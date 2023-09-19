import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Repository,
  DeleteResult,
  UpdateResult,
  Like,
  Brackets,
} from "typeorm";

import { providerOperatorDto } from "./provider-operator.dto";
import { ProviderOperator } from "./provider-operator.entity";

import { Users } from "../users/users.entity";

import { v4 as uuidv4 } from "uuid";
import { ProvidersService } from "../providers/providers.service";
import { OperatorsService } from "../operators/operators.service";
import { ExternalProviderOpeartorService } from "../externalProviderOperator/externalProviderOperator.service";
import { SandgridService } from "../sandgrid/sandgrid.service";
import { Providers } from "../providers/providers.entity";
import { Operators } from "../operators/operators.entity";
import { externalProviderOpeartors } from "../externalProviderOperator/externalProviderOperator.entity";
import { externalProviderOpeartorDto } from "../externalProviderOperator/externalProviderOperator.dto";
import { handleErrors } from "../common/errorHandling";

enum Status {
  Active = "Active",
  InActive = "InActive",
}
@Injectable()
export class ProviderOperatorService {
  constructor(
    private readonly providersService: ProvidersService,
    private readonly operatorsService: OperatorsService,
    private readonly externalProviderOpeartorService: ExternalProviderOpeartorService,
    private readonly sandgridService: SandgridService,

    @InjectRepository(ProviderOperator)
    private readonly repository: Repository<ProviderOperator>,
    @InjectRepository(externalProviderOpeartors)
    private readonly ex_repository: Repository<externalProviderOpeartors>,
    @InjectRepository(Providers)
    private readonly provider: Repository<Providers>,
    @InjectRepository(Operators)
    private readonly operator: Repository<Operators>
  ) { }

  async addOperatorById(
    providerOperator: providerOperatorDto,type?:string
  ): Promise<providerOperatorDto[]> {
    const res = await this.create(providerOperator,type);
    //const email_res = await this.sendEmail()
    return res;
  }

