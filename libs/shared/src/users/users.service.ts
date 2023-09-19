import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DeleteResult, UpdateResult } from "typeorm";

import { OperatorsService } from "./../operators/operators.service";
import { ProvidersService } from "./../providers/providers.service";

import { ChangePasswordDto, UsersDto, UserWithCompnay } from "./users.dto";
import { Users } from "./users.entity";

import { hash, compare } from "bcryptjs";
import { randomBytes } from "crypto";

import { v4 as uuidv4 } from "uuid";

import { GlobalService } from "./../core/config/global.service";
import { SandgridService } from "../sandgrid/sandgrid.service";
import { UserProviderOperator } from "../user-provider-operator/user-provider-operator.entity";
import { UserProviderOperatorService } from "../user-provider-operator/user-provider-operator.service";
import { handleError, handleErrors, handleStatusError } from "../common/errorHandling";
import { MyTemplete } from "../sandgrid/mytemp";

@Injectable()
export class UsersService {
  constructor(
    private readonly sandgridService: SandgridService,

    @InjectRepository(Users)
    private readonly repository: Repository<Users>,
    private readonly userProviderOperatorService: UserProviderOperatorService,

    private readonly operatorsService: OperatorsService,
    private readonly providersService: ProvidersService
  ) {}

  async create(authUser: UsersDto, userDto: UsersDto,type?:string): Promise<UsersDto | any> {
    try {
      const result = userDto?.email.match(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      );
      if (!result) {
        throw new HttpException("Email is not valid!", HttpStatus.BAD_REQUEST);
      }
      return this.createUser(userDto,type);
    } catch (error) {
      if (type == "api") {
        handleErrors(error)
      }
      handleError(error);
    }
  }

  async createUser(userDto: UsersDto,type?:string): Promise<UsersDto> {
    try {
      if (!userDto.userRole) {
        throw new HttpException(
          "userRole should not be empty",
          HttpStatus.BAD_REQUEST
        );
      }
      let exists = await this.getUserByEmail(userDto.email);
      if (exists != null)
        throw new HttpException(
          "user with email:" + userDto.email + " exists already",
          HttpStatus.CONFLICT
        );
      userDto.apiKey = uuidv4();
      userDto.id= uuidv4();
      
      const randomPassword = await this.generateRandomPassword();
      // console.log(randomPassword, "randomPassword");
      userDto.password = await hash(randomPassword, 10);
     
      let user = this.getUserAsEntity(userDto);

      let saved = await this.repository.save(user);
      this.sendEmail(userDto, randomPassword);
      return this.getUserAsDto(saved);
    } catch (error) {
      if (type == "api") {
        handleErrors(error)
      }
      handleError(error);
    }
  }

  async update(
    userDto: UsersDto,
    authUser?: UsersDto,
    type?:string
  ): Promise<{ status: string; data?: UsersDto | any; error?: string }> {
    try {
      delete userDto["password"];
      let user = this.getUserAsEntity(userDto);
      delete user.email;
      // delete user.userRole;

      let updateResult = await this.repository.update(user.id, user);

      if (updateResult.affected === 0) {
        if (type == "api") {
          throw new HttpException(
            "No record found with the ID",
            HttpStatus.NOT_FOUND
          );
        }
        return { status: "error", error: "No record found with the ID" };
      }
      const save = await this.getUserById(user.id);

      return { status: "success", data: save };
    } catch (error) {
      if(type=="api"){
        handleErrors(error)
      }
      return handleStatusError(error);
    }
  }

  async forgotPassword(
    userDto: UsersDto
  ,type?:string): Promise<{ status: string; data?: UsersDto; error?: string }> {
    try {
      if (userDto.email == null || userDto.password == null) {
        return { status: "error", error: "filed should not be empty" };
      }
      const user_details = await this.getUserByEmail(userDto.email);
      // const user_details = await this.repository.findOne({ where: { email: userDto.email } });
      if (user_details == null) {
        return { status: "error", error: "No record found with the Email ID" };
      }
      userDto.password = await hash(userDto.password, 10);

      let user = this.getUserAsEntity(userDto);

      let updateResult = await this.repository.update(user_details.id, user);
      if (updateResult.affected === 0) {
        return { status: "error", error: "No record found with the ID" };
      }
      const save = await this.getUserById(user_details.id);
      return { status: "success", data: save };
    } catch (error) {
      return { status: "error", error: error };
    }
  }

