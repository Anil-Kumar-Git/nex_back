import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DeleteResult, UpdateResult, Like } from "typeorm";

import { OperatorProposalDto } from "./operatorProposal.dto";
import { OperatorProposal } from "./operatorProposal.entity";

import { UsersDto } from "../users/users.dto";
import { Users } from "../users/users.entity";

import { ValidateService } from "./../core/config/validate.service";

import { v4 as uuidv4 } from "uuid";
import { Providers } from "../providers/providers.entity";
import { error } from "console";
import { Operators } from "../operators/operators.entity";
import { handleErrors, handleStatusError } from "../common/errorHandling";
import { GameTracking } from "../gameTracking/game_tracking.entity";
import { ProposalTracking } from "../proposalTracking/proposal_tracking.entity";
@Injectable()
export class OperatorProposalService {
  constructor(
    @InjectRepository(OperatorProposal)
    private readonly repository: Repository<OperatorProposal>,
    @InjectRepository(GameTracking)
    private readonly gameTracking: Repository<GameTracking>,
    @InjectRepository(ProposalTracking)
    private readonly proposalTracking: Repository<ProposalTracking>
  ) { }

  async create(
    OperatorProposalDto_ref: OperatorProposalDto ,type?:string
  ): Promise<{ status: string, data?: OperatorProposalDto, error?: string }> {
    try {
      OperatorProposalDto_ref.id = uuidv4();
      let operator_proposal = this.getOperatorProposalAsEntity(
        OperatorProposalDto_ref
      );

      let saved = await this.repository.save(operator_proposal);
      const res = this.getOperatorProposalAsDto(saved);
      if (res && OperatorProposalDto_ref.default == true) {
        const hasDefaultTrue = await this.repository
          .createQueryBuilder("operator_proposal")
          .where("operator_proposal.default = :default", { default: true })
          .getCount();

        if (hasDefaultTrue) {
          await this.repository
            .createQueryBuilder()
            .update("operator_proposal")
            .set({ default: false })
            .where("operator_proposal.id != :id", { id: res.id })
            .execute();
        }
      }
      return { status: "success", data: res }

    } catch (error) {
      if (type == "api") {
        handleErrors(error)
      }
      if (error.code === "ER_DUP_ENTRY") {
        const errorMessage = `Error: You have already created this proposal.`;
        return { status: "error", error: errorMessage }
      }

      if (error.code === "ER_NO_DEFAULT_FOR_FIELD" || error.code === "ER_PARSE_ERROR") {

        return { status: "error", error: error?.sqlMessage }

      }
      return { status: "error", error: error }
    }
  }
  async find(params: {
    operatorId?: string;
    id?: string;
    createdBy?: string;
  },type?:string): Promise<OperatorProposalDto[]> {
    try {
      let saved = await this.repository.find({
        where: {
          id: params.id,
          operatorId: {
            id: params.operatorId,
          },
          createdBy: {
            id: params.createdBy,
          },
        },
        relations: {
          operatorId: true,
          createdBy: true,
        },
      });

      if (saved.length <= 0 && type == "api") {
        throw new HttpException(
          "No record found with the ID",
          HttpStatus.BAD_REQUEST
        );
      }   
      return this.getOperatorProposalsAsDto(saved);
    } catch (error) {
      if (type == "api") {
        handleErrors(error)
      }
      return error;
    }
  }

