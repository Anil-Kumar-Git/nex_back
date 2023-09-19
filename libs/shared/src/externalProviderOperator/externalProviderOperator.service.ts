import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Repository,
  Brackets,
  DeleteResult,
  UpdateResult,
  Like,
} from "typeorm";

import { externalProviderOpeartorDto } from "./externalProviderOperator.dto";
import { externalProviderOpeartors } from "./externalProviderOperator.entity";

import { GlobalService } from "../core/config/global.service";

import { v4 as uuidv4 } from "uuid";
import { Operators } from "../operators/operators.entity";
import { Providers } from "../providers/providers.entity";
import { SandgridService } from "../sandgrid/sandgrid.service";
import { ProviderOperator } from "../provider-operator/provider-operator.entity";
import { ProvidersService } from "../providers/providers.service";
import { OperatorsService } from "../operators/operators.service";
import { handleError, handleErrors } from "../common/errorHandling";
import { MyTemplete } from "../sandgrid/mytemp";

@Injectable()
export class ExternalProviderOpeartorService {
  constructor(
    private readonly sandgridService: SandgridService,

    @InjectRepository(Providers)
    private readonly provider: Repository<Providers>,
    @InjectRepository(Operators)
    private readonly operator: Repository<Operators>,
    @InjectRepository(ProviderOperator)
    private readonly providerOperator: Repository<ProviderOperator>,

    @InjectRepository(externalProviderOpeartors)
    private readonly repository: Repository<externalProviderOpeartors>
  ) {}

  async create(
    externalProviderOpeartorDto: externalProviderOpeartorDto[],type?:string
  ): Promise<externalProviderOpeartorDto[]> {
    try {
      const promises = JSON.parse(
        JSON.stringify(externalProviderOpeartorDto)
      ).data.map(async (items: externalProviderOpeartorDto) => {
        // items.id = uuidv4();
        let provider = this.getExternailProviderOperatorAsEntity(items);

        let saved = await this.repository.save(provider);
        return saved;
      });

      const savedProviders: externalProviderOpeartorDto[] = await Promise.all(
        promises
      );

      const all = this.getExternalProviderOperatorsAsDto(savedProviders);

      return all;
    } catch (error) {
      if (type == "api") {
        handleErrors(error)
      }
      if (error.code === "ER_DUP_ENTRY") {
        const errorMessage = `Error: Already exits .`;
        throw new HttpException(errorMessage, HttpStatus.OK, {
          cause: new Error(errorMessage),
        });
      }

      if (error.code === "ER_NO_DEFAULT_FOR_FIELD") {
        throw new HttpException(error.sqlMessage, HttpStatus.OK, {
          cause: new Error("field are empty"),
        });
      }
      throw new HttpException(error, HttpStatus.OK, {
        cause: new Error(error),
      });
    }
  }

  async createScrapper(
    externalProviderOpeartorDto: externalProviderOpeartorDto[]
  ): Promise<{
    successfulResults: externalProviderOpeartorDto[];
    errors: string[];
  }> {
    const successfulResults: externalProviderOpeartorDto[] = [];
    const errors: string[] = [];

    const promises = JSON.parse(
      JSON.stringify(externalProviderOpeartorDto)
    ).data.map(async (items: externalProviderOpeartorDto) => {
      try {
        let provider = this.getExternailProviderOperatorAsEntity(items);
        let saved = await this.repository.save(provider);
        successfulResults.push(saved);
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
          const errorMessage = `Error: Already exists.`;
          errors.push(errorMessage);
        } else if (error.code === "ER_NO_DEFAULT_FOR_FIELD") {
          errors.push("Field is empty");
        } else {
          errors.push(error.message || "Unknown error occurred");
        }
      }
    });

    await Promise.all(promises);

    const all = this.getExternalProviderOperatorsAsDto(successfulResults);

