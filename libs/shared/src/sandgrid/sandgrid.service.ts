import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { ConfigService } from '../core/config/config.service';


@Injectable()
export class SandgridService {
  private SENDER_MAIL_ID: string;

  constructor(
    
  ) {
    let configService = new ConfigService();
    const SEND_GRID_KEY = configService.get('SEND_GRID_KEY')
    this.SENDER_MAIL_ID = configService.get('SENDER_MAIL_ID')
    sgMail.setApiKey(SEND_GRID_KEY);
  }

  async checkEmailSubscription(msg: any,option?:any): Promise<any> {
    try {
      const params = new URLSearchParams(option);
      const type = params.get("type");
      const from = params.get("from");
      const id = params.get("id");
      let apiType;

      if(from=="Internal"){
        if(type=="Provider"){
          apiType="interPro"
        }else{
        apiType="interOp"
        }
      }else{
        apiType="interExt"
      }
      // console.log(payload,"payload")
      // const res = await updateExternalProOp(payload)
      
      let check_email = await sgMail.send({ ...msg, from: this.SENDER_MAIL_ID });
      return check_email
    } catch (error) {
      return error

    }
  }


  //send to another person
  async sendEmail(msg: any,option?:any): Promise<any> {
    try {
      if(msg?.to?.includes("@yopmail.c")){
        let check_email = await sgMail.send({ ...msg, from: this.SENDER_MAIL_ID });
        return check_email
      }
      // if(option){
      //  let check_email=await this.checkEmailSubscription(msg,option);
      //  return check_email
      // }
      
    } catch (error) {
      console.log("send-Email Error : ",error)
      return error
    }
  }

  //recieve from another person
  async recieveEmail(msg: any): Promise<any> {
    try {
      let check_email = await sgMail.send({ ...msg, to: this.SENDER_MAIL_ID });
      return check_email
    } catch (error) {
      console.log(error);

      return error

    }
  }
}
