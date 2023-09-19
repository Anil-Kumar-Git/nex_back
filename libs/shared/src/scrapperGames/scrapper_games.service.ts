import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like, DeleteResult, UpdateResult } from "typeorm";
import { SchedulerRegistry } from "@nestjs/schedule";

import { ScrapperGamesDto } from "./scrapper_games.dto";
import { ScrapperGames } from "./scrapper_games.entity";

import { GlobalService } from "../core/config/global.service";
import { ValidateService } from "../core/config/validate.service";

import { v4 as uuidv4 } from "uuid";
import { Providers } from "../providers/providers.entity";
import { Users } from "../users/users.entity";
import { CronJob, CronTime } from "cron";
import { GameTrackingService } from "../gameTracking/game_tracking.service";
import { NotificationService } from "../notification/notification.service";
import { handleError, handleErrors, handleStatusError } from "../common/errorHandling";

@Injectable()
export class ScrapperGamesService {
  constructor(
    @InjectRepository(ScrapperGames)
    private readonly repository: Repository<ScrapperGames>,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly gameTrackingService: GameTrackingService,
    private readonly notificationService: NotificationService
  ) {}

  async create(
    gameDto: ScrapperGamesDto[]
  ): Promise<{ status: string; data?: ScrapperGamesDto[]; error?: string }> {
    try {
      const promises = gameDto?.map(async (items: ScrapperGamesDto) => {
        items.id = uuidv4();
        let scrapper_game = this.getGameAsEntity(items);

        let saved = await this.repository.save(scrapper_game);
        return saved;
      });

      const saveScrapperGame: ScrapperGames[] = await Promise.all(promises);

      const all = this.getGamesAsDto(saveScrapperGame);

      return { status: "success", data: all };
    } catch (error) {
      return handleStatusError(error);
    }
  }

  async createScrapper(
    gameDto: ScrapperGamesDto[]
  ): Promise<{ status: string; data?: ScrapperGamesDto[]; errors?: string[] }> {
    const successfulResults: ScrapperGamesDto[] = [];
    const errors: string[] = [];

    const promises = gameDto?.map(async (items: ScrapperGamesDto) => {
      try {
        items.id = uuidv4();
        let scrapper_game = this.getGameAsEntity(items);
        let saved = await this.repository.save(scrapper_game);
        successfulResults.push(this.getGameAsDto(saved));
      } catch (error) {
        let ss = handleStatusError(error);
        errors.push(ss.error);
      }
    });

    await Promise.all(promises);

    return { status: "success", data: successfulResults, errors };
  }

  async createOne(
    gameDto: ScrapperGamesDto
  ): Promise<{ status: string; data?: ScrapperGamesDto; error?: string }> {
    try {
      gameDto.id = uuidv4();

      let game = this.getGameAsEntity(gameDto);

      let saved = await this.repository.save(game);
      const res = this.getGameAsDto(saved);

      // this.handleCronJob(res)
      return { status: "success", data: res };
    } catch (error) {
      return handleStatusError(error);
    }
  }

  async update(
    gameDto: ScrapperGamesDto
  ): Promise<{ status: string; data?: ScrapperGamesDto; error?: string }> {
    try {
      let game = this.getGameAsEntity(gameDto);
      let res = await this.repository.update(game.id, game);
      if (res.affected === 0) {
        return { status: "error", error: "No record found with the ID" };
      }

      const save = await this.getGameById(game.id);
      const ref_company =
        await this.gameTrackingService.getGameTrackingByDetails({
          gameId: save.id,
        });

      //for sending the messge of notification
      if (ref_company.status === "success") {
        const ref_messages = ref_company.data.map((data) => {
          const senderId = data.providerId?.id;
          const receiverId = {
            id: JSON.parse(data.operatorId)?.id,
            email: JSON.parse(data.operatorId)?.companyEmail || "",
          };
          // const body = gameDto.gameStatus === save.gameStatus ?
          //   `The ${data.providerId.companyName} has updated the game details of Game${save.gameName}.` :
          //   `The ${data.providerId.companyName} has changed the status of ${save.gameName} to ${save.gameStatus}.`;

          const tempOption = {
            title: "Game Details Updated",
            subject: `🚀 ${save.gameName} Game Updated 🎮`,
            // subTitle: "subtitleemail",
            userName: JSON.parse(data?.operatorId)?.companyName,
            content: `<b>${data.providerId?.companyName}</b> has updated the game details of Game <b>${save?.gameName}</b>.`,

            contentBelow:
              "Thank you for choosing NEXUS as your gaming partner. Together, we're revolutionizing the gaming experience!            ",
          };

          return {
           tempOption,
            senderId,
            receiverId,
            message: {
              title:  `${save?.gameName} Game Updated `,
              type: "game",
              link: save?.id,
              body: `The ${data.providerId?.companyName} has updated the game details of Game${save?.gameName}.`,
            },
          };
        });

        await Promise.all(
          ref_messages.map((ref_message) =>
            this.notificationService.createNew(ref_message,ref_message?.tempOption)
          )
        );
      }

      return { status: "success", data: save };
    } catch (error) {
      return handleStatusError(error);
    }
  }

