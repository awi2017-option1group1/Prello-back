
INSERT INTO team (name, description, "isPrivate")
VALUES ('team1', 'first team', 'false');

INSERT INTO "user" ("fullName", "initial", "username", "bio", "notificationsEnabled", "email", "password", "confirmed")
VALUES ('Bouygues Quentin', 'QB', 'Qbouygues', 'A great biography', 'true', 'qbouygues@gmail.com', 'pwd', 'true');

INSERT INTO board ("name", "isPrivate", "teamId")
VALUES ('board1', 'false', 5);

INSERT INTO list("name", "pos", "boardId")
    VALUES ('list1', 1, 3);

INSERT INTO card("listId", "name", "closed", "desc", "due", "dueComplete", "pos")
    VALUES (2, 'card1', 'false' ,'card description', '2017-10-29', '2017-10-29', 1);

INSERT INTO check_list("name", "cardId", "pos")
    VALUES ('Title of the check list', 2, 1);

INSERT INTO check_list("name", "cardId", "pos")
    VALUES ('CHECK LIST for card 9', 9, 1);

INSERT INTO check_list("name", "cardId", "pos")
    VALUES ('Secon CheckList for card 9', 9, 0);

INSERT INTO check_item("checkListId", "name", "pos", "state")
    VALUES ('4', 'CHECK LIST for card 9', 1, false);

INSERT INTO check_item("checkListId", "name", "pos", "state")
    VALUES ('4', 'CHECK ITEM for CHECKLIST 4', 2, false);

INSERT INTO check_item("checkListId", "name", "pos", "state")
    VALUES ('4', 'Second CHECK ITEM for CHECKLIST 4', 3, true);

INSERT INTO check_item("checkListId", "name", "pos", "state")
    VALUES ('5', 'First CHECK ITEM for CHECKLIST 5', 0, true);

INSERT INTO check_item("checkListId", "name", "pos", "state")
    VALUES ('5', 'Second CHECK ITEM for CHECKLIST 5', 1, false);