const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class scrapperEntityRemoveDefault1689833133354 {
    name = 'scrapperEntityRemoveDefault1689833133354'

    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`scrapper_games\` CHANGE \`brandedGame\` \`brandedGame\` tinyint NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`scrapper_games\` CHANGE \`maxBetSmallOperators\` \`maxBetSmallOperators\` decimal(10, 2) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`scrapper_games\` CHANGE \`maxBetBigOperators\` \`maxBetBigOperators\` decimal(10, 2) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`scrapper_games\` CHANGE \`licensedCountries\` \`licensedCountries\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`scrapper_games\` CHANGE \`marketingBonus\` \`marketingBonus\` tinyint NULL
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`scrapper_games\` CHANGE \`marketingBonus\` \`marketingBonus\` tinyint NOT NULL DEFAULT 0
        `);
        await queryRunner.query(`
            ALTER TABLE \`scrapper_games\` CHANGE \`licensedCountries\` \`licensedCountries\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`scrapper_games\` CHANGE \`maxBetBigOperators\` \`maxBetBigOperators\` decimal(10, 2) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`scrapper_games\` CHANGE \`maxBetSmallOperators\` \`maxBetSmallOperators\` decimal(10, 2) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`scrapper_games\` CHANGE \`brandedGame\` \`brandedGame\` tinyint NOT NULL DEFAULT 0
        `);
    }
}
