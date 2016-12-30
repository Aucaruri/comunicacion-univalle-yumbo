CREATE SCHEMA `intranet`;

CREATE TABLE `intranet`.`usuarios` (
`user_id` INT NOT NULL AUTO_INCREMENT,
`nombres` VARCHAR(50) NULL,
`apellidos` VARCHAR(50) NULL,
`cargo` VARCHAR(30) NULL,
`correo` VARCHAR(50) NULL,
`contraseña` VARCHAR(100) NULL,
`foto_perfil` VARCHAR(150) NULL,
`registryPasswordToken` VARCHAR(100) NULL,
`tokenExpires` BIGINT NULL,
`estado` TINYINT NOT NULL DEFAULT 0,
PRIMARY KEY (`user_id`));

CREATE TABLE `intranet`.`categorias` (
`categoria_id` INT NOT NULL AUTO_INCREMENT,
`nombre` VARCHAR(50) NOT NULL,
PRIMARY KEY (`categoria_id`));

CREATE TABLE `intranet`.`eventos` (
`evento_id` INT NOT NULL AUTO_INCREMENT,
`titulo` VARCHAR(50) NOT NULL,
`fecha_inicio` TIMESTAMP NOT NULL,
`fecha_final` TIMESTAMP NOT NULL,
`descripcion` TEXT NOT NULL,
`lugar` VARCHAR(50) NOT NULL,
`categoria` INT NOT NULL,
`usuario` INT NOT NULL,
`imagen` VARCHAR(150) NOT NULL,
`estado` TINYINT NOT NULL DEFAULT 1,
PRIMARY KEY (`evento_id`),
INDEX `usuario_idx` (`usuario` ASC),
INDEX `categoria_fk_idx` (`categoria` ASC),
CONSTRAINT `usuario_fk`
	FOREIGN KEY (`usuario`)
	REFERENCES `intranet`.`usuarios` (`user_id`)
	ON DELETE NO ACTION
	ON UPDATE NO ACTION,
CONSTRAINT `categoria_fk`
	FOREIGN KEY (`categoria`)
	REFERENCES `intranet`.`categorias` (`categoria_id`)
	ON DELETE NO ACTION
	ON UPDATE NO ACTION);

CREATE TABLE `intranet`.`conversaciones` (
`conversacion_id` INT NOT NULL AUTO_INCREMENT,
`user_1_id` INT NULL,
`user_2_id` INT NULL,
PRIMARY KEY (`conversacion_id`),
INDEX `user_1_fk_idx` (`user_1_id` ASC),
INDEX `user_2_fk_idx` (`user_2_id` ASC),
CONSTRAINT `user_1_fk`
	FOREIGN KEY (`user_1_id`)
	REFERENCES `intranet`.`usuarios` (`user_id`)
	ON DELETE NO ACTION
	ON UPDATE NO ACTION,
CONSTRAINT `user_2_fk`
	FOREIGN KEY (`user_2_id`)
	REFERENCES `intranet`.`usuarios` (`user_id`)
	ON DELETE NO ACTION
	ON UPDATE NO ACTION);

CREATE TABLE `intranet`.`mensajes` (
`mensaje_id` INT NOT NULL AUTO_INCREMENT,
`remitente` INT NOT NULL,
`mensaje` VARCHAR(255) NOT NULL,
`creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
`archivo` VARCHAR(50) NULL,
`leido` TINYINT NOT NULL DEFAULT 0,
`conversacion_id` INT NOT NULL,
PRIMARY KEY (`mensaje_id`),
INDEX `remitente_fk_idx` (`remitente` ASC),
INDEX `conversacion_fk_idx` (`conversacion_id` ASC),
CONSTRAINT `remitente_fk`
	FOREIGN KEY (`remitente`)
	REFERENCES `intranet`.`usuarios` (`user_id`)
	ON DELETE NO ACTION
	ON UPDATE NO ACTION,
CONSTRAINT `conversacion_fk`
	FOREIGN KEY (`conversacion_id`)
	REFERENCES `intranet`.`conversaciones` (`conversacion_id`)
	ON DELETE NO ACTION
	ON UPDATE NO ACTION);

INSERT INTO `intranet`.`categorias` (`nombre`) VALUES ("Extracurricular");
INSERT INTO `intranet`.`categorias` (`nombre`) VALUES ("Académico");
INSERT INTO `intranet`.`categorias` (`nombre`) VALUES ("Deportivo");
INSERT INTO `intranet`.`categorias` (`nombre`) VALUES ("Urgente");
INSERT INTO `intranet`.`categorias` (`nombre`) VALUES ("Privado");
INSERT INTO `intranet`.`usuarios` (`nombres`,`apellidos`,`correo`,`cargo`,`estado`,`contraseña`,`foto_perfil`) VALUES ("Jhon","Doe","jhon.doe@correounivalle.edu.co","Administrador","1","$2a$05$ZPWxiG2gZL3dcHctrpN15.FO1PAtbDP3Al6dj8tFY4id18AIwvtDq","/public/imagenes/profile/default.jpeg");