  async changePassword(
    userDto: ChangePasswordDto,type?:string
  ): Promise<{ status: string; data?: UsersDto; error?: string }> {
    try {
      if (
        userDto.email == null ||
        userDto.password == null ||
        userDto.oldPassword == null
      ) {
        if (type == "api") {
          throw new HttpException(
            "filed should not be empty",
            HttpStatus.BAD_REQUEST
          );
        }
        return { status: "error", error: "filed should not be empty" };
      }
      let user_details = await this.repository.findOneBy({
        email: userDto?.email,
      });
      if (user_details == null) {
        if (type == "api") {
          throw new HttpException(
            "No record found with the Email Address",
            HttpStatus.NOT_FOUND
          );
        }
        return { status: "error", error: "No record found with the Email Id" };
      }
      if (userDto.password == userDto.oldPassword) {
        if (type == "api") {
          throw new HttpException(
            "New password should be different from the old password",
            HttpStatus.BAD_REQUEST
          );
        }
        return {
          status: "error",
          error: "New password should be different from the old password",
        };
      }
      let IscorrectPassword = await compare(
        userDto.oldPassword,
        user_details.password
      );
      if (!IscorrectPassword){
        if (type == "api") {
          throw new HttpException(
            "Old password doesn't matched",
            HttpStatus.BAD_REQUEST
          );
        }
        return { status: "error", error: "Old password doesn't matched" };

      }

      userDto.password = await hash(userDto.password, 10);
      const user_ref = Object.assign(new UsersDto(), userDto);
      delete user_ref.oldPassword;
      let user = this.getUserAsEntity(user_ref);
      let updateResult = await this.repository.update(user_details.id, user);
      if (updateResult.affected === 0) {
        if (type == "api") {
          throw new HttpException(
            "No record found with the ID",
            HttpStatus.NOT_FOUND
          );
        }
        return { status: "error", error: "No record found with the ID" };
      }
      const save = await this.getUserById(user_details.id,type);
      return { status: "success", data: save };
    } catch (error) {
      if(type=="api"){
        handleErrors(error)
      }
      return { status: "error", error: error };
    }
  }

  async getAllSubUser(id: string,type?:string): Promise<any> {
    try {
      if (id == null) {
        throw new HttpException("Id is required", HttpStatus.BAD_REQUEST);
      }
      const ss = await this.userProviderOperatorService.find({
        userId: id
      },type);
     if(type==="api"){
      return ss
     }
      return {ss};
    } catch (error) {
      if (type == "api") {
        handleErrors(error)
      }
      throw new HttpException(error?.response, HttpStatus.BAD_REQUEST);
    }
  }

