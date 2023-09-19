import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../users/users.entity';
import { UsersDto } from '../users/users.dto';
import { ProvidersService } from '../providers/providers.service';
import { OperatorsService } from '../operators/operators.service';
import { ExternalProviderOpeartorService } from '../externalProviderOperator/externalProviderOperator.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationDto } from '../notification/notification.dto';
import { NotificationShare } from '../notification/notification.entity';
import { Reconciliation } from './reconciliation.entity';
import { ReconciliationDto } from './reconciliation.dto';
import { handleErrors } from '../common/errorHandling';

@Injectable()
export class ReconciliationService {
    constructor(
        private readonly providersService: ProvidersService,
        private readonly operatorsService: OperatorsService,
        private readonly externalProviderOpeartorService: ExternalProviderOpeartorService,
        private readonly notificationService: NotificationService,
        @InjectRepository(Reconciliation)
        private readonly repository: Repository<Reconciliation>,
    ) { }

    async create(reconciliationDto: ReconciliationDto,type?:string): Promise<ReconciliationDto> {
        try {
            const already_uploaded = await this.alreadyUploaded(reconciliationDto)
            if (!already_uploaded) {
                throw new HttpException("You have already uploaded the file this month.", HttpStatus.NOT_ACCEPTABLE, { cause: new Error("You have already uploaded the file this month.") });
            }
            const reconciliation = await this.getReconciliationasEntity(reconciliationDto);

            const save = await this.repository.save(reconciliation);
            let ref_save = await this.getReconciliationasDto(save)

            //for sending the notification to operator
            this.sendNotification(ref_save)


            return ref_save
        } catch (error) {
            if (type == "api") {
                handleErrors(error)
              }
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
    async getReconciliation(params: { id?: string, operatorId?: string, providerId?: string, createdBy?: string, index?: string, refIndex?: string },type?:string): Promise<ReconciliationDto[]> {
        try {
            if(type=="api"){
                delete params.index
            }
            let saved = await this.repository.find({
                where: {
                    id: params.id,
                    providerId: params.providerId,
                    operatorId: params.operatorId,
                    index: params.index,
                    refIndex: params.refIndex,
                    createdBy: { id: params.createdBy }
                },
                relations: {
                    createdBy: true,
                },
                order: {
                    createdDate: 'DESC', // or 'DESC' for descending order
                },
            });
            if (saved.length <= 0 && type == "api") {
                throw new HttpException(
                  "No record found with the ID",
                  HttpStatus.NOT_FOUND
                );
              }
            return this.getReconciliationsasDto(saved);
        } catch (error) {
            if (type == "api") {
                handleErrors(error)
              }
            return error
        }

    }

    async getReconciliationasDto(item: Reconciliation): Promise<ReconciliationDto> {
        if (item == null) return null;

        let ret = Object.assign(new ReconciliationDto(), item);

        if (item.refIndex == "Internal" && (item.index == "Provider" || item.index == "Operator")) {
            const operator_details = await this.getOperator(item.operatorId)
            const provider_details = await this.getProvider(item.providerId)

            ret.operatorId = operator_details
            ret.providerId = provider_details

        }
        else if (item.refIndex == "Scraper" && item.index == "Provider") {
            const external_details = await this.externalProviderOpeartorService.getExternalProviderOperatorById(item.operatorId)
            const provider_details = await this.getProvider(item.providerId)

            ret.operatorId = JSON.stringify(external_details)
            ret.providerId = provider_details

        }
        else if (item.refIndex == "Scraper" && item.index == "Operator") {
            const external_details = await this.externalProviderOpeartorService.getExternalProviderOperatorById(item.providerId)
            const operator_details = await this.getOperator(item.operatorId)

            ret.providerId = JSON.stringify(external_details)
            ret.operatorId = operator_details

        }
        ret.createdBy = Object.assign(new UsersDto(), item.createdBy);
        return ret;
    }

    async getReconciliationsasDto(items: Reconciliation[]): Promise<Array<ReconciliationDto>> {
        if (items == null) return null;
        let ret = new Array<ReconciliationDto>();
        for (var i = 0; i < items.length; i++) {
            let ref = await this.getReconciliationasDto(items[i])
            ret.push(ref);
        }
        return ret;
    }

    async getReconciliationasEntity(reconciliationDto: ReconciliationDto): Promise<Reconciliation> {
        if (reconciliationDto == null) return null;
        let reconciliation = Object.assign(new Reconciliation, reconciliationDto)
        reconciliation.createdBy = Object.assign(new Users(), reconciliationDto.createdBy);
        return reconciliation
    }

    //send notification
    sendNotification(ref_save: ReconciliationDto): any {
        let ref_obj = Object.assign(new NotificationShare(), {});
        let providerId = JSON.parse(ref_save?.providerId)
        let operatorId = JSON.parse(ref_save?.operatorId)
       let userName;
       let receverName;
        if (ref_save?.index == "Provider" || ref_save?.index == "Sub Provider") {
            ref_obj.senderId = providerId?.id;
            ref_obj.receiverId = {
                id: operatorId?.id,
                email: operatorId?.companyEmail || ""
            };
            ref_obj.message.body = `${providerId?.companyName || ""} has been uploade the reconciliation file.`
            userName=providerId?.companyName
            receverName=operatorId?.companyName
        }
        else if (ref_save.index == "Operator" || ref_save.index == "Sub Operator") {
            ref_obj.senderId = operatorId?.id;
            ref_obj.receiverId = {
                id: providerId?.id,
                email: providerId?.companyEmail || ""
            };
            ref_obj.message.body = `${operatorId?.companyName || ""} has been uploade the reconciliation file.`
            userName=operatorId?.companyName
            receverName=providerId?.companyName
        }
        const formattedDate = this.formatDate(ref_save?.referenceDate);

        ref_obj.message.title = `Reconciliation File Uploaded by ${userName} for ${ formattedDate}`
        ref_obj.message.type = "reconciliation"

        const tempOption = {
            title: "Reconciliation File Uploaded",
            subject:`📊 Reconciliation File Uploaded by ${userName} for ${ formattedDate} 📁            `,
            subTitle: `We hope this email finds you well. We are pleased to inform you that the reconciliation file for <b>${formattedDate}</b>  has been successfully uploaded by <b>${userName}</b> `,
            userName: receverName,
            content:"You can now log into the <a style='text-decoration: underline; color:blue' href='https://lobby.nexus7995.com/' target='_blank' >NEXUS Lobby </a> to view or download the file. Simply navigate to the 'Reconciliation' section, and you'll find the file waiting for you.",
            subContent:"If you have any questions or need further assistance, don't hesitate to reach out to our support team. We're always here to help!",
            contentBelow:"Thank you for choosing NEXUS as your game management platform. We are committed to making your experience seamless and efficient.",
            nexusLink:"If you're not already using NEXUS, we recommend signing up for a  <a style='text-decoration: underline; color:blue' href='https://www.nexus7995.com/pricing' target='_blank' >Freemium account here</a>, giving you access to all functionalities for an extended period."
        };
        this.notificationService.createNew(ref_obj,tempOption)
    }

    async alreadyUploaded(reconciliationDto: ReconciliationDto): Promise<boolean> {
        try {
            const conciliation = await this.getReconciliation({
              providerId: reconciliationDto.providerId,
              operatorId: reconciliationDto.operatorId,
              index: reconciliationDto.index,
            });
            if (conciliation.length == 0) {
              return true;
            }
            const all_createdDate =
              conciliation &&
              conciliation?.map((data) => {
                const date1 = new Date(data?.referenceDate);
                const date2 = new Date(reconciliationDto?.referenceDate);

                const monthYear1 = `${date1.getMonth()}-${date1.getFullYear()}`;
                const monthYear2 = `${date2.getMonth()}-${date2.getFullYear()}`;
                console.log(monthYear2, monthYear1, "data");
                return monthYear1 === monthYear2;
              });

            return all_createdDate.every((element) => element === false);
        } catch (error) {
            return true
        }

    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const monthNames = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
      
        return `${month} ${ year}`;
      }

    // get provider
    async getProvider(providerId: string): Promise<string> {
        const provider = await this.providersService.getProviderById(providerId)
        return JSON.stringify(provider)
    }
    //get operator
    async getOperator(operatorId: string): Promise<string> {
        const operator = await this.operatorsService.getOperator(operatorId)
        return JSON.stringify(operator)
    }
}


