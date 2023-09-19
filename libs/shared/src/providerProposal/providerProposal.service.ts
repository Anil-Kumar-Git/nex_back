import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DeleteResult, UpdateResult, Like } from "typeorm";

import { providerProposalDto } from "./providerProposal.dto";
import { ProviderProposal } from "./providerProposal.entity";

import { UsersDto } from "../users/users.dto";
import { Users } from "../users/users.entity";

import { ValidateService } from "../core/config/validate.service";

import { v4 as uuidv4 } from "uuid";
import { Providers } from "../providers/providers.entity";
import { error } from "console";
import { errRespo, handleError, handleErrors, handleStatusError } from "../common/errorHandling";
import { GameTracking } from "../gameTracking/game_tracking.entity";
import { GameTrackingService } from "../gameTracking/game_tracking.service";
import { ProposalTracking } from "../proposalTracking/proposal_tracking.entity";
@Injectable()
export class ProviderProposalService {
  constructor(
    @InjectRepository(ProviderProposal)
    private readonly repository: Repository<ProviderProposal>,
    @InjectRepository(GameTracking)
    private readonly gameTracking: Repository<GameTracking>,
    @InjectRepository(ProposalTracking)
    private readonly proposalTracking: Repository<ProposalTracking>
  ) { }

  async create(
    OperatorProposalDto_ref: providerProposalDto,type?:string
  ): Promise<{ status: string; data?: providerProposalDto; error?: string }> {
    try {

      OperatorProposalDto_ref.id = uuidv4();
      // this.myValidate(OperatorProposalDto_ref);
      let operator_proposal = this.getProviderProposalAsEntity(
        OperatorProposalDto_ref
      );

      let saved = await this.repository.save(operator_proposal);
      let res = this.getProviderProposalAsDto(saved);

      if (res && OperatorProposalDto_ref.default == true) {
        const hasDefaultTrue = await this.repository
          .createQueryBuilder("provider_proposal")
          .where("provider_proposal.default = :default", { default: true })
          .getCount();

        if (hasDefaultTrue) {
          await this.repository
            .createQueryBuilder()
            .update("provider_proposal")
            .set({ default: false })
            .where("provider_proposal.id != :id", { id: res.id })
            .execute();
        }
      }
      return { status: "success", data: res };
    } catch (error) {
      if(type=="api"){
        if(error.code=="ER_NO_REFERENCED_ROW_2"){
          throw new HttpException(errRespo(HttpStatus.BAD_REQUEST,error?.sqlMessage,"please check the Provider column value is not valid!"), HttpStatus.BAD_REQUEST);
        }
        handleErrors(error)
      }
      if (error?.code === "ER_DUP_ENTRY") {
        const errorMessage = `Error: You have already created this proposal.`;
        return { status: "error", error: errorMessage };
      } else {
        return handleStatusError(error)
      }
    }
  }
  async find(params: {
    providerId?: string;
    id?: string;
    createdBy?: string;
  }, type?:string): Promise<providerProposalDto[]> {
    try {
      let saved = await this.repository.find({
        where: {
          id: params.id,
          providerId: {
            id: params.providerId,
          },
          createdBy: {
            id: params.createdBy,
          },
        },
        relations: {
          providerId: true,
          createdBy: true,
        },
      });
      if (saved.length <= 0 && type == "api") {
        throw new HttpException(
          "No record found with the ID",
          HttpStatus.BAD_REQUEST
        );
      }
      const save = this.getProviderProposalsAsDto(saved);
      return save;
    } catch (error) {
      if (type == "api") {
        handleErrors(error);
      }
      return error;
    }
  }
  async getProviderProposalById(id: string): Promise<providerProposalDto> {
    let res = await this.repository.findOne({ where: { id: id } });
    return this.getProviderProposalAsDto(res);
  }
  async update(
    providerProposalDto: providerProposalDto,type?:string
  ): Promise<{ status: string; data?: providerProposalDto; error?: string }> {
    try {
      const provider_proposal_entity =
        this.getProviderProposalAsEntity(providerProposalDto);
      delete ProviderProposal["version"];

      let updateResult = await this.repository.update(
        providerProposalDto.id,
        provider_proposal_entity
      );
      if (updateResult.affected === 0) {
        if (type == "api") {
          throw new HttpException(
            "No record found with the ID",
            HttpStatus.BAD_REQUEST
          );
        }
        return { status: "error", error: "No record found with the ID" };
      }

      let res = await this.repository.findOne({
        where: { id: providerProposalDto.id },
        relations: {
          providerId: true,
          createdBy: true,
        },
      });
      let save = this.getProviderProposalAsDto(res);


      if (save && providerProposalDto.default == true) {
        const hasDefaultTrue = await this.repository
          .createQueryBuilder("provider_proposal")
          .where("provider_proposal.default = :default", { default: true })
          .getCount();

        if (hasDefaultTrue) {
          await this.repository
            .createQueryBuilder()
            .update("provider_proposal")
            .set({ default: false })
            .where("provider_proposal.id != :id", { id: save.id })
            .execute();
        }
      }
      return { status: "success", data: save };
    } catch (error) {
      if (type == "api") {
        if(error.code=="ER_NO_REFERENCED_ROW_2"){
          throw new HttpException(errRespo(HttpStatus.BAD_REQUEST,error?.sqlMessage,"please check the Provider column value is not valid!"), HttpStatus.BAD_REQUEST);
        }
        handleErrors(error)
      }
      if (error?.code === "ER_DUP_ENTRY") {
        const errorMessage = `Error: You have already created this proposal.`;
        return { status: "error", error: errorMessage };
      } else {
        return { status: "error", data: error };
      }
    }
  }

