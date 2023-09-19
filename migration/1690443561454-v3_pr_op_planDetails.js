const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class v3PrOpPlanDetails1690443561454 {
    name = 'v3PrOpPlanDetails1690443561454'

    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`operators\`
            ADD \`planDetails\` varchar(255) NOT NULL DEFAULT ''
        `);
        await queryRunner.query(`
            ALTER TABLE \`providers\`
            ADD \`planDetails\` varchar(255) NOT NULL DEFAULT ''
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`providers\` DROP COLUMN \`planDetails\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`operators\` DROP COLUMN \`planDetails\`
        `);
    }
}
