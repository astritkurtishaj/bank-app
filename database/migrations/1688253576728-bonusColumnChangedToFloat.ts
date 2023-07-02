import { MigrationInterface, QueryRunner } from "typeorm";

export class BonusColumnChangedToFloat1688253576728 implements MigrationInterface {
    name = 'BonusColumnChangedToFloat1688253576728'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`accounts\` DROP COLUMN \`bonus\``);
        await queryRunner.query(`ALTER TABLE \`accounts\` ADD \`bonus\` float NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`accounts\` DROP COLUMN \`bonus\``);
        await queryRunner.query(`ALTER TABLE \`accounts\` ADD \`bonus\` int NOT NULL DEFAULT '0'`);
    }

}
