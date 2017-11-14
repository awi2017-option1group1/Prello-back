/* tslint:disable */
import {MigrationInterface, QueryRunner} from "typeorm";

export class userResetToken1510669800125 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "resetToken" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "resetTimeStamp" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."user" DROP "resetTimeStamp"`);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP "resetToken"`);
    }

}
