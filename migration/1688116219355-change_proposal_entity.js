const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class ChangeProposalEntity1688116219355 {
    name = 'ChangeProposalEntity1688116219355'

    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`operator_proposal\` DROP COLUMN \`revShareProvider\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`operator_proposal\`
            ADD \`revShareProvider\` decimal(10, 2) NULL
        `);
       
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`operator_proposal\` DROP COLUMN \`revShareProvider\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`operator_proposal\`
            ADD \`revShareProvider\` int NOT NULL
        `);
        
      
    }
}
