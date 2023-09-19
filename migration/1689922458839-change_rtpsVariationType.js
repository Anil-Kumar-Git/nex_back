const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class changeRtpsVariationType1689922458839 {
    name = 'changeRtpsVariationType1689922458839'

    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`games\` DROP COLUMN \`rtpsVariation\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`games\`
            ADD \`rtpsVariation\` longtext NOT NULL
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`games\` DROP COLUMN \`rtpsVariation\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`games\`
            ADD \`rtpsVariation\` varchar(255) NOT NULL
        `);
    }
}
