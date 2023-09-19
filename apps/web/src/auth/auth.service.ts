import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { UsersDto, UserWithCompnay } from "@app/shared/users/users.dto";
import { JwtPayload } from "./jwt.payload.interface";
import { UsersService } from "@app/shared/users/users.service";
import { ProvidersService } from "@app/shared/providers/providers.service";
import { OperatorsService } from "@app/shared/operators/operators.service";
import { UserProviderOperatorService } from "@app/shared/user-provider-operator/user-provider-operator.service";
import { retry } from "rxjs";
import { SandgridService } from "@app/shared/sandgrid/sandgrid.service";
import { ConfigService } from "@app/shared/core/config/config.service";
import axios from "axios";
import { ProvidersDto } from "@app/shared/providers/providers.dto";
import { OperatorsDto } from "@app/shared/operators/operators.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Users } from "@app/shared/users/users.entity";
import { UsersDeactivateService } from "@app/shared/users/deactvate.user.service";
import { MyTemplete } from "@app/shared/sandgrid/mytemp";
import { updateEmailSubscription } from "@app/shared/common/interfaces/errorResponse.interface";

@Injectable()
export class AuthService {
  constructor(
    private readonly operatorService: OperatorsService,
    private readonly providersService: ProvidersService,
    private readonly userService: UsersService,
    private readonly userDeActiveService: UsersDeactivateService,
    private readonly userProviderOperatorService: UserProviderOperatorService,
    private readonly jwtService: JwtService,
    private readonly sandgridService: SandgridService,
    private readonly configService: ConfigService
  ) {}

  async register(user: UsersDto): Promise<UsersDto> {
    const ret = await this.userService.createUser(user);
    delete ret.password;

    return ret;
  }

  async authFree(details: updateEmailSubscription): Promise<any> {
    const ret = await this.userDeActiveService.updateEmailSubscription(details);
    return ret;
  }

  /// wix userrrr

  async getAccessToken(): Promise<any> {
    const config = {
      grant_type: "refresh_token",
      client_id: this.configService.get("WIX_CLIENT_ID"),
      client_secret: this.configService.get("WIX_CLIENT_SECRET"),
      refresh_token: this.configService.get("WIX_REFRESH_TOKEN"),
    };
    const response = await axios.post(
      "https://www.wixapis.com/oauth/access",
      config
    );
    const tokens = await response?.data;
    return tokens?.access_token;
  }

