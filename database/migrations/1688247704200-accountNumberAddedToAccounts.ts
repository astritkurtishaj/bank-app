import { MigrationInterface, QueryRunner } from "typeorm";

export class AccountNumberAddedToAccounts1688247704200 implements MigrationInterface {
    name = 'AccountNumberAddedToAccounts1688247704200'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`accounts\` ADD \`accountNumber\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`accounts\` DROP COLUMN \`accountNumber\``);
    }

}
