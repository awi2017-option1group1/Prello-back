/* tslint:disable */

import {MigrationInterface, QueryRunner} from "typeorm";

export class NotificationDate1510593000390 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."notification" ADD "date" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."notification" DROP "date"`);
    }

}