  async findAll(query: {
    createdBy?: string;
    provider?: string;
    shortBy?: string;
  },type?:string): Promise<ScrapperGamesDto[]> {
    try {
      let { createdBy, provider, shortBy } = query;
      provider;
      let sortOptions: { [key: string]: string } = {};
      switch (shortBy) {
        case "gameName":
          sortOptions = { gameName: "ASC" };
          break;
        case "gameType":
          sortOptions = { gameType: "ASC" };
          break;
        case "createdDate":
          sortOptions = { createdDate: "ASC" };
          break;
        // Add additional cases as needed for other sort options
        default:
          // Use a default sort order if no valid `shortBy` parameter is provided
          sortOptions = { createdDate: "DESC" };
      }

      let items = await this.repository.find({
        where: {
          // createdBy: { id: createdBy },
          provider: provider,
        },
        // relations: {
        //   createdBy: true,
        //   providerId: true,
        // },
        order: sortOptions,
      });
      if (items.length <= 0 && type == "api") {
        throw new HttpException(
          "No record found with the Provider",
          HttpStatus.NOT_FOUND
        );
      }
      return this.getGamesAsDto(items);
    } catch (error) {
      if (type == "api") {
        handleErrors(error)
      }
 
      handleError(error);
      // throw new HttpException(error, HttpStatus.BAD_REQUEST, { cause: new Error(error) });
    }
  }

  // serch and filter all Proposals
  async searchDetails(params: {
    query?: string;
    provider?: string;
  }): Promise<ScrapperGamesDto[]> {
    const { query, provider } = params;
    const queryBuilder = this.repository.createQueryBuilder("ScrapperGames");
    let filterData = [];

    const allGames = await this.findAll({ provider: provider });

    if (query && query !== "") {
      const data = (
        await queryBuilder
          .where(
            "ScrapperGames.gameName LIKE :query OR ScrapperGames.gameType LIKE :query",
            { query: `%${query}%` }
          )
          .getMany()
      ).map((op) => filterData.push(op));
    } else {
      filterData = allGames;
    }

    const keys = filterData.map((data) => data.id);

    const searchedData = async (keys) => {
      const searchPro = allGames.filter((data) => {
        if (keys.includes(data.id)) {
          return data;
        }
      });
      return searchPro;
    };

    if (keys.length > 0) {
      filterData = await searchedData(keys);
    }

    return filterData;
  }

