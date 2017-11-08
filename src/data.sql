
INSERT INTO team (name, description, "isPrivate")
VALUES ('team1', 'first team', 'false');

INSERT INTO "user" ("fullName", "initial", "username", "bio", "notificationsEnabled", "email", "password", "confirmed")
VALUES ('Bouygues Quentin', 'QB', 'Qbouygues', 'A great biography', 'true', 'qbouygues@gmail.com', 'pwd', 'true');

INSERT INTO board ("name", "isPrivate", "teamId")
VALUES ('board1', 'false', 5);

INSERT INTO list("name", "pos", "boardId")
    VALUES ('list1', 1, 3);

INSERT INTO card("title", "description", "dueDate", "rank", "listId")
    VALUES ('card1', 'card description', '2017-10-29', 1, 4);

INSERT INTO task_list("title", "cardId")
    VALUES ('Title of the check list', 4);