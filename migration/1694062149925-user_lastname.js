const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class userLastname1694062149925 {
    name = 'userLastname1694062149925'

    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`lastname\` \`lastname\` varchar(255) NULL
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`lastname\` \`lastname\` varchar(255) NOT NULL
        `);
    }
}
