import { DataSourceOptions, DataSource } from "typeorm";
import { ConfigService } from "../../config/config.service";
import { Operators } from "./../../../operators/operators.entity";
import { Users } from "./../../../users/users.entity";
import { Contracts } from "./../../../contracts/contracts.entity";
import { Games } from "./../../../games/games.entity";
import { Providers } from "./../../../providers/providers.entity";
import { externalProviderOpeartors } from "../../../externalProviderOperator/externalProviderOperator.entity";
import { OperatorProposal } from "../../../operatorProposal/operatorProposal.entity";
import { ProviderProposal } from "@app/shared/providerProposal/providerProposal.entity";
import { ProviderOperator } from "@app/shared/provider-operator/provider-operator.entity";
import { ProposalTracking } from "@app/shared/proposalTracking/proposal_tracking.entity";
import { GameThemes } from "@app/shared/gameThemes/gameThemes.entity";
import { UserProviderOperator } from "@app/shared/user-provider-operator/user-provider-operator.entity";
import { GameTracking } from "@app/shared/gameTracking/game_tracking.entity";
import { Notification } from "@app/shared/notification/notification.entity";
import { Reconciliation } from "@app/shared/reconciliation/reconciliation.entity";
import { ScrapperGames } from "@app/shared/scrapperGames/scrapper_games.entity";

const configService = new ConfigService();

export const TypeOrmConfig: DataSourceOptions = {
  type: "mariadb",
  host: configService.get("DB_SERVER_HOST"),
  port: Number(configService.get("DB_SERVER_PORT")),
  username: configService.get("DB_SERVER_USERNAME"),
  password: configService.get("DB_SERVER_PASSWORD"),
  database: configService.get("DATABASE"),
  entities: [
    Operators,
    Games,
    Providers,
    externalProviderOpeartors,
    OperatorProposal,
    ProviderProposal,
    ProviderOperator,
    ProposalTracking,
    Users,
    Contracts,
    GameThemes,
    UserProviderOperator,
    GameTracking,
    Notification,
    Reconciliation,
    ScrapperGames
  ],
  migrations: ['migration/*.js'],
  // ! ALWAYS FALSE IN PROD
  synchronize: false,
  //logging: ["query", "error"],
  logging: ["error"],
};

export default new DataSource(TypeOrmConfig);
