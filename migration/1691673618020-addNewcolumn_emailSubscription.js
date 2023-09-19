const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class addNewcolumnEmailSubscription1691673618020 {
    name = 'addNewcolumnEmailSubscription1691673618020'

    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`operators\`
            ADD \`emailSubscription\` tinyint NOT NULL DEFAULT 1
        `);
        await queryRunner.query(`
            ALTER TABLE \`providers\`
            ADD \`emailSubscription\` tinyint NOT NULL DEFAULT 1
        `);
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\`
            ADD \`emailSubscription\` tinyint NOT NULL DEFAULT 1
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`external_provider_opeartors\` DROP COLUMN \`emailSubscription\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`providers\` DROP COLUMN \`emailSubscription\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`operators\` DROP COLUMN \`emailSubscription\`
        `);
    }
}
