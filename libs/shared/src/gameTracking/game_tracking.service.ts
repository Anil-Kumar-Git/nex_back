import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, UpdateResult, Like } from 'typeorm';

import { GameTrackingDto } from './game_tracking.dto';
import { GameTracking } from './game_tracking.entity';

import { v4 as uuidv4 } from 'uuid';
import { Users } from '../users/users.entity';
import { UsersDto } from '../users/users.dto';
import { ProvidersService } from '../providers/providers.service';
import { OperatorsService } from '../operators/operators.service';
import { ProviderProposalService } from '../providerProposal/providerProposal.service';
import { OperatorProposalService } from '../operatorProposal/operatorProposal.service';
import { providerProposalDto } from '../providerProposal/providerProposal.dto';
import { ContractsDto } from '../contracts/contracts.dto';
import { ProvidersDto } from '../providers/providers.dto';
import { Providers } from '../providers/providers.entity';
import { Contracts } from '../contracts/contracts.entity';
import { ProviderProposal } from '../providerProposal/providerProposal.entity';
import { ExternalProviderOpeartorService } from '../externalProviderOperator/externalProviderOperator.service';
import { Games } from '../games/games.entity';
import { async } from 'rxjs';
import { NotificationService } from '../notification/notification.service';
import { NotificationDto } from '../notification/notification.dto';
import { NotificationShare } from '../notification/notification.entity';
import { ConfigService } from '../core/config/config.service';
import { handleErrors } from '../common/errorHandling';

@Injectable()
export class GameTrackingService {
  constructor(
    private readonly providersService: ProvidersService,
    private readonly operatorsService: OperatorsService,
    private readonly providerProposalService: ProviderProposalService,
    private readonly operatorProposalService: OperatorProposalService,
    private readonly externalProviderOpeartorService: ExternalProviderOpeartorService,
    private readonly notificationService: NotificationService,
    private readonly configService: ConfigService,

    @InjectRepository(GameTracking)
    private readonly repository: Repository<GameTracking>,
    @InjectRepository(Games)
    private readonly gameRepo: Repository<Games>,
  ) { }