  async pagination(query: {
    page: number;
    limit: number;
    searchTerm: string;
    sortBy: string;
  }): Promise<{
    data: ScrapperGamesDto[];
    count: number;
    currentPage: number;
    totalPages: number;
  }> {
    let { page, limit, searchTerm, sortBy } = query;

    const [games, count] = await this.repository.findAndCount({
      where: {
        gameName: Like(`%${searchTerm}%`),
      },
      order: {
        [sortBy]: "ASC",
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: this.getGamesAsDto(games),
      count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    };
  }

  async getGameById(id: string,type?:string): Promise<ScrapperGamesDto> {
    try {
      let saved = await this.repository.findOne({
        where: {
          id: id,
        },
        // relations: {
        //   provider: true,
        //   // createdBy: true,
        // },
      });
      if (saved==null && type == "api") {
        throw new HttpException(
          "No record found with the ID",
          HttpStatus.NOT_FOUND
        );
      }
      if (saved == null) return null;

      return this.getGameAsDto(saved);
    } catch (error) {
      if (type == "api") {
        handleErrors(error)
      }
      return error;
    }
  }

  async delete(
    id: string,type?:string
  ): Promise<{ status: number; message?: string; error?: string }> {
    try {
      let deleteResult = await this.repository.delete(id);
      if (deleteResult.affected === 0) {
        if (type == "api") {
          throw new HttpException(
            "No record found with the ID",
            HttpStatus.NOT_FOUND
          );
        }
        throw new HttpException(
          "Game not found with this Id!",
          HttpStatus.BAD_REQUEST
        );
      }
      return { status: 200, message: "game deleted successfully" };
    } catch (error) {
      if (type == "api") {
        handleErrors(error)
      }
      handleError(error);
    }
  }

  async clear(): Promise<string> {
    if (GlobalService.isTestCase) {
      let items = await this.repository.find();
      for (const item of items) {
        let dr = await this.repository.delete(item.id);
      }
      return "cleared";
    }
    return "not cleared";
  }

  getGamesAsDto(items: ScrapperGames[]): Array<ScrapperGamesDto> {
    if (items == null) return null;
    let ret = new Array<ScrapperGamesDto>();
    for (var i = 0; i < items.length; i++) {
      ret.push(this.getGameAsDto(items[i]));
    }

    return ret;
  }

  getGameAsDto(item: ScrapperGames): ScrapperGamesDto {
    if (item == null) return null;

    let ret: ScrapperGamesDto = Object.assign(new ScrapperGamesDto(), item);
    // ret.provider = Object.assign(new Providers(), item.provider);
    // ret.createdBy = Object.assign(new Users(), item.createdBy);
    if (item.gameTheme) {
      ret.gameTheme = JSON.parse(item.gameTheme);
    }

    if (item.launchURLFormat) {
      ret.launchURLFormat = JSON.parse(item.launchURLFormat);
    }
    if (item.rtpsVariation) {
      ret.rtpsVariation = JSON.parse(item.rtpsVariation);
    }

    if (item.certifiedCountries) {
      ret.certifiedCountries = JSON.parse(item.certifiedCountries);
    }
    if (item.logosOfGame) {
      ret.logosOfGame = item.logosOfGame;
    }
    if (item?.goLiveDate !== undefined && item?.goLiveDate !== null) {
      ret.goLiveDate = item.goLiveDate ? new Date(item.goLiveDate) : null;
    }
    if (item?.expirationDate !== undefined && item?.expirationDate !== null) {
      ret.expirationDate = item.expirationDate
        ? new Date(item.expirationDate)
        : null;
    }

    return ret;
  }

  getGameAsEntity(gameDto: ScrapperGamesDto): ScrapperGames {
    if (gameDto == null) return null;
    let game: ScrapperGames = Object.assign(new ScrapperGames(), gameDto);
    // game.provider = Object.assign(new Providers(), gameDto.provider);
    // game.createdBy = Object.assign(new Users(), gameDto.createdBy);

    if (gameDto.gameTheme) {
      game.gameTheme = JSON.stringify(gameDto.gameTheme);
    }
    if (gameDto.launchURLFormat) {
      game.launchURLFormat = JSON.stringify(gameDto.launchURLFormat);
    }
    if (gameDto.rtpsVariation) {
      game.rtpsVariation = JSON.stringify(gameDto.rtpsVariation);
    }

    if (gameDto.certifiedCountries) {
      game.certifiedCountries = JSON.stringify(gameDto.certifiedCountries);
    }
    if (gameDto.logosOfGame) {
      game.logosOfGame = JSON.stringify(gameDto.logosOfGame);
    }
    if (gameDto?.goLiveDate !== undefined && gameDto?.goLiveDate !== null) {
      if (
        gameDto.goLiveDate instanceof Date &&
        !isNaN(gameDto.goLiveDate.getTime())
      ) {
        game.goLiveDate = gameDto.goLiveDate;
      } else {
        game.goLiveDate = null;
      }
    } else {
      game.goLiveDate = null;
    }

    if (
      gameDto?.expirationDate !== undefined &&
      gameDto?.expirationDate !== null
    ) {
      if (
        gameDto.expirationDate instanceof Date &&
        !isNaN(gameDto.expirationDate.getTime())
      ) {
        game.expirationDate = gameDto.expirationDate;
      } else {
        game.expirationDate = null;
      }
    } else {
      game.expirationDate = null;
    }

    game.rtp = Number(gameDto.rtp);
    return game;
  }
  async handleCronJob(gameDto: ScrapperGamesDto) {
    const goLiveDate = gameDto.goLiveDate;
    const currentDate = new Date();
    const timeDifference = goLiveDate.getTime() - currentDate.getTime();
    let triggerTime = timeDifference;
    if (timeDifference <= 0) {
      triggerTime = 1;
      return;
    }
    const job = new CronJob(
      new Date(Date.now() + triggerTime), //     new Date(Date.now() + timeDifference),
      async () => {
        gameDto.gameStatus = "Published";
        // Perform the job logic here
        const res = await this.update(gameDto);
        if (res.status == "success") {
          job.stop();
        } else {
          const nextCycleStartTime = new Date(
            currentDate.getTime() + 24 * 60 * 60 * 1000
          );
          const cronTime = new CronTime(nextCycleStartTime);
          // Set the start time for the next cycle
          job.setTime(cronTime);
          job.start();
        }
      },
      null,
      true,
      "UTC" // Timezone
    );
    this.schedulerRegistry.addCronJob(
      `updateGameStatus${gameDto.gameName}${triggerTime}`,
      job
    );
  }
  myValidate(gameDto: ScrapperGamesDto) {
    ValidateService.validateLanguageCodes(gameDto.certifiedCountries);
  }
}
