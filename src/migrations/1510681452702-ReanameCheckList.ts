/* tslint:disable */
import {MigrationInterface, QueryRunner} from "typeorm";

export class ReanameCheckList1510681452702 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "check_item" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "pos" integer NOT NULL, "state" boolean NOT NULL, "checkListId" integer, PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "check_list" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "pos" integer NOT NULL, "cardId" integer, PRIMARY KEY("id"))`);
        await queryRunner.query(`ALTER TABLE "check_item" ADD CONSTRAINT "fk_c9ad7e50fca49e5a6e3f4ca5340" FOREIGN KEY ("checkListId") REFERENCES "check_list"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "check_list" ADD CONSTRAINT "fk_b9e5e579a6b187657ca41f1c046" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "check_list" DROP CONSTRAINT "fk_b9e5e579a6b187657ca41f1c046"`);
        await queryRunner.query(`ALTER TABLE "check_item" DROP CONSTRAINT "fk_c9ad7e50fca49e5a6e3f4ca5340"`);
        await queryRunner.query(`DROP TABLE "check_list"`);
        await queryRunner.query(`DROP TABLE "check_item"`);
    }

}
