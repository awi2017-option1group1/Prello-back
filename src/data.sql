
INSERT INTO team (name, description, "isPrivate")
VALUES ('team1', 'first team', 'false');

INSERT INTO "user" ("fullName", "initial", "username", "bio", "notificationsEnabled", "email", "password", "confirmed")
VALUES ('Bouygues Quentin', 'BQ', 'Qbouygues', 'A great biography', 'true', 'qbouygues@gmail.com', 'pwd', 'false');

INSERT INTO board ("name", "isPrivate", "teamId")
VALUES ('board1', 'false', 2);

INSERT INTO list("title", "rank", "boardId")
    VALUES ('list1', 1, 2);

INSERT INTO card("title", "description", "dueDate", "rank", "listId")
    VALUES ('card1', 'card description', '2017-10-29', 1, 3);