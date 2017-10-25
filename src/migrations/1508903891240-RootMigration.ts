/* tslint:disable */
import {MigrationInterface, QueryRunner} from "typeorm";

export class RootMigration1508903891240 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "notification" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "about" integer NOT NULL, "from" integer NOT NULL, "userId" integer, PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" SERIAL NOT NULL, "content" text NOT NULL, "date" date NOT NULL, "cardId" integer, "userId" integer, PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "token" ("userid" integer NOT NULL, "clientType" character varying NOT NULL, "value" text NOT NULL, "userId" integer, PRIMARY KEY("userid", "clientType"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "lastname" character varying, "firstname" character varying, "pseudo" character varying NOT NULL, "biography" text, "notificationsEnabled" boolean NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "token" character varying, CONSTRAINT "uk_user_pseudo" UNIQUE ("pseudo") , CONSTRAINT "uk_user_email" UNIQUE ("email"), PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "team" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "isPrivate" boolean NOT NULL, CONSTRAINT "uk_team_name" UNIQUE ("name"), PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "list" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "rank" integer NOT NULL, "boardId" integer, PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "board" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "isPrivate" boolean NOT NULL, "teamId" integer, PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "tag" ("id" SERIAL NOT NULL, "label" character varying NOT NULL, "color" character varying NOT NULL, PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "task" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "rank" integer NOT NULL, "isDone" boolean NOT NULL, "taskListId" integer, PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "task_list" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "cardId" integer, PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "card" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text, "dueDate" date NOT NULL, "rank" integer NOT NULL, "listId" integer, PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "attachement" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "URL" text NOT NULL, "cardId" integer, PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "board_role" ("id" SERIAL NOT NULL, "role" text NOT NULL, PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "team_role" ("id" SERIAL NOT NULL, "role" character varying NOT NULL, PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "user_team" ("user" integer NOT NULL, "team" integer NOT NULL, PRIMARY KEY("user", "team"))`);
        await queryRunner.query(`CREATE TABLE "user_board" ("board" integer NOT NULL, "user" integer NOT NULL, PRIMARY KEY("board", "user"))`);
        await queryRunner.query(`CREATE TABLE "board_tag" ("board" integer NOT NULL, "tag" integer NOT NULL, PRIMARY KEY("board", "tag"))`);
        await queryRunner.query(`CREATE TABLE "card_tags" ("card" integer NOT NULL, "tag" integer NOT NULL, PRIMARY KEY("card", "tag"))`);
        await queryRunner.query(`CREATE INDEX "ind_8226f6255c8943fe0c23c99b62" ON "user_team"("user")`);
        await queryRunner.query(`CREATE INDEX "ind_b286f0b52354ea3cd84d8cc9b9" ON "user_team"("team")`);
        await queryRunner.query(`CREATE INDEX "ind_14fe00ca85008593588936f5c0" ON "user_board"("board")`);
        await queryRunner.query(`CREATE INDEX "ind_89fb345dee5fec977b852a14f6" ON "user_board"("user")`);
        await queryRunner.query(`CREATE INDEX "ind_ee599f688057e83055decb2c96" ON "board_tag"("board")`);
        await queryRunner.query(`CREATE INDEX "ind_4332cc3f0ead2d333d3b65429b" ON "board_tag"("tag")`);
        await queryRunner.query(`CREATE INDEX "ind_d457ba794f3419fd7a00f3edb7" ON "card_tags"("card")`);
        await queryRunner.query(`CREATE INDEX "ind_9b0282c741c84786a8f46340aa" ON "card_tags"("tag")`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "fk_1885ec41c81a7b0638e47dd16a0" FOREIGN KEY ("userId") REFERENCES "user"("id")`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "fk_32d498cc5f4e3ae0145483b725b" FOREIGN KEY ("cardId") REFERENCES "card"("id")`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "fk_e1462f7cd68fe816d2124d7a257" FOREIGN KEY ("userId") REFERENCES "user"("id")`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "fk_3dffa21ee65151950b27ba2c5d9" FOREIGN KEY ("userId") REFERENCES "user"("id")`);
        await queryRunner.query(`ALTER TABLE "list" ADD CONSTRAINT "fk_92fd99cabd2cd7336817771307e" FOREIGN KEY ("boardId") REFERENCES "board"("id")`);
        await queryRunner.query(`ALTER TABLE "board" ADD CONSTRAINT "fk_b82dcddb5bc5f9b166487ba4f0d" FOREIGN KEY ("teamId") REFERENCES "team"("id")`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "fk_d0047906a862c652fd82d4947d5" FOREIGN KEY ("taskListId") REFERENCES "task_list"("id")`);
        await queryRunner.query(`ALTER TABLE "task_list" ADD CONSTRAINT "fk_f129c340de8ddc4cae5232b3bad" FOREIGN KEY ("cardId") REFERENCES "card"("id")`);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "fk_0ad426ec552cfce3192f30a1a19" FOREIGN KEY ("listId") REFERENCES "list"("id")`);
        await queryRunner.query(`ALTER TABLE "attachement" ADD CONSTRAINT "fk_1b55dda3c5744aac69cd5b03a92" FOREIGN KEY ("cardId") REFERENCES "card"("id")`);
        await queryRunner.query(`ALTER TABLE "user_team" ADD CONSTRAINT "fk_d45a315d65fb5c88ce89ed82a4f" FOREIGN KEY ("user") REFERENCES "user"("id")`);
        await queryRunner.query(`ALTER TABLE "user_team" ADD CONSTRAINT "fk_e91905f1c3986a82c9348956f3c" FOREIGN KEY ("team") REFERENCES "team"("id")`);
        await queryRunner.query(`ALTER TABLE "user_board" ADD CONSTRAINT "fk_b538c3e57f5193f752f313cc76e" FOREIGN KEY ("board") REFERENCES "board"("id")`);
        await queryRunner.query(`ALTER TABLE "user_board" ADD CONSTRAINT "fk_affb2b5aa12c8d8e1c9954b21a3" FOREIGN KEY ("user") REFERENCES "user"("id")`);
        await queryRunner.query(`ALTER TABLE "board_tag" ADD CONSTRAINT "fk_64e42317047eacfdf964e638a47" FOREIGN KEY ("board") REFERENCES "board"("id")`);
        await queryRunner.query(`ALTER TABLE "board_tag" ADD CONSTRAINT "fk_8258f7409df67329dd9314ba9ee" FOREIGN KEY ("tag") REFERENCES "tag"("id")`);
        await queryRunner.query(`ALTER TABLE "card_tags" ADD CONSTRAINT "fk_2e4b5cef7534461317dcc0e0c6f" FOREIGN KEY ("card") REFERENCES "card"("id")`);
        await queryRunner.query(`ALTER TABLE "card_tags" ADD CONSTRAINT "fk_fec1ebd38a8db1673e9f235ef08" FOREIGN KEY ("tag") REFERENCES "tag"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "card_tags" DROP CONSTRAINT "fk_fec1ebd38a8db1673e9f235ef08"`);
        await queryRunner.query(`ALTER TABLE "card_tags" DROP CONSTRAINT "fk_2e4b5cef7534461317dcc0e0c6f"`);
        await queryRunner.query(`ALTER TABLE "board_tag" DROP CONSTRAINT "fk_8258f7409df67329dd9314ba9ee"`);
        await queryRunner.query(`ALTER TABLE "board_tag" DROP CONSTRAINT "fk_64e42317047eacfdf964e638a47"`);
        await queryRunner.query(`ALTER TABLE "user_board" DROP CONSTRAINT "fk_affb2b5aa12c8d8e1c9954b21a3"`);
        await queryRunner.query(`ALTER TABLE "user_board" DROP CONSTRAINT "fk_b538c3e57f5193f752f313cc76e"`);
        await queryRunner.query(`ALTER TABLE "user_team" DROP CONSTRAINT "fk_e91905f1c3986a82c9348956f3c"`);
        await queryRunner.query(`ALTER TABLE "user_team" DROP CONSTRAINT "fk_d45a315d65fb5c88ce89ed82a4f"`);
        await queryRunner.query(`ALTER TABLE "attachement" DROP CONSTRAINT "fk_1b55dda3c5744aac69cd5b03a92"`);
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "fk_0ad426ec552cfce3192f30a1a19"`);
        await queryRunner.query(`ALTER TABLE "task_list" DROP CONSTRAINT "fk_f129c340de8ddc4cae5232b3bad"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "fk_d0047906a862c652fd82d4947d5"`);
        await queryRunner.query(`ALTER TABLE "board" DROP CONSTRAINT "fk_b82dcddb5bc5f9b166487ba4f0d"`);
        await queryRunner.query(`ALTER TABLE "list" DROP CONSTRAINT "fk_92fd99cabd2cd7336817771307e"`);
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "fk_3dffa21ee65151950b27ba2c5d9"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "fk_e1462f7cd68fe816d2124d7a257"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "fk_32d498cc5f4e3ae0145483b725b"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "fk_1885ec41c81a7b0638e47dd16a0"`);
        await queryRunner.query(`-- TODO: revert CREATE INDEX "ind_9b0282c741c84786a8f46340aa" ON "card_tags"("tag")`);
        await queryRunner.query(`-- TODO: revert CREATE INDEX "ind_d457ba794f3419fd7a00f3edb7" ON "card_tags"("card")`);
        await queryRunner.query(`-- TODO: revert CREATE INDEX "ind_4332cc3f0ead2d333d3b65429b" ON "board_tag"("tag")`);
        await queryRunner.query(`-- TODO: revert CREATE INDEX "ind_ee599f688057e83055decb2c96" ON "board_tag"("board")`);
        await queryRunner.query(`-- TODO: revert CREATE INDEX "ind_89fb345dee5fec977b852a14f6" ON "user_board"("user")`);
        await queryRunner.query(`-- TODO: revert CREATE INDEX "ind_14fe00ca85008593588936f5c0" ON "user_board"("board")`);
        await queryRunner.query(`-- TODO: revert CREATE INDEX "ind_b286f0b52354ea3cd84d8cc9b9" ON "user_team"("team")`);
        await queryRunner.query(`-- TODO: revert CREATE INDEX "ind_8226f6255c8943fe0c23c99b62" ON "user_team"("user")`);
        await queryRunner.query(`DROP TABLE "card_tags"`);
        await queryRunner.query(`DROP TABLE "board_tag"`);
        await queryRunner.query(`DROP TABLE "user_board"`);
        await queryRunner.query(`DROP TABLE "user_team"`);
        await queryRunner.query(`DROP TABLE "team_role"`);
        await queryRunner.query(`DROP TABLE "board_role"`);
        await queryRunner.query(`DROP TABLE "attachement"`);
        await queryRunner.query(`DROP TABLE "card"`);
        await queryRunner.query(`DROP TABLE "task_list"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TABLE "tag"`);
        await queryRunner.query(`DROP TABLE "board"`);
        await queryRunner.query(`DROP TABLE "list"`);
        await queryRunner.query(`DROP TABLE "team"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "token"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP TABLE "notification"`);
    }

}
