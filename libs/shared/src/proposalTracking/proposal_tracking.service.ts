import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DeleteResult, UpdateResult, Like } from "typeorm";

import { ProposalTrackingDto } from "./proposal_tracking.dto";
import { ProposalTracking } from "./proposal_tracking.entity";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";

import { promisify } from "util";
// import fs from 'fs';
import { v4 as uuidv4 } from "uuid";
import { Users } from "../users/users.entity";
import { UsersDto } from "../users/users.dto";
import { ProvidersService } from "../providers/providers.service";
import { OperatorsService } from "../operators/operators.service";
import { ProviderProposalService } from "../providerProposal/providerProposal.service";
import { OperatorProposalService } from "../operatorProposal/operatorProposal.service";
import { strict } from "assert";
import { ContractsService } from "../contracts/contracts.service";
import { ContractsDto } from "../contracts/contracts.dto";
import { GameTrackingService } from "../gameTracking/game_tracking.service";
import { GameTrackingDto } from "../gameTracking/game_tracking.dto";
import { ExternalProviderOpeartorService } from "../externalProviderOperator/externalProviderOperator.service";
import { GamesService } from "../games/games.service";
import { GamesDto } from "../games/games.dto";
import { SandgridService } from "../sandgrid/sandgrid.service";
import {
  OperatorProposalOptions,
  ProviderProposalOptions,
  gameDetails,
} from "../common/option";
import moment from "moment";
import { ProviderOperator } from "../provider-operator/provider-operator.entity";
import { ProviderOperatorService } from "../provider-operator/provider-operator.service";
import { providerOperatorDto } from "../provider-operator/provider-operator.dto";
import { UsersDeactivateService } from "../users/deactvate.user.service";
import { handleErrors, handleStatusError } from "../common/errorHandling";
import { NotificationShare } from "../notification/notification.entity";
import { NotificationService } from "../notification/notification.service";
import * as fs from "fs";
import * as util from "util";
import path from "path";
import { MyTemplete } from "../sandgrid/mytemp";
import { nexIcon, nexusLogo } from "./getlogo";

@Injectable()
export class ProposalTrackingService {
  constructor(
    private readonly providersService: ProvidersService,
    private readonly operatorsService: OperatorsService,
    private readonly providerProposalService: ProviderProposalService,
    private readonly operatorProposalService: OperatorProposalService,
    private readonly contractsService: ContractsService,
    private readonly gameTrackingService: GameTrackingService,
    private readonly gamesService: GamesService,
    private readonly providerOperatorService: ProviderOperatorService,
    private readonly usersDeactivateService: UsersDeactivateService,
    private readonly notificationService: NotificationService,

    private readonly sandgridService: SandgridService,
    private readonly externalProviderOpeartorService: ExternalProviderOpeartorService,

    @InjectRepository(ProposalTracking)
    private readonly repository: Repository<ProposalTracking>
  ) {}

