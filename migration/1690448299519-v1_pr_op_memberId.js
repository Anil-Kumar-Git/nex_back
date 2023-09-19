const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class v1PrOpMemberId1690448299519 {
    name = 'v1PrOpMemberId1690448299519'

    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`operators\`
            ADD \`memberId\` varchar(255) NOT NULL DEFAULT ''
        `);
        await queryRunner.query(`
            ALTER TABLE \`providers\`
            ADD \`memberId\` varchar(255) NOT NULL DEFAULT ''
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`providers\` DROP COLUMN \`memberId\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`operators\` DROP COLUMN \`memberId\`
        `);
    }
}
