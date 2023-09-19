import { contractStatus } from '@app/shared/contracts/contracts.entity';
import { Platforms, Technology, Volatility } from '@app/shared/games/games.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiProperty({ description: 'error code' })
  statusCode: number;

  @ApiProperty({ description: 'error description' })
  message: string;
}

export enum Role {
  PROVIDER = 'Provider',
  OPERATOR = 'Operator',
}

// export enum BooleanEnum {
//   FALSE = 'false',
//   TRUE = 'true',
// }

export class ContractDtoDefault {
  @ApiProperty({ example: '1234',type:String  })
  id: string;
  // @ApiProperty({ example: "fce013d0-a9c1-4111-a220-d26d06cc0454", type:String})
  // providerId: string;
  @ApiProperty({example: false ,type:Boolean})
  default: Boolean;
}

export class OperatorDefaultDto {
  @ApiProperty({ example: '1234',type:String  })
  id: string;
  @ApiProperty({ example: "fce013d0-a9c1-4111-a220-d26d06cc0454", type:String})
  operatorId: string;
  @ApiProperty({example: false ,type:Boolean})
  default: Boolean;
}

export class updateEmailSubscription {
  // @ApiProperty({ example: '1234',type:String  })
  id: string;
  apiType:string;
  emailSubscription: boolean;
}

// update contractStatus

export class ContractDtoStatus {
  @ApiProperty({ example: '1234',type:String  })
  id: string;
  @ApiProperty({type: "enum",
  enum: contractStatus,
  default: contractStatus.DRAFT})
  status: contractStatus;
}
export class ContactUsDto {
  @ApiProperty({ example: 'sender@gmail.com',type:String  })
  senderEmail: string;
  @ApiProperty({ example: '',type:String  })
  message: string;
  @ApiProperty({ example: 'sender',type:String  })
  firstName: string;
  @ApiProperty({ example: '',type:String  })
  lastName: string;
  @ApiProperty({ example: '',type:String  })
  companyName: string;
  @ApiProperty({type: String, example:""})
  businessType: String;
}

export class CertifiedFileDto {
  @ApiProperty({ description: 'Country code', example: 'AF' })
  country: string;

  @ApiProperty({ description: 'Date', example: '2023-09-19' })
  date: string;

  @ApiProperty({ description: 'File URL', example: 'https://example.com/file.pdf' })
  file: string;

  @ApiProperty({ description: 'File type', example: 'link' })
  type: string;
}


export class apiUpdateGamesDto {
  @ApiProperty({ example: 'd6b72fde-8c67-42ca-a776-88bc85131233' , type :String , description:"enter game id if update if create a new game not required this colum" })
  id!: string;
  @ApiProperty({ example: 'test_game' , type :String  ,description:"enter game name"})
  gameName!: string;
  @ApiPropertyOptional({ example: 'its table game' , type :String ,description:"tell us about the game in short"})
  gameDescShort: string;
  @ApiPropertyOptional({ example: 'it is two player table game ' , type :String ,description:"tell us about game in brief details" })
  gameDescLong: string;
  @ApiProperty({ example: 'Table Game' ,type:String , description:"what is type of game" })
  gameType!: string;
  @ApiPropertyOptional({ example: true ,type:Boolean ,description:"this game is branded or not!"})
  brandedGame: boolean
  @ApiPropertyOptional({ example: Technology.Flash , type : "enum" ,enum:Technology })
  technology: Technology;
  @ApiPropertyOptional({ example: Platforms.Desktop , type : "enum" ,enum:Platforms })
  platforms: Platforms;
  @ApiPropertyOptional({ example: Volatility.Medium , type : "enum" ,enum:Volatility})
  volatility: Volatility;
  @ApiPropertyOptional({ example: 12 ,description:"enter default bet for game" ,type:Number})
  defaultBet: number;
  @ApiPropertyOptional({ example: 1,description:"enter minimum bet for game",type:Number })
  minimumBet: number;
  @ApiPropertyOptional({ example: 2 ,description:"enter maximum bet for small operator",type:Number})
  maxBetSmallOperators: number;
  @ApiPropertyOptional({ example: 2 ,description:"enter maximum bet for big opertaor",type:Number})
  maxBetBigOperators: number;
  @ApiProperty({
    example:
      'sandy@yopmail.com' ,description:"enter email for when any change in game we will notify you",type:String
  })
  gameEmail!: string;
  @ApiPropertyOptional({ example: 'http://newGame' ,description:"demo url for game",type:String})
  demoLink: string;
  @ApiPropertyOptional({
    example:
      'http://newGame/deep',description:"deep link for game",type:String
  })
  deepLink: string;
  @ApiPropertyOptional({
    example: 'http://newGame/backlink',type:String
  })
  backLink: string;
  @ApiProperty({
    example: ["technology", "game id", "auth"],type :Array })
  launchURLFormat!: string[];
  @ApiProperty({ example: 'http://newGame/transtation',type:String })
  transactionDataLink!: string;
  @ApiProperty({ example: 3,type:Number })
  rtp!: number;
  @ApiProperty({ example:[ '11','55.5','22.7'],type:String })
  rtpsVariation: string[];
  @ApiPropertyOptional({ example: 2,type:Number })
  maxMultiplier: number;
  @ApiPropertyOptional({ example: 12,type:Number})
  hitRate: number;
  @ApiPropertyOptional({ example: 1,type:Number})
  vsPayWays: number;
  @ApiPropertyOptional({ example: 2 ,type:Number})
  vsHorizontal: number;
  @ApiPropertyOptional({example: 12 ,description: 'If Game Type= Video Slot: Slot Layout' ,type:Number })
  vsVertical: number;
  @ApiProperty({ description: ' certified countries' ,example:["AU", "BR"] ,type:Array})
  certifiedCountries!: string[];
  @ApiProperty({ description: ' certified files for countries' , example: [{ country: 'AF', date: '2023-09-19T18:30:00.000Z', file: 'https://example.com/file.pdf', type: 'link' }] ,type:"enum",enum:CertifiedFileDto})
  certifiedFile!: string[];
  @ApiPropertyOptional({ description: 'Can feature/bonus be retriggered?' })
  certifiedCountryCheck: boolean;
  @ApiProperty({ description: ' certified Live date for countries' , example: [{ goLiveDate1: '2023-09-19'}, {expirationDate: '2023-09-19'}] ,type:"enum",enum:String})
  multiLiveExpDate!: string[];
  
