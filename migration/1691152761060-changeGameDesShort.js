const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class changeGameDesShort1691152761060 {
    name = 'changeGameDesShort1691152761060'

    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`games\` DROP COLUMN \`gameDescShort\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`games\`
            ADD \`gameDescShort\` varchar(200) NULL
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`games\` DROP COLUMN \`gameDescShort\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`games\`
            ADD \`gameDescShort\` varchar(255) NULL
        `);
    }
}
