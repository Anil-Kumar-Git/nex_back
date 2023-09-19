const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class apikeyForuser1689576096033 {
    name = 'apikeyForuser1689576096033'

    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`users\`
            ADD \`apiKey\` varchar(255) NOT NULL
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`users\` DROP COLUMN \`apiKey\`
        `);
    }
}
