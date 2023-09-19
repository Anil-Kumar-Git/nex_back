const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class providerServicePlan1693888592427 {
    name = 'providerServicePlan1693888592427'

    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`operators\` CHANGE \`servicePlan\` \`servicePlan\` enum (
                    'Free Startup Plan <3',
                    'Freemium',
                    'Premium Operator',
                    'Gold Operator'
                ) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`providers\` CHANGE \`servicePlan\` \`servicePlan\` enum (
                    'Free Startup Plan <3',
                    'Freemium',
                    'Premium Provider',
                    'Gold Provider'
                ) NOT NULL
        `);
    }

    async down(queryRunner) {
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
            ALTER TABLE \`operators\` CHANGE \`servicePlan\` \`servicePlan\` enum (
                    'Startup',
                    'Freemium',
                    'Free Startup Plan <3',
                    'Premium',
                    'Gold'
                ) NOT NULL
        `);
    }
}
