const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class gameThemeType1688034291984 {
    name = 'gameThemeType1688034291984'

    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`games\` DROP COLUMN \`gameTheme\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`games\`
            ADD \`gameTheme\` longtext NULL
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`games\` DROP COLUMN \`gameTheme\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`games\`
            ADD \`gameTheme\` text NULL
        `);
    }
}
