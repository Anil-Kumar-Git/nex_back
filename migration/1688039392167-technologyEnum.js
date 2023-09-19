const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class technologyEnum1688039392167 {
    name = 'technologyEnum1688039392167'

    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`games\` CHANGE \`technology\` \`technology\` enum ('HTML5', 'Flash', 'Javascript/WebGL') NULL
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`games\` CHANGE \`technology\` \`technology\` enum ('HTML5', 'Flash', 'YY') NULL
        `);
    }
}
