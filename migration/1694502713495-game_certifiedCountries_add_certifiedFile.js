const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class gameCertifiedCountriesAddCertifiedFile1694502713495 {
    name = 'gameCertifiedCountriesAddCertifiedFile1694502713495'

    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`scrapper_games\` CHANGE \`licensedCountries\` \`certifiedCountries\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`games\` DROP COLUMN \`licensedCountries\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`games\`
            ADD \`certifiedCountries\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`games\`
            ADD \`certifiedFile\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`scrapper_games\` DROP COLUMN \`certifiedCountries\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`scrapper_games\`
            ADD \`certifiedCountries\` varchar(255) NULL
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`scrapper_games\` DROP COLUMN \`certifiedCountries\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`scrapper_games\`
            ADD \`certifiedCountries\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`games\` DROP COLUMN \`certifiedFile\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`games\` DROP COLUMN \`certifiedCountries\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`games\`
            ADD \`licensedCountries\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`scrapper_games\` CHANGE \`certifiedCountries\` \`licensedCountries\` varchar(255) NULL
        `);
    }
}
