/* tslint:disable */
import {MigrationInterface, QueryRunner} from "typeorm";

export class User1510491133387 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "confirmationToken" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD CONSTRAINT "uk_user_username" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TABLE "public"."user" ALTER COLUMN "password" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`-- TODO: revert ALTER TABLE "public"."user" ALTER COLUMN "password" DROP NOT NULL`);
        await queryRunner.query(`-- TODO: revert ALTER TABLE "public"."user" ADD CONSTRAINT "uk_user_username" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP "confirmationToken"`);
    }

}