  @ApiProperty({ description: 'go live date' ,example:"Wed May 24 2023",type:Date })
  goLiveDate!: Date;
  @ApiPropertyOptional({
    description: 'Expiration Date for Seasonal Games or End of Live Date', example:"Wed May 24 2023" ,type:Date
  })
  expirationDate: Date;
  @ApiPropertyOptional({ description: 'Automated Detection for Mobile?' , example:false ,type:Boolean})
  autoDetectMobile: boolean;
  @ApiPropertyOptional({ description: 'Can feature/bonus be retriggered?' })
  featureBonusRetriggered: boolean;
  @ApiPropertyOptional({
    description:
      'Marketing Bonus For Players to be applied? (Will increase traffic)', example:false,type:Boolean
  })
  marketingBonus: boolean;
  @ApiPropertyOptional({
    description: 'Native BackToLobby URL Supported ingame?',example:false,type:Boolean
  })
  backToLobbyURL: boolean;
  @ApiPropertyOptional({
    description: 'Native AddDeposit URL Supported ingame?',example:false,type:Boolean
  })
  addDepositURL: boolean;
  @ApiPropertyOptional({
    description: 'Dynamic Promotion Support (free rounds etc)?', example:false,type:Boolean
  })
  dynamicPromotion: boolean;
  @ApiPropertyOptional({
    description: 'Responsible Gaming Compliant in relevant Jurisdictions?',example:false,type:Boolean
  })
  responsibleGaming: boolean;
  @ApiPropertyOptional({ description: 'Are Mini-Games Supported?' ,example:false,type:Boolean })
  miniGamesSupported: boolean;
  // @ApiPropertyOptional({ description: 'currencyCode' ,example:"GBP",type:String })
  currencyCode: string;
  @ApiPropertyOptional({ example: "awosome game", type: String, description: 'Game special features' })
  gameSpecialFeatures: string;
  @ApiPropertyOptional({ example: 1, type: Number, description: 'Number of symbols to trigger feature/bonus' })
  numberOfSymbolsTrigger: number;
  @ApiPropertyOptional({ example: 1, type: Number, description: 'Number of free spins awarded' })
  numberOfFreeSpinsAwarded: number;
  @ApiPropertyOptional({ example: false, type: Boolean, description: 'Stacked/ expanding wilds in game?' })
  stackedExpandingWildsInGame: boolean;
  @ApiPropertyOptional({ example: 1, type: Number, description: 'Number of jackpot tiers' })
  numberOfJackpotTiers: number;
  @ApiPropertyOptional({ example: false, type: Boolean, description: 'Auto-play function?' })
  autoPlayFunction: boolean;
  @ApiProperty({ description: 'gameTheme' ,example:["Texas","Entertainment"] ,type:Array })
  gameTheme: string[];
}

export enum userRole {
  PROVIDER = "Provider",
  SUB_PROVIDER = "Sub Provider",
  SUB_OPERATOR = "Sub Operator",
  OPERATOR = "Operator",
  ADMIN = "Admin"
}

export enum userType {
  TECHNICAL_UER = "Technical User",
  COMMERCIAL_USER = "Commercial User"
}

export enum userFrom {
  INTERNAL = "Internal",
  EXTERNAL = "Scraper"
}
 