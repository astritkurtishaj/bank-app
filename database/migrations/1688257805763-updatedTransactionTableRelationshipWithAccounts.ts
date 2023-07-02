import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedTransactionTableRelationshipWithAccounts1688257805763 implements MigrationInterface {
    name = 'UpdatedTransactionTableRelationshipWithAccounts1688257805763'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transactions\` DROP FOREIGN KEY \`FK_26d8aec71ae9efbe468043cd2b9\``);
        await queryRunner.query(`ALTER TABLE \`transactions\` ADD CONSTRAINT \`FK_26d8aec71ae9efbe468043cd2b9\` FOREIGN KEY (\`accountId\`) REFERENCES \`accounts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transactions\` DROP FOREIGN KEY \`FK_26d8aec71ae9efbe468043cd2b9\``);
        await queryRunner.query(`ALTER TABLE \`transactions\` ADD CONSTRAINT \`FK_26d8aec71ae9efbe468043cd2b9\` FOREIGN KEY (\`accountId\`) REFERENCES \`accounts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
