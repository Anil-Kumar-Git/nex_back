import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsEmail,
  IsUrl,
  IsUUID,
  IsBoolean,
  IsDate,
  IsArray,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

import { ContractsDto } from '../contracts/contracts.dto';
import { ProvidersDto } from '../providers/providers.dto';
import { UsersDto } from '../users/users.dto';
import { GameThemesDto } from '../gameThemes/gameThemes.dto';

export class ScrapperGamesDto {
  @IsUUID()
  @ApiProperty({ example: '1234 ' , type :String , description:"enter game id if update if create a new game not required this colum" })
  id: string;

  @IsString()
  @ApiProperty({ example: 'test_game' , type :String  ,description:"enter game name"})
  gameName : string;

  @IsString()
  @ApiPropertyOptional({ example: 'its table game' , type :String ,description:"tell us about the game in short"})
  gameDescShort: string;

  @IsString()
  @ApiPropertyOptional({ example: 'it is two player table game ' , type :String ,description:"tell us about game in brief details" })
  gameDescLong: string;

  @IsString()
  @ApiProperty({ example: 'Table Game' ,type:String , description:"what is type of game" })
  gameType: string;

  @IsBoolean()
  @ApiPropertyOptional({ example: true ,type:Boolean ,description:"this game is branded or not!"})
  brandedGame: boolean

  @IsString()
//   @ApiPropertyOptional({
//     description: `game status  
//   Transmitted: The request has been sent, but no action has been taken yet. No additional confirmation is required.
// Accepted: The request has been received and accepted. An additional confirmation is required for both the operator and the provider.
// Queued: The request has been added to a queue for processing. An additional confirmation is required for both the operator and the provider.
// Live: The request has been processed and is now live. No additional confirmation is required.
// Rejected: The request has been rejected and will not be processed. An additional confirmation is required for both the operator and the provider.
// Disabled: The request has been disabled and will not be processed. An additional confirmation is required for both the operator and the provider.
// Re-Enabled: The request has been re-enabled after being disabled. An additional confirmation is required for both the operator and the provider.
// Deleted: The request has been deleted and will not be processed. No additional confirmation is required.
// Deprecated: The request is no longer supported and should not be used. No additional confirmation is required.`})
  gameStatus: string;

  @IsString()
  // @ApiPropertyOptional({ example: 'technology' })
  technology: string;

  @IsString()
  @ApiPropertyOptional({ example: 'Desktop' , type:String , description:"Enter platform for game" })
  platforms: string;

  @IsString()
  @ApiPropertyOptional({ example: 'Medium' ,description:"enter game volatilaty" ,type:String})
  volatility: string;

  @IsNumber()
  @ApiPropertyOptional({ example: '12' ,description:"enter default bet for game" ,type:Number})
  defaultBet: number;

  @IsNumber()
  @ApiPropertyOptional({ example: '1',description:"enter minimum bet for game",type:Number })
  minimumBet: number;

  @IsNumber()
  @ApiPropertyOptional({ example: '2' ,description:"enter maximum bet for small operator",type:Number})
  maxBetSmallOperators: number;

  @IsNumber()
  @ApiPropertyOptional({ example: '2' ,description:"enter maximum bet for big opertaor",type:Number})
  maxBetBigOperators: number;

  @IsEmail()
  @ApiProperty({
    example:
      'sandy@yopmail.com' ,description:"enter email for when any change in game we will notify you",type:String
  })
  gameEmail: string;

  @IsUrl()
  @ApiPropertyOptional({ example: 'http://newGame' ,description:"demo url for game",type:String})
  demoLink: string;

  @IsUrl()
  @ApiPropertyOptional({
    example:
      'http://newGame/deep',description:"deep link for game",type:String
  })
  deepLink: string;

  @IsUrl()
  @ApiPropertyOptional({
    example: 'http://newGame/backlink',type:String
  })
  backLink: string;

  @IsUrl()
  @ApiProperty({
    example: ["technology", "game id", "auth"],type :Array })
  launchURLFormat: string[];

  @IsUrl()
  @ApiProperty({ example: 'http://newGame/transtation',type:String })
  transactionDataLink: string;


  @IsNumber()
  @ApiProperty({ example: '12',type:Number })
  rtp: string;

  @IsNumber()
  @ApiProperty({ example: '11rtps',type:String })
  rtpsVariation: string;

  @IsNumber()
  @ApiPropertyOptional({ example: '2',type:Number })
  maxMultiplier: number;

  @IsNumber()
  @ApiPropertyOptional({ example: '12',type:Number})
  hitRate: number;

  @IsNumber()
  @ApiPropertyOptional({ example: '1',type:Number})
  vsPayWays: number;

  @IsNumber()
  @ApiPropertyOptional({ example: '2' ,type:Number})
  vsHorizontal: number;

  @IsNumber()
  @ApiPropertyOptional({example: '12' ,description: 'If Game Type= Video Slot: Slot Layout' ,type:Number })
  vsVertical: number;

