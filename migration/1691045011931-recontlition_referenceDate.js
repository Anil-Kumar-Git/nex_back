const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class recontlitionReferenceDate1691045011931 {
    name = 'recontlitionReferenceDate1691045011931'

    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`reconciliation\`
            ADD \`referenceDate\` varchar(255) NULL
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`reconciliation\` DROP COLUMN \`referenceDate\`
        `);
    }
}
