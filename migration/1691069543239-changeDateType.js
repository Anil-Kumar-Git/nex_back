const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class changeDateType1691069543239 {
    name = 'changeDateType1691069543239'

    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`reconciliation\` DROP COLUMN \`referenceDate\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`reconciliation\`
            ADD \`referenceDate\` timestamp NULL
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`reconciliation\` DROP COLUMN \`referenceDate\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`reconciliation\`
            ADD \`referenceDate\` varchar(255) NULL
        `);
    }
}
