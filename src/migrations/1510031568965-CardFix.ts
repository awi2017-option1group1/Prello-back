/* tslint:disable */
import {MigrationInterface, QueryRunner} from "typeorm";

export class CardFix1510031568965 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."card" ALTER COLUMN "closed" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "public"."card" ALTER COLUMN "due" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."card" ALTER COLUMN "dueComplete" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`-- TODO: revert ALTER TABLE "public"."card" ALTER COLUMN "dueComplete" DROP NOT NULL`);
        await queryRunner.query(`-- TODO: revert ALTER TABLE "public"."card" ALTER COLUMN "due" DROP NOT NULL`);
        await queryRunner.query(`-- TODO: revert ALTER TABLE "public"."card" ALTER COLUMN "closed" SET DEFAULT false`);
    }

}
