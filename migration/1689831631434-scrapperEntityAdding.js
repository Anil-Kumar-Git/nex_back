const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class scrapperEntityAdding1689831631434 {
    name = 'scrapperEntityAdding1689831631434'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE \`scrapper_games\` (
                \`id\` varchar(36) NOT NULL,
                \`gameName\` varchar(255) NULL,
                \`gameDescShort\` varchar(255) NULL,
                \`gameDescLong\` varchar(1500) NULL,
                \`gameType\` varchar(255) NULL,
                \`brandedGame\` tinyint NOT NULL DEFAULT 0,
                \`gameStatus\` varchar(255) NULL,
                \`technology\` varchar(255) NULL,
                \`platforms\` varchar(255) NULL,
                \`volatility\` varchar(255) NULL,
                \`currencyCode\` varchar(255) NULL,
                \`defaultBet\` decimal(10, 2) NULL,
                \`minimumBet\` decimal(10, 2) NULL,
                \`maxBetSmallOperators\` decimal(10, 2) NOT NULL,
                \`maxBetBigOperators\` decimal(10, 2) NOT NULL,
                \`gameEmail\` varchar(255) NULL,
                \`demoLink\` varchar(255) NULL,
                \`deepLink\` varchar(255) NULL,
                \`backLink\` varchar(255) NULL,
                \`launchURLFormat\` varchar(255) NULL,
                \`transactionDataLink\` varchar(255) NULL,
                \`rtp\` int NULL,
                \`rtpsVariation\` varchar(255) NULL,
                \`maxMultiplier\` int NULL,
                \`hitRate\` int NULL,
                \`vsPayWays\` int NULL,
                \`vsHorizontal\` int NULL,
                \`vsVertical\` int NULL,
                \`licensedCountries\` varchar(255) NOT NULL,
                \`goLiveDate\` date NULL,
                \`expirationDate\` date NULL,
                \`autoDetectMobile\` tinyint NULL,
                \`marketingBonus\` tinyint NOT NULL DEFAULT 0,
                \`featureBonusRetriggered\` tinyint NULL,
                \`backToLobbyURL\` tinyint NULL,
                \`addDepositURL\` tinyint NULL,
                \`dynamicPromotion\` tinyint NULL,
                \`responsibleGaming\` tinyint NULL,
                \`miniGamesSupported\` tinyint NULL,
                \`logosOfGame\` longtext NULL,
                \`gameSpecialFeatures\` varchar(255) NULL,
                \`numberOfSymbolsTrigger\` int NULL,
                \`numberOfFreeSpinsAwarded\` int NULL,
                \`stackedExpandingWildsInGame\` tinyint NULL,
                \`numberOfJackpotTiers\` int NULL,
                \`autoPlayFunction\` tinyint NULL,
                \`gameTheme\` longtext NULL,
                \`createdBy\` varchar(255) NULL,
                \`provider\` varchar(255) NULL,
                \`createdDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(),
                \`modifiedDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            DROP TABLE \`scrapper_games\`
        `);
    }
}
