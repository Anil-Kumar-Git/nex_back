import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DeleteResult, UpdateResult } from "typeorm";

import { OperatorsDto } from "./operators.dto";
import { Operators } from "./operators.entity";

import { UsersDto } from "./../users/users.dto";
import { Users } from "./../users/users.entity";

import { v4 as uuidv4 } from "uuid";

import { GlobalService } from "./../core/config/global.service";
import { handleErrors } from "../common/errorHandling";

@Injectable()
export class OperatorsService {
  constructor(
    @InjectRepository(Operators)
    private readonly repository: Repository<Operators>
  ) {}

  async create(operatorDto: OperatorsDto,type?:string): Promise<OperatorsDto> {
    try {
      operatorDto.id = uuidv4();

      let operator = this.getOperatorAsEntity(operatorDto);

      let saved = await this.repository.save(operator);
      return this.getOperatorAsDto(saved);
    } catch (error) {
      if (type == "api") {
        handleErrors(error)
      }
      if (error.code === "ER_DUP_ENTRY") {
        const errorMessage = `Error: Operator already exists.`;
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

  async planStatusChange(): Promise<boolean> {
    try {
      let operators = await this.repository.find();
      Promise.all(
        operators.map(async (operator) => {
          if (operator?.planDetails) {
            const planDetails = JSON.parse(operator.planDetails);
            if (planDetails?.endDate && (this.getDaysDifference(planDetails?.endDate)==-6 || this.getDaysDifference(planDetails?.endDate)==-5)) {
              console.warn("5 day left in plan expire op")
            }else if(planDetails?.endDate && (this.getDaysDifference(planDetails?.endDate)==-2 || this.getDaysDifference(planDetails?.endDate)==-1)){
              console.warn("1 day left in plan expire op")
            }
            if (planDetails?.endDate && !this.isEndDateValid(planDetails?.endDate) && (!operator.planStatus || operator.planStatus!="CANCELED")) {
              const statusData: any = {
                  planStatus:"CANCELED",
              }
              let updateResult=await this.repository.update(operator?.id, statusData);
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



  async updatePlan(
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
          // planName:memberData?.planName|| "",
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
    operatorDto: OperatorsDto,type?:string
  ): Promise<{ status: string; data?: OperatorsDto; error?: string }> {
    try {
      let operator = this.getOperatorAsEntity(operatorDto);
      let updateResult = await this.repository.update(operator.id, operator);
      if (updateResult.affected === 0) {
        return { status: "error", error: "No record found with the ID" };
      }
      let res = await this.getOperator(operator.id);
      return { status: "success", data: res };
    } catch (error) {
      return { status: "error", error: error };
    }
  }

  async findAll(): Promise<OperatorsDto[]> {
    let items = await this.repository.find();
    return this.getOperatorsAsDto(items);
  }

  async getOperator(id: string): Promise<OperatorsDto> {
    let saved = await this.repository.findOne({
      where: {
        id: id,
      },
      relations: {
        createdBy: true,
      },
    });

    return this.getOperatorAsDto(saved);
  }

  async getOperatorByUser(userDto: UsersDto): Promise<OperatorsDto> {
    let saved = await this.repository.findOne({
      where: {
        createdBy: { id: userDto.id },
      },
      relations: {
        createdBy: true,
      },
    });

    return this.getOperatorAsDto(saved);
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

  getOperatorsAsDto(items: Operators[]): Array<OperatorsDto> {
    if (items == null) return null;
    let ret = new Array<OperatorsDto>();
    for (var i = 0; i < items.length; i++) {
      ret.push(this.getOperatorAsDto(items[i]));
    }
    return ret;
  }

  getOperatorAsDto(item: Operators): OperatorsDto {
    if (item == null) return null;
    let ret = Object.assign(new OperatorsDto(), item);
    ret.createdBy = Object.assign(new UsersDto(), item.createdBy);
    return ret;
  }

  getOperatorAsEntity(operatorDto: OperatorsDto): Operators {
    if (operatorDto == null) return null;
    let operator = Object.assign(new Operators(), operatorDto);
    operator.createdBy = Object.assign(new Users(), operatorDto.createdBy);
    if (operatorDto.currentQuarterRank) {
      operator.currentQuarterRank = Number(operatorDto.currentQuarterRank);
    }
    if (operatorDto.lastQuarterRank) {
      operator.lastQuarterRank = Number(operatorDto.lastQuarterRank);
    }
    return operator;
  }
}
