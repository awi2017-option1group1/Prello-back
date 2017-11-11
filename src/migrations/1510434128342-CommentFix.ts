/* tslint:disable */
import {MigrationInterface, QueryRunner} from "typeorm";

export class CommentFix1510434128342 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."comment" DROP "createdDate"`);
        await queryRunner.query(`ALTER TABLE "public"."comment" ADD "createdDate" timestamp NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."comment" DROP "createdDate"`);
        await queryRunner.query(`ALTER TABLE "public"."comment" ADD "date" timestamp NOT NULL`);
    }

}
