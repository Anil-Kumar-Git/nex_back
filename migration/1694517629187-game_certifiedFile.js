const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class gameCertifiedFile1694517629187 {
    name = 'gameCertifiedFile1694517629187'

    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`games\` DROP COLUMN \`certifiedFile\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`games\`
            ADD \`certifiedFile\` longtext NOT NULL
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`games\` DROP COLUMN \`certifiedFile\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`games\`
            ADD \`certifiedFile\` varchar(255) NOT NULL
        `);
    }
}
