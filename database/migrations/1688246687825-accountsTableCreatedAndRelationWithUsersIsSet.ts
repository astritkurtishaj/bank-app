import { MigrationInterface, QueryRunner } from "typeorm";

export class AccountsTableCreatedAndRelationWithUsersIsSet1688246687825 implements MigrationInterface {
    name = 'AccountsTableCreatedAndRelationWithUsersIsSet1688246687825'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`accounts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`balance\` int NOT NULL DEFAULT '0', \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` int NULL, UNIQUE INDEX \`REL_3aa23c0a6d107393e8b40e3e2a\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`accounts\` ADD CONSTRAINT \`FK_3aa23c0a6d107393e8b40e3e2a6\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`accounts\` DROP FOREIGN KEY \`FK_3aa23c0a6d107393e8b40e3e2a6\``);
        await queryRunner.query(`DROP INDEX \`REL_3aa23c0a6d107393e8b40e3e2a\` ON \`accounts\``);
        await queryRunner.query(`DROP TABLE \`accounts\``);
    }

}