  // serch and filter all Proposals
  async searchDetails(params: {
    query?: string;
    typeId?: string;
    type: string;
  }): Promise<providerProposalDto[]> {
    const { query, typeId } = params;
    const queryBuilder =
      this.repository.createQueryBuilder("provider_proposal");
    let my_Id = { providerId: typeId };
    let filterData = [];

    const allContract = await this.find(my_Id);

    if (query && query !== "") {
      const data = (
        await queryBuilder
          .where(
            "provider_proposal.id LIKE :query OR provider_proposal.proposalName LIKE :query ",
            { query: `%${query}%` }
          )
          .getMany()
      ).map((op) => filterData.push(op));
    } else {
      filterData = allContract;
    }

    const keys = filterData.map((data) => data.id);

    const searchedData = async (keys) => {
      const searchPro = allContract.filter((data) => {
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

  async UpdateDefault(providerProposalDto: {
    id: string;
    providerId: string;
    default: boolean;
  },type?:string): Promise<{ status: string; data?: providerProposalDto; error?: string }> {
    try {
      const queryBuilder =
        this.repository.createQueryBuilder("ProviderProposal");
      await queryBuilder
        .update("ProviderProposal")
        .set({ default: false })
        .execute();

        if (type == "api" && (typeof providerProposalDto.default)!='boolean') {
          throw new HttpException(
            "Only boolean type is acceptable.",
            HttpStatus.BAD_REQUEST
          );
        }
      let updateResult = await this.repository.update(providerProposalDto.id, {
        default: providerProposalDto.default,
      });
      if (updateResult.affected === 0) {
        if (type == "api") {
          throw new HttpException(
            "No record found with the ID",
            HttpStatus.BAD_REQUEST
          );
        }
        return { status: "error", error: "No record found with the ID" };
      }
      let res = await this.repository.findOne({
        where: { id: providerProposalDto.id },
        relations: {
          providerId: true,
          createdBy: true,
        },
      });
      const save = this.getProviderProposalAsDto(res);
      return { status: "success", data: save };

    } catch (error) {
      if (type == "api") {
        handleErrors(error)
      }
      if (error?.code === "ER_DUP_ENTRY") {
        const errorMessage = `Error: You have already created this proposal.`;
        return { status: "error", error: errorMessage };
      } else {
        return { status: "error", data: error };
      }
    }
  }

  async delete(id: string,type?:string): Promise<string> {
    try {
      const exitsInGameTracking = await this.gameTracking.findOne({ where: { proposalId: id } })
      const exitsInproposalTracking = await this.proposalTracking.findOne({ where: { proposalId: id } })
      if (exitsInproposalTracking == null && exitsInGameTracking == null) {
        let deleteResult = await this.repository.delete(id);
        if (deleteResult.affected === 0) {
          if (type == "api") {
            throw new HttpException(
              "No record found with the ID",
              HttpStatus.BAD_REQUEST
            );
          }
          // If no rows were affected, it means the ID does not match any existing records
          return "error: ID does not exist";
        }
        return "Success: Item with ID " + id + " has been successfully deleted.";
      } else {
        if (type == "api") {
          throw new HttpException(
            "The record cannot be deleted because it is referenced by other records",
            HttpStatus.BAD_REQUEST
          );
        }
        return "error: The record cannot be deleted because it is referenced by other records."

      }

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
  //some common function
  getProviderProposalAsEntity(
    providerProposalDto_ref: providerProposalDto
  ): ProviderProposal {
    if (providerProposalDto_ref == null) return null;
    let provider_proposal: ProviderProposal = Object.assign(
      new ProviderProposal(),
      providerProposalDto_ref
    );

    provider_proposal.createdBy = Object.assign(
      new Users(),
      providerProposalDto_ref.createdBy
    );
    provider_proposal.providerId = Object.assign(
      new Providers(),
      providerProposalDto_ref.providerId
    );
    provider_proposal.gameType = ProviderProposalService.stringifyJson(providerProposalDto_ref.gameType);
    provider_proposal.revShareProviderTiers = ProviderProposalService.stringifyJson(
      providerProposalDto_ref.revShareProviderTiers
    );


    provider_proposal.includedCountries = ProviderProposalService.stringifyJson(
      providerProposalDto_ref.includedCountries
    );

    provider_proposal.localLicenses = ProviderProposalService.stringifyJson(
      providerProposalDto_ref.localLicenses
    );


    provider_proposal.restrictedCountries = ProviderProposalService.stringifyJson(
      providerProposalDto_ref.restrictedCountries
    );

    return provider_proposal;
  }

  getProviderProposalsAsDto(
    items: ProviderProposal[]
  ): Array<providerProposalDto> {
    if (items == null) return null;
    let ret = new Array<providerProposalDto>();
    for (var i = 0; i < items.length; i++) {
      ret.push(this.getProviderProposalAsDto(items[i]));
    }

    return ret;
  }
  getProviderProposalAsDto(item: ProviderProposal): providerProposalDto {
    if (item == null) return null;

    let ret: providerProposalDto = Object.assign(
      new providerProposalDto(),
      item
    );

    ret.createdBy = Object.assign(new Users(), item.createdBy);
    ret.providerId = Object.assign(new Providers(), item.providerId);

    delete ret.createdBy.password;
    //delete ret.createdBy.createdAt

    ret.includedCountries = ProviderProposalService.parseJson(item.includedCountries);
    ret.gameType = ProviderProposalService.parseJson(item.gameType);

    ret.revShareProviderTiers = ProviderProposalService.parseJson(item.revShareProviderTiers);

    ret.localLicenses = ProviderProposalService.parseJson(item.localLicenses);

    ret.restrictedCountries = ProviderProposalService.parseJson(item.restrictedCountries);

    return ret;
  }

  myValidate(providerProposalDto: providerProposalDto) {
    ValidateService.validateLanguageCodes(
      providerProposalDto.restrictedCountries
    );
    ValidateService.validateLanguageCodes(providerProposalDto.localLicenses);
  }

  static parseJson(json: string): any {
    if (json == null) return json;

    var cName = json.constructor.name;
    if (cName != "String" && cName != "string") return json;

    return JSON.parse(json);
  }

  static stringifyJson(json: any): string {
    if (json == null) return json;

    var cName = json.constructor.name;
    if (cName === "String" || cName === "string") return json;

    return JSON.stringify(json);
  }
}
