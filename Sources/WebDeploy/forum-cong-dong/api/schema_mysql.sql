SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS `users` (
  `id`         INT NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(255) NOT NULL,
  `email`      VARCHAR(255) NOT NULL,
  `password`   VARCHAR(255) NOT NULL,
  `role`       VARCHAR(20)  NOT NULL DEFAULT 'user',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `settings` (
  `key`   VARCHAR(255) NOT NULL,
  `value` TEXT,
  `grp`   VARCHAR(50)  NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `contacts` (
  `id`         INT NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(255) NOT NULL,
  `email`      VARCHAR(255),
  `phone`      VARCHAR(50),
  `subject`    VARCHAR(255),
  `message`    TEXT NOT NULL,
  `status`     VARCHAR(20) DEFAULT 'new',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `hero_slides` (
  `id`          INT NOT NULL AUTO_INCREMENT,
  `title`       VARCHAR(500) NOT NULL,
  `subtitle`    TEXT,
  `button_text` VARCHAR(255),
  `button_link` VARCHAR(500),
  `image`       TEXT,
  `sort_order`  INT DEFAULT 0,
  `status`      VARCHAR(20) DEFAULT 'published',
  `created_at`  DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `media` (
  `id`          INT NOT NULL AUTO_INCREMENT,
  `filename`    VARCHAR(255) NOT NULL,
  `filepath`    TEXT NOT NULL,
  `filesize`    INT,
  `filetype`    VARCHAR(100),
  `alt_text`    VARCHAR(255),
  `uploaded_by` INT,
  `created_at`  DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `forum_categories` (
  `id`          INT NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(255) NOT NULL,
  `slug`        VARCHAR(255),
  `description` TEXT,
  `icon`        VARCHAR(50),
  `sort_order`  INT DEFAULT 0,
  `status`      VARCHAR(20) DEFAULT 'published',
  `created_at`  DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_fc_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `forum_threads` (
  `id`            INT NOT NULL AUTO_INCREMENT,
  `category_id`   INT,
  `title`         VARCHAR(500) NOT NULL,
  `slug`          VARCHAR(500),
  `content`       TEXT,
  `author_name`   VARCHAR(255) NOT NULL DEFAULT 'Ẩn danh',
  `author_email`  VARCHAR(255),
  `author_avatar` TEXT,
  `reply_count`   INT DEFAULT 0,
  `view_count`    INT DEFAULT 0,
  `is_pinned`     TINYINT(1) DEFAULT 0,
  `is_hot`        TINYINT(1) DEFAULT 0,
  `status`        VARCHAR(20) DEFAULT 'published',
  `sort_order`    INT DEFAULT 0,
  `created_at`    DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_ft_slug` (`slug`),
  FOREIGN KEY (`category_id`) REFERENCES `forum_categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `forum_tags` (
  `id`          INT NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(255) NOT NULL,
  `slug`        VARCHAR(255),
  `usage_count` INT DEFAULT 0,
  `created_at`  DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_ft_name` (`name`),
  UNIQUE KEY `uq_ft_slug2` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `forum_thread_tags` (
  `thread_id` INT NOT NULL,
  `tag_id`    INT NOT NULL,
  PRIMARY KEY (`thread_id`, `tag_id`),
  FOREIGN KEY (`thread_id`) REFERENCES `forum_threads`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`tag_id`)    REFERENCES `forum_tags`(`id`)    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
