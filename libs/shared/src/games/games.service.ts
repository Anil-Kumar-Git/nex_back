import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, DeleteResult, UpdateResult } from 'typeorm';
import { SchedulerRegistry } from '@nestjs/schedule';

import { GamesDto } from './games.dto';
import { Games } from './games.entity';


import { GlobalService } from './../core/config/global.service';
import { ValidateService } from './../core/config/validate.service';

import { v4 as uuidv4 } from 'uuid';
import { Providers } from '../providers/providers.entity';
import { Users } from '../users/users.entity';
import { CronJob, CronTime } from 'cron';
import { GameTrackingService } from '../gameTracking/game_tracking.service';
import { NotificationService } from '../notification/notification.service';
import { handleError, handleErrors, handleStatusError } from '../common/errorHandling';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { nexIcon, nexusLogo } from '../proposalTracking/getlogo';
import { gameDetails } from '../common/option';
@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Games)
    private readonly repository: Repository<Games>,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly gameTrackingService: GameTrackingService,
    private readonly notificationService: NotificationService
  ) {}

  async create(
    gameDto: GamesDto,
    type?: string
  ): Promise<{ status: string; data?: GamesDto; error?: string }> {
    try {
      gameDto.id = uuidv4();

      let game = this.getGameAsEntity(gameDto);

      let saved = await this.repository.save(game);
      const res = this.getGameAsDto(saved);

      this.handleCronJob(res);
      return { status: "success", data: res };
    } catch (error) {
      if (type == "api") {
        handleErrors(error);
      }
      return handleStatusError(error);
    }
  }

  async update(
    gameDto: GamesDto,
    type?: string
  ): Promise<{ status: string; data?: GamesDto; error?: string }> {
    try {
      let game = this.getGameAsEntity(gameDto);
      const checkSave = await this.getGameById(gameDto.id);
      let res = await this.repository.update(game.id, game);
      if (res.affected === 0) {
        if (type == "api") {
          throw new HttpException(
            "No record found with the ID",
            HttpStatus.NOT_FOUND
          );
        }
        return { status: "error", error: "No record found with the ID" };
      }

      const save = await this.getGameById(game.id);

      const ref_company =
        await this.gameTrackingService?.getGameTrackingByDetails({
          gameId: save?.id,
        });

      await this.generateGamePdf(save);
      // for sending the messge of notification
      if (ref_company?.status === "success") {
        if (gameDto.gameStatus == "Published") {
          let cnNotify = this.checkChangeInCountry(checkSave, gameDto);
         if(cnNotify.status){
        const ref_messages = ref_company?.data?.map((data) => {
          const senderId = data?.providerId?.id;
          const receiverId = {
            id: JSON.parse(data?.operatorId)?.id,
            email: JSON.parse(data?.operatorId)?.companyEmail || "",
          };

          return {
            senderId,
            receiverId,
            message: {
              title: `${save?.gameName} Game Certified Countries Updated`,
              type: "game",
              link: save?.id,
              body: `The ${data?.providerId?.companyName} ${cnNotify?.data} Game ${save?.gameName}.`,
            },
          };
        });

        await Promise.all(
          ref_messages.map((ref_message) => {
            this.notificationService.createNew(ref_message);
          })
        );
      }
      }
      }

      return { status: "success", data: save };
    } catch (error) {
      if (type == "api") {
        handleErrors(error);
      }
      return handleStatusError(error);
    }
  }

  checkChangeInCountry(save, gameDto) {
    let newCont = [];
    let oldCont = [];
    let respon = { status: false, data: "" };
    
    if (save.certifiedCountryCheck == gameDto.certifiedCountryCheck) {
      if (gameDto.certifiedCountryCheck) {
        let data =
          gameDto.multiLiveExpDate &&
          JSON.parse(gameDto?.multiLiveExpDate)
            .map((item) => {
                return item.certifiedCountries;
            })
            .filter((value) => value !== undefined)
            .flat();
        newCont = data;
      } else {
        newCont = gameDto.certifiedCountries ? gameDto.certifiedCountries : [];
      }
      if (save.certifiedCountryCheck) {
        let data =
          save.multiLiveExpDate &&
          JSON.parse(save?.multiLiveExpDate)
            .map((item) => {
                return item.certifiedCountries;
            })
            .filter((value) => value !== undefined)
            .flat();
        oldCont = data;
      } else {
        oldCont = save.certifiedCountries ? save.certifiedCountries : [];
      }
      console.log(oldCont,newCont,"save, gameDto")
      const missingItemsInData2 = newCont.filter(
        (element) => !oldCont.includes(element)
      );
      const missingItemsInData = oldCont.filter(
        (element) => !newCont.includes(element)
      );

      if (missingItemsInData2.length > 0) {
        respon.status = true;
        respon.data = `has added the certified countries (${missingItemsInData2.join(
          ","
        )}) to this`;
        return respon;
      } else if (missingItemsInData.length > 0) {
        respon.status = true;
        respon.data = `has removed the certified countries (${missingItemsInData.join(
          ","
        )}) from this`;
        return respon;
      } else {
        respon.status = false;
        respon.data = "";
        return respon;
      }
    } else {
      if (gameDto.certifiedCountryCheck) {
        let data =
          gameDto.multiLiveExpDate &&
          JSON.parse(gameDto?.multiLiveExpDate)
            .map((item) => {
                return item.certifiedCountries;
            })
            .filter((value) => value !== undefined)
            .flat();
        newCont = data;
      } else {
        newCont = gameDto.certifiedCountries ? gameDto.certifiedCountries : [];
      }
      respon.status = true;
      respon.data = `has added the certified countries (${newCont.join(
        ","
      )}) to this`;
      return respon;
    }
  }

  async generateGamePdf(game_details: any) {
    try {
      (async () => {
        try {
          pdfMake.vfs = pdfFonts.pdfMake.vfs;
          pdfMake.fonts = {
            Roboto: {
              normal: "Roboto-Regular.ttf",
              bold: "Roboto-Medium.ttf",
              italics: "Roboto-Italic.ttf",
              bolditalics: "Roboto-Italic.ttf",
            },
          };
          const gamedocDefinition = {
            content: [
              {
                image: nexusLogo(),
                width: 200,
                alignment: "center",
                link: "https://www.nexus7995.com/",
                margin: [0, 0, 0, 20],
              },

              {
                text: [
                  "This attachment contains essential information about the latest game provided by ",
                  {
                    text:
                      (game_details?.providerId &&
                        game_details?.providerId?.companyName) ||
                      "",
                    fontSize: 13,
                    bold: true,
                  },
                  ". For an enhanced Game Management experience and access to a plethora of benefits, sign up with NEXUS 7995 at",
                  {
                    text: " www.nexus7995.com. ",
                    link: "https://www.nexus7995.com/",
                    decoration: "underline",
                    color: "blue",
                  },
                  "Unlock Contract, Queue, License, Reconciliation, and New Business Management features and propel your gaming empire to new heights!.",
                ],
                style: "headerContent",
                fontSize: 12,
                bold: false,
                margin: [0, 0, 0, 20],
              },
              {
                text: `Game Details :- ${game_details.gameName}`,
                style: "header",
                fontSize: 16,
                bold: 300,
              },
              {
                table: {
                  headerRows: 1,
                  widths: ["auto", "*"],
                  body: gameDetails.map(function (detail) {
                    let value: any;
                    if (game_details[detail.name] === null) {
                      value = "";
                    } else if (typeof game_details[detail.name] === "boolean") {
                      value = game_details[detail.name] ? "Yes" : "No";
                    } else if (
                      game_details[detail.name] instanceof Date &&
                      !isNaN(game_details[detail.name])
                    ) {
                      const date = new Date(game_details[detail.name]);
                      const day = String(date.getDate()).padStart(2, "0");
                      const month = String(date.getMonth() + 1).padStart(
                        2,
                        "0"
                      );
                      const year = date.getFullYear();
                      const formattedDate = `${day}/${month}/${year}`;
                      value = formattedDate || "";
                    } else if (detail.title === "Video Slot") {
                      value = `${game_details["vsVertical"] || 0} X ${
                        game_details["vsHorizontal"] || 0
                      }`;
                    } else if (detail.name === "companyName") {
                      value =
                        (game_details?.providerId &&
                          game_details?.providerId?.companyName) ||
                        "";
                    } else if (detail.name === "companyEmail") {
                      value =
                        (game_details?.providerId &&
                          game_details?.providerId?.companyEmail) ||
                        "";
                    } else if (detail.name === "logoOfGames") {
                      const dataDetails = JSON.parse(game_details?.logosOfGame);
                      let logoData = [];
                      if (dataDetails?.data?.length > 0) {
                        dataDetails?.data?.map((item) => {
                          let data = `${capFL(item.name)} : ${item?.link}`;
                          logoData.push(data);
                        });
                      }
                      if (dataDetails?.additional?.length > 0) {
                        dataDetails?.additional?.map((item) => {
                          let data = `${capFL(item.name)} : ${item?.link}`;
                          logoData.push(data);
                        });
                      }

                      // use for game of logo value
                      value =
                        {
                          stack: [
                            "allFiles",
                            {
                              ul: logoData,
                            },
                          ],
                        } || "";
                    } else if (typeof game_details[detail.name] === "object") {
                      if (game_details[detail.name] !== null) {
                        if (game_details[detail.name].length > 0) {
                          value = game_details[detail.name].join(",") || "";
                        } else {
                          value = game_details[detail.name] || "";
                        }
                      }
                    } else {
                      value = game_details[detail.name] || "";
                    }

                    return [{ text: detail.title, bold: true }, value];
                  }),
                },
                layout: {
                  fillColor: function (i: number, node: any) {
                    return i % 2 === 0 ? "#F0F0F0" : null;
                  },
                },
              },

              {
                text: [
                  {
                    text: "Attention : Image Usage Guidelines",
                    fontSize: 11,
                    bold: true,
                  },
                  "\nPlease avoid publishing logos and images directly linked to a NEXUS URL. Instead, kindly download and host them on your servers to prevent any disruptions due to increased traffic. Your understanding is much appreciated.",
                ],
                style: "headerContent",
                fontSize: 10,
                bold: false,
                margin: [0, 20, 0, 0],
              },

              {
                text: [
                  {
                    text: "Game Acceptance or Future Collaboration? ",
                    fontSize: 15,
                    bold: true,
                    decoration: "underline",
                    margin: [0, 20, 0, 20],
                  },
                  "\n",
                  "\nIf you already have an",
                  {
                    text: " existing business relationship with the Provider, ",
                    fontSize: 12,
                    bold: true,
                  },
                  '\n you have the option to accept the game and indicate your intention to roll out the game on the planned go-live date. To proceed, simply click on the "Accept" button.',
                  "\n",
                  "\n",
                  {
                    text: " Accept",
                    link: "https://nexus.switzerlandnorth.cloudapp.azure.com/provider/game/overview",
                    fontSize: 12,
                    bold: false,
                    color: "blue",
                    alignment: "center",
                    margin: [0, 20, 0, 0],
                  },
                  "\n",
                  ` \nFor any future cooperation discussions, you can directly contact the Provider at the email address provided above, to initiate commercial negotiations and explore potential partnerships.`,
                  "\n",
                ],
                style: "footerUpper",
                margin: [0, 20, 0, 0],
              },
              {
                canvas: [
                  {
                    type: "line",
                    x1: 0,
                    y1: 10,
                    x2: 520,
                    y2: 10,
                    lineWidth: 1,
                  },
                ],
                margin: [0, 20, 0, 20],
              },
              {
                text: " Level up Game Management & Collaboration with NEXUS!",
                fontSize: 13,
                bold: true,
                alignment: "center",
                margin: [0, 0, 0, 20],
                italics: false,
                style: "header",
              },
              {
                text: "Ready to revolutionize your Game Management process and future collaborations with Providers? Experience the power of NEXUS and enjoy these features:",
                fontSize: 13,
                bold: false,
                margin: [0, 0, 0, 20],
              },
              {
                columns: [
                  {
                    width: 8,
                    height: 15,
                    image: nexIcon(),
                  },
                  {
                    width: "auto",
                    margin: [15, 0, 0, 0],
                    text: "Effortless Game Acceptance: Accept games from Providers hassle-free with just a click! No more back-and-forth emails.",
                  },
                ],
                margin: [0, 0, 0, 8],
              },
              {
                columns: [
                  {
                    width: 8,
                    height: 15,
                    image: nexIcon(),
                  },
                  {
                    width: "auto",
                    margin: [15, 0, 0, 0],
                    text: "Queue Management: Keep track of games in real-time with Queue Management.",
                  },
                ],
                margin: [0, 0, 0, 8],
              },
              {
                columns: [
                  {
                    width: 8,
                    height: 15,
                    image: nexIcon(),
                  },
                  {
                    width: "auto",
                    margin: [15, 0, 0, 0],
                    text: "Contract Management: Safeguard your contracts with a refined versioning system.",
                  },
                ],
                margin: [0, 0, 0, 8],
              },
              {
                columns: [
                  {
                    width: 8,
                    height: 15,
                    image: nexIcon(),
                  },
                  {
                    width: "auto",
                    margin: [15, 0, 0, 0],
                    text: "Monthly Reconciliation: Securely reconcile financial data to streamline transactions.",
                  },
                ],
                margin: [0, 0, 0, 8],
              },
              {
                columns: [
                  {
                    width: 8,
                    height: 15,
                    image: nexIcon(),
                  },
                  {
                    width: "auto",
                    margin: [15, 0, 0, 0],
                    text: "Freemium Model: Get started right away with our Freemium package – 0 integration!",
                  },
                ],
                margin: [0, 0, 0, 8],
              },
              {
                columns: [
                  {
                    width: 8,
                    height: 15,
                    image: nexIcon(),
                  },
                  {
                    width: "auto",
                    margin: [15, 0, 0, 0],
                    text: "License Jedi: Safeguard and track game licenses with ease.",
                  },
                ],
                margin: [0, 0, 0, 8],
              },

              {
                text: [
                  {
                    text: "Join NEXUS now to supercharge your Game Management! Click here to discover the possibilities :",
                    fontSize: 13,
                    bold: true,
                    italics: false,
                  },
                  "\n",
                  {
                    text: " Our Value Proposition",
                    fontSize: 12,
                    bold: true,
                    color: "blue",
                    italics: false,
                    alignment: "center",
                    link: "https://www.nexus7995.com/pricing",
                  },
                ],
                style: "footerBottom",
              },
              {
                canvas: [
                  {
                    type: "line",
                    x1: 0,
                    y1: 10,
                    x2: 520,
                    y2: 10,
                    lineWidth: 1,
                  },
                ],
                margin: [0, 20, 0, 20],
              },
            ],

            styles: {
              header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10], // top, right, bottom, left margins
              },
              footer: {
                fontSize: 10,
                italics: true,
                lineHeight: 1.3,
              },
            },
          };

          const docDefinitions = [gamedocDefinition];
          const pdfPromises = docDefinitions.map((docDefinition) => {
            return new Promise((resolve, reject) => {
              try {
                const pdfDoc = pdfMake.createPdf(docDefinition);
                pdfDoc.getBase64((data: any) => {
                  resolve(data);
                });
              } catch (error) {
                reject(error);
              }
            });
          });

          await Promise.all(pdfPromises)
            .then(async (pdfDataArray) => {
              const ref_company =
                await this.gameTrackingService?.getGameTrackingByDetails({
                  gameId: game_details?.id,
                });

              if (ref_company?.status === "success") {
                const ref_messages = ref_company?.data?.map((data) => {
                  const senderId = data?.providerId?.id;
                  const receiverId = {
                    id: JSON.parse(data?.operatorId)?.id,
                    email: JSON.parse(data?.operatorId)?.companyEmail || "",
                  };
                  const tempOption = {
                    title: "Game Details Updated",
                    subject: `🚀 ${game_details.gameName} Game Updated 🎮`,
                    userName: JSON.parse(data?.operatorId)?.companyName,
                    content: `<b>${
                      data?.providerId?.companyName || ""
                    }</b> has updated the game details of Game <b>${
                      game_details?.gameName
                    }</b>.`,

                    contentBelow:
                      "Thank you for choosing NEXUS as your gaming partner. Together, we're revolutionizing the gaming experience!",
                    attachments: [],
                  };

                  pdfDataArray.forEach((pdfData, index) => {
                    let fileName = "";
                    if (index === 0) {
                      fileName = "game.pdf";
                    }
                    tempOption.attachments.push({
                      filename: fileName,
                      content: pdfData,
                      encoding: "base64",
                    });
                  });

                  return {
                    tempOption,
                    senderId,
                    receiverId,
                    message: {
                      title: `${game_details?.gameName} Game Updated`,
                      type: "game",
                      link: game_details?.id,
                      body: `The ${data.providerId?.companyName} has updated the game details of Game ${game_details.gameName}.`,
                    },
                  };
                });

                await Promise.all(
                  ref_messages.map((ref_message) => {
                    this.notificationService.createNew(
                      ref_message,
                      ref_message.tempOption
                    );
                  })
                );
              }
            })
            .then((mailOptions) => {
              console.log("Email sent with mailOptions:", mailOptions);
            })
            .catch((error) => {
              console.error("Error sending email:", error);
            });
          // return
        } catch (error) {
          console.error("Error generating PDF:", error);
        }
      })();
    } catch (error) {}
  }

  async findAll(
    query: { createdBy?: string; providerId?: string; shortBy?: string },
    type?: string
  ): Promise<GamesDto[]> {
    try {
      let { createdBy, providerId, shortBy } = query;
      providerId;
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
          createdBy: { id: createdBy },
          providerId: { id: providerId },
        },
        relations: {
          createdBy: true,
          providerId: true,
        },
        order: sortOptions,
      });
      if (items.length <= 0 && type == "api") {
        throw new HttpException(
          "No record found with the ID",
          HttpStatus.BAD_REQUEST
        );
      }
      return this.getGamesAsDto(items);
    } catch (error) {
      if (type == "api") {
        handleErrors(error);
      }
      handleError(error);
      // throw new HttpException(error, HttpStatus.BAD_REQUEST, { cause: new Error(error) });
    }
  }

  // serch and filter all Proposals
  async searchDetails(
    params: {
      query?: string;
      typeId?: string;
    },
    type?: string
  ): Promise<GamesDto[]> {
    const { query, typeId } = params;
    const queryBuilder = this.repository.createQueryBuilder("Games");
    let filterData = [];

    const allGames = await this.findAll({ providerId: typeId });

    if (query && query !== "") {
      const data = (
        await queryBuilder
          .where(
            "Games.id LIKE :query OR Games.gameName LIKE :query OR Games.gameType LIKE :query",
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

    if (filterData.length <= 0 && type == "api" && !params.query) {
      throw new HttpException(
        "No record found with the ID",
        HttpStatus.BAD_REQUEST
      );
    }

    return filterData;
  }

  async pagination(query: {
    page: number;
    limit: number;
    searchTerm: string;
    sortBy: string;
  }): Promise<{
    data: GamesDto[];
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
  async getGameById(id: string, type?: string): Promise<GamesDto> {
    try {
      let saved = await this.repository.findOne({
        where: {
          id: id,
        },
        relations: {
          providerId: true,
          createdBy: true,
        },
      });
      if (saved == null && type == "api") {
        throw new HttpException(
          "No record found with the ID",
          HttpStatus.NOT_FOUND
        );
      }

      if (saved == null) return null;

      return this.getGameAsDto(saved);
    } catch (error) {
      if (type == "api") {
        handleErrors(error);
      }

      return error;
    }
  }

  async delete(id: string, type?: string): Promise<string> {
    try {
      let deleteResult = await this.repository.delete(id);

      if (deleteResult.affected === 0) {
        if (type == "api") {
          throw new HttpException(
            "No record found with the ID",
            HttpStatus.NOT_FOUND
          );
        }
        // If no rows were affected, it means the ID does not match any existing records
        return "error: ID does not exist";
      }

      return "Success: Item with ID " + id + " has been successfully deleted.";
    } catch (error) {
      if (type == "api") {
        handleErrors(error);
      }

      // Handle specific error cases
      if (error.code === "ER_ROW_IS_REFERENCED_2") {
        // If the error is due to a foreign key constraint violation
        return "error: The record cannot be deleted because it is referenced by other records";
      }
      // Handle other general errors
      return "error: An error occurred while deleting the record";
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

  getGamesAsDto(items: Games[]): Array<GamesDto> {
    if (items == null) return null;
    let ret = new Array<GamesDto>();
    for (var i = 0; i < items.length; i++) {
      ret.push(this.getGameAsDto(items[i]));
    }

    return ret;
  }

  getGameAsDto(item: Games): GamesDto {
    if (item == null) return null;

    let ret: GamesDto = Object.assign(new GamesDto(), item);
    ret.providerId = Object.assign(new Providers(), item.providerId);
    ret.createdBy = Object.assign(new Users(), item.createdBy);
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
      ret.logosOfGame = JSON.parse(item.logosOfGame);
    }
    if (item.goLiveDate) {
      ret.goLiveDate = new Date(item.goLiveDate);
    }
    if (item.expirationDate) {
      ret.expirationDate = new Date(item.expirationDate);
    }

    return ret;
  }

  getGameAsEntity(gameDto: GamesDto): Games {
    if (gameDto == null) return null;
    let game: Games = Object.assign(new Games(), gameDto);
    game.providerId = Object.assign(new Providers(), gameDto.providerId);
    game.createdBy = Object.assign(new Users(), gameDto.createdBy);

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
    if (gameDto.goLiveDate) {
      game.goLiveDate = new Date(gameDto.goLiveDate);
    }
    if (gameDto.expirationDate) {
      game.expirationDate = new Date(gameDto.expirationDate);
    }
    return game;
  }
  async handleCronJob(gameDto: GamesDto) {
    const goLiveDate = new Date(gameDto.goLiveDate);
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
  myValidate(gameDto: GamesDto) {
    ValidateService.validateLanguageCodes(gameDto.certifiedCountries);
  }
}

function capFL(name: any) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}
