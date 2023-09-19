const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class modifyacrapperdata1689751994400 {
    name = 'modifyacrapperdata1689751994400'

    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\` DROP COLUMN \`CurrentQuarterRank\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\` DROP COLUMN \`LastQuarterRank\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\` DROP COLUMN \`Website\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`operators\`
            ADD \`currentQuarterRank\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`operators\`
            ADD \`lastQuarterRank\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`operators\`
            ADD \`website\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`providers\`
            ADD \`currentQuarterRank\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`providers\`
            ADD \`lastQuarterRank\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`providers\`
            ADD \`website\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\`
            ADD \`currentQuarterRank\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\`
            ADD \`lastQuarterRank\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\`
            ADD \`website\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\`
            ADD \`ipRange\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\`
            ADD \`vatId\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\`
            ADD \`taxId\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\`
            ADD \`registrationNumber\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\`
            ADD \`address\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\`
            ADD \`city\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\`
            ADD \`state\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\`
            ADD \`zip\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\`
            ADD \`logo\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\` CHANGE \`companyEmail\` \`companyEmail\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\` CHANGE \`oldId\` \`oldId\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`reconciliation\`
            ADD CONSTRAINT \`FK_001b5a878ed46d5f93513586877\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`reconciliation\` DROP FOREIGN KEY \`FK_001b5a878ed46d5f93513586877\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\` CHANGE \`oldId\` \`oldId\` varchar(255) NOT NULL DEFAULT ''
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\` CHANGE \`companyEmail\` \`companyEmail\` varchar(255) NOT NULL DEFAULT ''
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\` DROP COLUMN \`logo\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\` DROP COLUMN \`zip\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\` DROP COLUMN \`state\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\` DROP COLUMN \`city\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\` DROP COLUMN \`address\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\` DROP COLUMN \`registrationNumber\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\` DROP COLUMN \`taxId\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\` DROP COLUMN \`vatId\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\` DROP COLUMN \`ipRange\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\` DROP COLUMN \`website\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\` DROP COLUMN \`lastQuarterRank\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\` DROP COLUMN \`currentQuarterRank\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`providers\` DROP COLUMN \`website\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`providers\` DROP COLUMN \`lastQuarterRank\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`providers\` DROP COLUMN \`currentQuarterRank\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`operators\` DROP COLUMN \`website\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`operators\` DROP COLUMN \`lastQuarterRank\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`operators\` DROP COLUMN \`currentQuarterRank\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\`
            ADD \`Website\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\`
            ADD \`LastQuarterRank\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\`
            ADD \`CurrentQuarterRank\` int NULL
        `);
    }
}