  async create(
    providerOperator: providerOperatorDto,type?:string
  ): Promise<providerOperatorDto[]> {
    try {
      let results: providerOperatorDto[] = [];

      if (
        "providerId" in providerOperator &&
        typeof providerOperator.providerId == "string"
      ) {
        const promises = Object.keys(providerOperator.operatorId).flatMap(
          (ref_id) => {
            return providerOperator.operatorId[ref_id].map(async (id) => {
              const local_data: providerOperatorDto = {
                ...providerOperator,
                refID: ref_id,
                index: "Provider",
                operatorId: id,
                createdBy: providerOperator.createdBy,
                id: uuidv4(),
              };
              let operator_proposal =
                this.getProviderOperatorAsEntity(local_data);
              const saved = await this.repository.save(operator_proposal);
              return this.getProviderOperatorAsDto(saved);
            });
          }
        );
        const providerResults = await Promise.all(promises);
        results.push(...providerResults);
      }

      if (
        "operatorId" in providerOperator &&
        typeof providerOperator.operatorId == "string"
      ) {
        const promises = Object.keys(providerOperator.providerId).flatMap(
          (ref_id) => {

            return providerOperator.providerId[ref_id].map(async (id) => {
              const local_data: providerOperatorDto = {
                ...providerOperator,
                refID: ref_id,
                index: "Operator",
                providerId: id,
                createdBy: providerOperator.createdBy,
                id: uuidv4(),
              };
              let operator_proposal =
                this.getProviderOperatorAsEntity(local_data);
              const saved = await this.repository.save(operator_proposal);
              return this.getProviderOperatorAsDto(saved);
            });
          }
        );
        const providerResults = await Promise.all(promises);
        results.push(...providerResults);
      }
      const res = await Promise.all(results);

      return res;
    } catch (error) {
      if (type == "api") {
        handleErrors(error)
      }
      if (error.code === "ER_DUP_ENTRY") {
        const errorMessage = `Error: You have already added this user. `;
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
  async find(params: {
    providerId?: string;
    operatorId?: string;
    id?: string;
    createdBy?: string;
    index?: string;
    status?: string
  },type?:string): Promise<providerOperatorDto[]> {
    try {
      let saved = await this.repository.find({
        where: {
          id: params.id,
          index: params.index,
          providerId: params.providerId,
          operatorId: params.operatorId,
          createdBy: {
            id: params.createdBy,
          },
          status: Status[(params.status)]
        },
        relations: {
          createdBy: true,
        },
      });
     
      if (saved.length <= 0 && type == "api") {
        throw new HttpException(
          "No record found with the ID",
          HttpStatus.BAD_REQUEST
        );
      }
      return this.getOperatorProvidersAsDto(saved);
    } catch (error) {
      if (type == "api") {
        handleErrors(error)
      }
      throw new HttpException(error, HttpStatus.OK);
    }
  }
  async update(
    providerOperatorDto: providerOperatorDto ,type?:string
  ): Promise<{ status: string, data?: providerOperatorDto, error?: string }> {
    try {
      const provider_operator_entity =
        this.getProviderOperatorAsEntity(providerOperatorDto);
      delete ProviderOperator["version"];
      let updateResult = await this.repository.update(
        providerOperatorDto.id,
        provider_operator_entity
      );
      if (updateResult.affected === 0) {
        if (type == "api") {
          throw new HttpException(
            "No record found with the ID",
            HttpStatus.BAD_REQUEST
          );
        }
        return { status: "error", error: "No record found with the ID" }
      }

      let res = await this.repository.find({
        where: { id: providerOperatorDto.id },
        relations: {
          createdBy: true,
        },
      });

      const save = await this.getProviderOperatorAsDto(res[0]);
      return { status: "success", data: save }

    } catch (error) {
      if (type == "api") {
        handleErrors(error)
      }
      return { status: "error", error: error }

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

      return "Success: Item with ID " + id + " has been successfully deleted.";
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

  // //some common function
  // async sendEmail() {
  //   const mail = {
  //     to: "hello@yopmail.com",
  //     subject: "Greeting Message from NestJS Sendgrid",
  //     text: "Hello World from NestJS Sendgrid",
  //     html: "<h1>Hello World from NestJS Sendgrid</h1>",
  //   };
  //   //from mail is contain in the sendEmail service

  //   return await this.sandgridService.sendEmail(mail);
  // }

  // async getAllOperatorDetails(providerOperatorDto:providerOperatorDto[]):Promise<providerOperatorDto[]> {

  // }
  
  getProviderOperatorAsEntity(
    providerOperatorDto_ref: providerOperatorDto
  ): ProviderOperator {
    if (providerOperatorDto_ref == null) return null;
    let operator_proposal: ProviderOperator = Object.assign(
      new ProviderOperator(),
      providerOperatorDto_ref
    );

    operator_proposal.createdBy = Object.assign(
      new Users(),
      providerOperatorDto_ref.createdBy
    );

    return operator_proposal;
  }

  async getOperatorProvidersAsDto(
    items: ProviderOperator[]
  ): Promise<Array<providerOperatorDto>> {
    if (items == null) return null;
    let ret = new Array<providerOperatorDto>();
    for (var i = 0; i < items.length; i++) {
      // if(items[i].index=="Provider" && items[i].refID=="Scraper" ){


      // }
      let ref = await this.getProviderOperatorAsDto(items[i]);
      ret.push(ref);
    }
    return ret;
  }
 
  async getProviderOperatorAsDto(
    item: ProviderOperator
  ): Promise<providerOperatorDto | null> {
    if (item == null) {
      return null;
    }
    
    const ret: providerOperatorDto = Object.assign(
      new providerOperatorDto(),
      item
    );
    if (
      item.refID === "Internal" &&
      (item.index === "Provider" || item.index === "Operator")
    ) {
      // For provider
      if (item.providerId) {
        try {
          ret.providerId = await this.getProvider(item.providerId);
        } catch (error) {
          // Handle error if provider ID is not found
          ret.providerId = null; // Set to null or handle as needed
        }
      }
  
      // For operator
      if (item.operatorId) {
        try {
          ret.operatorId = await this.getOperator(item.operatorId);
        } catch (error) {
          // Handle error if operator ID is not found
          ret.operatorId = null; // Set to null or handle as needed
        }
      }
    } else if (item.refID === "Scraper" && item.index === "Provider") {
      try {
        ret.providerId = await this.getProvider(item.providerId);
        ret.operatorId = await this.getExtOperatorProvider(item.operatorId);
      } catch (error) {
        // Handle error if provider or operator ID is not found
        ret.providerId = null; // Set to null or handle as needed
        ret.operatorId = null; // Set to null or handle as needed
      }
    } else if (item.refID === "Scraper" && item.index === "Operator") {
      try {
        ret.operatorId = await this.getOperator(item.operatorId);
        ret.providerId = await this.getExtOperatorProvider(item.providerId);
      } catch (error) {
        // Handle error if operator or provider ID is not found
        ret.operatorId = null; // Set to null or handle as needed
        ret.providerId = null; // Set to null or handle as needed
      }
    }
  
    try {
      ret.createdBy = Object.assign(new Users(), item.createdBy);
      delete ret.createdBy.id;
    } catch (error) {
      // Handle error if createdBy data cannot be assigned or id cannot be deleted
      ret.createdBy = null; // Set to null or handle as needed
    }
  
    return ret;
  }
  


  // async getProviderOperatorAsDto(
  //   item: ProviderOperator
  // ): Promise<providerOperatorDto> {
  //   if (item == null) return null;
  //   let ret: providerOperatorDto = Object.assign(
  //     new providerOperatorDto(),
  //     item
  //   );
  
  //   if (
  //     item.refID == "Internal" &&
  //     (item.index == "Provider" || item.index === "Operator")
  //   ) {
  //     //for provider
  //     if (item.providerId) {

  //       ret.providerId = await this.getProvider(item.providerId);

  //     }

  //     // for operator
  //     if (item.operatorId) {
  //       ret.operatorId = await this.getOperator(item.operatorId);
  //     }
  //   } else if (item.refID === "Scraper" && item.index === "Provider") {
  //     if (item.providerId) {
  //     ret.providerId = await this.getProvider(item.providerId);
  //     }
  //     if (item.operatorId) {
  //     ret.operatorId = await this.getExtOperatorProvider(item.operatorId);
  //     }
  //   } else if (item.refID === "Scraper" && item.index === "Operator") {
  //     if (item.operatorId) {
  //     ret.operatorId = await this.getOperator(item.operatorId);
  //     }
  //     if (item.providerId) {
  //     ret.providerId = await this.getExtOperatorProvider(item.providerId);
  //     }
  //   }

  //   if (item.createdBy) {
  //   ret.createdBy = Object.assign(new Users(), item.createdBy);
  //   for (const prop in ret.createdBy) {
  //     if (prop !== "id") {
  //       delete ret.createdBy[prop];
  //     }
  //   }
  // }
  //   //delete ret.createdBy
  //   return ret;
  // }

  // get provider
  async getProvider(providerId: string): Promise<string> {
    const provider = await this.providersService.getProviderById(providerId);
    const providerData = {
      id: provider.id,
      companyName: provider.companyName,
      companyEmail: provider.companyEmail,
      oldId: provider.oldId
    };
    return JSON.stringify(providerData);
  }
  //get operator
  async getOperator(operatorId: string): Promise<string> {
    const operator = await this.operatorsService.getOperator(operatorId);
    const operatorData = {
      id: operator.id,
      companyName: operator.companyName,
      companyEmail: operator.companyEmail,
      oldId: operator.oldId
    };
    return JSON.stringify(operatorData);
  }

  //get external operator/provider
  async getExtOperatorProvider(operatorId: string): Promise<any> {
    const extOperatorProvider =
      await this.externalProviderOpeartorService.getExternalProviderOperatorById(
        operatorId
      );
    return JSON.stringify(extOperatorProvider);
  }

  async search(params: {
    limit: number;
    query: string;
    type: string;
    typeId: string;
    status?: string;
  }): Promise<string[]> {
    const { limit, query, type, typeId, status } = params;

    const queryBuilder = this.repository.createQueryBuilder('provider_operator');
    const externalQueryBuilder = this.ex_repository.createQueryBuilder('externalProviderOpeartor');
    const operatorQueryBuilder = this.operator.createQueryBuilder('Operators');
    const providerQueryBuilder = this.provider.createQueryBuilder('Providers');

    const scraperOp: string[] = (
      await queryBuilder
        .where('provider_operator.refId = :ref', { ref: 'Scraper' })
        //.andWhere('provider_operator.index = :index', { index: type })
        .getMany()
    ).map((op) => (type === 'Operator' ? op.providerId : op.operatorId));

    const internalOp: string[] = (
      await queryBuilder
        .where('provider_operator.refId = :ref', { ref: 'Internal' })
        .getMany()
    ).map((op: providerOperatorDto) =>
      type === 'Operator' ? op.operatorId : op.providerId
    );

    let allData = [];

    const searchedData = async (keys) => {
      // const data =
      //   type === 'Operator'
      //     ? { operatorId: typeId, index: 'Operator' }
      //     : { providerId: typeId, index: 'Provider' };
      const data =
        type === 'Operator'
          ? { operatorId: typeId }
          : { providerId: typeId };

      const allPro = await this.find(data);
      const filteredByStatus = allPro.filter((data) => data.status === status);
      console.log(filteredByStatus,status,"filteredByStatus")
      const searchPro = filteredByStatus.filter((data) => {
        const checkid = type === 'Operator' ? data?.providerId : data?.operatorId;
        if (keys.includes(JSON.parse(checkid)?.id)) {
          return data;
        }
      });
      return searchPro;
    };

    if (!query) {
      (await externalQueryBuilder.getMany()).filter((op: externalProviderOpeartorDto) =>
        op.index !== type && allData.push(op)
      );

      if (type === 'Operator') {
        (await providerQueryBuilder.getMany()).filter((op: Providers) => allData.push(op));
      } else if (type === 'Provider') {
        (await operatorQueryBuilder.getMany()).filter((op: Operators) => allData.push(op));
      }

      const keys = allData.map((data) => data.id);

      if (keys.length > 0) {
        allData = await searchedData(keys);
      }

      const finalData: string[] = allData.map((obj) => JSON.stringify(obj)).map((obj) => JSON.parse(obj));
      return finalData;
    }

    if (scraperOp.length > 0) {
      (
        await externalQueryBuilder
          .where(
            'externalProviderOpeartor.id LIKE :query OR externalProviderOpeartor.companyName LIKE :query OR externalProviderOpeartor.companyEmail LIKE :query',
            {
              query: `%${query}%`,
            }
          )
          .getMany()
      ).filter((op: externalProviderOpeartorDto) => op.index !== type && allData.push(op));
    }

    if (internalOp.length > 0) {
      if (type === 'Operator') {
        (
          await providerQueryBuilder
            .where('Providers.companyName LIKE :query OR Providers.id LIKE :query', { query: `%${query}%` })
            .getMany()
        ).filter((op: Providers) => allData.push(op));
      } else if (type === 'Provider') {
        (
          await operatorQueryBuilder
            .where('Operators.companyName LIKE :query OR Operators.id LIKE :query', { query: `%${query}%` })
            .getMany()
        ).filter((op: Operators) => allData.push(op));
      }
    }
    const keys = allData.map((data) => data.id);

    if (keys.length > 0) {
      allData = await searchedData(keys);
    }

    const finalData: string[] = allData.map((obj) => JSON.stringify(obj)).map((obj) => JSON.parse(obj));
    return finalData;
  }

}