  // serch and filter all Proposals
  async searchDetails(params: {
    query?: string;
    typeId?: string;
  }, type?: string): Promise<OperatorProposalDto[]> {
    const { query, typeId } = params;
    const queryBuilder =
      this.repository.createQueryBuilder("operator_proposal");
    let my_Id = { operatorId: typeId };
    let filterData = [];

    const allContract = await this.find(my_Id);

    if (!query || query == null || query == "") {
      filterData = allContract;
    } else {
      const data = (
        await queryBuilder
          .where(
            "operator_proposal.id LIKE :query OR operator_proposal.proposalName LIKE :query ",
            { query: `%${query}%` }
          )
          .getMany()
      ).map((op) => filterData.push(op));
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

  async getOperatorProposalById(id: string): Promise<OperatorProposalDto> {
    try {
      let saved = await this.repository.findOne({
        where: {
          id: id,
        },
        relations: {
          operatorId: true,
          createdBy: true,
        },
      });
      return this.getOperatorProposalAsDto(saved);
    } catch (error) {
      return error;
    }
  }

  async update(
    OperatorProposalDto: OperatorProposalDto,type?:string
  ): Promise<{ status: string, data?: OperatorProposalDto, error?: string }> {
    try {
      const operator_proposal_entity =
        this.getOperatorProposalAsEntity(OperatorProposalDto);
      delete OperatorProposal["version"];
      let updateResult = await this.repository.update(
        OperatorProposalDto.id,
        operator_proposal_entity
      );
      if (updateResult.affected === 0) {
        if (type == "api") {
          throw new HttpException(
            "No record found with the ID",
            HttpStatus.NOT_FOUND
          );
       }
        return { status: "error", error: "No record found with the ID" }
      }

      let res = await this.repository.find({
        where: { id: OperatorProposalDto.id },
        relations: {
          operatorId: true,
          createdBy: true,
        },
      });
      let data = this.getOperatorProposalAsDto(res[0]);

      if (res && OperatorProposalDto.default == true) {
        const hasDefaultTrue = await this.repository
          .createQueryBuilder("operator_proposal")
          .where("operator_proposal.default = :default", { default: true })
          .getCount();

        if (hasDefaultTrue) {

          await this.repository
            .createQueryBuilder("operator_proposal")
            .update("operator_proposal")
            .set({ default: false })
            .where("operator_proposal.id != :id", { id: OperatorProposalDto.id })
            .execute();
        }
      }
      return { status: "success", data: data }
    } catch (error) {
      if (type == "api") {
        handleErrors(error)
      }
      return handleStatusError(error)
    }
  }

  async UpdateDefault(operatorProposalDto: {
    id: string;
    operatorId: string;
    default: boolean;
  },type?:string): Promise<{ status: string, data?: OperatorProposalDto, error?: string }> {
    try {
      if (type == "api") {
        if(typeof operatorProposalDto.default!=="boolean"){
          throw new HttpException(
            "The default value only accepts boolean.",
            HttpStatus.BAD_REQUEST
          );
        }
      }
      const queryBuilder =
        this.repository.createQueryBuilder("OperatorProposal");
      await queryBuilder
        .update("OperatorProposal")
        .set({ default: false })
        .execute();

      let updateResult = await this.repository.update(operatorProposalDto.id, {
        default: operatorProposalDto.default,
      });
      if (updateResult.affected === 0) {
        if (type == "api") {
          throw new HttpException(
            "No record found with the ID",
            HttpStatus.NOT_FOUND
          );
        }
        return { status: "error", error: "No record found with the ID" }
      }
      let res = await this.repository.find({
        where: { id: operatorProposalDto.id },
        relations: {
          operatorId: true,
          createdBy: true,
        },
      });
      const save = this.getOperatorProposalAsDto(res[0]);
      return { status: "success", data: save };


    } catch (error) {
      if (type == "api") {
        handleErrors(error)
      } 
      return { status: "error", error: error };
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
              HttpStatus.NOT_FOUND
            );
          }
          // If no rows were affected, it means the ID does not match any existing records
          return "error: ID does not exist";
        }
        return "Success: Item with ID " + id + " has been successfully deleted.";
      } else {
        if (type == "api") {
          throw new HttpException(
            "The record cannot be deleted because it is referenced by other records.",
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
  getOperatorProposalAsEntity(
    OperatorProposalDto_ref: OperatorProposalDto
  ): OperatorProposal {
    if (OperatorProposalDto_ref == null) return null;
    let operator_proposal: OperatorProposal = Object.assign(
      new OperatorProposal(),
      OperatorProposalDto_ref
    );

    operator_proposal.createdBy = Object.assign(
      new Users(),
      OperatorProposalDto_ref.createdBy
    );
    operator_proposal.operatorId = Object.assign(
      new Operators(),
      OperatorProposalDto_ref.operatorId
    );

    operator_proposal.localLicenses = OperatorProposalService.stringifyJson(
      OperatorProposalDto_ref.localLicenses
    );
    operator_proposal.restrictedCountries = OperatorProposalService.stringifyJson(
      OperatorProposalDto_ref.restrictedCountries
    );
    operator_proposal.revShareProviderTiers = OperatorProposalService.stringifyJson(
      OperatorProposalDto_ref.revShareProviderTiers
    );

    return operator_proposal;
  }

  getOperatorProposalsAsDto(
    items: OperatorProposal[]
  ): Array<OperatorProposalDto> {
    if (items == null) return null;
    let ret = new Array<OperatorProposalDto>();
    for (var i = 0; i < items.length; i++) {
      ret.push(this.getOperatorProposalAsDto(items[i]));
    }
    return ret;
  }
  getOperatorProposalAsDto(item: OperatorProposal): OperatorProposalDto {
    if (item == null) return null;
    let ret = Object.assign(new OperatorProposalDto(), item);

    //  ret.createdBy = Object.assign(new Users(), item.createdBy,);
    //  ret.operatorId = Object.assign(new Operators(), item.operatorId,);

    delete ret.createdBy.password;
    delete ret.createdBy.createdAt;

    ret.localLicenses = OperatorProposalService.parseJson(item.localLicenses);
    ret.restrictedCountries = OperatorProposalService.parseJson(item.restrictedCountries);
    ret.revShareProviderTiers = OperatorProposalService.parseJson(item.revShareProviderTiers)
    return ret;
  }


  myValidate(OperatorProposalDto: OperatorProposalDto) {
    ValidateService.validateLanguageCodes(
      OperatorProposalDto.restrictedCountries
    );
    ValidateService.validateLanguageCodes(OperatorProposalDto.localLicenses);
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
