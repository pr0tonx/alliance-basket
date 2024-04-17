CREATE DATABASE alliance_basket;

USE alliance_basket;

CREATE TABLE TB_clients (
	id_client int PRIMARY KEY AUTO_INCREMENT,
    name varchar(100),
    phone_number char(11),
    email varchar(50),
    password varchar(20),
    created_at DATETIME NOT NULL DEFAULT NOW(),
    deleted_at DATETIME
);

INSERT INTO TB_clients (name, phone_number, email, password) VALUE ("João Victor", "41996950668", "joaovicbarletta@gmail.com", "pamonha1234");
INSERT INTO TB_clients (name, phone_number, email, password) VALUE ("Felipe", "41996934579", "felipeeingler@gmail.com", "arroz1234");
INSERT INTO TB_clients (name, phone_number, email, password) VALUE ("Joao Fagundi", "11111111111","Fagundi@gmail.com", "1029384756Cd");
INSERT INTO TB_clients (name, phone_number, email, password) VALUES ("felipe", "4141", "a123", "a123");

SELECT * FROM TB_clients;

CREATE TABLE TB_groups(
	id_group int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    group_name varchar(100) NOT NULL,
	id_admin int NOT NULL,
    admin_only_expenses bool DEFAULT false, 
	created_at DATETIME NOT NULL DEFAULT NOW(),
    deleted_at DATETIME
);

CREATE TABLE TB_members(
	id_members int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    id_group int NOT NULL,
    id_client int NOT NULL,
	created_at DATETIME NOT NULL DEFAULT NOW(),
    deleted_at DATETIME,
    FOREIGN KEY (id_group) REFERENCES TB_groups(id_group),
    FOREIGN KEY (id_client) REFERENCES TB_clients(id_client)
);

-- add the following lines into TB_groups after insert trigger
CREATE DEFINER=`root`@`localhost` TRIGGER `TB_groups_AFTER_INSERT` AFTER INSERT ON `TB_groups` FOR EACH ROW BEGIN
SET @id_group =  NEW.id_group;
SET @id_admin =  NEW.id_admin;
INSERT INTO tb_members (id_group, id_client) VALUES (@id_group, @id_admin);
END

INSERT INTO TB_groups(group_name, id_admin) VALUE ( "Grupo do churras", 1);
INSERT INTO TB_groups(group_name, id_admin) VALUE ( "Aniversario jao", 2);
INSERT INTO TB_groups(group_name, id_admin) VALUE ( "Pagode do sabado", 3);
