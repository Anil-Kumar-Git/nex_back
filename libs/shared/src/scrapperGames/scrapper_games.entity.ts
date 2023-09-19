import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  Generated,
  CreateDateColumn,
  Unique,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Contracts } from '../contracts/contracts.entity';
import { type } from 'os';
import { Providers } from '../providers/providers.entity';
import { Users } from '../users/users.entity';
import { GameThemes } from '../gameThemes/gameThemes.entity';




// enum Technology {
//   HTML5 = "HTML5",
//   Flash = "Flash",
//   JW = "Javascript/WebGL"
// }
// enum Platforms {
//   Mobile = "Mobile",
//   Desktop = "Desktop",
//   NativeApp = "Native App",
//   Download = "Download"
// }

// enum Volatility {
//   Low = "Low",
//   Medium = "Medium",
//   High = "High"
// }
// enum GameStatus {
//   Draft = "Draft",
//   Transmitted = "Transmitted",
//   Published = "Published",
//   Accepted = "Accepted",
//   Queued = "Queued",
//   Live = "Live",
//   Rejected = "Rejected",
//   Disabled = "Disabled",
//   ReEnabled = "Re-Enabled",
//   Deleted = "Deleted",
//   Deprecated = "Deprecated"
// }

@Entity()
// @Unique(["gameName", "providerId"])
export class ScrapperGames {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  gameName: string;

  //Game Description (short)
  @Column({ nullable: true })
  gameDescShort: string;

  //Game Description (long)
  @Column({ type: 'varchar', length: 1500, nullable: true })
  gameDescLong: string;

  @Column({ nullable: true })
  gameType: string;

  @Column({nullable: true })//optional
  brandedGame: boolean;

  @Column({ nullable: true })
  gameStatus: string;

  @Column({ nullable: true })
  technology: string;

  @Column({ nullable: true })
  platforms: string;

  @Column({ nullable: true })
  volatility: string;

  // @Column({
  //   type: 'enum',
  //   enum: GameStatus,
  //   default: GameStatus.Draft
  // })
  // gameStatus: GameStatus;

  // @Column({
  //   type: 'enum',
  //   enum: Technology,
  //   nullable: true
  // })
  // technology: Technology;

  // @Column({
  //   type: 'enum',
  //   enum: Platforms,
  //   nullable: true
  // })
  // platforms: Platforms;

  // @Column({
  //   type: 'enum',
  //   enum: Volatility,
  //   nullable: true
  // })
  // volatility: Volatility;

  @Column({ nullable: true })
  currencyCode: string

  @Column({ nullable: true,type: 'decimal', precision: 10, scale: 2 })
  defaultBet: number;

  @Column({ nullable: true,type: 'decimal', precision: 10, scale: 2 })
  minimumBet: number;

  //Maximum for Bet Small Operators
  @Column({type: 'decimal', precision: 10, scale: 2 ,nullable: true})
  maxBetSmallOperators: number;

  //Maximum Bet for Big Operators
  @Column({type: 'decimal', precision: 10, scale: 2 ,nullable: true})
  maxBetBigOperators: number;

  //Email Address for Notifications, Monthly Reportings and GAME STATUS changes
  @Column({ nullable: true })
  @IsEmail({}, { message: 'Incorrect email' })
  @IsNotEmpty({ message: 'The email is required' })
  gameEmail: string;

  //Demo Link To Game
  @Column({ nullable: true })
  demoLink: string;

  //Deep Link to Game Marketing Kit (append Username/ PW if required)
  @Column({ nullable: true })
  deepLink: string;

  //GET: Backlink for Reconciliation and Status Changes*****
  @Column({ nullable: true })
  backLink: string;

  //Launch URL Format
  @Column({ nullable: true })
  launchURLFormat: string;

  //POST: Transaction Data Link****
  @Column({ nullable: true })
  transactionDataLink: string;

  //# of RTP (Return To Player) Variations
  @Column({ nullable: true })
  rtp: number;

  //RTPs per Variation
  @Column({ nullable: true })
  rtpsVariation: string;//this can be mulitple if rtp more than one ,you can write like that 1,2,3,4

  @Column({ nullable: true })
  maxMultiplier: number;

  @Column({ nullable: true })
  hitRate: number;

  //If Game Type= Video Slot: Pay Ways
  @Column({ nullable: true })
  vsPayWays: number;

  //If Game Type= Video Slot: Slot Layout
  @Column({ nullable: true })
  vsHorizontal: number;

  //If Game Type= Video Slot: Slot Layout
  @Column({ nullable: true })
  vsVertical: number;

  @Column({nullable: true}) //@Column("text", { array: true, nullable: true })
  certifiedCountries: string; //string[];

  @Column({ type: 'date', nullable: true })
  goLiveDate: Date;

  //Expiration Date for Seasonal Games or End of Live Date
  @Column({ type: 'date', nullable: true })
  expirationDate: Date;

  //Automated Detection for Mobile?
  @Column({ nullable: true })
  autoDetectMobile: boolean;

  //Marketing Bonus For Players to be applied? (Will increase traffic)
  @Column({nullable: true })
  marketingBonus: boolean;


  //Can feature/bonus be retriggered?
  @Column({ nullable: true })
  featureBonusRetriggered: boolean;

  //Native BackToLobby URL Supported ingame?
  @Column({ nullable: true })
  backToLobbyURL: boolean;

  //Native AddDeposit URL Supported ingame?
  @Column({ nullable: true })
  addDepositURL: boolean;

  //Dynamic Promotion Support (free rounds etc)?
  @Column({ nullable: true })
  dynamicPromotion: boolean;

  //Responsible Gaming Compliant in relevant Jurisdictions?
  @Column({ nullable: true })
  responsibleGaming: boolean;

  //Are Mini-Games Supported?
  @Column({ nullable: true })
  miniGamesSupported: boolean;

  @Column({ type:'longtext', nullable: true }) //("logo", [{ name: Thumbnail, url: ww.com.pmg },{ name: medium quality, url:  ww.com.pmg },{ name: banner, url:  ww.com.pmg },{ name: high quality, url:  ww.com.pmg }....{name:additional,url:ww.png}])
  logosOfGame: string;

  //Game special features
  @Column({ nullable: true })
  gameSpecialFeatures: string;

  //Number of symbols to trigger feature/bonus
  @Column({ nullable: true })
  numberOfSymbolsTrigger: number;

  //Number of free spins awarded
  @Column({ nullable: true })
  numberOfFreeSpinsAwarded: number;

  //Stacked/ expanding wilds in game?
  @Column({ nullable: true })
  stackedExpandingWildsInGame: boolean;

  //Number of jackpot tiers:
  @Column({ nullable: true })
  numberOfJackpotTiers: number;

  //Auto-play function?
  @Column({ nullable: true })
  autoPlayFunction: boolean;


  @Column({ type:'longtext' ,nullable: true })
  gameTheme: string; //string[{id:"",gameTheme:""}];

  @Column({ nullable: true })
  createdBy: string;
  
  @Column({ nullable: true })
  provider: string;

  // @ManyToOne(type => Users, { nullable: true })
  // @JoinColumn()
  // @Index("User")
  // createdBy: Users

  // @ManyToOne(type => Providers, { nullable: true })
  // @JoinColumn()
  // @Index("Provider")
  // providerId: Providers

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  modifiedDate: Date;
}