  //send proposal from the provider
  async create(
    proposalTrackingDto: ProposalTrackingDto,type?:string
  ): Promise<{ status: string; data?: ProposalTrackingDto[]; error?: string }> {
    const promises = JSON.parse(
      JSON.stringify(proposalTrackingDto.receiverId)
    ).map(
      async (receiverDetails: {
        id: string;
        index: string;
        companyEmail: string;
        companyName: string;
      }) => {
        const proposal_tracking_obj = {
          ...proposalTrackingDto,
          receiverId: receiverDetails.id,
          refIndex: receiverDetails.index,
        };

        let contract_details: any;
        let proposalId: string;
        let proposal_details: any;
        let save: any;
        if (proposalTrackingDto.proposalId) {
          proposal_details =
            await this.providerProposalService.getProviderProposalById(
              proposalTrackingDto.proposalId
            );
            if (type == "api" && proposal_details==null) {
              throw new HttpException(
                "No records were found with the given proposalId. Please check it accordingly." ,
                HttpStatus.NOT_FOUND
              );
           }
          proposalId = proposal_details.id;
        }

        let IscontractExits = false;
        const avilable_contract = await this.contractsService.IsContract({
          providerId: proposalTrackingDto.senderId,
          operatorId: receiverDetails.id,
        });
        if (type == "api" && proposal_details==null) {
          throw new HttpException(
            "No records were found with the given senderId or receiverId . Please check it accordingly." ,
            HttpStatus.NOT_FOUND
          );
       }
        let avilable_proposal = await this.getProposalTrackingByDetails({
          senderId: proposalTrackingDto.senderId,
          receiverId: receiverDetails.id,
        });
        console.log(avilable_proposal, "1");

        //use for inverse tracking proposal
        if (avilable_proposal.data.length === 0) {
          avilable_proposal = await this.getProposalTrackingByDetails({
            receiverId: proposalTrackingDto.senderId,
            senderId: receiverDetails.id,
          });
        }
        console.log(avilable_proposal, "2");

        if (
          avilable_proposal.status == "success" &&
          avilable_proposal.data.length > 0
        ) {
          proposalId =
            (avilable_proposal.data[0].proposalId &&
              JSON.parse(avilable_proposal.data[0].proposalId).id) ||
            "";
          proposal_details =
            (avilable_proposal.data[0].proposalId &&
              JSON.parse(avilable_proposal.data[0].proposalId)) ||
            {};
        }
        let save_res;
        if (
          avilable_proposal.data == null ||
          this.isObjectEmpty(avilable_proposal.data)
        ) {
          const proposal_tracking_entity =
            await this.getProposalTrackingasEntity(proposal_tracking_obj);
          save = await this.repository.save(proposal_tracking_entity);
          //for sending the notification to operator
          save_res = await this.getProposalTrackingById(save.id);

          let ref_obj = Object.assign(new NotificationShare(), {});
          ref_obj.senderId = JSON.parse(save_res.senderId)?.id;
          ref_obj.receiverId = {
            id: JSON.parse(save_res.receiverId)?.id,
            email: JSON.parse(save_res.receiverId).companyEmail || "",
          };
          ref_obj.message.title = `New Partnership Proposal Received from ${
            JSON.parse(save_res.senderId)?.companyName
          }`;
          ref_obj.message.body = `${
            JSON.parse(save_res.senderId)?.companyName || ""
          } has shared a New Proposal - ${
            JSON.parse(save_res.proposalId)?.proposalName || ""
          } with you.`;
          ref_obj.message.link = JSON.parse(save_res.proposalId)?.id;
          ref_obj.message.type = "proposal";

          // const tempOption = {
          //   title: "New Partnership Proposal Received",
          //   subject: `🤝 New Partnership Proposal Received from  ${
          //     save_res.senderId && JSON.parse(save_res.senderId)?.companyName
          //   }! 🚀🔗`,

          //   subTitle: `Greetings from NEXUS! 🎮 We're thrilled to share exciting news with you. ${
          //     save_res.senderId && JSON.parse(save_res.senderId)?.companyName
          //   }, a fellow iGaming enthusiast and potential partner has just sent you a proposal for a thrilling collaboration.`,
          //   userName: JSON.parse(save_res.receiverId)?.companyName,
          //   content: `${
          //     JSON.parse(save_res.senderId)?.companyName || ""
          //   } has shared a New Proposal - ${
          //     JSON.parse(save_res.proposalId)?.proposalName || ""
          //   } with you.`,
          //   subContent:
          //     "Take a moment to review the proposal and consider the incredible possibilities that lie ahead. Our goal is to foster a vibrant community where like-minded gaming innovators join forces to create an extraordinary experience for players around the globe.                ",
          //   contentBelow:
          //     "<a href='https://www.nexus7995.com/pricing' style='color:blue' target='_blank'>Check out our webpage and benefits to become a NEXUS member yourself, if you you would like to professionalize your game management, expand your network and reach out to new business partners, too! 🚀</a>",
          //   contentBelow2:
          //     "The NEXUS team is here to support you every step of the way. We believe that by uniting forces, we can revolutionize the gaming landscape and achieve new heights together.",
          //   contentBelow3:
          //     "Here's to a future filled with triumphant quests and exhilarating challenges!                ",
          // };

          this.notificationService.createNew(ref_obj);
        }

        if (
          avilable_contract == null ||
          this.isObjectEmpty(avilable_contract)
        ) {
          const contract_obj = Object.assign(new ContractsDto(), {
            ...proposal_details,
            contractName: `${proposal_details.proposalName} Contract`,
            index: "Provider",
            operatorId: receiverDetails.id,
            refIndex: receiverDetails.index,
            providerId: proposalTrackingDto.senderId,
            createdBy: proposalTrackingDto.createdBy,
            gracePerMin:
              proposal_details.gracePeriodforMinimumAbsoluteRevshareFee || 0,
            minRevshareGen: proposal_details.minimumAbsoluteRevshareFee || 0,
            startDate: new Date(),
            default: false,
          });

          IscontractExits = false;
          contract_details = await this.contractsService.createOneContract(
            contract_obj
          );
        } else {
          IscontractExits = true;
          contract_details = avilable_contract;
        }

        let Game_tracking_obj = Object.assign(new GameTrackingDto(), {
          index: "Provider",
          operatorId: receiverDetails.id,
          refIndex: receiverDetails.index,
          providerId: { id: proposalTrackingDto.senderId },
          createdBy: proposalTrackingDto.createdBy,
          gameId: JSON.parse(JSON.stringify(proposalTrackingDto)).gameId,
          proposalId: proposalId,
          contractId: { id: contract_details.id },
        });

        const IsGame = await this.gameTrackingService.getGameTrackingByDetails({
          operatorId: receiverDetails.id,
          providerId: proposalTrackingDto.senderId,
          gameId: JSON.parse(JSON.stringify(proposalTrackingDto)).gameId,
        });

        //create game tracking
        if (IsGame.data.length === 0) {
          const game_tracking_details = await this.gameTrackingService.create(
            Game_tracking_obj
          );
        } else {
          Game_tracking_obj.id = IsGame.data[0].id;
          delete Game_tracking_obj.index;
          delete Game_tracking_obj.operatorId;
          delete Game_tracking_obj.refIndex;
          delete Game_tracking_obj.providerId;
          delete Game_tracking_obj.createdBy;
          delete Game_tracking_obj.gameId;
          const game_tracking_details = await this.gameTrackingService.update(
            Game_tracking_obj
          );
        }
        const game_details = await this.gamesService.getGameById(
          JSON.parse(JSON.stringify(proposalTrackingDto)).gameId
        );
        // console.log(receiverDetails.companyEmail, '++');

        (async () => {
          try {
            pdfMake.vfs = pdfFonts.pdfMake.vfs;
            pdfMake.fonts = {
              Roboto: {
                normal: "Roboto-Regular.ttf",
                bold: "Roboto-Medium.ttf",
                italics: "Roboto-Italic.ttf",
                bolditalics: "Roboto-Italic.ttf",
              },
            };
            const gamedocDefinition = {
              content: [
                {
                  image: nexusLogo(),
                  width: 200,
                  alignment: "center",
                  link: "https://www.nexus7995.com/",
                  margin: [0, 0, 0, 20],
                },

                {
                  text: [
                    "This attachment contains essential information about the latest game provided by ",
                    {
                      text:
                        (game_details?.providerId &&
                          game_details?.providerId?.companyName) ||
                        "",
                      fontSize: 13,
                      bold: true,
                    },
                    ". For an enhanced Game Management experience and access to a plethora of benefits, sign up with NEXUS 7995 at",
                    {
                      text: " www.nexus7995.com. ",
                      link: "https://www.nexus7995.com/",
                      decoration: "underline",
                      color: "blue",
                    },
                    "Unlock Contract, Queue, License, Reconciliation, and New Business Management features and propel your gaming empire to new heights!.",
                  ],
                  style: "headerContent",
                  fontSize: 12,
                  bold: false,
                  margin: [0, 0, 0, 20],
                },
                {
                  text: `Game Details :- ${game_details.gameName}`,
                  style: "header",
                  fontSize: 16,
                  bold: 300,
                 
                },
                {
                  table: {
                    headerRows: 1,
                    widths: ['auto', '*' ],
                    body: gameDetails.map(function (detail) {
                      let value: any;
                      if (game_details[detail.name] === null) {
                        value = "";
                      } else if (
                        typeof game_details[detail.name] === "boolean"
                      ) {
                        value = game_details[detail.name] ? "Yes" : "No";
                      } else if (
                        game_details[detail.name] instanceof Date &&
                        !isNaN(game_details[detail.name])
                      ) {
                        const date = new Date(game_details[detail.name]);
                        const day = String(date.getDate()).padStart(2, "0");
                        const month = String(date.getMonth() + 1).padStart(
                          2,
                          "0"
                        );
                        const year = date.getFullYear();
                        const formattedDate = `${day}/${month}/${year}`;
                        value = formattedDate || "";
                      } else if (detail.title === "Video Slot") {
                        value = `${game_details["vsVertical"] || 0} X ${
                          game_details["vsHorizontal"] || 0
                        }`;
                      } else if (detail.name === "companyName") {
                        value =
                          (game_details?.providerId &&
                            game_details?.providerId?.companyName) ||
                          "";
                      } else if (detail.name === "companyEmail") {
                        value =
                          (game_details?.providerId &&
                            game_details?.providerId?.companyEmail) ||
                          "";
                      } else if (detail.name === "logoOfGames") {
                        const dataDetails = JSON.parse(
                          game_details?.logosOfGame
                        );
                        let logoData = [];
                        if (dataDetails?.data?.length > 0) {
                          dataDetails?.data?.map((item) => {
                            let data = `${capFL(item.name)} : ${item?.link}`;
                            logoData.push(data);
                          });
                        }
                        if (dataDetails?.additional?.length > 0) {
                          dataDetails?.additional?.map((item) => {
                            let data = `${capFL(item.name)} : ${item?.link}`;
                            logoData.push(data);
                          });
                        }
                      
                        // use for game of logo value
                        value =
                          {
                            stack: [
                              "allFiles",
                              {
                                ul: logoData,
                              },
                            ],
                          } || "";
                      } else if (
                        typeof game_details[detail.name] === "object"
                      ) {
                        if (game_details[detail.name] !== null) {
                          if (game_details[detail.name].length > 0) {
                            value = game_details[detail.name].join(",") || "";
                          } else {
                            value = game_details[detail.name] || "";
                          }
                        }
                      } else {
                        value = game_details[detail.name] || "";
                      }

                      return [{ text: detail.title, bold: true }, value];
                    }),
                  },
                  layout: {
                    fillColor: function (i: number, node: any) {
                      return i % 2 === 0 ? "#F0F0F0" : null;
                    },
                  },
                },

                {
                  text: [
                    {
                      text:"Attention : Image Usage Guidelines",
                      fontSize: 11,
                      bold: true,
                    },
                    "\nPlease avoid publishing logos and images directly linked to a NEXUS URL. Instead, kindly download and host them on your servers to prevent any disruptions due to increased traffic. Your understanding is much appreciated.",
                    ],
                  style: "headerContent",
                  fontSize: 10,
                  bold: false,
                  margin: [0, 20, 0, 0],
                },

                {
                  text: [
                    {
                      text: "Game Acceptance or Future Collaboration? ",
                      fontSize: 15,
                      bold: true,
                      decoration: "underline",
                      margin: [0, 20, 0, 20],
                    },
                    "\n",
                    "\nIf you already have an",
                    {
                      text: " existing business relationship with the Provider, ",
                      fontSize: 12,
                      bold: true,
                    },
                    '\n you have the option to accept the game and indicate your intention to roll out the game on the planned go-live date. To proceed, simply click on the "Accept" button.',
                    "\n",
                    "\n",
                    {
                      text: " Accept",
                      link: "https://nexus.switzerlandnorth.cloudapp.azure.com/provider/game/overview",
                      fontSize: 12,
                      bold: false,
                      color: "blue",
                      alignment: "center",
                      margin: [0, 20, 0, 0],
                    },
                    "\n",
                    ` \nFor any future cooperation discussions, you can directly contact the Provider at the email address provided above, to initiate commercial negotiations and explore potential partnerships.`,
                    "\n",
                  ],
                  style: "footerUpper",
                  margin: [0, 20, 0,0],
                },
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 10,
                      x2: 520,
                      y2: 10,
                      lineWidth: 1,
                    },
                  ],
                  margin: [0, 20, 0, 20],
                },
                {
                  text: " Level up Game Management & Collaboration with NEXUS!",
                  fontSize: 13,
                  bold: true,
                  alignment: "center",
                  margin: [0, 0, 0, 20],
                  italics: false,
                  style: "header",
                },
                {
                  text: "Ready to revolutionize your Game Management process and future collaborations with Providers? Experience the power of NEXUS and enjoy these features:",
                  fontSize: 13,
                  bold: false,
                  margin: [0, 0, 0, 20],
                },
                {
                  columns: [
                    {
                      width: 8,
                      height: 15,
                      image: nexIcon(),
                    },
                    {
                      width: "auto",
                      margin: [15, 0, 0, 0],
                      text: "Effortless Game Acceptance: Accept games from Providers hassle-free with just a click! No more back-and-forth emails.",
                    },
                  ],
                  margin: [0, 0, 0, 8],
                },
                {
                  columns: [
                    {
                      width: 8,
                      height: 15,
                      image: nexIcon(),
                    },
                    {
                      width: "auto",
                      margin: [15, 0, 0, 0],
                      text: "Queue Management: Keep track of games in real-time with Queue Management.",
                    },
                  ],
                  margin: [0, 0, 0, 8],
                },
                {
                  columns: [
                    {
                      width: 8,
                      height: 15,
                      image: nexIcon(),
                    },
                    {
                      width: "auto",
                      margin: [15, 0, 0, 0],
                      text: "Contract Management: Safeguard your contracts with a refined versioning system.",
                    },
                  ],
                  margin: [0, 0, 0, 8],
                },
                {
                  columns: [
                    {
                      width: 8,
                      height: 15,
                      image: nexIcon(),
                    },
                    {
                      width: "auto",
                      margin: [15, 0, 0, 0],
                      text: "Monthly Reconciliation: Securely reconcile financial data to streamline transactions.",
                    },
                  ],
                  margin: [0, 0, 0, 8],
                },
                {
                  columns: [
                    {
                      width: 8,
                      height: 15,
                      image: nexIcon(),
                    },
                    {
                      width: "auto",
                      margin: [15, 0, 0, 0],
                      text: "Freemium Model: Get started right away with our Freemium package – 0 integration!",
                    },
                  ],
                  margin: [0, 0, 0, 8],
                },
                {
                  columns: [
                    {
                      width: 8,
                      height: 15,
                      image: nexIcon(),
                    },
                    {
                      width: "auto",
                      margin: [15, 0, 0, 0],
                      text: "License Jedi: Safeguard and track game licenses with ease.",
                    },
                  ],
                  margin: [0, 0, 0, 8],
                },

                {
                  text: [
                    {
                      text: "Join NEXUS now to supercharge your Game Management! Click here to discover the possibilities :",
                      fontSize: 13,
                      bold: true,
                      italics: false,
                    },
                    "\n",
                    {
                      text: " Our Value Proposition",
                      fontSize: 12,
                      bold: true,
                      color: "blue",
                      italics: false,
                      alignment: "center",
                      link: "https://www.nexus7995.com/pricing",
                    },
                  ],
                  style: "footerBottom",
                },
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 10,
                      x2: 520,
                      y2: 10,
                      lineWidth: 1,
                    },
                  ],
                  margin: [0, 20, 0, 20],
                },
              ],

              styles: {
                header: {
                  fontSize: 18,
                  bold: true,
                  margin: [0, 0, 0, 10], // top, right, bottom, left margins
                },
                footer: {
                  fontSize: 10,
                  italics: true,
                  lineHeight: 1.3,
                },
              },
            };
            const proposaldocDefinition = {
              content: [
                {
                  image: nexusLogo(),
                  width: 200,
                  alignment: "center",
                  link: "https://www.nexus7995.com/",
                  margin: [0, 0, 0, 20],
                },
                {
                  text: [
                    {
                      text: "Explore a World of Thrilling Games! ",
                      fontSize: 13,
                      bold: true,
                    },
                    "\nReview and approve this new business relationship proposal with our esteemed Provider ",
                    {
                      text:
                        (game_details?.providerId &&
                          game_details?.providerId?.companyName) ||
                        "",
                      fontSize: 12,
                      bold: true,
                    },
                    " today, and together, we'll elevate the gaming experience for players worldwide! Best of all, this service is provided free of charge. You can also directly communicate your decision to the Provider for any inquiries.",
                  ],
                  style: "header",
                  fontSize: 12,
                  bold: false,
                },
                {
                  text: `Proposal Details :- ${proposal_details.proposalName}`,
                  style: "header",
                  fontSize: 16,
                  bold: 300,
                },
                {
                  table: {
                    headerRows: 1,
                    widths: ["auto", "*"],
                    body: ProviderProposalOptions.map(function (detail) {
                      let value: any;
                      if (proposal_details[detail.name] === null) {
                        value = "";
                      } else if (
                        typeof proposal_details[detail.name] === "boolean"
                      ) {
                        value = proposal_details[detail.name] ? "Yes" : "No";
                      } else if (
                        proposal_details[detail.name] instanceof Date &&
                        !isNaN(proposal_details[detail.name])
                      ) {
                        const date = new Date(proposal_details[detail.name]);
                        const day = String(date.getDate()).padStart(2, "0");
                        const month = String(date.getMonth() + 1).padStart(
                          2,
                          "0"
                        );
                        const year = date.getFullYear();
                        const formattedDate = `${day}/${month}/${year}`;
                        value = formattedDate || "";
                      } else if (detail.name == "providerName") {
                        value =
                          (game_details?.providerId &&
                            game_details?.providerId?.companyName) ||
                          "";
                      } else if (detail.name == "NumberOfNewGamesPerYear") {
                        value = proposal_details?.NumberOfNewGamesPerYear || "";
                      } else if (detail.name == "localLicenses") {
                        value = proposal_details?.localLicenses || "";
                      } else if (detail.name == "currency") {
                        value = proposal_details?.currency || "";
                      } else if (
                        typeof proposal_details[detail.name] === "object"
                      ) {
                        if (proposal_details[detail.name] !== null) {
                          if (proposal_details[detail.name].length > 0) {
                            value =
                              proposal_details[detail.name].join(",") || "";
                          } else {
                            value = proposal_details[detail.name] || "";
                          }
                        }
                      } else {
                        value = proposal_details[detail.name] || "";
                      }

                      return [{ text: detail.title, bold: true }, value];
                    }),
                  },
                  layout: {
                    fillColor: function (i: number, node: any) {
                      return i % 2 === 0 ? "#F0F0F0" : null;
                    },
                  },
                },
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 10,
                      x2: 520,
                      y2: 10,
                      lineWidth: 1,
                    },
                  ],
                  margin: [0, 20, 0, 20],
                },

                {
                  text: " Level up Game Management & Collaboration with NEXUS!",
                  fontSize: 13,
                  bold: true,
                  alignment: "center",
                  margin: [0, 0, 0, 20],
                  italics: false,
                  style: "header",
                },
                {
                  text: "Ready to revolutionize your Game Management process and future collaborations with Providers? Experience the power of NEXUS and enjoy these features:",
                  fontSize: 13,
                  bold: false,
                  margin: [0, 0, 0, 20],
                },
                {
                  columns: [
                    {
                      width: 8,
                      height: 15,
                      image: nexIcon(),
                    },
                    {
                      width: "auto",
                      margin: [15, 0, 0, 0],
                      text: "Effortless Game Acceptance: Accept games from Providers hassle-free with just a click! No more back-and-forth emails.",
                    },
                  ],
                  margin: [0, 0, 0, 8],
                },
                {
                  columns: [
                    {
                      width: 8,
                      height: 15,
                      image: nexIcon(),
                    },
                    {
                      width: "auto",
                      margin: [15, 0, 0, 0],
                      text: "Queue Management: Keep track of games in real-time with Queue Management.",
                    },
                  ],
                  margin: [0, 0, 0, 8],
                },
                {
                  columns: [
                    {
                      width: 8,
                      height: 15,
                      image: nexIcon(),
                    },
                    {
                      width: "auto",
                      margin: [15, 0, 0, 0],
                      text: "Contract Management: Safeguard your contracts with a refined versioning system.",
                    },
                  ],
                  margin: [0, 0, 0, 8],
                },
                {
                  columns: [
                    {
                      width: 8,
                      height: 15,
                      image: nexIcon(),
                    },
                    {
                      width: "auto",
                      margin: [15, 0, 0, 0],
                      text: "Monthly Reconciliation: Securely reconcile financial data to streamline transactions.",
                    },
                  ],
                  margin: [0, 0, 0, 8],
                },
                {
                  columns: [
                    {
                      width: 8,
                      height: 15,
                      image: nexIcon(),
                    },
                    {
                      width: "auto",
                      margin: [15, 0, 0, 0],
                      text: "Freemium Model: Get started right away with our Freemium package – 0 integration!",
                    },
                  ],
                  margin: [0, 0, 0, 8],
                },
                {
                  columns: [
                    {
                      width: 8,
                      height: 15,
                      image: nexIcon(),
                    },
                    {
                      width: "auto",
                      margin: [15, 0, 0, 0],
                      text: "License Jedi: Safeguard and track game licenses with ease.",
                    },
                  ],
                  margin: [0, 0, 0, 8],
                },

                {
                  text: [
                    {
                      text: "Join NEXUS now to supercharge your Game Management! Click here to discover the possibilities :",
                      fontSize: 13,
                      bold: true,
                      italics: false,
                    },
                    "\n",
                    {
                      text: " Our Value Proposition",
                      fontSize: 12,
                      bold: true,
                      color: "blue",
                      italics: false,
                      alignment: "center",
                      link: "https://www.nexus7995.com/pricing",
                    },
                  ],
                  style: "footerBottom",
                },
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 10,
                      x2: 520,
                      y2: 10,
                      lineWidth: 1,
                    },
                  ],
                  margin: [0, 20, 0, 20],
                },
              ],
              styles: {
                header: {
                  fontSize: 18,
                  bold: true,
                  margin: [0, 0, 0, 10],
                },
                footer: {
                  fontSize: 10,
                  italics: true,
                  lineHeight: 1.3,
                },
              },
            };

            const docDefinitions =
               !IscontractExits ?
              [gamedocDefinition, proposaldocDefinition]
            : [gamedocDefinition]
            const pdfPromises = docDefinitions.map((docDefinition) => {
              return new Promise((resolve, reject) => {
                try {
                  const pdfDoc = pdfMake.createPdf(docDefinition);
                  pdfDoc.getBase64((data: any) => {
                    resolve(data);
                  });
                } catch (error) {
                  if (type == "api") {
                    throw new HttpException(
                      error,
                      HttpStatus.BAD_REQUEST
                    );
                 }
                  reject(error);
                }
              });
            });

            await Promise.all(pdfPromises)
              .then(async (pdfDataArray) => {
                const unsubscribeDetails=`nexus.switzerlandnorth.cloudapp.azure.com/subscription/email/?email=${receiverDetails?.companyEmail}&id=${receiverDetails?.id}&type="Provider"&from=${receiverDetails?.index}`
            
                const tempOption = {
                  title: IscontractExits?"New Game Received":"New Partnership Proposal Received",
                  // subject:`🤝 New Partnership Proposal Received from  ${receiverDetails?.companyName}! 🚀🔗`,
                  subTitle: `Greetings from NEXUS! 🎮 We're thrilled to share exciting news with you. <b> ${
                    save_res
                      ? JSON.parse(save_res.senderId)?.companyName
                      : game_details?.providerId?.companyName
                  } </b>, a fellow iGaming enthusiast and potential partner has just sent you a ${IscontractExits?  'new game <b>'+ game_details?.gameName +'</b>' :"proposal"} for a thrilling collaboration.`,
                  userName: receiverDetails?.companyName,
                  content:"Attached to this email, you'll find essential files providing insights into their gaming prowess and company background. This proposal is an invitation to embark on a mutually beneficial iGaming adventure together, where victory and success are just a step away!",
                  subContent:
                    "Take a moment to review the proposal and consider the incredible possibilities that lie ahead. Our goal is to foster a vibrant community where like-minded gaming innovators join forces to create an extraordinary experience for players around the globe.",
                  subContent2:
                    "Should you have any questions or require further information, don't hesitate to <b>reach out to the proposing party directly, no strings or charges attached.</b> Embrace the power of collaboration and let this proposal be the catalyst for a remarkable partnership.",
                  subContent3:
                    "Granted, this mail is not entirely altruistic 😏, here's the pitch 🚀🎯:",
                  subContent4:
                    "Join the ranks of successful gaming enterprises who have already embraced the NEXUS advantage! 🌟 Take the reins of account management with our user-friendly 'Lobby' interface, allowing <b>effortless game management</b> and customization with 49 defining parameters. Enjoy seamless integration with our API for unparalleled flexibility. Stay ahead of the curve with our <b>Release Calendar, Queue Management, Contract Management and Game License Tracking</b> features. Plus, access the exclusive Clients Directory for a treasure trove of new business opportunity delights! Join the winning team and unleash the full potential of your gaming empire with NEXUS! 🎮💎🔥 ",
                  link: "",
                  button: "",
                  contentBelow:
                    "<a href='https://www.nexus7995.com/pricing' style='color:blue' target='_blank'>Check out our webpage and benefits to become a NEXUS member yourself, if you you would like to professionalize your game management, expand your network and reach out to new business partners, too! 🚀</a>",
                  contentBelow2:
                    "The NEXUS team is here to support you every step of the way. We believe that by uniting forces, we can revolutionize the gaming landscape and achieve new heights together.",
                  contentBelow3:
                    "Here's to a future filled with triumphant quests and exhilarating challenges!",
                    bottomLink:`If you prefer not to receive further emails, click <a style='text-decoration: underline; color:blue' href='http:/${unsubscribeDetails}' target='_blank' >here</a> to unsubscribe. Thank you. 🌌💫`,

                };

                // const tempOption = {
                //   title: "Receved New proposal",
                //   subTitle:`Title: Proposal Submission - ${proposal_details?.proposalName}`,
                //   userName: receiverDetails?.companyName,
                //   content:
                //     `We are pleased to submit our comprehensive proposal for ${proposal_details.proposalName}. Our team has dedicated significant time and effort to develop this proposal, taking into account your organization's needs and objectives.`,
                //   link:'',
                //   button:"",
                //   subContent:""
                //   };

                const mailOptions = {
                  to: receiverDetails?.companyEmail,
                  subject: IscontractExits?`🤝 New Game Received from ${ save_res
                    ? JSON.parse(save_res.senderId)?.companyName
                    : game_details?.providerId?.companyName }! 🚀🔗`:
                    `🤝 New Partnership Proposal Received from ${ save_res
                      ? JSON.parse(save_res.senderId)?.companyName
                      : game_details?.providerId?.companyName }! 🚀🔗`,
                  html: MyTemplete(tempOption),
                  attachments: [],
                };

                pdfDataArray.forEach((pdfData, index) => {
                  let fileName = "";

                  if (index === 0) {
                    fileName = "game.pdf";
                  } else if (index === 1) {
                    fileName = "proposal.pdf";
                  }
                  mailOptions.attachments.push({
                    filename: fileName,
                    content: pdfData,
                    encoding: "base64",
                  });
                });

                let checkSend=await this.usersDeactivateService.getEmailSubscription(receiverDetails?.id,receiverDetails?.index,"Provider");
                console.log(checkSend,"checkEmailIsSnd")
                if(checkSend){
                  return await this.sandgridService.sendEmail(mailOptions);
                }
              })
              .then((mailOptions) => {
                console.log("Email sent with mailOptions:", mailOptions);
              })
              .catch((error) => {
                console.error("Error sending email:", error);
              });
            // return
            return this.getProposalTrackingasDto(save);
          } catch (error) {
            console.error("Error generating PDF:", error);
          }
        })();
        //return
        return this.getProposalTrackingasDto(save);
      }
    );
    try {
      pdfMake.fonts = {
        Roboto: {
          normal: "node_modules/pdfmake/build/vfs_fonts.js",
          bold: "node_modules/pdfmake/build/vfs_fonts.js",
          italics: "node_modules/pdfmake/build/vfs_fonts.js",
          bolditalics: "node_modules/pdfmake/build/vfs_fonts.js",
        },
      };

      const results = await Promise.all(promises);

      const gameCheck = await this.gamesService.getGameById(
        JSON.parse(JSON.stringify(proposalTrackingDto)).gameId
      );

      if (gameCheck.gameStatus == "Draft") {
        const Game_obj = Object.assign(new GamesDto(), {
          id: JSON.parse(JSON.stringify(proposalTrackingDto)).gameId,
          gameStatus: "Transmitted",
          modifiedDate: new Date(),
        });
        const game = await this.gamesService.update(Game_obj);
      }

      return { status: "success", data: results };
    } catch (error) {
      console.log(error, "error");

      if (error.code === "ER_DUP_ENTRY") {
        const duplicateKey = error.sqlMessage.split("'")[1];
        const errorMessage = `Error: You have already sent a proposal to this user.`;
        return { status: "error", error: errorMessage };
      }

      if (error.code === "ER_NO_DEFAULT_FOR_FIELD") {
        return { status: "error", error: error.sqlMessage };
      }
      return { status: "error", error: error };
    }
  }
  //send proposal from the operator
  async createOperatorProposalTracking(
    proposalTrackingDto: ProposalTrackingDto
  ): Promise<{ status: string; data?: ProposalTrackingDto[]; error?: string }> {
    const promises = JSON.parse(
      JSON.stringify(proposalTrackingDto.receiverId)
    ).map(
      async (receiverDetails: {
        id: string;
        index: string;
        companyEmail: string;
        companyName: string;
      }) => {
        const proposal_tracking_obj = {
          ...proposalTrackingDto,
          receiverId: receiverDetails.id,
          refIndex: receiverDetails.index,
        };

        let contract_details: any;
        let proposalId: string;
        let proposal_details: any;
        let save: any;

        if (proposalTrackingDto.proposalId) {
          proposal_details =
            await this.operatorProposalService.getOperatorProposalById(
              proposalTrackingDto.proposalId
            );
          proposalId = proposal_details.id;
        }

        const avilable_contract = await this.contractsService.IsContract({
          providerId: receiverDetails.id,
          operatorId: proposalTrackingDto.senderId,
        });

        let avilable_proposal = await this.getProposalTrackingByDetails({
          senderId: proposalTrackingDto.senderId,
          receiverId: receiverDetails.id,
        });
        //use for inverse tracking proposal
        if (avilable_proposal.data.length === 0) {
          avilable_proposal = await this.getProposalTrackingByDetails({
            receiverId: proposalTrackingDto.senderId,
            senderId: receiverDetails.id,
          });
        }
        if (
          avilable_proposal.status == "success" &&
          avilable_proposal.data.length > 0
        ) {
          proposalId =
            (avilable_proposal.data[0].proposalId &&
              JSON.parse(avilable_proposal.data[0].proposalId).id) ||
            "";
          proposal_details =
            (avilable_proposal.data[0].proposalId &&
              JSON.parse(avilable_proposal.data[0].proposalId)) ||
            {};
        }
        if (
          avilable_contract == null ||
          this.isObjectEmpty(avilable_contract)
        ) {
          const contract_obj = Object.assign(new ContractsDto(), {
            ...proposal_details,
            contractName: `${proposal_details.proposalName} Contract`,
            index: "Operator",
            providerId: receiverDetails.id,
            refIndex: receiverDetails.index,
            operatorId: proposalTrackingDto.senderId,
            createdBy: proposalTrackingDto.createdBy,
            gracePerMin:
              proposal_details.gracePeriodforMinimumAbsoluteRevshareFee || 0,
            minRevshareGen: proposal_details.minimumAbsoluteRevshareFee || 0,
            startDate: new Date(),
            setUpCost: 0,
            includedCountries: [],
            currency: "USD",
            revShareTiedToGameType: 0,
            default: false,
          });
          contract_details = await this.contractsService.createOneContract(
            contract_obj
          );
        }
        let save_res;
        if (
          avilable_proposal.data == null ||
          this.isObjectEmpty(avilable_proposal.data)
        ) {
          const proposal_tracking_entity =
            await this.getProposalTrackingasEntity(proposal_tracking_obj);
          save = await this.repository.save(proposal_tracking_entity);
          save_res = await this.getProposalTrackingById(save.id);

          // for sending the notification from operator
          let ref_obj = Object.assign(new NotificationShare(), {});
          ref_obj.senderId = JSON.parse(save_res.senderId)?.id;
          ref_obj.receiverId = {
            id: JSON.parse(save_res.receiverId)?.id,
            email: JSON.parse(save_res.receiverId).companyEmail || "",
          };
          ref_obj.message.title = `New Partnership Proposal Received from  ${
            JSON.parse(save_res.senderId)?.companyName
          }`;
          ref_obj.message.body = `${
            JSON.parse(save_res.senderId)?.companyName || ""
          } has shared a New Proposal - ${
            JSON.parse(save_res.proposalId)?.proposalName || ""
          } with you.`;
          ref_obj.message.link = JSON.parse(save_res.proposalId)?.id;
          ref_obj.message.type = "proposal";

          // const tempOption = {
          //   title: "New Partnership Proposal Received",
          //   subject: `🤝 New Partnership Proposal Received from  ${
          //     JSON.parse(save_res.senderId)?.companyName
          //   }! 🚀🔗`,

          //   subTitle: `Greetings from NEXUS! 🎮 We're thrilled to share exciting news with you. ${
          //     JSON.parse(save_res.senderId)?.companyName
          //   }, a fellow iGaming enthusiast and potential partner has just sent you a proposal for a thrilling collaboration.`,
          //   userName: JSON.parse(save_res.receiverId)?.companyName,
          //   content: `${
          //     JSON.parse(save_res.senderId)?.companyName || ""
          //   } has shared a New Proposal - ${
          //     JSON.parse(save_res.proposalId)?.proposalName || ""
          //   } with you.`,
          //   subContent:
          //     "Take a moment to review the proposal and consider the incredible possibilities that lie ahead. Our goal is to foster a vibrant community where like-minded gaming innovators join forces to create an extraordinary experience for players around the globe.                ",
          //   contentBelow:
          //     "<a href='https://www.nexus7995.com/pricing' style='color:blue' target='_blank'>Check out our webpage and benefits to become a NEXUS member yourself, if you you would like to professionalize your game management, expand your network and reach out to new business partners, too! 🚀</a>",
          //   contentBelow2:
          //     "The NEXUS team is here to support you every step of the way. We believe that by uniting forces, we can revolutionize the gaming landscape and achieve new heights together.",
          //   contentBelow3:
          //     "Here's to a future filled with triumphant quests and exhilarating challenges!                ",
          // };

          this.notificationService.createNew(ref_obj);
        }

        (async () => {
          try {
            pdfMake.vfs = pdfFonts.pdfMake.vfs;
            pdfMake.fonts = {
              Roboto: {
                normal: "Roboto-Regular.ttf",
                bold: "Roboto-Medium.ttf",
                italics: "Roboto-Italic.ttf",
                bolditalics: "Roboto-Italic.ttf",
              },
            };

            const proposaldocDefinition = {
              content: [
                {
                  image: nexusLogo(),
                  width: 200,
                  alignment: "center",
                  link: "https://www.nexus7995.com/",
                  margin: [0, 0, 0, 20],
                },
                {
                  text: [
                    {
                      text: "Explore a World of Thrilling Games! ",
                      fontSize: 13,
                      bold: true,
                    },
                    "\nReview and approve this new business relationship proposal with our esteemed Operator ",
                    {
                      text:
                      JSON.parse(save_res.senderId)?.companyName || "",
                      fontSize: 12,
                      bold: true,
                    },
                    " today, and together, we'll elevate the gaming experience for players worldwide! Best of all, this service is provided free of charge. You can also directly communicate your decision to the Operator for any inquiries.",
                  ],
                  style: "header",
                  fontSize: 12,
                  bold: false,
                },
                {
                  text: `Proposal Details :- ${proposal_details.proposalName}`,
                  style: "header",
                  fontSize: 16,
                  bold: 300,
                },
                {
                  table: {
                    headerRows: 1,
                    widths: ["auto", "*"],
                    body: OperatorProposalOptions.map(function (detail) {
                      let value: any;
                      if (proposal_details[detail.name] === null) {
                        value = "";
                      }else if(detail.name=="alexaRankInStrongestCountry"){
                        value=JSON.parse(save_res.senderId)?.lastQuarterRank
                      } else if (
                        typeof proposal_details[detail.name] === "boolean"
                      ) {
                        value = proposal_details[detail.name] ? "Yes" : "No";
                      } else if (
                        proposal_details[detail.name] instanceof Date &&
                        !isNaN(proposal_details[detail.name])
                      ) {
                        const date = new Date(proposal_details[detail.name]);
                        const day = String(date.getDate()).padStart(2, "0");
                        const month = String(date.getMonth() + 1).padStart(
                          2,
                          "0"
                        );
                        const year = date.getFullYear();
                        const formattedDate = `${day}/${month}/${year}`;
                        value = formattedDate || "";
                      } else if (
                        typeof proposal_details[detail.name] === "object"
                      ) {
                        if (proposal_details[detail.name] !== null) {
                          if (proposal_details[detail.name].length > 0) {
                            value =
                              proposal_details[detail.name].join(",") || "";
                          } else {
                            value = proposal_details[detail.name] || "";
                          }
                        }
                      } else {
                        value = proposal_details[detail.name] || "";
                      }

                      return [{ text: detail.title, bold: true }, value];
                    }),
                  },
                  layout: {
                    fillColor: function (i: number, node: any) {
                      return i % 2 === 0 ? "#F0F0F0" : null;
                    },
                  },
                },
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 10,
                      x2: 520,
                      y2: 10,
                      lineWidth: 1,
                    },
                  ],
                  margin: [0, 20, 0, 20],
                },

                {
                  text: " Level up Game Management & Collaboration with NEXUS!",
                  fontSize: 13,
                  bold: true,
                  alignment: "center",
                  margin: [0, 0, 0, 20],
                  italics: false,
                  style: "header",
                },
                {
                  text: "Ready to revolutionize your Game Management process and future collaborations with Operators? Experience the power of NEXUS and enjoy these features:",
                  fontSize: 13,
                  bold: false,
                  margin: [0, 0, 0, 20],
                },
                {
                  columns: [
                    {
                      width: 8,
                      height: 15,
                      image: nexIcon(),
                    },
                    {
                      width: "auto",
                      margin: [15, 0, 0, 0],
                      text: "Effortless Game Acceptance: Distribute games to Operators hassle-free via API or just a click! No more back-and-forth emails.",
                    },
                  ],
                  margin: [0, 0, 0, 8],
                },
                {
                  columns: [
                    {
                      width: 8,
                      height: 15,
                      image: nexIcon(),
                    },
                    {
                      width: "auto",
                      margin: [15, 0, 0, 0],
                      text: "Queue Management: Keep track of games in real-time with Queue Management.",
                    },
                  ],
                  margin: [0, 0, 0, 8],
                },
                {
                  columns: [
                    {
                      width: 8,
                      height: 15,
                      image: nexIcon(),
                    },
                    {
                      width: "auto",
                      margin: [15, 0, 0, 0],
                      text: "Contract Management: Safeguard your contracts with a refined versioning system.",
                    },
                  ],
                  margin: [0, 0, 0, 8],
                },
                {
                  columns: [
                    {
                      width: 8,
                      height: 15,
                      image: nexIcon(),
                    },
                    {
                      width: "auto",
                      margin: [15, 0, 0, 0],
                      text: "Monthly Reconciliation: Securely reconcile financial data to streamline transactions.",
                    },
                  ],
                  margin: [0, 0, 0, 8],
                },
                {
                  columns: [
                    {
                      width: 8,
                      height: 15,
                      image: nexIcon(),
                    },
                    {
                      width: "auto",
                      margin: [15, 0, 0, 0],
                      text: "Freemium Model: Get started right away with our Freemium package – 0 integration!",
                    },
                  ],
                  margin: [0, 0, 0, 8],
                },
                {
                  columns: [
                    {
                      width: 8,
                      height: 15,
                      image: nexIcon(),
                    },
                    {
                      width: "auto",
                      margin: [15, 0, 0, 0],
                      text: "License Jedi: Safeguard and track game licenses with ease.",
                    },
                  ],
                  margin: [0, 0, 0, 8],
                },

                {
                  text: [
                    {
                      text: "Join NEXUS now to supercharge your Game Management! Click here to discover the possibilities :",
                      fontSize: 13,
                      bold: true,
                      italics: false,
                    },
                    "\n",
                    {
                      text: " Our Value Proposition",
                      fontSize: 12,
                      bold: true,
                      color: "blue",
                      italics: false,
                      alignment: "center",
                      link: "https://www.nexus7995.com/pricing",
                    },
                  ],
                  style: "footerBottom",
                },
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 10,
                      x2: 520,
                      y2: 10,
                      lineWidth: 1,
                    },
                  ],
                  margin: [0, 20, 0, 20],
                },
              ],
              styles: {
                header: {
                  fontSize: 18,
                  bold: true,
                  margin: [0, 0, 0, 10], // top, right, bottom, left margins
                },
              },
            };

            const docDefinitions = [proposaldocDefinition];
            const pdfPromises = docDefinitions.map((docDefinition) => {
              return new Promise((resolve, reject) => {
                try {
                  const pdfDoc = pdfMake.createPdf(docDefinition);
                  pdfDoc.getBase64((data: any) => {
                    resolve(data);
                  });
                } catch (error) {
                  console.log(error, "error");

                  reject(error);
                }
              });
            });
            await Promise.all(pdfPromises)
              .then(async (pdfDataArray) => {
                const unsubscribeDetails=`nexus.switzerlandnorth.cloudapp.azure.com/subscription/email/?email=${receiverDetails?.companyEmail}&id=${receiverDetails?.id}&type="Provider"&from=${receiverDetails?.index}`

                const tempOption = {
                  title: "New Partnership Proposal Received",
                  // subject:`🤝 New Partnership Proposal Received from  ${receiverDetails?.companyName}! 🚀🔗`,
                  subTitle: `Greetings from NEXUS! 🎮 We're thrilled to share exciting news with you. <b> ${
                       JSON.parse(save_res.senderId)?.companyName
                  } </b>, a fellow iGaming enthusiast and potential partner has just sent you a proposal for a thrilling collaboration.`,
                  userName: receiverDetails?.companyName,
                  content:
                    "Attached to this email, you'll find essential files providing insights into their gaming prowess and company background. This proposal is an invitation to embark on a mutually beneficial iGaming adventure together, where victory and success are just a step away!",
                  subContent:
                    "Take a moment to review the proposal and consider the incredible possibilities that lie ahead. Our goal is to foster a vibrant community where like-minded gaming innovators join forces to create an extraordinary experience for players around the globe.",
                  subContent2:
                    "Should you have any questions or require further information, don't hesitate to <b>reach out to the proposing party directly, no strings or charges attached.</b> Embrace the power of collaboration and let this proposal be the catalyst for a remarkable partnership.",
                  subContent3:
                    "Granted, this mail is not entirely altruistic 😏, here's the pitch 🚀🎯:",
                  subContent4:
                    "Join the ranks of successful gaming enterprises who have already embraced the NEXUS advantage! 🌟 Take the reins of account management with our user-friendly 'Lobby' interface, allowing <b>effortless game management</b> and customization with 49 defining parameters. Enjoy seamless integration with our API for unparalleled flexibility. Stay ahead of the curve with our <b>Release Calendar, Queue Management, Contract Management and Game License Tracking</b> features. Plus, access the exclusive Clients Directory for a treasure trove of new business opportunity delights! Join the winning team and unleash the full potential of your gaming empire with NEXUS! 🎮💎🔥 ",
                  link: "",
                  button: "",
                  contentBelow:
                    "<a href='https://www.nexus7995.com/pricing' style='color:blue' target='_blank'>Check out our webpage and benefits to become a NEXUS member yourself, if you you would like to professionalize your game management, expand your network and reach out to new business partners, too! 🚀</a>",
                  contentBelow2:
                    "The NEXUS team is here to support you every step of the way. We believe that by uniting forces, we can revolutionize the gaming landscape and achieve new heights together.",
                  contentBelow3:
                    "Here's to a future filled with triumphant quests and exhilarating challenges!",
                    bottomLink:`If you prefer not to receive further emails, click <a style='text-decoration: underline; color:blue' href='http:/${unsubscribeDetails}' target='_blank' >here</a> to unsubscribe. Thank you. 🌌💫`,
                  };

                const mailOptions = {
                  to: receiverDetails?.companyEmail,
                  subject: `🤝 New Partnership Proposal Received from   
                  ${
                    JSON.parse(save_res.senderId)?.companyName
                  }! 🚀🔗`,
                  html: MyTemplete(tempOption),
                  attachments: [],
                };

                pdfDataArray.forEach((pdfData, index) => {
                  let fileName = "Proposal.pdf";

                  // if (index === 0) {
                  //   fileName = 'game.pdf';
                  // } else if (index === 1) {
                  //   fileName = 'proposal.pdf';
                  // }
                  mailOptions.attachments.push({
                    filename: fileName,
                    content: pdfData,
                    encoding: "base64",
                  });
                });
                let checkSend=await this.usersDeactivateService.getEmailSubscription(receiverDetails?.id,receiverDetails?.index,"Operator");
                   console.log(checkSend,"checkEmailIsSnd")
                if(checkSend){
                return await this.sandgridService.sendEmail(mailOptions);
                }
              })
              .then((mailOptions) => {
                console.log("Email sent with mailOptions:", mailOptions);
              })
              .catch((error) => {
                console.error("Error sending email:", error);
              });
            // return
            return this.getProposalTrackingasDto(save);
          } catch (error) {
            console.error("Error generating PDF:", error);
          }
        })();
        //return
        return this.getProposalTrackingasDto(save);
      }
    );
    try {
      pdfMake.fonts = {
        Roboto: {
          normal: "node_modules/pdfmake/build/vfs_fonts.js",
          bold: "node_modules/pdfmake/build/vfs_fonts.js",
          italics: "node_modules/pdfmake/build/vfs_fonts.js",
          bolditalics: "node_modules/pdfmake/build/vfs_fonts.js",
        },
      };

      const results = await Promise.all(promises);

      return { status: "success", data: results };
    } catch (error) {
      return handleStatusError(error);
    }
  }

  async update(
    proposalTrackingDto: ProposalTrackingDto,type?:string
  ): Promise<{ status: string; data?: ProposalTrackingDto; error?: string }> {
    try {
      let proposal_tracking_entity = await this.getProposalTrackingasEntity(
        proposalTrackingDto
      );

      const res = await this.repository.update(
        proposal_tracking_entity.id,
        proposal_tracking_entity
      );

      if (res.affected === 0) {
        if (type == "api") {
          throw new HttpException(
            "No record found with the ID",
            HttpStatus.NOT_FOUND
          );
        }
        throw new HttpException(
          "No record found with the  ID",
          HttpStatus.BAD_REQUEST,
          { cause: new Error("No record found with the ID") }
        );
      }

      let save = await this.getProposalTrackingById(
        proposal_tracking_entity.id
      );
      let ref_obj = {
        providerId:
          save.index == "Provider"
            ? JSON.parse(save.senderId)?.id
            : JSON.parse(save.receiverId)?.id,
        operatorId:
          save.index == "Provider"
            ? JSON.parse(save.receiverId).id
            : JSON.parse(save.senderId).id,
      };

      let include_contracts = await this.contractsService.findByDetails(
        ref_obj
      );

      let provider_operators = await this.providerOperatorService.find(ref_obj);

      if (include_contracts.length > 0 && provider_operators.length > 0) {
        const contractUpdate = Object.assign(new ContractsDto(), {
          id: include_contracts[0].id,
          status:
            proposalTrackingDto.status === "Accepted" ? "Published" : "Draft",
        });

        const providerOperatorUpdate = Object.assign(
          new providerOperatorDto(),
          {
            id: provider_operators[0].id,
            status:
              proposalTrackingDto.status === "Accepted" ? "Active" : "Inactive",
          }
        );

        await this.contractsService.update(contractUpdate);
        if (provider_operators[0].status !== "Active") {
          await this.providerOperatorService.update(providerOperatorUpdate);
        }
      }

      return { status: "success", data: save };
    } catch (error) {
      if (type == "api") {
        handleErrors(error)
      }
      return { status: "error", error: error.message };
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
  //commom function

  async getProposalTrackingByDetails(
    params: {
      id?: string;
      index?: string;
      senderId?: string;
      receiverId?: string;
      createdBy?: string;
      proposalId?: string;
    },
    type?: string
  ): Promise<{ status: string; data?: ProposalTrackingDto[]; error?: string }> {
    try {
      let saved = await this.repository.find({
        where: {
          id: params.id,
          index: params.index,
          senderId: params.senderId,
          proposalId: params.proposalId,
          receiverId: params.receiverId,
          createdBy: {
            id: params.createdBy,
          },
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

      const res = await this.getProposalTrackinsgasDto(saved);
      return { status: "success", data: res };
    } catch (error) {
      if (type == "api") {
        handleErrors(error);
      }
      return { status: "error", error: error.message };
    }
  }

  async getProposalTrackingById(id: string,type?:string): Promise<ProposalTrackingDto> {
    try {
      let saved = await this.repository.findOne({
        where: {
          id: id,
        },
        relations: {
          createdBy: true,
        },
      });
  
      if (saved==null && type == "api") {
        throw new HttpException(
          "No record found with the ID",
          HttpStatus.NOT_FOUND
        );
      }
  
      return this.getProposalTrackingasDto(saved);
    } catch (error) {
      if (type == "api") {
        handleErrors(error)
      }
    }
  }

  async getProposalTrackingasDto(
    item: ProposalTracking
  ): Promise<ProposalTrackingDto> {
    if (item == null) return null;
    let ret = Object.assign(new ProposalTrackingDto(), item);
    ret.createdBy = Object.assign(new UsersDto(), item.createdBy);

    if (item.index == "Provider") {
      ret.senderId = await this.getProvider(item.senderId);

      ret.proposalId = await this.getProviderProposal(item.proposalId);
      if (item.refIndex == "Internal") {
        ret.receiverId = await this.getOperator(item.receiverId);
      }
      if (item.refIndex == "Scraper") {
        ret.receiverId = await this.getExternalProviderOperator(
          item.receiverId
        );
      }
    }
    if (item.index == "Operator") {
      ret.senderId = await this.getOperator(item.senderId);
      ret.proposalId = await this.getOperatorProposal(item.proposalId);

      if (item.refIndex == "Internal") {
        ret.receiverId = await this.getProvider(item.receiverId);
      }
      if (item.refIndex == "Scraper") {
        ret.receiverId = await this.getExternalProviderOperator(
          item.receiverId
        );
      }
    }
    return ret;
  }

  async getProposalTrackinsgasDto(
    items: ProposalTracking[]
  ): Promise<Array<ProposalTrackingDto>> {
    if (items == null) return null;
    let ret = new Array<ProposalTrackingDto>();
    for (var i = 0; i < items.length; i++) {
      let ref = await this.getProposalTrackingasDto(items[i]);
      ret.push(ref);
    }
    return ret;
  }

  async getProposalTrackingasEntity(
    proposalTrackingDto: ProposalTrackingDto
  ): Promise<ProposalTracking> {
    if (proposalTrackingDto == null) return null;
    let proposal_tracking = Object.assign(
      new ProposalTracking(),
      proposalTrackingDto
    );
    proposal_tracking.createdBy = Object.assign(
      new Users(),
      proposalTrackingDto.createdBy
    );
    return proposal_tracking;
  }

  //check object is empty or not
  isObjectEmpty(obj: any): boolean {
    return Object.keys(obj).length === 0;
  }

  // get provider
  async getProvider(providerId: string): Promise<string> {
    const provider = await this.providersService.getProviderById(providerId);
    // const providerData = {
    //   id: provider.id,
    //   companyName: provider.companyName
    // }
    return JSON.stringify(provider);
  }
  //get operator
  async getOperator(operatorId: string): Promise<string> {
    const operator = await this.operatorsService.getOperator(operatorId);

    // const operatorData = {
    //   id: operator.id,
    //   companyName: operator.companyName
    // }
    return JSON.stringify(operator);
  }
  //get providerProposal
  async getProviderProposal(id: string): Promise<string> {
    let res = await this.providerProposalService.getProviderProposalById(id);
    return JSON.stringify(res);
  }
  //get operatorProposal
  async getOperatorProposal(id: string): Promise<string> {
    let res = await this.operatorProposalService.getOperatorProposalById(id);
    return JSON.stringify(res);
  }

  //get external provider operator
  async getExternalProviderOperator(id: string): Promise<string> {
    let res =
      await this.externalProviderOpeartorService.getExternalProviderOperatorById(
        id
      );
    return JSON.stringify(res);
  }
}
function capFL(name: any) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

// function truSt(str) {
//   const chunks = [];
  
//   for (let i = 0; i < str.length; i += 30) {
//     chunks.push(str?.substring(i, 30));
//   }

//   return chunks.join('\n');
// }

function truSt(str) {
  if (str.length > 30) {
    return str.substring(0, 30) + "...";
  }
  return str;
}
