import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DeleteResult, UpdateResult } from "typeorm";

import { ProvidersDto, planStatus } from "./providers.dto";
import { Providers } from "./providers.entity";

import { UsersDto } from "./../users/users.dto";
import { Users } from "./../users/users.entity";

import { GlobalService } from "./../core/config/global.service";

import { v4 as uuidv4 } from "uuid";
import { checkEmail, handleError, handleErrors } from "../common/errorHandling";

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(Providers)
    private readonly repository: Repository<Providers>
  ) {}

  async create(providerDto: ProvidersDto,type?:string): Promise<ProvidersDto> {
    try {
      if (!checkEmail(providerDto?.companyEmail)) {
        throw new HttpException("Enter Valid E-mail!", HttpStatus.BAD_REQUEST);
      }
      if (type == "api") {
      if(typeof providerDto.isAcceptedTerm!="boolean"){
        throw new HttpException("The isAcceptedTerm value only accepts boolean.", HttpStatus.BAD_REQUEST);
      }
      if(providerDto.planStatus!=planStatus.Active && providerDto.planStatus!=planStatus.Canceled){
        throw new HttpException("The planStatus value only accepts (CANCELED,ACTIVE).", HttpStatus.BAD_REQUEST);
      }
     }
      providerDto.id = uuidv4();
      let provider = this.getProviderAsEntity(providerDto);
      let saved = await this.repository.save(provider);
      return this.getProviderAsDto(saved);
    } catch (error) {
      if (type == "api") {
        handleErrors(error)
      } 
      handleError(error);
    }
  }

  isEndDateValid=(endDate)=>{
    const currentDate = new Date();
    return new Date(endDate) > currentDate;
  }

  getDaysDifference(endDate) {
    const currentDate = new Date();
    const end = new Date(endDate);
    const timeDifference = end.getTime() - currentDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return daysDifference;
  }


  async planProStatusChange(): Promise<boolean> {
    try {
      let providers = await this.repository.find();
      Promise.all(
        providers.map(async (provider) => {
          if (provider?.planDetails) {
            const planDetails = JSON.parse(provider.planDetails);
            if (planDetails?.endDate && (this.getDaysDifference(planDetails?.endDate)==-6 || this.getDaysDifference(planDetails?.endDate)==-5)) {
              console.warn("5 day left in plan expire op")
            }else if(planDetails?.endDate && (this.getDaysDifference(planDetails?.endDate)==-2 || this.getDaysDifference(planDetails?.endDate)==-1)){
              console.warn("1 day left in plan expire op")
            }
            if (planDetails?.endDate && !this.isEndDateValid(planDetails?.endDate) && (!provider.planStatus || provider.planStatus!="CANCELED")) {
              const statusData: any = {
                  planStatus:"CANCELED",
              }
              let updateResult=await this.repository.update(provider?.id, statusData);
              return updateResult;
            }
          }
        })
      )
      return false;
    } catch (error) {
      console.warn("planStatusError == ",error)
    }
  }

  async updateProPlan(
    orderData: any
  ): Promise<{ status: string; data?: []; error?: string }> {
    try {
      let memberId: string = orderData?.buyer?.memberId;
      let checkOp = await this.repository.findOne({
        where: { memberId: memberId },
      });
      const userFor: any = {
        planStatus: orderData?.planName.toUpperCase()=="FREEMIUM"? "CANCELED" : "ACTIVE" || "",
        planDetails: JSON.stringify({
          startDate:
            orderData?.startDate || orderData?.currentCycle?.startedDate || "",
          endDate:orderData?.earliestEndDate ||
            orderData?.endDate ||
            "Until canceled" ||
            "",
          // paymentStatus:orderData?.lastPaymentStatus || "",
          planPrice:
            orderData?.planPrice || orderData?.priceDetails?.planPrice || "",
          currency: orderData?.priceDetails?.currency || "",
          duration:
            orderData?.priceDetails?.singlePaymentForDuration?.count || "",
          // cancleAction:orderData?.cancellation?.cause || ""
        }),
      };
      let updateResult;
      if (checkOp) {
        updateResult = await this.repository.update(checkOp?.id, userFor);
        if (updateResult?.affected === 0) {
          return { status: "error", error: "No record found with the ID" };
        }
      }
      return { status: "success", data: [] };
    } catch (error) {
      return { status: "error", error: error };
    }
  }

  async update(
    providerDto: ProvidersDto,type?:string
  ): Promise<{ status: string; data?: ProvidersDto; error?: string }> {
    try {
      let provider = this.getProviderAsEntity(providerDto);
      let updateResult = await this.repository.update(provider.id, provider);
      if (updateResult.affected === 0) {
        if (type == "api") {
          throw new HttpException(
            "No record found with the ID",
            HttpStatus.NOT_FOUND
          );
       }
        return { status: "error", error: "No record found with the ID" };
      }
      let res = await this.getProviderById(provider.id);
      return { status: "success", data: res };
    } catch (error) {
      if (type == "api") {
        handleErrors(error)
      } 
      return { status: "error", data: error };
    }
  }

  async findAll(): Promise<ProvidersDto[]> {
    let items = await this.repository.find({
      relations: {
        createdBy: true,
      },
    });

    return this.getProvidersAsDto(items);
  }

  async getProviderById(id: string): Promise<ProvidersDto> {
    let saved = await this.repository.findOne({
      where: {
        id: id,
      },
      relations: {
        createdBy: true,
      },
    });

    return this.getProviderAsDto(saved);
  }

  async getProviderByUser(userDto: UsersDto): Promise<ProvidersDto> {
    let saved = await this.repository.findOne({
      where: {
        createdBy: { id: userDto.id },
      },
      relations: {
        createdBy: true,
      },
    });

    return this.getProviderAsDto(saved);
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

  getProvidersAsDto(items: Providers[]): Array<ProvidersDto> {
    if (items == null) return null;
    let ret = new Array<ProvidersDto>();
    for (var i = 0; i < items.length; i++) {
      ret.push(this.getProviderAsDto(items[i]));
    }
    return ret;
  }

  getProviderAsDto(item: Providers): ProvidersDto {
    if (item == null) return null;
    let ret = Object.assign(new ProvidersDto(), item);
    ret.createdBy = Object.assign(new UsersDto(), item.createdBy);
    return ret;
  }

  getProviderAsEntity(providerDto: ProvidersDto): Providers {
    if (providerDto == null) return null;

    let provider = Object.assign(new Providers(), providerDto);
    if (providerDto.currentQuarterRank) {
      provider.currentQuarterRank = Number(providerDto.currentQuarterRank);
    }
    if (providerDto.lastQuarterRank) {
      provider.lastQuarterRank = Number(providerDto.lastQuarterRank);
    }
    provider.createdBy = Object.assign(new Users(), providerDto.createdBy);

    return provider;
  }
}
