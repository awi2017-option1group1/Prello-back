
INSERT INTO team (name, description, "isPrivate")
VALUES ('team1', 'first team', 'false');

INSERT INTO "user" ("lastname", "firstname", "pseudo", "biography", "notificationsEnabled", "email", "password")
VALUES ('Bouygues', 'Quentin', 'Qbouygues', 'A great biography', 'true', 'qbouygues@gmail.com', 'pwd');

INSERT INTO board (title, "isPrivate", team)
VALUES ('board1', 'false', 1);

INSERT INTO list(title, rank, board)
    VALUES ('list1', 1, 1);

INSERT INTO card(title, description, "dueDate", rank, list)
    VALUES ('card1', 'card description', '2017-10-29', 1, 1);
