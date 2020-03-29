import {MigrationInterface, QueryRunner} from "typeorm";

export class BalanceDefault1585412057635 implements MigrationInterface {
    name = 'BalanceDefault1585412057635'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user_entity` CHANGE `balance` `balance` int UNSIGNED NOT NULL DEFAULT 0", undefined);
        await queryRunner.query("ALTER TABLE `comment_entity` CHANGE `rating` `rating` tinyint UNSIGNED NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `inbound_log_entity` CHANGE `count` `count` int UNSIGNED NOT NULL DEFAULT 0", undefined);
        await queryRunner.query("ALTER TABLE `product_option_entity` CHANGE `originalPrice` `originalPrice` int UNSIGNED NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `product_option_entity` CHANGE `price` `price` int UNSIGNED NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `product_option_entity` CHANGE `stockCount` `stockCount` int UNSIGNED NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `product_entity` CHANGE `basePrice` `basePrice` int UNSIGNED NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `order_item_entity` CHANGE `count` `count` smallint UNSIGNED NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `order_item_entity` CHANGE `itemPrice` `itemPrice` int UNSIGNED NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `referral_entity` CHANGE `purchaseCount` `purchaseCount` int UNSIGNED NOT NULL DEFAULT 0", undefined);
        await queryRunner.query("ALTER TABLE `referral_entity` CHANGE `purchaseAmount` `purchaseAmount` int UNSIGNED NOT NULL DEFAULT 0", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `referral_entity` CHANGE `purchaseAmount` `purchaseAmount` int(10) UNSIGNED NOT NULL DEFAULT '0'", undefined);
        await queryRunner.query("ALTER TABLE `referral_entity` CHANGE `purchaseCount` `purchaseCount` int(10) UNSIGNED NOT NULL DEFAULT '0'", undefined);
        await queryRunner.query("ALTER TABLE `order_item_entity` CHANGE `itemPrice` `itemPrice` int(10) UNSIGNED NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `order_item_entity` CHANGE `count` `count` smallint(5) UNSIGNED NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `product_entity` CHANGE `basePrice` `basePrice` int(10) UNSIGNED NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `product_option_entity` CHANGE `stockCount` `stockCount` int(10) UNSIGNED NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `product_option_entity` CHANGE `price` `price` int(10) UNSIGNED NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `product_option_entity` CHANGE `originalPrice` `originalPrice` int(10) UNSIGNED NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `inbound_log_entity` CHANGE `count` `count` int(10) UNSIGNED NOT NULL DEFAULT '0'", undefined);
        await queryRunner.query("ALTER TABLE `comment_entity` CHANGE `rating` `rating` tinyint(3) UNSIGNED NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `user_entity` CHANGE `balance` `balance` int(10) UNSIGNED NOT NULL", undefined);
    }

}