  async getUserDetail(memberData: any) {
    try {
      // console.log(memberData, "orderDetails");
      let formData = memberData.formData.submissionData;
      let memberId = memberData?.buyer?.memberId;
      let userRole =
        formData.userRole == "iGaming Operator" ? "Operator" : "Provider";
      const token = await this.getAccessToken();
      const response = await axios.get(
        `https://www.wixapis.com/members/v1/members/${memberId}?fieldSet=FULL`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const member = await response?.data.member;

      const user = Object.assign(new UsersDto(), {
        firstname: member.contact.firstName || member.profile.nickname || "",
        lastname: member.contact.lastName || "",
        mobile: member.contact.phones[0] || "91",
        userRole: userRole,
        email: member.loginEmail || member.contact.emails[0] || "",
        whatsapp: "",
        skype: "",
        id: "",
        password: "",
        slack: "",
        telegram: "",
        signal: "",
        viber: "",
        discord: "",
        userType: "Technical User",
        initialUser: false,
        profileCompleted: false,
        deactivationDate: null,
        apiKey:""
      });

      const checkEmail = await this.userService.getUserByEmail(
        member?.loginEmail
      );

      let createUser;
      // console.log(checkEmail, "checkEmail");
      if (!checkEmail) {
        createUser = await this.register(user);
        createUser.companyID = "null";
      } else {
        user.id = checkEmail.id;
        createUser = await this.userService.update(user);
      }

      createUser = checkEmail ? createUser?.data : createUser;

      // let ref_obj = JSON.parse(JSON.stringify(createUser));
      // if (ref_obj.status == 409 || ref_obj.status != "success") {
      //   return ref_obj.message;
      // }

      if (createUser) {
        const userFor: any = {
          id: "",
          usednexus: true,
          companyName: formData.companyName || "",
          companyEmail: createUser?.email || member?.loginEmail,
          ipRange: "1",
          oldId: "",
          vatId: formData.vatId || "",
          taxId: formData.taxId || "",
          registrationNumber: "1234",
          address: member.contact.addresses[0] || "",
          city: "",
          servicePlan: memberData.planName || "",
          logo: "",
          state: "",
          zip: "",
          createdBy: {
            id: createUser?.id || checkEmail?.id,
          },
          isAcceptedTerm: formData.terms || true,
          memberId:memberData?.buyer?.memberId || memberData?.buyer?.contactId,
          planStatus: "ACTIVE" || "",
          planDetails: JSON.stringify( {
            // planName:memberData?.planName|| "",
            // planStatus:memberData?.status ||memberData?.statusNew|| "",
            startDate:memberData?.startDate || memberData?.currentCycle?.startedDate|| "",
            endDate:memberData?.earliestEndDate || memberData?.endDate || "Until canceled"|| "",
            // paymentStatus:memberData?.lastPaymentStatus || "",
            // memberId:memberData?.buyer?.memberId|| "",
            planPrice: memberData?.planPrice || memberData?.priceDetails?.planPrice|| "",
            currency:memberData?.priceDetails?.currency|| "",
            duration:memberData?.priceDetails?.singlePaymentForDuration?.count|| "",
            // cancleAction:memberData?.cancellation?.cause || ""
          })
        };
        let createUserProf;
        // console.log(createUser?.userRole, createUser?.companyID, "createUser");
        if (
          createUser?.userRole == "Operator" &&
          createUser?.companyID == "null"
        ) {
          createUserProf = await this.operatorService.create(userFor);
        } else if (
          createUser.userRole == "Operator" &&
          createUser?.companyID != "null"
        ) {
          delete userFor.usednexus;
          userFor.id = JSON.parse(createUser?.companyID)?.id;
          createUserProf = await this.operatorService.update(userFor);
        } else if (
          createUser.userRole == "Provider" &&
          createUser?.companyID == "null"
        ) {
          createUserProf = await this.providersService.create(userFor);
        } else if (
          createUser.userRole == "Provider" &&
          createUser?.companyID != "null"
        ) {
          delete userFor.usednexus;
          userFor.id = JSON.parse(createUser?.companyID)?.id;
          createUserProf = await this.providersService.update(userFor);
        }
        const savedUser = await this.userService.getUserById(createUser?.id);
        return savedUser;
      }
    } catch (error) {
      return error;
    }
  }
  
  async canclePlan(memberData: any): Promise<any> {
    try {     
      let userRole =memberData.formData.submissionData.userRole == "iGaming Operator" ? "Operator" : "Provider";
      if(userRole=="Provider"){
        const createUserProf = await this.providersService.updateProPlan(memberData);
      }else{
        const createUserProf = await this.operatorService.updatePlan(memberData);
      }
    } catch (error) {
      return error;
    }
  }

  async checkout(user: any,cancleType?:string): Promise<any> {
    try {
      if (!user?.data?.order_id) {
        return "user Not Found";
      }
      const token = await this.getAccessToken();
      const id = user?.data?.order_id.trim();
      if (token && id) {
        setTimeout(async () => {
          const response = await axios.get(
            `https://manage.wix.com/_api/paid-plans/v2/orders/${id}?id=${id}`,
            {
              headers: {
                Authorization: token,
              },
            }
          );
          const response2 = await axios.post(
            `https://www.wixapis.com/wix-data/v2/items/query`,
            {
              dataCollectionId: "myOrders",
              query: {
                filter: {
                  orderId: `${id}`,
                },
              },
            },
            {
              headers: {
                Authorization: token,
              },
            }
          );
          const order = response?.data?.order;
          // console.log(response2?.data?.dataItems, "collectionQuery");
          const additinalInfo = response2?.data.dataItems[0].data;

          if (response2) {
            order.formData.submissionData.companyName =
              additinalInfo.companyName || "test2";
            order.formData.submissionData.userRole = additinalInfo.userRole;
            order.formData.submissionData.vatId = additinalInfo.vatId;
            order.formData.submissionData.taxId = additinalInfo.taxId;
            order.formData.submissionData.terms = additinalInfo.terms || true;
            if (response.status == 200) {
              if(cancleType=="cancle"){
                const userDetails = await this.canclePlan(order);
                return userDetails;
              }else{
                const userDetails = await this.getUserDetail(order);
                return userDetails;
              }
            } else {
              throw new HttpException("", HttpStatus.BAD_REQUEST);
            }
          }
        }, 10000);
      }
    } catch (error) {
      console.log(error, "error");
      return error;
    }
  }

  async login(email: string, password: string): Promise<UserWithCompnay> {
    let user: UserWithCompnay;

    try {
      user = await this.userService.getUserByEmail(email);
    } catch (err) {
      throw new UnauthorizedException(
        `There isn't any user with email: ${email}`
      );
    }

    let valid = await this.userService.validate(email, password);
    if (!valid) {
      throw new UnauthorizedException(
        `Wrong password for user with email: ${email}`
      );
    }

    delete user.password;
    if (user.userRole == "Provider") {
      let company_id = JSON.stringify(
        await this.providersService.getProviderByUser(user)
      );
      user.companyID = company_id;
    } else if (user.userRole == "Operator") {
      let company_id = JSON.stringify(
        await this.operatorService.getOperatorByUser(user)
      );
      user.companyID = company_id;
    } else if (user.userRole == "Sub Provider") {
      const ss = await this.userProviderOperatorService.find({
        userId: user.id,
      });
      if (ss.status == "error") return;

      let company_id = JSON.stringify(
        await this.providersService.getProviderById(ss.data[0].companyId)
      );

      user.companyID = company_id;
    } else if (user.userRole == "Sub Operator") {
      const ss = await this.userProviderOperatorService.find({
        userId: user.id,
      });
      if (ss.status == "error") return;

      let company_id = JSON.stringify(
        await this.operatorService.getOperator(ss.data[0].companyId)
      );

      user.companyID = company_id;
    }
    return user;
  }

  async forgotPasswordLink(
    userDto: UsersDto
  ): Promise<{ status: string; data?: any; error?: string }> {
    try {
      const user = await this.userService.getUserByEmail(userDto?.email);
      if (user == null) {
        return { status: "error", error: "Email does not exist" };
      }
      const token = await this.forgotPasswordToken(userDto.email);

      let FRONTEND_URL = this.configService.get("FRONTEND_URL");
      const link = `${FRONTEND_URL}password/${token}`;

      const tempOption = {
        title: "Reset Your Password",
        subTitle: "We hope this email finds you in high spirits and geared up for more adventures with NEXUS!         ",
        userName: user?.firstname,
        content:
          "You recently requested a password reset for your NEXUS Lobby account. Don't worry; we've got you covered! To ensure your account's security and seamless access, we've set up a straightforward process to reset your password.          ",
        subContent:"Here's how you can get back into the action in no time:",
        subContent2:"Click on the button below to access the password reset page.",
        link:link,
        button:"Reset My Password",
        contentBelow:"You'll be directed to a secure page where you can enter your new password. Be sure to choose something strong and memorable to safeguard your NEXUS Lobby.",
        contentBelow2:"Once you've reset your password, you'll be all set to dive back and explore a world of thrilling opportunities!        ",
        contentBelow3:"As always, our dedicated support team is here to assist you if you encounter any issues or need further assistance. Simply reach out to us at support@nexus7995.com, and we'll be more than happy to help.",
        nexusLink:"We can't wait to see you back in the <a style='text-decoration: underline; color:blue' href='https://lobby.nexus7995.com/' target='_blank' >NEXUS Lobby </a>, where epic quests and incredible victories await! 🌌💫",
        bottom:"Happy game managing!"
      };

      const mail = {
        to: userDto.email,
        subject: "Reset Your NEXUS Lobby Password 🚀🔐",
        text: "Click the link below to reset your password:",
        html:MyTemplete(tempOption),
      };
      

      const res = await this.sandgridService.sendEmail(mail);
      return { status: "success", data: res };
    } catch (error) {
      return { status: "error", error: error };
    }
  }

  async forgotPassword(
    usersDto: UsersDto
  ): Promise<{ status: string; data?: UsersDto; error?: string }> {
    try {
      const user_details = await this.userService.forgotPassword(usersDto);

      return user_details;
    } catch (error) {
      return { status: "error", error: error };
    }
  }
  async verifyPayload(payload: JwtPayload): Promise<UsersDto> {
    let user: UsersDto;

    try {
      user = await this.userService.getUserByEmail(payload.sub);
    } catch (error) {
      throw new UnauthorizedException(
        `There isn't any user with email: ${payload.sub}`
      );
    }
    delete user.password;

    return user;
  }

  signToken(user: UsersDto): string {
    const payload = {
      sub: user.email,
      id: user.id,
    };

    return this.jwtService.sign(payload);
  }

  async forgotPasswordToken(email: string): Promise<string> {
    const payload = {
      sub: email,
    };

    const secretKey = this.configService.get("secretKey"); // Replace with your actual secret key

    return this.jwtService.sign(payload, {
      expiresIn: "15m",
      secret: secretKey,
    });
  }

  signTokenParmanent(user: UsersDto): string {
    const payload = {
      sub: user.email,
      jti: "parmanent",
    };

    return this.jwtService.sign(payload);
  }
}
