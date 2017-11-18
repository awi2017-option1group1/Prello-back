/* tslint:disable */
import {MigrationInterface, QueryRunner} from "typeorm";

export class AvatarColor1510987719628 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "avatarColor" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."user" DROP "avatarColor"`);
    }

}
