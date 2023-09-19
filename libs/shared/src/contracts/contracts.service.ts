import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DeleteResult, UpdateResult } from "typeorm";

import { ContractsDto } from "./contracts.dto";
import { Contracts } from "./contracts.entity";

import { v4 as uuidv4 } from "uuid";

import { GlobalService } from "./../core/config/global.service";
import { ValidateService } from "./../core/config/validate.service";
import { validate } from "class-validator";
import { ProviderOperatorService } from "../provider-operator/provider-operator.service";
import { providerOperatorDto } from "../provider-operator/provider-operator.dto";
import { handleError, handleErrors, handleStatusError } from "../common/errorHandling";
import { ProvidersService } from "../providers/providers.service";
import { OperatorsService } from "../operators/operators.service";
import { NotificationShare } from "../notification/notification.entity";
import { NotificationService } from "../notification/notification.service";
import { error } from "console";

enum contractStatus {
  Draft = "Draft",
  Published = "Published",
}

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contracts)
    private readonly repository: Repository<Contracts>,
    private readonly providerOperatorService: ProviderOperatorService,
    private readonly providerService: ProvidersService,
    private readonly operatorService: OperatorsService,
    private readonly notificationService: NotificationService
  ) { }

  async create(contractDto: ContractsDto,type?:string): Promise<ContractsDto[]> {
    let results: ContractsDto[] = [];

    try {
      
      if (
        "providerId" in contractDto &&
        typeof contractDto.providerId == "string"
      ) {
        const promises = Object.keys(contractDto.operatorId).flatMap(
          (ref_id) => {
            return contractDto.operatorId[ref_id].map(async (id) => {
              const local_data: ContractsDto = {
                ...contractDto,
                index: "Provider",
                operatorId: id,
                createdBy: contractDto.createdBy,
                refIndex: ref_id,
                id: uuidv4(),
              };

              let operator_proposal = this.getContractAsEntity(local_data);

              const saved = await this.repository.save(operator_proposal);
              return this.getContractAsDto(saved);
            });
          }
        );
        const providerResults = await Promise.all(promises);
        results.push(...providerResults);
      }
      if (
        "operatorId" in contractDto &&
        typeof contractDto.operatorId == "string"
      ) {
        const promises = Object.keys(contractDto.providerId).flatMap(
          (ref_id) => {
            return contractDto.providerId[ref_id].map(async (id) => {
              const local_data: ContractsDto = {
                ...contractDto,
                index: "Operator",
                providerId: id,
                createdBy: contractDto.createdBy,
                refIndex: ref_id,
                id: uuidv4(),
              };
              let operator_proposal = this.getContractAsEntity(local_data);
              const saved = await this.repository.save(operator_proposal);
              return this.getContractAsDto(saved);
            });
          }
        );
        const providerResults = await Promise.all(promises);
        results.push(...providerResults);
      }
      const res = await Promise.all(results);
      if (res.length == 0)
        throw new HttpException(
          "something went wrong",
          HttpStatus.NOT_MODIFIED,
          { cause: new Error("something went wrong") }
        );
      return res;
    } catch (error) {
      if(type==="api"){
         handleErrors(error,"contract")
      }
      if (error?.code === "ER_DUP_ENTRY") {
        const errorMessage = `Error: You have already contract with this user.`;
        throw new HttpException(errorMessage, HttpStatus.CONFLICT, {
          cause: new Error(errorMessage),
        });
      } else if (error.code === "ER_NO_DEFAULT_FOR_FIELD") {
        throw new HttpException(error.sqlMessage, HttpStatus.BAD_REQUEST, {
          cause: new Error(error?.sqlMessage),
        });
      } else {
        throw new HttpException(error, HttpStatus.BAD_REQUEST, {
          cause: new Error(error),
        });
      }
    }
  }

  async createOneContract(contractDto: ContractsDto,type?:string): Promise<ContractsDto> {
    try {
      contractDto.id = uuidv4();
      let operator_proposal = this.getContractAsEntity(contractDto);

      const saved = await this.repository.save(operator_proposal);
      return this.getContractAsDto(saved);
    } catch (error) {
      if(type==="api"){
        handleErrors(error,"contract")
     }
      if (error.code === "ER_DUP_ENTRY") {
        const errorMessage = `Error: You have already contract with this user.`;

        throw new HttpException(errorMessage, HttpStatus.CONFLICT, {
          cause: new Error(errorMessage),
        });
      }

      if (error.code === "ER_NO_DEFAULT_FOR_FIELD") {
        throw new HttpException(error.sqlMessage, HttpStatus.BAD_REQUEST, {
          cause: new Error(error?.sqlMessage),
        });
      }
      throw new HttpException(error, HttpStatus.BAD_REQUEST, {
        cause: new Error(error),
      });
    }
  }

  async update(contractDto: ContractsDto, companyDetails?: any,type?:string): Promise<ContractsDto> {
    // this.myValidate(contractDto);
    try {
      let contract = this.getContractAsEntity(contractDto);
  
      let updateResult = await this.repository.update(contract.id, contract);

      if (updateResult.affected == 0) {
        throw new HttpException(
          "No record found with the ID",
          HttpStatus.BAD_REQUEST,
          { cause: new Error("No record found with the ID") }
        );
      }
      const save = await this.getContractById(contract.id);
      //for notification
      if (companyDetails) {
        companyDetails = JSON.parse(JSON.stringify(companyDetails))
        let ref_obj = Object.assign(new NotificationShare(), {});
       let userName;
        if (companyDetails?.createdBy?.userRole == "Provider" || companyDetails?.createdBy?.userRole == "Sub Provider") {
          ref_obj.senderId = companyDetails?.id;
          ref_obj.receiverId = {
            id: JSON.parse(save.operatorId)?.id,
            email: JSON.parse(save.operatorId)?.companyEmail
          };
          ref_obj.message.body = `The Provider - ${companyDetails?.companyName} has changed the contract details of the Contract - ${save?.contractName}.`;
          userName=JSON?.parse(save?.operatorId)?.companyName
        } else if (companyDetails?.createdBy?.userRole == "Operator" || companyDetails?.createdBy?.userRole == "Sub Operator") {
          ref_obj.senderId = companyDetails?.id;
          ref_obj.receiverId = {
            id: JSON?.parse(save?.providerId)?.id,
            email: JSON?.parse(save?.providerId)?.companyEmail
          };
          ref_obj.message.body = `The Operator - ${companyDetails?.companyName} has changed the contract details of the Contract - ${save?.contractName}.`;
          userName=JSON?.parse(save?.providerId)?.companyName
        }
        ref_obj.message.link = save?.id
        ref_obj.message.title =  `NEXUS Contract Update Alert From ${companyDetails?.companyName}`
        ref_obj.message.type = "contract"

        const tempOption = {
          title: `${companyDetails?.companyName} Contract Updated`,
          subject: `NEXUS Contract Update Alert From ${companyDetails?.companyName}`,
          subTitle: `Greetings from NEXUS! We have some exciting news regarding an updated contract from <b>${companyDetails?.companyName}</b> .`,
          userName: userName,
          content:
            "We value transparency and efficiency in our operations, which is why we strive to maintain a single source of truth for all contracts. Your input is crucial in ensuring the accuracy and integrity of your records.",
          subContent: `<b>${companyDetails?.companyName}</b> has made some changes to the contract with you, and we kindly request you to take a moment to review and approve these updates. Your prompt action will help us keep our repository up-to-date and ensure smooth collaboration moving forward.`,
          subContent2:"To access the revised contract, simply log in to your <a style='text-decoration: underline; color:blue' href='https://lobby.nexus7995.com/' target='_blank' >NEXUS Lobby </a> and head to the Contract Management section or click on the Notifications icon on the top right hand corner. You'll find the updated document clearly marked for your review.",

          contentBelow:"We greatly appreciate your cooperation in this matter. If you have any questions or need assistance, our dedicated support team is here to help.",
          contentBelow2:"Thank you for being part of the NEXUS community. Together, we're building a stronger and more reliable platform for all our valued users.",
          nexusLink:"If you're not already using NEXUS, we recommend signing up for a  <a style='text-decoration: underline; color:blue' href='https://www.nexus7995.com/pricing' target='_blank' >Freemium account here</a>, giving you access to all functionalities for an extended period."
        };

        this.notificationService.createNew(ref_obj,tempOption)
      }

      return save;
    } catch (error) {
      if(type==="api"){
        handleError(error)
      }
      if (error?.status == 400) {
        throw new HttpException(error?.response, HttpStatus.BAD_REQUEST);
      } else if (error?.code === "ER_DUP_ENTRY") {
        const errorMessage = `Error: You have already contract with this user.`;

        throw new HttpException(errorMessage, HttpStatus.CONFLICT, {
          cause: new Error(errorMessage),
        });
      } else {
        if (error.code == "ER_BAD_NULL_ERROR") {
          throw new HttpException(error.sqlMessage, HttpStatus.BAD_REQUEST);
        }
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async ChangeContractStatus(
    contractDto: ContractsDto,type?:string
  ): Promise<{ status: String; data?: ContractsDto; error?: string }> {
    // this.myValidate(contractDto);
    try {
      let contract = this.getContractAsEntity(contractDto);


      let updateResult = await this.repository.update(contract.id, contract);

      if (updateResult.affected === 0) {
        if (type == "api") {
          throw new HttpException(
            "No record found with the ID",
            HttpStatus.NOT_FOUND
          );
        }
        return { status: "error", error: "No record found with the ID" };
      }
      const save = await this.getContractById(contract.id);

      let ref_obj = {
        providerId: JSON.parse(save.providerId)?.id,
        operatorId: JSON.parse(save.operatorId)?.id,
      };
      let provider_operators = await this.providerOperatorService.find(ref_obj);

      const providerOperatorUpdate = Object.assign(new providerOperatorDto(), {
        id: provider_operators[0].id,
        status: "Active",
      });
      const provider_operator_resutt =
        await this.providerOperatorService.update(providerOperatorUpdate);
      if (provider_operator_resutt.status == "error")
        return { status: "error", error: provider_operator_resutt.error };
      return { status: "success", data: save };
    } catch (error) {
      if (type == "api") {
        handleErrors(error)
      }
      const throwError = handleStatusError(error);
      return throwError;
    }
  }

  async UpdateDefault(contract_ref: {
    id: string;
    providerId: string;
    default: boolean;
  },type?:string): Promise<ContractsDto> {
    try {
      const queryBuilder = this.repository.createQueryBuilder("Contracts");
      await queryBuilder.update("Contracts").set({ default: false }).execute();

      let updateResult = await this.repository.update(contract_ref.id, {
        default: contract_ref.default,
      });
      if (updateResult.affected === 0) {
        throw new HttpException(
          "No record found with the ID!",
          HttpStatus.NOT_FOUND
        );
      }
      let res = await this.repository.find({
        where: { id: contract_ref.id },
        relations: {
          createdBy: true,
        },
      });
      if (res.length == 0) {
        throw new HttpException(
          "contract id is not valid!",
          HttpStatus.CONFLICT
        );
      }
      return this.getContractAsDto(res[0]);
    } catch (error) {
      if (type == "api") {
        handleErrors(error)
      } 
      handleError(error);
    }
  }

  async findAll(): Promise<ContractsDto[]> {
    let items = await this.repository.find();
    return this.getContractsAsDto(items);
  }

  async findByDetails(params: {
    providerId?: string;
    operatorId?: string;
    id?: string;
    createdBy?: string;
    status?: string;
    index?: string;
  },type?:string): Promise<ContractsDto[]> {
    try {
      const queryBuilder = this.repository.createQueryBuilder("contract");
      if (params.id) {
        queryBuilder.where("contract.id = :id", { id: params.id });
      }
      if (params.status) {
        queryBuilder.andWhere("contract.status = :status", {
          status: contractStatus[params.status],
        });
      }
      if (params.index) {
        queryBuilder.andWhere('contract.index = :index', { index: params.index });
      }
      if (params.providerId) {
        queryBuilder.andWhere("contract.providerId = :providerId", {
          providerId: params.providerId,
        });
      }
      if (params.operatorId) {
        queryBuilder.andWhere("contract.operatorId = :operatorId", {
          operatorId: params.operatorId,
        });
      }

      queryBuilder.leftJoinAndSelect("contract.createdBy", "createdBy");

      const items = await queryBuilder.getMany();

    
      // const filteredItems = items.filter(data => {
      //   if (params.providerId !== undefined && data.index == "Operator" && data.status !== "Published") {
      //     return false;
      //   }
      //   else if (params.operatorId !== undefined && data.index === "Provider" && data.status !== "Published") {
      //     return false;
      //   }
      //   else {
      //     return true;

      //   }
      // });
      if (items.length <= 0 && type == "api") {
        throw new HttpException(
          "No record found with the ID",
          HttpStatus.BAD_REQUEST
        );
      }
      return this.getContractsAsDto(items);
    } catch (error) {
      if(type=="api"){
        handleErrors(error)
      }
      console.log(error, "errorerror");
    }
  }

  // serch and filter all contracts
  async searchDetails(params: {
    query?: string;
    typeId?: string;
    type: string;
    status?: string;
  }): Promise<ContractsDto[]> {
    try {
      const { query, type, typeId, status } = params;

      const queryBuilder = this.repository.createQueryBuilder("contracts");
      let my_Id =
        type == "Provider"
          ? { providerId: typeId, status: status }
          : { operatorId: typeId, status: status };
      let filterData = [];
      const allContract = await this.findByDetails(my_Id);

      if (!query || query == null || query == "") {
        filterData = allContract;
      } else {
        filterData = await queryBuilder
          .where(
            "contracts.id LIKE :query OR contracts.contractName LIKE :query OR contracts.revShareTiedToGameType LIKE :query",
            {
              query: `%${query}%`,
            }
          )
          .getMany();
      }

      const keys = filterData?.map((data) => data.id);

      const searchedData = async (keys) => {
        const finalData = allContract.filter((data) => {
          if (keys.includes(data.id)) {
            return data;
          }
        });
        return finalData;
      };

      if (keys.length > 0) {
        filterData = await searchedData(keys);
      }
      return filterData;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getContractById(id: string): Promise<ContractsDto> {
    try {
      let saved = await this.repository.findOne({
        where: {
          id: id,
        },
      });
       if(saved==null){
        throw new HttpException("Not found any contract with this Id!", HttpStatus.BAD_REQUEST);
       }
      return this.getContractAsDto(saved);
    } catch (error) {
      if (error?.status == 400) {
        throw new HttpException(error?.response, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException("Bad Request", HttpStatus.BAD_REQUEST);
      }
    }
  }

  async IsContract(params: { providerId: string, operatorId: string }): Promise<ContractsDto> {
    let saved = await this.repository.findOne({
      where: {
        providerId: params.providerId,
        operatorId: params.operatorId,
      },
    });

    if (saved == null) return null;

    return this.getContractAsDto(saved);
  }

  async delete(id: string,type?:string): Promise<string> {
    try {
      let deleteResult = await this.repository.delete(id);

      if (deleteResult.affected === 0) {
        // If no rows were affected, it means the ID does not match any existing records
        if(type==="api"){
          throw new HttpException("Not found any contract with this Id!", HttpStatus.NOT_FOUND);
        }
        return "error: ID does not exist";
      }

      return "Success: Item with ID " + id + " has been successfully deleted.";
    } catch (error) {
      if(type==="api"){
        handleErrors(error)
      }
      if (error.code === "ER_ROW_IS_REFERENCED_2") {
        return "error: The record cannot be deleted because it is referenced by other records";
      }
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

  async getContractsAsDto(items: Contracts[]): Promise<ContractsDto[]> {
    if (items == null) return null;
    let ret = new Array<ContractsDto>();
    for (var i = 0; i < items.length; i++) {
      ret.push(await this.getContractAsDto(items[i]));
    }
    return ret;
  }

  async getContractAsDto(
    item: Contracts,
  ): Promise<ContractsDto> {
    if (item == null) return null;
    let ret: ContractsDto = Object.assign(new ContractsDto(), item);

    ret.gameType = this.parseJson(item.gameType);
    ret.revShareProviderTiers = this.parseJson(item.revShareProviderTiers);
    ret.gameExceptions = this.parseJson(item.gameExceptions);
    ret.includedCountries = this.parseJson(item.includedCountries);
    ret.restrictedCountries = this.parseJson(item.restrictedCountries);
    ret.localLicenses = this.parseJson(item.localLicenses);
    ret.startDate = new Date(item.startDate);

    const details = await this.getProviderOperator(item);
    ret.providerId = details.providerId
    ret.operatorId = details.operatorId
    return ret;
  }

  async getProviderOperator(item: Contracts) {
    let ref_data = {
      providerId: "string",
      operatorId: "string",
    };
    if (item.index == "Provider") {
      if (item.refIndex === "Scraper") {
        ref_data.operatorId = this.stringifyJson(await this.providerOperatorService.getExtOperatorProvider(
          item.operatorId
        ))
          ;
      } else if (item.refIndex === "Internal") {
        ref_data.operatorId = this.stringifyJson(await this.operatorService.getOperator(
          item.operatorId
        ));
      }

      ref_data.providerId = this.stringifyJson(await this.providerService.getProviderById(
        item.providerId
      ))
    }
    if (item.index == "Operator") {
      if (item.refIndex === "Scraper") {
        ref_data.providerId = this.stringifyJson(
          await this.providerOperatorService.getExtOperatorProvider(
            item.providerId
          ));
      } else if (item.refIndex === "Internal") {
        ref_data.providerId = this.stringifyJson(await this.providerService.getProviderById(
          item.providerId
        ));
        let ss = this.stringifyJson(await this.providerService.getProviderById(
          item.providerId
        ));
      }
      ref_data.operatorId = this.stringifyJson(await this.operatorService.getOperator(
        item.operatorId
      ));
    }

    return ref_data;
  }

  parseJson(json: string): any {
    if (json == null) return json;

    var cName = json.constructor.name;
    if (cName != "String" && cName != "string") return json;

    return JSON.parse(json);
  }

  stringifyJson(json: any): string {
    if (json == null) return json;

    var cName = json.constructor.name;
    if (cName === "String" || cName === "string") return json;

    return JSON.stringify(json);
  }

  getContractAsEntity(contractDto: ContractsDto): Contracts {
    if (contractDto == null) return null;
    let contract: Contracts = Object.assign(new Contracts(), contractDto);
    if (contractDto.startDate) {
      contract.startDate = new Date(contractDto.startDate);
    }
    contract.gameType = this.stringifyJson(contractDto.gameType);
    contract.revShareProviderTiers = this.stringifyJson(
      contractDto.revShareProviderTiers
    );
    contract.gameExceptions = this.stringifyJson(contractDto.gameExceptions);
    contract.includedCountries = this.stringifyJson(
      contractDto.includedCountries
    );
    contract.localLicenses = this.stringifyJson(contractDto.localLicenses);
    contract.restrictedCountries = this.stringifyJson(
      contractDto.restrictedCountries
    );

    return contract;
  }

  myValidate(contractDto: ContractsDto) {
    ValidateService.validateLanguageCodes(contractDto.includedCountries);
    ValidateService.validateLanguageCodes(contractDto.restrictedCountries);
    ValidateService.validateLanguageCodes(contractDto.localLicenses);
  }
}
