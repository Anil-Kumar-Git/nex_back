const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class CreateReconsilationOrEditScrapingEntity1689243755495 {
    name = 'CreateReconsilationOrEditScrapingEntity1689243755495'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE \`reconciliation\` (
                \`id\` varchar(36) NOT NULL,
                \`providerId\` varchar(255) NOT NULL,
                \`operatorId\` varchar(255) NOT NULL,
                \`index\` varchar(255) NOT NULL,
                \`refIndex\` varchar(255) NOT NULL,
                \`reconciliationFile\` varchar(255) NOT NULL,
                \`createdDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(),
                \`modifiedDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(),
                \`createdById\` varchar(36) NULL,
                INDEX \`providerId\` (\`providerId\`),
                INDEX \`operatorId\` (\`operatorId\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\`
            ADD \`CurrentQuarterRank\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\`
            ADD \`LastQuarterRank\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\`
            ADD \`Website\` varchar(255) NULL
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`reconciliation\` DROP FOREIGN KEY \`FK_001b5a878ed46d5f93513586877\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\` DROP COLUMN \`Website\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\` DROP COLUMN \`LastQuarterRank\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\` DROP COLUMN \`CurrentQuarterRank\`
        `);
        await queryRunner.query(`
            DROP INDEX \`operatorId\` ON \`reconciliation\`
        `);
        await queryRunner.query(`
            DROP INDEX \`providerId\` ON \`reconciliation\`
        `);
        await queryRunner.query(`
            DROP TABLE \`reconciliation\`
        `);
    }
}