  async getUserById(id: string,type?:string): Promise<UserWithCompnay> {
    try {
      if (id == null) {
        throw new HttpException("Id is required", HttpStatus.BAD_REQUEST);
      }
      const savedUser = await this.repository.findOneBy({ id });
      if (!savedUser) {
        throw new HttpException(
          "user id is not valid!",
          HttpStatus.NOT_FOUND
        );
      }
      let companyID = null;

      if (savedUser.userRole == "Provider") {
        companyID = JSON.stringify(
          await this.providersService.getProviderByUser(savedUser)
        );
      }
      if (savedUser.userRole == "Sub Provider") {
        const ss = await this.userProviderOperatorService.find({
          userId: savedUser.id,
        });
        if (ss.status == "error") return;
        companyID = JSON.stringify(
          await this.providersService.getProviderById(ss.data[0].companyId)
        );
      }
      if (savedUser.userRole == "Operator") {
        companyID = JSON.stringify(
          await this.operatorsService.getOperatorByUser(savedUser)
        );
      }
      if (savedUser.userRole == "Sub Operator") {
        const ss = await this.userProviderOperatorService.find({
          userId: savedUser.id,
        });
        if (ss.status == "error") return;
        companyID = JSON.stringify(
          await this.operatorsService.getOperator(ss.data[0].companyId)
        );
      }

      const user = await this.getUserAsDto(savedUser);

      return { ...user, companyID };
    } catch (error) {
      if (type == "api") {
        handleErrors(error)
      }
      throw new HttpException(error?.response, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllUser(type?:string): Promise<UserWithCompnay[]> {
    try {
      let saved = await this.repository.find();
      return saved;
    } catch (error) {
      return error;
    }
  }

  async contactUs(data: {
    senderEmail: string;
    message: string;
    firstName: string;
    lastName?: string;
    companyName: string;
    businessType?: string;
  },type?:string): Promise<{ status: string; data?: string; error?: string }> {
    try {
      const tempOption = {
        title: `Inquiry from ${data?.companyName || ""}/Nexus Lobby`,
        userName:"",
        content:
          `EmailID :- ${data?.senderEmail || ""} <br/>
          firstName :- ${data?.firstName || ""} <br/>
          lastName :- ${data?.lastName || ""} <br/>
          business Type :- ${data?.businessType || ""} <br/>
          emailId :- ${data?.senderEmail || ""}`,
        link:"",
        button:"",
        subContent:`${data?.message}`
        };

        const mail = {
          subject: `inquiry from ${data?.companyName || ""}/Nexus Lobby`,
          from: data.senderEmail,
          html: MyTemplete(tempOption)
        //   `<h4>EmailID :- ${data?.senderEmail || ""} </h4>
        //   <h4>firstName :- ${data?.firstName || ""} </h4>
        //   <h4>lastName :- ${data?.lastName || ""} </h4>
        //   <h4>business Type :- ${data?.businessType || ""} </h4>
        //   <h4>emailId :- ${data?.senderEmail || ""} </h4>
        // <p>${data?.message}</p>`,
        };
      const status = await this.sandgridService.recieveEmail(mail);

    

      if (status?.code == "202") {
        const tempOption = {
          title: "Getting in Touch with NEXUS",
         subTitle: ` Thanks For Getting in Touch with NEXUS, ${data?.firstName}`,
          userName: data?.firstName,
          content:
            "At NEXUS, we've got your back and are already on the case! Rest assured that our dedicated team is working diligently to address your inquiry with lightning speed. 🚀⚡️",
            contentBelow:
            "In no time, you'll receive a comprehensive response tailored to your specific question. Our goal is to provide you with the utmost clarity and assistance, ensuring that your  experience remains nothing short of exceptional.    ",

          contentBelow2:
            "So, sit tight and keep an eye on your inbox, as we're gearing up to deliver the answer you've been waiting for. And remember, we're just an email away if you need anything else.          ",
        };

      const mail = {
        subject: `Thanks For Getting in Touch with NEXUS, ${data?.firstName}`,
        to: data.senderEmail,
        html: MyTemplete(tempOption),
      };
        const status = await this.sandgridService.sendEmail(mail);
        return { status: "success", data: "successfully send" };
      } else {
        if (type == "api") {
          if(status?.code==403)
          throw new HttpException(
            "sendgrid issue try again!",
            HttpStatus.BAD_REQUEST
          );
        }
        return { status: "error", error: "Try again " };
      }
    } catch (error) {
      if (type == "api") {
        handleErrors(error)
      }
      return { status: "error", error: "error" };
    }
  }
  async getUserByEmail(email: string,type?:string): Promise<UsersDto> {
    if (email == null || email == "") return null;
    let saved = await this.repository.findOneBy({ email: email });
    return this.getUserAsDto(saved);
  }

  async validate(email: string, password: string,type?:string): Promise<boolean> {
    let saved = await this.repository.findOneBy({ email: email });
    if (saved != null) {
      let ret = await compare(password, saved.password);
      return ret;
    }
    return false;
  }



  async deleteSubUser(
    userId: string,usersId?:string
  ,type?:string): Promise<{ status: string; data?: string; error?: string }> {
    try {
    
      let user_provider_operator;
      if(type=="api"){
        user_provider_operator =
        await this.userProviderOperatorService.find({id:userId,userId:usersId},"api")
      if (user_provider_operator == null) {
        throw new HttpException(
          "No record found with the ID",
          HttpStatus.NOT_FOUND
        );
      }
    }else{
    user_provider_operator =
        await this.userProviderOperatorService.find({ userId: userId });
      if (user_provider_operator == null) {
        return {
          status: "error",
          error: "user_provider_operator id doesn`t exits",
        };
      }
    }
    console.log(user_provider_operator)

      const delete_res = await this.userProviderOperatorService.delete(
        user_provider_operator?.data[0]?.id
      );

      if (delete_res.includes("error:")) {
        return { status: "error", error: delete_res };
      }
      const res = this.delete(userId);
      return res;
    } catch (error) {
      if (type == "api") {
        handleErrors(error)
      }
      return { status: "error", error: error };
    }
  }

  async delete(
    id: string,type?:string
  ): Promise<{ status: string; data?: string; error?: string }> {
    try {
      let user = await this.getUserById(id,type);
      if (user?.userRole == "Admin") {
        if (type == "api") {
          throw new HttpException(
            "Admin can`t delete",
            HttpStatus.BAD_REQUEST
          );
        }
        return { status: "error", error: "Admin can`t delete" };
      }
      let deleteResult = await this.repository.delete(id);
      return { status: "success", error: `${id} successfully deleted` };
    } catch (error) {
      if (type == "api") {
        handleErrors(error)
      }
      return handleStatusError(error);
    }
  }

  async deleteAccoun(id: string) {
    const user = await this.repository.findOneBy({ id });
    if (!user) {
      return null; // User not found
    }
    await this.repository.delete(id);
  }

  async clear(authUser: UsersDto,type?:string): Promise<string> {
    if (GlobalService.isTestCase) {
      let items = await this.repository.find();
      for (const item of items) {
        let dr = await this.delete(item.id);
      }
      return "cleared";
    }

    return "not cleared";
  }

  //some common function
  async sendEmail(data: UsersDto, password: string) {
 
    const tempOption = {
      title: "🎮 Welcome to NEXUS Lobby!🚀🔒",
      userName: data?.firstname,
      subTitle:"We're thrilled to welcome you to the NEXUS family! 🌟 As a new user, you've been invited to join our exclusive NEXUS Lobby, where the game management magic comes to life."
      ,content: `<b>Hello we are invited you for join the  NEXUS :</b><br/> <br/>
       <b>userEmail:- </b>${data?.email}<br/> 
      <b> password:-</b> ${password}`,
      link: "https://nexus.switzerlandnorth.cloudapp.azure.com/",
      button: "Let's go to the lobby",
      subContent: "Click the button below to go to the lobby:",
      contentBelow:"Should you encounter any questions or need assistance, our friendly support team is always here to lend a hand. Feel free to reach out to us at support@nexus7995.com.",
      contentBelow2:"Thank you for joining NEXUS, where thrilling quests and exhilarating challenges await at every turn. We can't wait to witness your prowess and celebrate your victories!",

    };

    const mail = {
      to: data?.email,
      subject: "Welcome to the NEXUS Lobby!",
      text: "Hello we are invited you for join the  NEXUS. ",
      html: MyTemplete(tempOption),
    };
    return await this.sandgridService.sendEmail(mail);
  }

  async getUsersAsDto(items: Users[],type?:string): Promise<Array<UsersDto>> {
    if (items == null) return null;
    let ret = new Array<UsersDto>();
    for (var i = 0; i < items.length; i++) {
      ret.push(await this.getUserAsDto(items[i]));
    }
    return ret;
  }



  async getUserAsDto(item: Users,type?:string): Promise<UsersDto> {
    if (item == null) return null;
    let ret = Object.assign(new UsersDto(), item);
    delete ret["password"];

    // if (item.userRole == null || item.userRole == '') {
    //   ret.userRole = await this.getProfile(ret);
    // }

    return ret;
  }

  getUserAsEntity(item: UsersDto,type?:string): Users {
    if (item == null) return null;
    let ret = Object.assign(new Users(), item);
    // if (ret['profile'] != 'admin') ret['profile'] = '';
    return ret;
  }

  async generateRandomPassword(type?:string): Promise<string> {
    const baseName = "Nexus";
    const length = 10; // length of the random password
    const randomBytesPromise = () => {
      return new Promise<Buffer>((resolve, reject) => {
        randomBytes(length, (err, buf) => {
          if (err) {
            reject(err);
          }
          resolve(buf);
        });
      });
    };
    const randomBytesBuffer = await randomBytesPromise();
    const randomPassword = `${baseName}${randomBytesBuffer.toString("hex")}`;
    return randomPassword;
  }

  async getUserRole(role: string): Promise<string> {
    return role;
  }
}
