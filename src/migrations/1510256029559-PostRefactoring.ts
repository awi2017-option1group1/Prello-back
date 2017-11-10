/* tslint:disable */import { MigrationInterface, QueryRunner } from "typeorm";

export class PostRefactoring1510256029559 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."comment" DROP "date"`);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP "uuid"`);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP "token"`);
        await queryRunner.query(`ALTER TABLE "public"."comment" ADD "createdDate" date NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."comment" DROP "createdDate"`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "token" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "uuid" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "public"."comment" ADD "date" date NOT NULL`);
    }

}
/* tslint:enable */
