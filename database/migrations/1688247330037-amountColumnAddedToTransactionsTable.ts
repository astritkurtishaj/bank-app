import { MigrationInterface, QueryRunner } from "typeorm";

export class AmountColumnAddedToTransactionsTable1688247330037 implements MigrationInterface {
    name = 'AmountColumnAddedToTransactionsTable1688247330037'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transactions\` ADD \`amount\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transactions\` DROP COLUMN \`amount\``);
    }

}
