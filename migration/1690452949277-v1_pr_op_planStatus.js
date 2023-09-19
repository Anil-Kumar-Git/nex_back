const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class v1PrOpPlanStatus1690452949277 {
    name = 'v1PrOpPlanStatus1690452949277'

    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`operators\`
            ADD \`planStatus\` varchar(255) NOT NULL DEFAULT ''
        `);
        await queryRunner.query(`
            ALTER TABLE \`providers\`
            ADD \`planStatus\` varchar(255) NOT NULL DEFAULT ''
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`providers\` DROP COLUMN \`planStatus\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`operators\` DROP COLUMN \`planStatus\`
        `);
    }
}