  async create(gameTrackingDto: GameTrackingDto): Promise<GameTrackingDto> {
    try {
      gameTrackingDto.id = uuidv4();
      const game_tracking_entity = await this.getGameTrackingasEntity(gameTrackingDto);
      const save = await this.repository.save(game_tracking_entity);
      const save_res = await this.getGameTrackingById(save.id);

      //for sending the notification to operator
      let ref_obj = Object.assign(new NotificationShare(), {});
      ref_obj.senderId = save_res.providerId.id;
      ref_obj.receiverId = {
        id: JSON.parse(save_res.operatorId).id,
        email: JSON.parse(save_res.operatorId).companyEmail || ""
      };
      ref_obj.message.title = `${save_res.gameId.gameName } Game received from ${ save_res.providerId?.companyName}`
      ref_obj.message.body = `${save_res.providerId.companyName || ""} has shared a New Game - ${save_res.gameId.gameName || ""} with you.`
      ref_obj.message.link = save_res.gameId.id;
      ref_obj.message.type = "game"

      // const tempOption = {
      //   title: "New Game Received",
      //   subject: `🚀${save_res.gameId.gameName } Game received from  ${ save_res.providerId.companyName} 🎮`,
       
      //   userName: JSON.parse(save_res?.operatorId)?.companyName,
      //   content: `<b>${save_res.providerId.companyName || ""}</b> has shared a New Game - <b>${ save_res.gameId.gameName }</b> with you.`,
      //   contentBelow:
      //     "Thank you for choosing NEXUS as your gaming partner. Together, we're revolutionizing the gaming experience!            ",
      // };
      
      this.notificationService.createNew(ref_obj)
      return save_res
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        const errorMessage = `Error: Already exits.`;
        throw new HttpException(errorMessage, HttpStatus.CONFLICT, { cause: new Error(errorMessage) });
      }

      if (error.code === 'ER_NO_DEFAULT_FOR_FIELD') {
        throw new HttpException(error.sqlMessage, HttpStatus.BAD_REQUEST, { cause: new Error('field are empty') });

      }
      throw new HttpException(error, HttpStatus.BAD_REQUEST, { cause: new Error(error) });
    }

  }


  async update(GameTrackingDto: GameTrackingDto, companyDetails?: any,type?:string): Promise<{ status: string, data?: GameTrackingDto, error?: string }> {
    try {
      let proposal_tracking_entity = await this.getGameTrackingasEntity(GameTrackingDto)
      const res = await this.repository.update(proposal_tracking_entity.id, proposal_tracking_entity)
      if (res.affected === 0) {
        if (type == "api") {
          throw new HttpException(
            "No record found with the ID",
            HttpStatus.NOT_FOUND
          );
        }
        throw new HttpException("No record found with the ID", HttpStatus.BAD_REQUEST, { cause: new Error("No record found with the ID") });
      }
      let save = await this.getGameTrackingById(proposal_tracking_entity.id)

      //for sending the messge of notification

      if (companyDetails) {
        companyDetails = JSON.parse(JSON.stringify(companyDetails))

        let ref_obj = Object.assign(new NotificationShare(), {});
        let operatorDetails = save?.operatorId && JSON?.parse(save?.operatorId);
        let providerDetails = save?.providerId;
        let url = this?.configService?.get("FRONTEND_URL")
        let userName;
        if (companyDetails?.createdBy?.userRole == "Provider" || companyDetails?.createdBy?.userRole == "Sub Provider") {
          ref_obj.senderId = companyDetails?.id;
          ref_obj.receiverId = {
            id: operatorDetails?.id,
            email: operatorDetails?.companyEmail
          };
          ref_obj.message.link = `${url}operator/game_preview/${save?.gameId?.id}?action=View`
          ref_obj.message.body = `The Operator - ${providerDetails?.companyName} has changed the status of the Game -  ${save?.gameId?.gameName} to ${save?.status}.`;
          userName=operatorDetails?.companyName;
        } else if (companyDetails?.createdBy?.userRole == "Operator" || companyDetails?.createdBy?.userRole == "Sub Operator") {
          ref_obj.senderId = companyDetails?.id;
          ref_obj.receiverId = {
            id: providerDetails?.id,
            email: providerDetails?.companyEmail
          };
          ref_obj.message.body = `The Operator - ${operatorDetails?.companyName} has changed the status of the Game - ${save?.gameId?.gameName} to ${save?.status}.`;
          ref_obj.message.link = `${url}provider/gamestatus/${save?.gameId?.id}?action=gamestatus&operatorId=${GameTrackingDto?.operatorId}`
          userName=providerDetails?.companyName;
        }
        ref_obj.message.title = `${save?.gameId?.gameName} Integration Status Updated `;
        ref_obj.message.type = "gameIntegration"

        const tempOption = {
          title: "Game Status Updated",
          subject: `🚀 ${save?.gameId?.gameName} Integration Status Updated 🎮`,
          userName: userName,
          content: `The updated integration status for <b>${save?.gameId?.gameName}</b> is <b>${save?.status}</b>. Please <a style='text-decoration: underline; color:blue' href='${ref_obj?.message?.link}' target='_blank' > review the details </a> (click on notifications on the top right hand corner) to ensure everything meets your expectations. We're here to address any questions or feedback you may have.`,

          contentBelow:
            "Thank you for choosing NEXUS as your gaming partner. Together, we're revolutionizing the gaming experience!            ",
        };

        this.notificationService.createNew(ref_obj,tempOption)
      }
      return { status: "success", data: save }
    } catch (error) {
      if (type == "api") {
        handleErrors(error)
      }
      return { status: "error", error: error.message }
    }

  }


  async delete(id: string,type?:string): Promise<string> {
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

      return `This ${id} data deleted sccessfully`;
    } catch (error) {
      if (type == "api") {
        handleErrors(error)
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
  //commom function

  async getGameTrackingByDetails(params: { id?: string, index?: string, providerId?: string, operatorId?: string, proposalId?: string, contractId?: string, gameId?: string, createdBy?: string },type?:string): Promise<{ status: string, data?: GameTrackingDto[], error?: string,length?:number }> {
    try {
      let saved = await this.repository.find({
        where: {
          id: params.id,
          operatorId: params.operatorId,
          createdBy: {
            id: params.createdBy
          },
          providerId: {
            id: params.providerId
          },
          proposalId: params.proposalId,
          contractId: {
            id: params.contractId
          },
          gameId: {
            id: params.gameId
          }
        },
        relations: {
          createdBy: true,
          providerId: true,
          contractId: true,
          gameId: true
        },
      });
      if (saved.length <= 0 && type == "api") {
        throw new HttpException(
          "No record found with the ID",
          HttpStatus.BAD_REQUEST
        );
      }
      const res = await this.getGameTrackinsgasDto(saved);
      
      return { status: "success",length:res?.length, data: res }
    } catch (error) {
      if (type == "api") {
        handleErrors(error)
      }
      return { status: "error", error: error.message }
    }

  }

  // serch and filter all gametracking
  async searchDetails(params: {
    query?: string;
    typeId?: string;
    type: string;
  },type2?:string): Promise<GameTrackingDto[]> {
    const { query, type, typeId } = params;
    const queryBuilder = this.repository.createQueryBuilder("gametracking");
    const queryGamesBuilder = this.gameRepo.createQueryBuilder("games");
    let my_Id =
      type == "Provider" ? { providerId: typeId } : { operatorId: typeId };
    let filterData = [];

    const allGametrackings = await this.getGameTrackingByDetails(my_Id);
    let keys = null
    if (!query || query == null || query == "") {
      filterData = allGametrackings?.data;
      keys = filterData?.map((data) => data?.gameId.id);

    } else {
      filterData = await queryGamesBuilder
        .where(
          "games.id LIKE :query OR games.gameName LIKE :query",
          {
            query: `%${query}%`,
          }
        ).getMany();
      keys = filterData?.map((data) => data?.id);
    }

    const searchedData = async (keys) => {
      const finalData = allGametrackings?.data?.filter((data) => {
        if (keys.includes(data.gameId.id)) {
          return data;
        }
      });
     
      return finalData;
    };

    if (keys.length > 0) {
      filterData = await searchedData(keys);
    }

    if (type2 == "api" && filterData.length<=0) {
      throw new HttpException(
        "No record found with the ID",
        HttpStatus.NOT_FOUND
      );
   }

    return filterData;
  }

  async getGameTrackingById(id: string,type?:string): Promise<GameTrackingDto> {
    try {
      let saved = await this.repository.findOne({
        where: {
          id: id,
        },
        relations: {
          createdBy: true,
          providerId: true,
          gameId: true
        },
      });

      if (saved== null && type == "api") {
        throw new HttpException(
          "No record found with the ID",
          HttpStatus.NOT_FOUND
        );
      }

      return this.getGameTrackingasDto(saved);
    } catch (error) {
      if (type == "api") {
        handleErrors(error)
      }
 
      return error
    }

  }

  async getGameTrackingasDto(item: GameTracking): Promise<GameTrackingDto> {
    if (item == null) return null;

    let ret = Object.assign(new GameTrackingDto(), item);

    if (item.refIndex == "Internal" && item.index == "Provider") {
      const operator_details = await this.getOperator(item.operatorId)
      ret.operatorId = operator_details
    }
    else if (item.refIndex == "Scraper" && item.index == "Provider") {
      const external_details = await this.externalProviderOpeartorService.getExternalProviderOperatorById(item.operatorId)
      ret.operatorId = JSON.stringify(external_details)

    }
    ret.createdBy = Object.assign(new UsersDto(), item.createdBy);
    return ret;
  }

  async getGameTrackinsgasDto(items: GameTracking[]): Promise<Array<GameTrackingDto>> {
    if (items == null) return null;
    let ret = new Array<GameTrackingDto>();
    for (var i = 0; i < items.length; i++) {
      let ref = await this.getGameTrackingasDto(items[i])
      ret.push(ref);
    }
    return ret;
  }

  async getGameTrackingasEntity(gameTrackingDto: GameTrackingDto): Promise<GameTracking> {
    if (gameTrackingDto == null) return null;
    let game_tracking = Object.assign(new GameTracking, gameTrackingDto)
    game_tracking.createdBy = Object.assign(
      new Users(),
      gameTrackingDto.createdBy,
    );
    game_tracking.contractId = Object.assign(
      new Contracts(),
      gameTrackingDto.contractId,
    )
    game_tracking.providerId = Object.assign(
      new Providers(),
      gameTrackingDto.providerId,
    )
    return game_tracking
  }


  // get provider
  async getProvider(providerId: string): Promise<string> {
    const provider = await this.providersService.getProviderById(providerId)
    const providerData = {
      id: provider.id,
      companyName: provider.companyName
    }
    return JSON.stringify(providerData)
  }
  //get operator
  async getOperator(operatorId: string): Promise<string> {

    const operator = await this.operatorsService.getOperator(operatorId)
    // const operatorData = {
    //   id: operator.id,
    //   companyName: operator.companyName
    // }
    return JSON.stringify(operator)
  }
  //get providerProposal 
  async getProviderProposal(id: string): Promise<string> {
    let res = await this.providerProposalService.getProviderProposalById(id)
    return JSON.stringify(res)
  }
  //get operatorProposal
  async getOperatorProposal(id: string): Promise<string> {
    let res = await this.operatorProposalService.getOperatorProposalById(id)
    return JSON.stringify(res)

  }
}


