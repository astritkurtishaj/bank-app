import { MigrationInterface, QueryRunner } from "typeorm";

export class TransactionsTableCreatedAndRelationshipWithAccountsIsSet1688247240620 implements MigrationInterface {
    name = 'TransactionsTableCreatedAndRelationshipWithAccountsIsSet1688247240620'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`transactions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` varchar(255) NOT NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`accountId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`transactions\` ADD CONSTRAINT \`FK_26d8aec71ae9efbe468043cd2b9\` FOREIGN KEY (\`accountId\`) REFERENCES \`accounts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transactions\` DROP FOREIGN KEY \`FK_26d8aec71ae9efbe468043cd2b9\``);
        await queryRunner.query(`DROP TABLE \`transactions\``);
    }

}