    return { successfulResults: all, errors };
  }

  async createOne(
    externalProviderOpeartorDto: externalProviderOpeartorDto ,type?:string,name?:string
  ): Promise<externalProviderOpeartorDto> {
    try {
      externalProviderOpeartorDto.id = uuidv4();
      let provider = this.getExternailProviderOperatorAsEntity(
        externalProviderOpeartorDto
      );

      let saved = await this.repository.save(provider);

      const all = this.getExternalProviderOperatorAsDto(saved);
      if (JSON.parse(JSON.stringify(externalProviderOpeartorDto)).Invite) {
        // this.sendEmail(all.companyEmail);
        this.sendEmail(all,name);
      }
      return all;
    } catch (error) {
      if (type == "api") {
        handleErrors(error)
      }
 
      if (error.code === "ER_DUP_ENTRY") {
        const errorMessage = `Error: User already exists.`;
        throw new HttpException(errorMessage, HttpStatus.CONFLICT, {
          cause: new Error(errorMessage),
        });
      }

      if (error.code === "ER_NO_DEFAULT_FOR_FIELD") {
        throw new HttpException(error.sqlMessage, HttpStatus.BAD_REQUEST, {
          cause: new Error("field are empty"),
        });
      }
      throw new HttpException(error, HttpStatus.BAD_REQUEST, {
        cause: new Error(error),
      });
    }
  }
  async update(providerDto: externalProviderOpeartorDto,type?:string): Promise<{
    status: string;
    data?: externalProviderOpeartorDto;
    error?: string;
  }> {
    try {
      let provider = this.getExternailProviderOperatorAsEntity(providerDto);
      let res = await this.repository.update(provider.id, provider);
      if (res.affected === 0) {
        if (type == "api") {
          throw new HttpException(
            "No record found with the ID",
            HttpStatus.NOT_FOUND
          );
       }
        return { status: "error", error: "No record found with the ID" };
      }
      let save = await this.getExternalProviderOperatorById(provider.id);
      return { status: "success", data: save };
    } catch (error) {
      if (type == "api") {
        handleErrors(error)
      }
      return { status: "error", error: error };
    }
  }
  async search(params: {
    offset?: number;
    limit?: number;
    idsToSkip?: number[];
    searchQuery?: string;
    searchType?: string;
  }): Promise<externalProviderOpeartorDto[]> {
    const { offset, limit, idsToSkip, searchQuery, searchType } = params;
    const queryBuilder = this.repository
      .createQueryBuilder("externalProviderOpeartor")
      .where("externalProviderOpeartor.index = :index", { index: searchType });
    const operatorQueryBuilder = this.operator.createQueryBuilder("Operators");
    const providerQueryBuilder = this.provider.createQueryBuilder("Providers");

    if (searchQuery) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where("externalProviderOpeartor.companyName LIKE :searchQuery", {
            searchQuery: `%${params.searchQuery}%`,
          })
            .orWhere("externalProviderOpeartor.id LIKE :searchQuery", {
              searchQuery: `%${params.searchQuery}%`,
            })
            .orWhere(
              "externalProviderOpeartor.companyEmail LIKE :searchQuery",
              {
                searchQuery: `%${params.searchQuery}%`,
              }
            );
        })
      );

      if (searchType == "Operator") {
        operatorQueryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where("Operators.companyName LIKE :searchQuery", {
              searchQuery: `%${params.searchQuery}%`,
            }).orWhere("Operators.id LIKE :searchQuery", {
              searchQuery: `%${params.searchQuery}%`,
            });
          })
        );
      }
      if (searchType == "Provider")
        providerQueryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where("Providers.companyName LIKE :searchQuery", {
              searchQuery: `%${params.searchQuery}%`,
            }).orWhere("Providers.id LIKE :searchQuery", {
              searchQuery: `%${params.searchQuery}%`,
            });
          })
        );
    }

    try {
      // Execute queries
      const [items] = await queryBuilder.getManyAndCount();
      const allProvider = await providerQueryBuilder
        .select([
          "Providers.id",
          "Providers.companyName",
          "Providers.oldId",
          "Providers.companyEmail",
        ])
        .getMany();
      const allOperator = await operatorQueryBuilder
        .select([
          "Operators.id",
          "Operators.companyName",
          "Operators.oldId",
          "Operators.companyEmail",
        ])
        .getMany();
      let filter_operatorData: externalProviderOpeartorDto[] = allOperator.map(
        (operator_ref, index) => ({
          ...Object.assign(new externalProviderOpeartorDto(), operator_ref),
          index: "Internal",
        })
      );
      let filter_providerData: externalProviderOpeartorDto[] = allProvider.map(
        (provider_ref, index) => ({
          ...Object.assign(new externalProviderOpeartorDto(), provider_ref),
          index: "Internal",
        })
      );

      let filter_scraperData: externalProviderOpeartorDto[] = items.map(
        (scraper_ref, index) => ({
          ...scraper_ref,
          index: "Scraper",
        })
      );
      // Transform data to DTOs
      if (searchType == "Operator") {
        if (limit) {
          return this.getExternalProviderOperatorsAsDto(
            [...filter_scraperData, ...filter_operatorData].splice(0, limit)
          );
        } else {
          return this.getExternalProviderOperatorsAsDto([
            ...filter_scraperData,
            ...filter_operatorData,
          ]);
        }
      }
      if (searchType == "Provider") {
        if (limit) {
          return this.getExternalProviderOperatorsAsDto(
            [...filter_scraperData, ...filter_providerData].splice(0, limit)
          );
        } else {
          return this.getExternalProviderOperatorsAsDto([
            ...filter_scraperData,
            ...filter_providerData,
          ]);
        }
      }
      // Return DTOs
    } catch (error) {
      // Handle errors appropriately
      throw new Error(`Error searching for providers: ${error.message}`);
    }
  }

  async findAll(params: {
    index: string;
    companyName: string;
    id: string;
  },type?:string): Promise<externalProviderOpeartorDto[]> {
    try {
      let items = await this.repository.find({
        where: {
          index: params.index,
          id: params.id,
          companyName: params.companyName,
        },
      });
      if (items.length <= 0 && type == "api") {
        throw new HttpException(
          "No record found with the ID",
          HttpStatus.BAD_REQUEST
        );
      }
      console.log(items,"items")
      return this.getExternalProviderOperatorsAsDto(items);
    } catch (error) {
      if (type == "api") {
        handleErrors(error)
      }
      return error;
    }
  }
  //get getTop10 operator provider
  async getTop10(params: {
    id: string;
    searchType: string;
    
  },type?:string): Promise<externalProviderOpeartorDto[]> {
    
    try {
      const data = await this.search({ searchType: params.searchType });
     
      let existingProviderOperator: any;
      if (params.searchType == "Provider") {
        const existing_provider = await this.providerOperator.find({
          where: { operatorId: params.id },
        });
        existingProviderOperator = existing_provider.map(
          (data) => data.operatorId
        );
      } else if (params.searchType == "Operator") {
        const existing_provider = await this.providerOperator.find({
          where: { providerId: params.id },
        });
        existingProviderOperator = existing_provider.map(
          (data) => data.operatorId
        );
      }
      if(type=="api"){
        if(existingProviderOperator.length==0){
          throw new HttpException("Not found any data with this ID", HttpStatus.NOT_FOUND)
        }
      }

      let filter_data = data.filter(
        (data) => !existingProviderOperator.includes(data.id)
      );
      filter_data = filter_data
        .filter((data) => data.companyEmail !== "")
        .sort((a, b) => {
          const rankA = a.currentQuarterRank || 0; // Use a default value if property is not available
          const rankB = b.currentQuarterRank || 0; // Use a default value if property is not available
          return rankB - rankA;
        });
      return this.getExternalProviderOperatorsAsDto(filter_data.splice(0, 10));
    } catch (error) {
      if(type=="api"){
        handleErrors(error)
      }
      return error;
    }
  }

  async getExternalProviderOperatorById(
    id: string,type?:string
  ): Promise<externalProviderOpeartorDto> {
    try {
      let saved = await this.repository.findOne({
        where: {
          id: id,
        },
      });
      if(type=="api"){
        if(saved==null){
          throw new HttpException("Not found any data with this ID",HttpStatus.NOT_FOUND)
        }
      }
      return this.getExternalProviderOperatorAsDto(saved);
    } catch (error) {
      if(type=="api"){
        handleErrors(error)
      }
      return error;
    }
  }

  async delete(id: string,type?:string): Promise<string> {
    try {
      let deleteResult = await this.repository.delete(id);

      if (deleteResult.affected === 0) {
        if(type=="api"){
          throw new HttpException("Not found any data with this ID",HttpStatus.NOT_FOUND)
        }
        // If no rows were affected, it means the ID does not match any existing records
        return "error: ID does not exist";
      }

      return "Success: Item with ID " + id + " has been successfully deleted.";
    } catch (error) {
      if(type=="api"){
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

  async getEmailSubscription(id:string): Promise<any> {
    try {
      const res= await this.repository.findOneBy({id});
      return res.emailSubscription;
    } catch (error) {
      console.log(error, "usersForDeActiveusers--error");
      return false
    }
  }

  //some common function
  async sendEmail(data: externalProviderOpeartorDto,companyName?:string) {

    const unsubscribeDetails=`email=${data?.companyEmail}&id=${data?.id}&type=${data?.index}&from="Scraper"`

    const tempOption = {
      title:  `Join NEXUS - Your Invitation from ${ companyName}🚀`,
      subTitle: "We are thrilled to extend this exclusive invitation to join NEXUS, the game-changing platform that will revolutionize your gaming experience!",
      userName: data?.companyName,
      content:
        `<b>${companyName}</b>, one of our esteemed partners, is excited to recommend you to become a part of the NEXUS community. They have had a remarkable experience leveraging NEXUS's game management tools and wanted to share the advantages with you.`,
      subContent:"Here's why you should join NEXUS:      ",
      subContent2:"🌟 Seamlessly Manage Games: With our user-friendly 'Lobby' interface, setting up and customizing games becomes a breeze. You'll have complete control over 49 defining parameters, empowering you to unleash your creativity.",
      subContent3:"💎 Unparalleled Flexibility: NEXUS offers a seamless API integration, allowing you to fine-tune every aspect of your games. Say goodbye to emails and phone calls to coordinate game launches with your business partners."
     ,subContent4:"🔥 Stay Ahead with Exclusive Features: Operator and Provider Management, Sequential Go Live Pushes, The Release Calendar, Queue Management, Contract Management, Reconciliation possibilities and Game License Tracking features will keep you one step ahead in the ever-evolving gaming industry.",
        subContent5:"Join NEXUS today and embark on an exciting journey of gaming excellence! Given that you have been referred, we're excited to share our promotion code <b>UPSELL10NEX</b> to save 10% on the first year.", 
        link:"https://www.nexus7995.com/pricing",
      button:"Come Check us Out",
      contentBelow:"If you have any questions or need assistance with the registration process, don't hesitate to contact our friendly support team. We're here to ensure a smooth onboarding experience for you.",
      bottomLink:`If you prefer not to receive further emails, click <a style='text-decoration: underline; color:blue' href='https://nexus.switzerlandnorth.cloudapp.azure.com/subscription/email/?${unsubscribeDetails}' target='_blank' >here</a> to unsubscribe. Thank you. 🌌💫`,
      bottom:"Let's create gaming magic together with NEXUS!",
      };

    const mail = {
      to: data.companyEmail,
      subject: `Join NEXUS - Your Invitation from ${ companyName } 🚀`,
      html:MyTemplete(tempOption),
    };
    //from mail is contain in the sendEmail service
    let checkSend=await this.getEmailSubscription(data?.id);
    console.log(checkSend,"checkEmailIsSnd")
    if(checkSend){
    return await this.sandgridService.sendEmail(mail);
    }
  }

  getExternalProviderOperatorsAsDto(
    items: externalProviderOpeartors[]
  ): Array<externalProviderOpeartorDto> {
    if (items == null) return null;
    let ret = new Array<externalProviderOpeartorDto>();
    for (var i = 0; i < items.length; i++) {
      ret.push(this.getExternalProviderOperatorAsDto(items[i]));
    }
    return ret;
  }

  getExternalProviderOperatorAsDto(
    item: externalProviderOpeartors
  ): externalProviderOpeartorDto {
    if (item == null) return null;
    let ret = Object.assign(new externalProviderOpeartorDto(), item);
    return ret;
  }

  getExternailProviderOperatorAsEntity(
    providerDto: externalProviderOpeartorDto
  ): externalProviderOpeartors {
    if (providerDto == null) return null;
    let provider = Object.assign(new externalProviderOpeartors(), providerDto);
    if (providerDto.currentQuarterRank) {
      provider.currentQuarterRank = Number(providerDto.currentQuarterRank);
    }
    if (providerDto.lastQuarterRank) {
      provider.lastQuarterRank = Number(providerDto.lastQuarterRank);
    }
    if(providerDto.index){
      provider.index= this.CFL(providerDto.index)
    }
    return provider;
  }

  CFL(inputString) {
    return inputString.charAt(0).toUpperCase() + inputString.slice(1);
  }
}