  @IsArray()
  @ApiProperty({ description: 'licensed countries' ,example:["AU", "BR"] ,type:Array})
  certifiedCountries: string[];

  @IsDate()
  @ApiProperty({ description: 'go live date' ,example:"Wed May 24 2023 05:30:00 GMT+0530 (India Standard Time)",type:Date })
  goLiveDate : Date;

  @IsDate()
  @ApiPropertyOptional({
    description: 'Expiration Date for Seasonal Games or End of Live Date', example:"Wed May 24 2023 00:00:00 GMT+0530 (India Standard Time)" ,type:Date
  })
  expirationDate: Date;

  @IsBoolean()
  @ApiPropertyOptional({ description: 'Automated Detection for Mobile?' , example:false ,type:Boolean})
  autoDetectMobile: boolean;

  @IsBoolean()
  @ApiPropertyOptional({ description: 'Can feature/bonus be retriggered?' })
  featureBonusRetriggered: boolean;


  @IsBoolean()
  @ApiPropertyOptional({
    description:
      'Marketing Bonus For Players to be applied? (Will increase traffic)', example:false,type:Boolean
  })
  marketingBonus: boolean;

  @IsBoolean()
  @ApiPropertyOptional({
    description: 'Native BackToLobby URL Supported ingame?',example:false,type:Boolean
  })
  backToLobbyURL: boolean;

  @IsBoolean()
  @ApiPropertyOptional({
    description: 'Native AddDeposit URL Supported ingame?',example:false,type:Boolean
  })
  addDepositURL: boolean;

  @IsBoolean()
  @ApiPropertyOptional({
    description: 'Dynamic Promotion Support (free rounds etc)?', example:false,type:Boolean
  })
  dynamicPromotion: boolean;

  @IsBoolean()
  @ApiPropertyOptional({
    description: 'Responsible Gaming Compliant in relevant Jurisdictions?',example:false,type:Boolean
  })
  responsibleGaming: boolean;

  @IsBoolean()
  @ApiPropertyOptional({ description: 'Are Mini-Games Supported?' ,example:false,type:Boolean })
  miniGamesSupported: boolean;

  @IsString()
  @ApiPropertyOptional({ description: 'currencyCode' ,example:"GBP",type:String })
  currencyCode: string;

  //Game special features
  @IsString()
  @ApiPropertyOptional({ example: "awosome game", type: String, description: 'Game special features' })
  gameSpecialFeatures: string;

  @IsNumber()
  @ApiPropertyOptional({ example: "1", type: Number, description: 'Number of symbols to trigger feature/bonus' })
  numberOfSymbolsTrigger: number;

  @IsNumber()
  @ApiPropertyOptional({ example: "1", type: Number, description: 'Number of free spins awarded' })
  numberOfFreeSpinsAwarded: number;

  @IsBoolean()
  @ApiPropertyOptional({ example: false, type: Boolean, description: 'Stacked/ expanding wilds in game?' })
  stackedExpandingWildsInGame: boolean;

  @IsNumber()
  @ApiPropertyOptional({ example: "1", type: Number, description: 'Number of jackpot tiers' })
  numberOfJackpotTiers: number;

  @IsBoolean()
  @ApiPropertyOptional({ example: false, type: Boolean, description: 'Auto-play function?' })
  autoPlayFunction: boolean;
   

  // @Type(() => ContractsDto)
  // @ValidateNested()
  // @Transform(({ value }) =>
  //   value ? Object.assign(new ContractsDto(), value) : null,
  // )

  @IsString()
  @MaxLength(255000)
  @ApiProperty({ description: 'logo of the game , the data would be like this ss=[{ name:Thumbnail, url: ww.com.pmg },{ name: medium quality, url:  ww.com.pmg },{ name: banner, url:  ww.com.pmg },{ name: high quality, url:  ww.com.pmg }....{name:additional,url:ww.png}]', example:[] ,type:Array })
  logosOfGame:string;

  @IsString()
  @MaxLength(255000)
  @ApiProperty({ description: '[gameTheme,gameTheme}]' ,example:null ,type:Array })
  gameTheme: string[];

  // @ApiProperty({ description: 'createdBy' ,example:{
  //   "id": "f91681b3-1d47-43ae-a7c6-847cf378ad8a"
  // } ,type:UsersDto})
  // createdBy!: UsersDto;

  @IsString()
  @ApiPropertyOptional({ description: 'createdDate' ,example:"Wed May 24 2023 05:30:00 GMT+0530 (India Standard Time)",type:String})
  createdBy: any;

  @ApiProperty({ description: 'provider' ,example: {
    "id": "fce013d0-a9c1-4111-a220-d26d06cc0454"
  },type:String })
  provider : string;

  @IsString()
  @ApiPropertyOptional({ description: 'createdDate' ,example:"Wed May 24 2023 05:30:00 GMT+0530 (India Standard Time)",type:String})
  createdDate: string;
  
  @IsDate()
  @ApiPropertyOptional({ description: 'createdDate' })
  modifiedDate: string;
  
}
