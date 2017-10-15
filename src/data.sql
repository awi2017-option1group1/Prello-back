
INSERT INTO team (name, description, "isPrivate")
VALUES ('team1', 'first team', 'false');

INSERT INTO "user" ("lastname", "firstname", "pseudo", "biography", "notificationsEnabled", "email", "password", "token")
VALUES ('Bouygues', 'Quentin', 'Qbouygues', 'A great biography', 'true', 'qbouygues@gmail.com', 'pwd', 'tokenTest');

INSERT INTO board (title, "isPrivate", team)
VALUES ('board1', 'false', 4);

INSERT INTO list(title, rank, board)
    VALUES ('list1', 1, 6);

INSERT INTO card(title, description, "dueDate", rank, list)
    VALUES ('card1', 'card description', '2017-10-29', 1, 3);

