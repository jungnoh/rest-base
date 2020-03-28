import {MigrationInterface, QueryRunner} from "typeorm";

export class BuildModel11585329793493 implements MigrationInterface {
    name = 'BuildModel11585329793493'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `address_entity` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(40) NOT NULL, `phone` varchar(40) NOT NULL, `address1` varchar(80) NOT NULL, `address2` varchar(80) NOT NULL, `postalCode` varchar(10) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `user_entity` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `username` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `name` varchar(20) NOT NULL, `phone` varchar(40) NOT NULL, `adminLevel` smallint NOT NULL, `level` int NOT NULL, `type` enum ('member', 'partner') NOT NULL DEFAULT 'member', `allowSMS` tinyint NOT NULL DEFAULT 1, `allowPush` tinyint NOT NULL DEFAULT 1, `balance` int UNSIGNED NOT NULL, `landingPage` mediumtext NOT NULL, `active` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `ask_post_entity` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `answeredAt` timestamp NULL, `title` varchar(160) NOT NULL, `content` mediumtext NOT NULL, `answerContent` mediumtext NOT NULL, `answered` tinyint NOT NULL DEFAULT 0, `authorId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `board_entity` (`id` int NOT NULL AUTO_INCREMENT, `key` varchar(20) NOT NULL, `showComments` tinyint NOT NULL DEFAULT 0, `showCommentRatings` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `campaign_log_entity` (`id` int NOT NULL AUTO_INCREMENT, `type` varchar(20) NOT NULL, `method` varchar(80) NOT NULL, `searchTerm` varchar(255) NULL, `ip` varchar(40) NOT NULL, `country` varchar(40) NULL, `region` varchar(40) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `post_entity` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, `content` varchar(255) NOT NULL, `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `boardId` int NULL, `authorId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `comment_entity` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `content` mediumtext NOT NULL, `rating` tinyint UNSIGNED NOT NULL, `postId` int NULL, `authorId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `inbound_log_entity` (`id` int NOT NULL AUTO_INCREMENT, `date` date NOT NULL, `type` varchar(20) NOT NULL, `method` varchar(80) NOT NULL, `count` int UNSIGNED NOT NULL DEFAULT 0, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `ask_post_entity` ADD CONSTRAINT `FK_f9bf0d913c3c042b03e47025aac` FOREIGN KEY (`authorId`) REFERENCES `user_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `post_entity` ADD CONSTRAINT `FK_f1fd7cf6fe59775a95e5ecd2187` FOREIGN KEY (`boardId`) REFERENCES `board_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `post_entity` ADD CONSTRAINT `FK_6fbc92fc8a38f75ffe91acd93a8` FOREIGN KEY (`authorId`) REFERENCES `user_entity`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `comment_entity` ADD CONSTRAINT `FK_8149ef6edc077bb121ae704e3a8` FOREIGN KEY (`postId`) REFERENCES `post_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `comment_entity` ADD CONSTRAINT `FK_31f70669b3ae650b3335cc02417` FOREIGN KEY (`authorId`) REFERENCES `user_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `comment_entity` DROP FOREIGN KEY `FK_31f70669b3ae650b3335cc02417`", undefined);
        await queryRunner.query("ALTER TABLE `comment_entity` DROP FOREIGN KEY `FK_8149ef6edc077bb121ae704e3a8`", undefined);
        await queryRunner.query("ALTER TABLE `post_entity` DROP FOREIGN KEY `FK_6fbc92fc8a38f75ffe91acd93a8`", undefined);
        await queryRunner.query("ALTER TABLE `post_entity` DROP FOREIGN KEY `FK_f1fd7cf6fe59775a95e5ecd2187`", undefined);
        await queryRunner.query("ALTER TABLE `ask_post_entity` DROP FOREIGN KEY `FK_f9bf0d913c3c042b03e47025aac`", undefined);
        await queryRunner.query("DROP TABLE `inbound_log_entity`", undefined);
        await queryRunner.query("DROP TABLE `comment_entity`", undefined);
        await queryRunner.query("DROP TABLE `post_entity`", undefined);
        await queryRunner.query("DROP TABLE `campaign_log_entity`", undefined);
        await queryRunner.query("DROP TABLE `board_entity`", undefined);
        await queryRunner.query("DROP TABLE `ask_post_entity`", undefined);
        await queryRunner.query("DROP TABLE `user_entity`", undefined);
        await queryRunner.query("DROP TABLE `address_entity`", undefined);
    }

}
