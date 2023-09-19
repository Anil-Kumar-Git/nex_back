const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class ChangeDecimalEntity1688117235026 {
    name = 'ChangeDecimalEntity1688117235026'

    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`contracts\` DROP COLUMN \`revShareProvider\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`contracts\`
            ADD \`revShareProvider\` decimal(10, 2) NULL
        `);
      
        await queryRunner.query(`
            ALTER TABLE \`games\` DROP COLUMN \`defaultBet\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`games\`
            ADD \`defaultBet\` decimal(10, 2) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`games\` DROP COLUMN \`minimumBet\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`games\`
            ADD \`minimumBet\` decimal(10, 2) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`games\` DROP COLUMN \`maxBetSmallOperators\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`games\`
            ADD \`maxBetSmallOperators\` decimal(10, 2) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`games\` DROP COLUMN \`maxBetBigOperators\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`games\`
            ADD \`maxBetBigOperators\` decimal(10, 2) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`provider_proposal\` DROP COLUMN \`revShareProvider\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`provider_proposal\`
            ADD \`revShareProvider\` decimal(10, 2) NOT NULL
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`games\` DROP COLUMN \`maxBetBigOperators\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`games\`
            ADD \`maxBetBigOperators\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`games\` DROP COLUMN \`maxBetSmallOperators\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`games\`
            ADD \`maxBetSmallOperators\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`games\` DROP COLUMN \`minimumBet\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`games\`
            ADD \`minimumBet\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`games\` DROP COLUMN \`defaultBet\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`games\`
            ADD \`defaultBet\` int NULL
        `);       
        await queryRunner.query(`
            ALTER TABLE \`contracts\` DROP COLUMN \`revShareProvider\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`contracts\`
            ADD \`revShareProvider\` int NULL
        `);
    }
}
