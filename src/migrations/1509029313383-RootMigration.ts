/* tslint:disable */
import {MigrationInterface, QueryRunner} from "typeorm";

export class RootMigration1509029313383 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "notification" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "about" integer NOT NULL, "from" integer NOT NULL, "userId" integer, PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" SERIAL NOT NULL, "content" text NOT NULL, "date" date NOT NULL, "cardId" integer, "userId" integer, PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "fullName" character varying, "initial" character varying, "username" character varying NOT NULL, "bio" text, "notificationsEnabled" boolean NOT NULL DEFAULT true, "email" character varying NOT NULL, "password" character varying, "confirmed" boolean NOT NULL DEFAULT false, CONSTRAINT "uk_user_username" UNIQUE ("username") , CONSTRAINT "uk_user_email" UNIQUE ("email"), PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "list" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "pos" integer NOT NULL, "boardId" integer, PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "board" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "isPrivate" boolean NOT NULL, PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "tag" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "color" character varying NOT NULL, "boardId" integer, PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "card" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text, "dueDate" date NOT NULL, "rank" integer NOT NULL, "listId" integer, PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "board_users_user" ("boardId" integer NOT NULL, "userId" integer NOT NULL, PRIMARY KEY("boardId", "userId"))`);
        await queryRunner.query(`CREATE TABLE "card_tags" ("card" integer NOT NULL, "tag" integer NOT NULL, PRIMARY KEY("card", "tag"))`);
        await queryRunner.query(`CREATE INDEX "ind_8a6a43fc46a4624d790bb5e500" ON "board_users_user"("boardId")`);
        await queryRunner.query(`CREATE INDEX "ind_8798aae48855c292be685a34fb" ON "board_users_user"("userId")`);
        await queryRunner.query(`CREATE INDEX "ind_d457ba794f3419fd7a00f3edb7" ON "card_tags"("card")`);
        await queryRunner.query(`CREATE INDEX "ind_9b0282c741c84786a8f46340aa" ON "card_tags"("tag")`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "fk_1885ec41c81a7b0638e47dd16a0" FOREIGN KEY ("userId") REFERENCES "user"("id")`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "fk_32d498cc5f4e3ae0145483b725b" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "fk_e1462f7cd68fe816d2124d7a257" FOREIGN KEY ("userId") REFERENCES "user"("id")`);
        await queryRunner.query(`ALTER TABLE "list" ADD CONSTRAINT "fk_92fd99cabd2cd7336817771307e" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "fk_9eacbff885bd58d8e13efa4f4a1" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "fk_0ad426ec552cfce3192f30a1a19" FOREIGN KEY ("listId") REFERENCES "list"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "board_users_user" ADD CONSTRAINT "fk_fc319ccace2b26c4b417631e4ef" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "board_users_user" ADD CONSTRAINT "fk_95e8c065d099ff414045612a5dd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "card_tags" ADD CONSTRAINT "fk_2e4b5cef7534461317dcc0e0c6f" FOREIGN KEY ("card") REFERENCES "card"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "card_tags" ADD CONSTRAINT "fk_fec1ebd38a8db1673e9f235ef08" FOREIGN KEY ("tag") REFERENCES "tag"("id") ON DELETE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "card_tags" DROP CONSTRAINT "fk_fec1ebd38a8db1673e9f235ef08"`);
        await queryRunner.query(`ALTER TABLE "card_tags" DROP CONSTRAINT "fk_2e4b5cef7534461317dcc0e0c6f"`);
        await queryRunner.query(`ALTER TABLE "board_users_user" DROP CONSTRAINT "fk_95e8c065d099ff414045612a5dd"`);
        await queryRunner.query(`ALTER TABLE "board_users_user" DROP CONSTRAINT "fk_fc319ccace2b26c4b417631e4ef"`);
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "fk_0ad426ec552cfce3192f30a1a19"`);
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "fk_9eacbff885bd58d8e13efa4f4a1"`);
        await queryRunner.query(`ALTER TABLE "list" DROP CONSTRAINT "fk_92fd99cabd2cd7336817771307e"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "fk_e1462f7cd68fe816d2124d7a257"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "fk_32d498cc5f4e3ae0145483b725b"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "fk_1885ec41c81a7b0638e47dd16a0"`);
        await queryRunner.query(`-- TODO: revert CREATE INDEX "ind_9b0282c741c84786a8f46340aa" ON "card_tags"("tag")`);
        await queryRunner.query(`-- TODO: revert CREATE INDEX "ind_d457ba794f3419fd7a00f3edb7" ON "card_tags"("card")`);
        await queryRunner.query(`-- TODO: revert CREATE INDEX "ind_8798aae48855c292be685a34fb" ON "board_users_user"("userId")`);
        await queryRunner.query(`-- TODO: revert CREATE INDEX "ind_8a6a43fc46a4624d790bb5e500" ON "board_users_user"("boardId")`);
        await queryRunner.query(`DROP TABLE "card_tags"`);
        await queryRunner.query(`DROP TABLE "board_users_user"`);
        await queryRunner.query(`DROP TABLE "card"`);
        await queryRunner.query(`DROP TABLE "tag"`);
        await queryRunner.query(`DROP TABLE "board"`);
        await queryRunner.query(`DROP TABLE "list"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP TABLE "notification"`);
    }

}
