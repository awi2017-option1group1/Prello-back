/* tslint:disable */
import {MigrationInterface, QueryRunner} from "typeorm";

export class Card1510030935673 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "card_users" ("card" integer NOT NULL, "user" integer NOT NULL, PRIMARY KEY("card", "user"))`);
        await queryRunner.query(`ALTER TABLE "public"."card" DROP "title"`);
        await queryRunner.query(`ALTER TABLE "public"."card" DROP "description"`);
        await queryRunner.query(`ALTER TABLE "public"."card" DROP "dueDate"`);
        await queryRunner.query(`ALTER TABLE "public"."card" DROP "rank"`);
        await queryRunner.query(`ALTER TABLE "public"."card" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."card" ADD "closed" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."card" ADD "desc" text`);
        await queryRunner.query(`ALTER TABLE "public"."card" ADD "due" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."card" ADD "dueComplete" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."card" ADD "pos" integer NOT NULL`);
        await queryRunner.query(`CREATE INDEX "ind_725258f5cea3f040d590d8b456" ON "card_users"("card")`);
        await queryRunner.query(`CREATE INDEX "ind_921db1d52121ee8fd2bdbf1f29" ON "card_users"("user")`);
        await queryRunner.query(`ALTER TABLE "card_users" ADD CONSTRAINT "fk_759aef9d87b55106c56f64d01f4" FOREIGN KEY ("card") REFERENCES "card"("id")`);
        await queryRunner.query(`ALTER TABLE "card_users" ADD CONSTRAINT "fk_ac7e0c2db06d2300d481a3d87b0" FOREIGN KEY ("user") REFERENCES "user"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "card_users" DROP CONSTRAINT "fk_ac7e0c2db06d2300d481a3d87b0"`);
        await queryRunner.query(`ALTER TABLE "card_users" DROP CONSTRAINT "fk_759aef9d87b55106c56f64d01f4"`);
        await queryRunner.query(`-- TODO: revert CREATE INDEX "ind_921db1d52121ee8fd2bdbf1f29" ON "card_users"("user")`);
        await queryRunner.query(`-- TODO: revert CREATE INDEX "ind_725258f5cea3f040d590d8b456" ON "card_users"("card")`);
        await queryRunner.query(`ALTER TABLE "public"."card" DROP "pos"`);
        await queryRunner.query(`ALTER TABLE "public"."card" DROP "dueComplete"`);
        await queryRunner.query(`ALTER TABLE "public"."card" DROP "due"`);
        await queryRunner.query(`ALTER TABLE "public"."card" DROP "desc"`);
        await queryRunner.query(`ALTER TABLE "public"."card" DROP "closed"`);
        await queryRunner.query(`ALTER TABLE "public"."card" DROP "name"`);
        await queryRunner.query(`ALTER TABLE "public"."card" ADD "rank" integer(32) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."card" ADD "dueDate" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."card" ADD "description" text`);
        await queryRunner.query(`ALTER TABLE "public"."card" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "card_users"`);
    }

}
