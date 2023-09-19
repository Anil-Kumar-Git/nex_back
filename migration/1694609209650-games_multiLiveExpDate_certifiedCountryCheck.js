const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class gamesMultiLiveExpDateCertifiedCountryCheck1694609209650 {
    name = 'gamesMultiLiveExpDateCertifiedCountryCheck1694609209650'

    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`games\`
            ADD \`certifiedCountryCheck\` tinyint NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`games\`
            ADD \`multiLiveExpDate\` longtext NULL
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`games\` DROP COLUMN \`multiLiveExpDate\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`games\` DROP COLUMN \`certifiedCountryCheck\`
        `);
    }
}
