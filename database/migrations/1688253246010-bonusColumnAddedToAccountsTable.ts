import { MigrationInterface, QueryRunner } from "typeorm";

export class BonusColumnAddedToAccountsTable1688253246010 implements MigrationInterface {
    name = 'BonusColumnAddedToAccountsTable1688253246010'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`accounts\` ADD \`bonus\` int NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`accounts\` DROP COLUMN \`bonus\``);
    }

}
