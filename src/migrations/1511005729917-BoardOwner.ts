/* tslint:disable */

import {MigrationInterface, QueryRunner} from "typeorm";

export class BoardOwner1511005729917 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."board" ADD "ownerId" integer`);
        await queryRunner.query(`ALTER TABLE "public"."board" ADD CONSTRAINT "fk_c3cd2ed470c3d654c113f2cd66c" FOREIGN KEY ("ownerId") REFERENCES "user"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."board" DROP CONSTRAINT "fk_c3cd2ed470c3d654c113f2cd66c"`);
        await queryRunner.query(`ALTER TABLE "public"."board" DROP "ownerId"`);
    }

}
