import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NotificationDto } from './notification.dto';
import { Notification } from './notification.entity';
import axios from 'axios';
import { ConfigService } from '../core/config/config.service';
import { SandgridService } from '../sandgrid/sandgrid.service';
import { MyTemplete } from '../sandgrid/mytemp';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly repository: Repository<Notification>,
    private readonly sandgridService: SandgridService,


  ) { }

  async create(notificationDto: NotificationDto, to: { token: string }): Promise<{ status: string, data?: NotificationDto, error?: string }> {
    try {

      let notification = this.getNotificationsEntity(notificationDto);
      let saved = await this.repository.save(notification);
      const all = this.getNotificationDto(saved)
      //this.sandgridService.sendEmail()
      // const res = await this.sendFirebaseNotification(notificationDto, to.token)
      // let res_ref = JSON.parse(JSON.stringify(res))

      // if (res_ref.success == 1) {
      //   console.log(res_ref);
      // }else{
      //   console.log("error",res_ref);

      // }
      return { status: "success", data: all }
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        const errorMessage = `Error: You have already sent notifications.`;
        return { status: "error", error: errorMessage }
      }

      if (error.code === 'ER_NO_DEFAULT_FOR_FIELD') {
        return { status: "error", error: error.sqlMessage }
      }
      return { status: "error", error: error }
    }

  }

  async createNew(notificationDto: any ,options?:any): Promise<{ status: string, data?: NotificationDto, error?: string }> {
    try {

      let notificationDto_ref = {
        ...notificationDto,
        receiverId: notificationDto.receiverId.id,
        ...notificationDto.message
      } 
     
      delete notificationDto_ref.message

      let notification = this.getNotificationsEntity(notificationDto_ref);
      let saved = await this.repository.save(notification);
      const all = this.getNotificationDto(saved)
      
      if (options) {
        const mail_ref = {
          to: notificationDto.receiverId.email,
          subject:  options?.subject || "",
          html: MyTemplete(options),
          attachments:options.attachments
        };
        console.log(notificationDto.receiverId.email,"mail_ref")
        const res = await this.sandgridService.sendEmail(mail_ref);
      }
     

      // const res = await this.sendFirebaseNotification(notificationDto, to.token)
      // let res_ref = JSON.parse(JSON.stringify(res))

      // if (res_ref.success == 1) {
      //   console.log(res_ref);
      // }else{
      //   console.log("error",res_ref);

      // }
      return { status: "success", data: all }
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        const errorMessage = `Error: You have already sent notifications.`;
        return { status: "error", error: errorMessage }
      }

      if (error.code === 'ER_NO_DEFAULT_FOR_FIELD') {
        return { status: "error", error: error.sqlMessage }
      }
      return { status: "error", error: error }
    }

  }
  async findAll(notificationDto: NotificationDto): Promise<NotificationDto[]> {
    try {
      const res = await this.repository.find({
        where: {
          senderId: notificationDto.senderId,
          receiverId: notificationDto.receiverId

        },
        order: {
          createdDate: 'DESC', // or 'DESC' for descending order
        },
      })
      const saved = this.getNotificationsAsDto(res)
      return saved
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST, { cause: new Error(error) });
    }

  }

  async findById(notificationDto: NotificationDto): Promise<NotificationDto> {
    try {
      const res = await this.repository.findOneBy({ id: notificationDto.id });
      const saved = this.getNotificationDto(res)
      return saved
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST, { cause: new Error(error) });
    }

  }

  async update(notificationDto: NotificationDto): Promise<{ status: string, data?: NotificationDto, error?: string }> {
    let ref = this.getNotificationsEntity(notificationDto)
    const update_res = await this.repository.update(notificationDto.id, ref)
    if (update_res.affected === 0) {
      return { status: "error", error: "No record found with the ID" }
    }
    let res = await this.findById(notificationDto)
    return { status: "success", data: res }
  }


  async delete(id: string): Promise<string> {
    try {
      let deleteResult = await this.repository.delete(id);

      if (deleteResult.affected === 0) {
        // If no rows were affected, it means the ID does not match any existing records
        return "error: ID does not exist";
      }

      return "Success: Item with ID " + id + " has been successfully deleted.";
    } catch (error) {
      // Handle specific error cases
      if (error.code === "ER_ROW_IS_REFERENCED_2") {
        // If the error is due to a foreign key constraint violation
        return "error: The record cannot be deleted because it is referenced by other records";
      }
      // Handle other general errors
      return "error: An error occurred while deleting the record";
    }
  }


  getNotificationsAsDto(items: Notification[]): Array<NotificationDto> {
    if (items == null) return null;
    let ret = new Array<NotificationDto>();
    for (var i = 0; i < items.length; i++) {
      ret.push(this.getNotificationDto(items[i]));
    }
    return ret;
  }

  getNotificationDto(item: Notification): NotificationDto {
    if (item == null) return null;
    let ret = Object.assign(new NotificationDto(), item);
    return ret;
  }

  getNotificationsEntity(notificationDto: NotificationDto): Notification {
    if (notificationDto == null) return null;
    let notification = Object.assign(new Notification(), notificationDto);
    return notification;
  }
  async sendFirebaseNotification(options: NotificationDto, fcmToken: string): Promise<{ data: string }> {
    try {
      const { title, body, senderId, receiverId } = options;
      let configService = new ConfigService();
      const FIREBASE_SERVER_KEY = configService.get('FIREBASE_SERVER_KEY')
      const config = {
        headers: {
          Authorization: FIREBASE_SERVER_KEY,
          "Content-Type": "application/json",
        },
      };

      let notification_payload = {
        to: fcmToken,
        notification: {
          body: body,
          title: title,
        },
        webpush: {
          fcm_options: {
            link: "http://localhost:3000",
          },
        },
      };
      const res = await axios.post(
        "https://fcm.googleapis.com/fcm/send",
        notification_payload,
        config
      );
      return res.data
    } catch (error) {
      return error
    }
  }
}
