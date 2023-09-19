const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class addPlan1689334399270 {
    name = 'addPlan1689334399270'

    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`operators\` CHANGE \`servicePlan\` \`servicePlan\` enum (
                    'Startup',
                    'Freemium',
                    'Free Startup Plan <3',
                    'Premium',
                    'Gold'
                ) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`providers\` CHANGE \`servicePlan\` \`servicePlan\` enum (
                    'Startup',
                    'Freemium',
                    'Free Startup Plan <3',
                    'Premium',
                    'Gold'
                ) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`game_tracking\` DROP COLUMN \`proposalId\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`game_tracking\`
            ADD \`proposalId\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            CREATE INDEX \`proposalId\` ON \`game_tracking\` (\`proposalId\`)
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            DROP INDEX \`proposalId\` ON \`game_tracking\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`game_tracking\` DROP COLUMN \`proposalId\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`game_tracking\`
            ADD \`proposalId\` varchar(36) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`providers\` CHANGE \`servicePlan\` \`servicePlan\` enum ('Startup', 'Freemium', 'Premium', 'Gold') NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`operators\` CHANGE \`servicePlan\` \`servicePlan\` enum ('Startup', 'Freemium', 'Premium', 'Gold') NOT NULL
        `);
    }
}
