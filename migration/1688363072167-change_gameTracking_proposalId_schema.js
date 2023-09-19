const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class ChangeGameTrackingProposalIdSchema1688363072167 {
    name = 'ChangeGameTrackingProposalIdSchema1688363072167'

    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`game_tracking\` DROP FOREIGN KEY \`FK_cbd0636f7c00ea229db2e6391d0\`
        `);
        await queryRunner.query(`
            DROP INDEX \`ProviderProposal\` ON \`game_tracking\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`game_tracking\` CHANGE \`proposalIdId\` \`proposalId\` varchar(36) NOT NULL
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`game_tracking\` CHANGE \`proposalId\` \`proposalIdId\` varchar(36) NOT NULL
        `);
        await queryRunner.query(`
            CREATE INDEX \`ProviderProposal\` ON \`game_tracking\` (\`proposalIdId\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`game_tracking\`
            ADD CONSTRAINT \`FK_cbd0636f7c00ea229db2e6391d0\` FOREIGN KEY (\`proposalIdId\`) REFERENCES \`provider_proposal\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }
}
