/* tslint:disable */
import {MigrationInterface, QueryRunner} from "typeorm";

export class user1510243932969 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "confirmationToken" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."user" DROP "confirmationToken"`);
    }

}
