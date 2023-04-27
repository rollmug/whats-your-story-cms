SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `changemakers`;
CREATE TABLE `changemakers` (
  `id` char(36) NOT NULL,
  `dateAdded` timestamp NULL DEFAULT NULL,
  `approved` tinyint(1) DEFAULT '1',
  `name` varchar(255) NOT NULL,
  `quote` text NOT NULL,
  `bio` text NOT NULL,
  `changemakerImage` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `changemakers_changemakerimage_foreign` (`changemakerImage`),
  CONSTRAINT `changemakers_changemakerimage_foreign` FOREIGN KEY (`changemakerImage`) REFERENCES `directus_files` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `directus_activity`;
CREATE TABLE `directus_activity` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `action` varchar(45) NOT NULL,
  `user` char(36) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip` varchar(50) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `collection` varchar(64) NOT NULL,
  `item` varchar(255) NOT NULL,
  `comment` text,
  `origin` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_activity_collection_foreign` (`collection`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `directus_collections`;
CREATE TABLE `directus_collections` (
  `collection` varchar(64) NOT NULL,
  `icon` varchar(30) DEFAULT NULL,
  `note` text,
  `display_template` varchar(255) DEFAULT NULL,
  `hidden` tinyint(1) NOT NULL DEFAULT '0',
  `singleton` tinyint(1) NOT NULL DEFAULT '0',
  `translations` json DEFAULT NULL,
  `archive_field` varchar(64) DEFAULT NULL,
  `archive_app_filter` tinyint(1) NOT NULL DEFAULT '1',
  `archive_value` varchar(255) DEFAULT NULL,
  `unarchive_value` varchar(255) DEFAULT NULL,
  `sort_field` varchar(64) DEFAULT NULL,
  `accountability` varchar(255) DEFAULT 'all',
  `color` varchar(255) DEFAULT NULL,
  `item_duplication_fields` json DEFAULT NULL,
  `sort` int DEFAULT NULL,
  `group` varchar(64) DEFAULT NULL,
  `collapse` varchar(255) NOT NULL DEFAULT 'open',
  PRIMARY KEY (`collection`),
  KEY `directus_collections_group_foreign` (`group`),
  CONSTRAINT `directus_collections_group_foreign` FOREIGN KEY (`group`) REFERENCES `directus_collections` (`collection`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `directus_collections` (`collection`, `icon`, `note`, `display_template`, `hidden`, `singleton`, `translations`, `archive_field`, `archive_app_filter`, `archive_value`, `unarchive_value`, `sort_field`, `accountability`, `color`, `item_duplication_fields`, `sort`, `group`, `collapse`) VALUES
('changemakers',	NULL,	NULL,	'{{name}}',	0,	0,	'[{\"plural\": \"Changemakers\", \"language\": \"en-US\", \"singular\": \"Changemaker\", \"translation\": \"FYS Changemakers\"}]',	NULL,	1,	NULL,	NULL,	NULL,	'all',	NULL,	NULL,	2,	'Find_Your_Spark',	'open'),
('Find_Your_Spark',	'folder',	NULL,	NULL,	0,	0,	NULL,	NULL,	1,	NULL,	NULL,	NULL,	'all',	NULL,	NULL,	1,	NULL,	'open'),
('findYourSpark',	NULL,	'Manage the Entries for the Find Your Spark exhibit.',	'{{name}}',	0,	0,	NULL,	NULL,	1,	NULL,	NULL,	NULL,	'all',	NULL,	NULL,	1,	'Find_Your_Spark',	'open'),
('issueNames',	NULL,	NULL,	NULL,	1,	0,	NULL,	NULL,	1,	NULL,	NULL,	NULL,	'all',	NULL,	NULL,	2,	'Posters_For_Change',	'open'),
('ping',	NULL,	NULL,	NULL,	1,	1,	NULL,	NULL,	1,	NULL,	NULL,	NULL,	'all',	NULL,	NULL,	NULL,	NULL,	'open'),
('Posters_For_Change',	'folder',	NULL,	NULL,	0,	0,	NULL,	NULL,	1,	NULL,	NULL,	NULL,	'all',	NULL,	NULL,	2,	NULL,	'open'),
('qualityNames',	NULL,	NULL,	NULL,	1,	0,	NULL,	NULL,	1,	NULL,	NULL,	NULL,	'all',	NULL,	NULL,	1,	'Posters_For_Change',	'open'),
('quizAttributes',	NULL,	NULL,	NULL,	1,	0,	NULL,	NULL,	1,	NULL,	NULL,	NULL,	'all',	NULL,	NULL,	1,	'SuperPower_Quiz',	'open'),
('quizCategories',	NULL,	NULL,	NULL,	1,	0,	NULL,	NULL,	1,	NULL,	NULL,	NULL,	'all',	NULL,	NULL,	2,	'SuperPower_Quiz',	'open'),
('SuperPower_Quiz',	'folder',	NULL,	NULL,	0,	0,	NULL,	NULL,	1,	NULL,	NULL,	NULL,	'all',	NULL,	NULL,	3,	NULL,	'open'),
('superpowerChangemakers',	NULL,	NULL,	NULL,	0,	0,	NULL,	NULL,	1,	NULL,	NULL,	NULL,	'all',	NULL,	NULL,	3,	'SuperPower_Quiz',	'open'),
('visitorPosters',	NULL,	NULL,	NULL,	0,	0,	NULL,	NULL,	1,	NULL,	NULL,	NULL,	'all',	NULL,	NULL,	3,	'Posters_For_Change',	'open');

DROP TABLE IF EXISTS `directus_dashboards`;
CREATE TABLE `directus_dashboards` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `icon` varchar(30) NOT NULL DEFAULT 'dashboard',
  `note` text,
  `date_created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_created` char(36) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_dashboards_user_created_foreign` (`user_created`),
  CONSTRAINT `directus_dashboards_user_created_foreign` FOREIGN KEY (`user_created`) REFERENCES `directus_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `directus_fields`;
CREATE TABLE `directus_fields` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `collection` varchar(64) NOT NULL,
  `field` varchar(64) NOT NULL,
  `special` varchar(64) DEFAULT NULL,
  `interface` varchar(64) DEFAULT NULL,
  `options` json DEFAULT NULL,
  `display` varchar(64) DEFAULT NULL,
  `display_options` json DEFAULT NULL,
  `readonly` tinyint(1) NOT NULL DEFAULT '0',
  `hidden` tinyint(1) NOT NULL DEFAULT '0',
  `sort` int unsigned DEFAULT NULL,
  `width` varchar(30) DEFAULT 'full',
  `translations` json DEFAULT NULL,
  `note` text,
  `conditions` json DEFAULT NULL,
  `required` tinyint(1) DEFAULT '0',
  `group` varchar(64) DEFAULT NULL,
  `validation` json DEFAULT NULL,
  `validation_message` text,
  PRIMARY KEY (`id`),
  KEY `directus_fields_collection_foreign` (`collection`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `directus_fields` (`id`, `collection`, `field`, `special`, `interface`, `options`, `display`, `display_options`, `readonly`, `hidden`, `sort`, `width`, `translations`, `note`, `conditions`, `required`, `group`, `validation`, `validation_message`) VALUES
(8,	'findYourSpark',	'id',	'uuid',	'input',	NULL,	NULL,	NULL,	1,	1,	1,	'full',	NULL,	NULL,	NULL,	0,	NULL,	NULL,	NULL),
(9,	'findYourSpark',	'dateAdded',	'date-created',	'datetime',	NULL,	'datetime',	'{\"relative\": true}',	1,	1,	2,	'full',	NULL,	NULL,	NULL,	0,	NULL,	NULL,	NULL),
(11,	'findYourSpark',	'approved',	'cast-boolean',	'boolean',	'{\"label\": \"Approved?\", \"iconOn\": \"check_circle\", \"colorOn\": \"#2ECDA7\", \"iconOff\": \"circle\", \"colorOff\": \"#E35169\"}',	NULL,	NULL,	0,	0,	3,	'full',	NULL,	'Uncheck to hide this entry from the exhibit.',	NULL,	0,	NULL,	NULL,	NULL),
(12,	'findYourSpark',	'sticky',	'cast-boolean',	'boolean',	'{\"label\": \"Sticky?\", \"iconOn\": \"check_circle\", \"colorOn\": \"#2ECDA7\", \"iconOff\": \"circle\", \"colorOff\": \"#A2B5CD\"}',	NULL,	NULL,	0,	1,	4,	'full',	NULL,	NULL,	NULL,	0,	NULL,	NULL,	NULL),
(13,	'findYourSpark',	'name',	NULL,	'input',	'{\"placeholder\": \"First/Last name\"}',	NULL,	NULL,	0,	0,	5,	'full',	NULL,	'The first/last name of this person.',	NULL,	1,	NULL,	NULL,	NULL),
(15,	'findYourSpark',	'prompt',	NULL,	'select-dropdown',	'{\"choices\": [{\"text\": \"and I want to live in a world where\", \"value\": \"and I want to live in a world where\"}, {\"text\": \"and today I can\", \"value\": \"and today I can\"}, {\"text\": \"because\", \"value\": \"because\"}]}',	NULL,	NULL,	0,	0,	7,	'half',	NULL,	'Select the first part of the statement.',	NULL,	1,	NULL,	NULL,	NULL),
(16,	'findYourSpark',	'caresAbout',	NULL,	'input',	'{\"trim\": true, \"softLength\": 30, \"placeholder\": \"I care about...\"}',	NULL,	NULL,	0,	0,	6,	'half',	NULL,	'Max length: 30 characters.',	'[]',	1,	NULL,	NULL,	NULL),
(17,	'findYourSpark',	'statement',	NULL,	'input',	'{\"softLength\": 140, \"placeholder\": null}',	NULL,	NULL,	0,	0,	NULL,	'full',	NULL,	'Visitor statement. Max length: 140 characters.',	NULL,	1,	NULL,	NULL,	NULL),
(18,	'findYourSpark',	'personImage',	'file',	'file-image',	'{\"crop\": false, \"folder\": null}',	NULL,	NULL,	0,	0,	NULL,	'full',	NULL,	'Dimensions: 878 x 960 px (will be cropped automatically if not)',	'[]',	0,	NULL,	NULL,	NULL),
(19,	'changemakers',	'id',	'uuid',	'input',	NULL,	NULL,	NULL,	1,	1,	NULL,	'full',	NULL,	NULL,	NULL,	0,	NULL,	NULL,	NULL),
(20,	'changemakers',	'dateAdded',	'date-created',	'datetime',	NULL,	'datetime',	'{\"relative\": true}',	1,	1,	NULL,	'half',	NULL,	NULL,	NULL,	0,	NULL,	NULL,	NULL),
(21,	'changemakers',	'approved',	'cast-boolean',	'boolean',	'{\"label\": \"Approved\", \"iconOn\": \"check_circle\", \"colorOn\": \"#2ECDA7\", \"iconOff\": \"circle\", \"colorOff\": \"#E35169\"}',	NULL,	NULL,	0,	0,	NULL,	'full',	NULL,	'Uncheck to hide this entry from the exhibit.',	NULL,	0,	NULL,	NULL,	NULL),
(22,	'changemakers',	'name',	NULL,	'input',	'{\"placeholder\": \"Changemaker name\"}',	NULL,	NULL,	0,	0,	NULL,	'full',	NULL,	'The first/last name of this person.',	NULL,	1,	NULL,	NULL,	NULL),
(23,	'changemakers',	'quote',	NULL,	'input-multiline',	'{\"trim\": true, \"softLength\": 190, \"placeholder\": \"Quote text...\"}',	NULL,	NULL,	0,	0,	NULL,	'full',	NULL,	'This person’s statement or quote. Max length: 190 characters.',	NULL,	1,	NULL,	NULL,	NULL),
(24,	'changemakers',	'bio',	NULL,	'input-multiline',	'{\"trim\": true, \"softLength\": 90, \"placeholder\": \"Bio text...\"}',	NULL,	NULL,	0,	0,	NULL,	'full',	NULL,	'A short bio for this person. Max length: 90 characters.',	NULL,	1,	NULL,	NULL,	NULL),
(26,	'changemakers',	'changemakerImage',	'file',	'file-image',	'{\"crop\": false}',	NULL,	NULL,	0,	0,	NULL,	'full',	NULL,	'Dimensions: 878 x 960 px (will be cropped automatically if not)',	NULL,	0,	NULL,	NULL,	NULL),
(32,	'visitorPosters',	'id',	'uuid',	'input',	NULL,	NULL,	NULL,	1,	1,	1,	'full',	NULL,	NULL,	NULL,	0,	NULL,	NULL,	NULL),
(33,	'visitorPosters',	'dateAdded',	'date-created',	'datetime',	NULL,	'datetime',	'{\"relative\": true}',	1,	1,	2,	'half',	NULL,	NULL,	NULL,	0,	NULL,	NULL,	NULL),
(34,	'visitorPosters',	'approved',	'cast-boolean',	'boolean',	'{\"label\": \"Approved\", \"iconOn\": \"check_circle\", \"colorOn\": \"#2ECDA7\", \"iconOff\": \"circle\", \"colorOff\": \"#E35169\"}',	NULL,	NULL,	0,	0,	3,	'full',	NULL,	'Uncheck to completely hide this poster from the exhibit.',	NULL,	0,	NULL,	NULL,	NULL),
(35,	'visitorPosters',	'sticky',	'cast-boolean',	'boolean',	'{\"label\": \"Sticky\", \"iconOn\": \"check_circle\", \"colorOn\": \"#2ECDA7\", \"iconOff\": \"circle\", \"colorOff\": \"#E35169\"}',	NULL,	NULL,	0,	0,	4,	'full',	NULL,	'Check to make sticky. This will make it appear regardless of how long ago it was submitted.',	NULL,	0,	NULL,	NULL,	NULL),
(52,	'visitorPosters',	'stationID',	NULL,	'input',	NULL,	NULL,	NULL,	0,	1,	8,	'full',	NULL,	NULL,	NULL,	0,	NULL,	NULL,	NULL),
(53,	'visitorPosters',	'posterImage',	'file',	'file-image',	'{\"crop\": false}',	NULL,	NULL,	0,	0,	5,	'full',	NULL,	NULL,	NULL,	0,	NULL,	NULL,	NULL),
(63,	'qualityNames',	'key',	NULL,	'input',	NULL,	NULL,	NULL,	0,	0,	NULL,	'full',	NULL,	NULL,	NULL,	0,	NULL,	NULL,	NULL),
(64,	'qualityNames',	'name',	NULL,	'input',	'{\"trim\": true}',	NULL,	NULL,	0,	0,	NULL,	'full',	NULL,	NULL,	NULL,	0,	NULL,	NULL,	NULL),
(65,	'visitorPosters',	'quality',	'm2o',	'select-dropdown-m2o',	'{\"template\": \"{{name}}\", \"enableCreate\": false}',	NULL,	NULL,	0,	0,	NULL,	'half',	NULL,	'The quality chosen by the user',	NULL,	0,	NULL,	NULL,	NULL),
(66,	'issueNames',	'key',	NULL,	'input',	NULL,	NULL,	NULL,	0,	0,	NULL,	'full',	NULL,	NULL,	NULL,	0,	NULL,	NULL,	NULL),
(67,	'issueNames',	'name',	NULL,	'input',	NULL,	NULL,	NULL,	0,	0,	NULL,	'full',	NULL,	NULL,	NULL,	0,	NULL,	NULL,	NULL),
(68,	'visitorPosters',	'issue',	'm2o',	'select-dropdown-m2o',	'{\"template\": \"{{name}}\", \"enableCreate\": false}',	NULL,	NULL,	0,	0,	NULL,	'half',	NULL,	'The issue the user cares about',	NULL,	0,	NULL,	NULL,	NULL),
(69,	'quizCategories',	'key',	NULL,	'input',	NULL,	NULL,	NULL,	0,	0,	NULL,	'full',	NULL,	NULL,	NULL,	0,	NULL,	NULL,	NULL),
(70,	'quizCategories',	'category',	NULL,	'input',	NULL,	NULL,	NULL,	0,	0,	NULL,	'full',	NULL,	NULL,	NULL,	0,	NULL,	NULL,	NULL),
(71,	'quizAttributes',	'key',	NULL,	'input',	NULL,	NULL,	NULL,	0,	0,	NULL,	'full',	NULL,	NULL,	NULL,	0,	NULL,	NULL,	NULL),
(72,	'quizAttributes',	'attribute',	NULL,	'input',	NULL,	NULL,	NULL,	0,	0,	NULL,	'full',	NULL,	NULL,	NULL,	0,	NULL,	NULL,	NULL),
(73,	'superpowerChangemakers',	'id',	'uuid',	'input',	NULL,	NULL,	NULL,	1,	1,	1,	'full',	NULL,	NULL,	NULL,	0,	NULL,	NULL,	NULL),
(74,	'superpowerChangemakers',	'dateAdded',	'date-created',	'datetime',	NULL,	'datetime',	'{\"relative\": true}',	1,	1,	2,	'half',	NULL,	NULL,	NULL,	0,	NULL,	NULL,	NULL),
(75,	'superpowerChangemakers',	'name',	NULL,	'input',	'{\"trim\": true, \"softLength\": 20, \"placeholder\": \"Changemaker Full Name\"}',	NULL,	NULL,	0,	0,	3,	'full',	NULL,	'Enter the person\'s full name. Max chars: 20.',	NULL,	1,	NULL,	NULL,	NULL),
(76,	'superpowerChangemakers',	'title',	NULL,	'input',	'{\"trim\": true, \"softLength\": 40}',	NULL,	NULL,	0,	0,	4,	'full',	NULL,	'The person\'s title. Max chars: 40',	NULL,	1,	NULL,	NULL,	NULL),
(77,	'superpowerChangemakers',	'bio',	NULL,	'input-multiline',	'{\"trim\": true, \"softLength\": 560, \"placeholder\": \"Bio text...\"}',	NULL,	NULL,	0,	0,	5,	'full',	NULL,	'A bio for this person. Max chars: 560',	NULL,	1,	NULL,	NULL,	NULL),
(78,	'superpowerChangemakers',	'changemakerImage',	'file',	'file-image',	'{\"crop\": false}',	NULL,	NULL,	0,	0,	9,	'half',	NULL,	'Images should be cropped to 620x620px. Images uploaded larger than that will be automatically cropped in the front end.',	NULL,	0,	NULL,	NULL,	NULL),
(81,	'findYourSpark',	'user_color',	NULL,	'input',	'{\"max\": 3, \"min\": 1}',	NULL,	NULL,	0,	0,	NULL,	'full',	NULL,	NULL,	NULL,	0,	NULL,	NULL,	NULL),
(82,	'visitorPosters',	'otherValue',	NULL,	'input',	'{\"placeholder\": \"If other...\"}',	NULL,	NULL,	0,	0,	NULL,	'full',	NULL,	NULL,	NULL,	0,	NULL,	NULL,	NULL),
(83,	'ping',	'value',	NULL,	'input',	NULL,	NULL,	NULL,	0,	0,	NULL,	'full',	NULL,	NULL,	NULL,	0,	NULL,	NULL,	NULL),
(97,	'superpowerChangemakers',	'matches',	'cast-json',	'list',	'{\"fields\": [{\"meta\": {\"note\": \"Specify a category (Required)\", \"type\": \"string\", \"field\": \"category\", \"options\": {\"choices\": [{\"text\": \"Arts & Culture\", \"value\": \"Arts & Culture\"}, {\"text\": \"Business & Innovation\", \"value\": \"Business & Innovation\"}, {\"text\": \"Science & Education\", \"value\": \"Science & Education\"}, {\"text\": \"Politics & Activism\", \"value\": \"Politics & Activism\"}, {\"text\": \"Athletics & Recreation\", \"value\": \"Athletics & Recreation\"}]}, \"interface\": \"select-dropdown\"}, \"name\": \"category\", \"type\": \"string\", \"field\": \"category\"}, {\"meta\": {\"note\": \"Specify a superpower (Required)\", \"type\": \"string\", \"field\": \"superpower\", \"options\": {\"choices\": [{\"text\": \"Courage\", \"value\": \"Courage\"}, {\"text\": \"Creativity\", \"value\": \"Creativity\"}, {\"text\": \"Curiosity\", \"value\": \"Curiosity\"}, {\"text\": \"Determination\", \"value\": \"Determination\"}, {\"text\": \"Empathy\", \"value\": \"Empathy\"}, {\"text\": \"Passion\", \"value\": \"Passion\"}, {\"text\": \"Resilience\", \"value\": \"Resilience\"}]}, \"interface\": \"select-dropdown\"}, \"name\": \"superpower\", \"type\": \"string\", \"field\": \"superpower\"}], \"addLabel\": \"Create New Attribute Pair\", \"template\": \"{{ category }} + {{ superpower }}\"}',	'formatted-json-value',	'{\"format\": \"{{ category }} + {{superpower }}\"}',	0,	0,	8,	'full',	'[{\"language\": \"en-US\", \"translation\": \"Attribute Matches\"}]',	'Specify one or more category and superpower combinations that define this person.',	NULL,	1,	NULL,	NULL,	NULL);

DROP TABLE IF EXISTS `directus_files`;
CREATE TABLE `directus_files` (
  `id` char(36) NOT NULL,
  `storage` varchar(255) NOT NULL,
  `filename_disk` varchar(255) DEFAULT NULL,
  `filename_download` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `folder` char(36) DEFAULT NULL,
  `uploaded_by` char(36) DEFAULT NULL,
  `uploaded_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` char(36) DEFAULT NULL,
  `modified_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `charset` varchar(50) DEFAULT NULL,
  `filesize` bigint DEFAULT NULL,
  `width` int unsigned DEFAULT NULL,
  `height` int unsigned DEFAULT NULL,
  `duration` int unsigned DEFAULT NULL,
  `embed` varchar(200) DEFAULT NULL,
  `description` text,
  `location` text,
  `tags` text,
  `metadata` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_files_uploaded_by_foreign` (`uploaded_by`),
  KEY `directus_files_modified_by_foreign` (`modified_by`),
  KEY `directus_files_folder_foreign` (`folder`),
  CONSTRAINT `directus_files_folder_foreign` FOREIGN KEY (`folder`) REFERENCES `directus_folders` (`id`) ON DELETE SET NULL,
  CONSTRAINT `directus_files_modified_by_foreign` FOREIGN KEY (`modified_by`) REFERENCES `directus_users` (`id`),
  CONSTRAINT `directus_files_uploaded_by_foreign` FOREIGN KEY (`uploaded_by`) REFERENCES `directus_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `directus_flows`;
CREATE TABLE `directus_flows` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `icon` varchar(30) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `description` text,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `trigger` varchar(255) DEFAULT NULL,
  `accountability` varchar(255) DEFAULT 'all',
  `options` json DEFAULT NULL,
  `operation` char(36) DEFAULT NULL,
  `date_created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_created` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `directus_flows_operation_unique` (`operation`),
  KEY `directus_flows_user_created_foreign` (`user_created`),
  CONSTRAINT `directus_flows_user_created_foreign` FOREIGN KEY (`user_created`) REFERENCES `directus_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `directus_folders`;
CREATE TABLE `directus_folders` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `parent` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_folders_parent_foreign` (`parent`),
  CONSTRAINT `directus_folders_parent_foreign` FOREIGN KEY (`parent`) REFERENCES `directus_folders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `directus_migrations`;
CREATE TABLE `directus_migrations` (
  `version` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `directus_migrations` (`version`, `name`, `timestamp`) VALUES
('20201028A',	'Remove Collection Foreign Keys',	'2023-01-23 21:00:38'),
('20201029A',	'Remove System Relations',	'2023-01-23 21:00:38'),
('20201029B',	'Remove System Collections',	'2023-01-23 21:00:38'),
('20201029C',	'Remove System Fields',	'2023-01-23 21:00:38'),
('20201105A',	'Add Cascade System Relations',	'2023-01-23 21:00:39'),
('20201105B',	'Change Webhook URL Type',	'2023-01-23 21:00:39'),
('20210225A',	'Add Relations Sort Field',	'2023-01-23 21:00:39'),
('20210304A',	'Remove Locked Fields',	'2023-01-23 21:00:39'),
('20210312A',	'Webhooks Collections Text',	'2023-01-23 21:00:39'),
('20210331A',	'Add Refresh Interval',	'2023-01-23 21:00:39'),
('20210415A',	'Make Filesize Nullable',	'2023-01-23 21:00:39'),
('20210416A',	'Add Collections Accountability',	'2023-01-23 21:00:40'),
('20210422A',	'Remove Files Interface',	'2023-01-23 21:00:40'),
('20210506A',	'Rename Interfaces',	'2023-01-23 21:00:40'),
('20210510A',	'Restructure Relations',	'2023-01-23 21:00:40'),
('20210518A',	'Add Foreign Key Constraints',	'2023-01-23 21:00:40'),
('20210519A',	'Add System Fk Triggers',	'2023-01-23 21:00:40'),
('20210521A',	'Add Collections Icon Color',	'2023-01-23 21:00:40'),
('20210525A',	'Add Insights',	'2023-01-23 21:00:40'),
('20210608A',	'Add Deep Clone Config',	'2023-01-23 21:00:40'),
('20210626A',	'Change Filesize Bigint',	'2023-01-23 21:00:40'),
('20210716A',	'Add Conditions to Fields',	'2023-01-23 21:00:40'),
('20210721A',	'Add Default Folder',	'2023-01-23 21:00:40'),
('20210802A',	'Replace Groups',	'2023-01-23 21:00:40'),
('20210803A',	'Add Required to Fields',	'2023-01-23 21:00:40'),
('20210805A',	'Update Groups',	'2023-01-23 21:00:40'),
('20210805B',	'Change Image Metadata Structure',	'2023-01-23 21:00:40'),
('20210811A',	'Add Geometry Config',	'2023-01-23 21:00:41'),
('20210831A',	'Remove Limit Column',	'2023-01-23 21:00:41'),
('20210903A',	'Add Auth Provider',	'2023-01-23 21:00:41'),
('20210907A',	'Webhooks Collections Not Null',	'2023-01-23 21:00:41'),
('20210910A',	'Move Module Setup',	'2023-01-23 21:00:41'),
('20210920A',	'Webhooks URL Not Null',	'2023-01-23 21:00:41'),
('20210924A',	'Add Collection Organization',	'2023-01-23 21:00:41'),
('20210927A',	'Replace Fields Group',	'2023-01-23 21:00:41'),
('20210927B',	'Replace M2M Interface',	'2023-01-23 21:00:41'),
('20210929A',	'Rename Login Action',	'2023-01-23 21:00:41'),
('20211007A',	'Update Presets',	'2023-01-23 21:00:41'),
('20211009A',	'Add Auth Data',	'2023-01-23 21:00:41'),
('20211016A',	'Add Webhook Headers',	'2023-01-23 21:00:41'),
('20211103A',	'Set Unique to User Token',	'2023-01-23 21:00:41'),
('20211103B',	'Update Special Geometry',	'2023-01-23 21:00:41'),
('20211104A',	'Remove Collections Listing',	'2023-01-23 21:00:41'),
('20211118A',	'Add Notifications',	'2023-01-23 21:00:41'),
('20211211A',	'Add Shares',	'2023-01-23 21:00:42'),
('20211230A',	'Add Project Descriptor',	'2023-01-23 21:00:42'),
('20220303A',	'Remove Default Project Color',	'2023-01-23 21:00:42'),
('20220308A',	'Add Bookmark Icon and Color',	'2023-01-23 21:00:42'),
('20220314A',	'Add Translation Strings',	'2023-01-23 21:00:42'),
('20220322A',	'Rename Field Typecast Flags',	'2023-01-23 21:00:42'),
('20220323A',	'Add Field Validation',	'2023-01-23 21:00:42'),
('20220325A',	'Fix Typecast Flags',	'2023-01-23 21:00:42'),
('20220325B',	'Add Default Language',	'2023-01-23 21:00:42'),
('20220402A',	'Remove Default Value Panel Icon',	'2023-01-23 21:00:42'),
('20220429A',	'Add Flows',	'2023-01-23 21:00:42'),
('20220429B',	'Add Color to Insights Icon',	'2023-01-23 21:00:42'),
('20220429C',	'Drop Non Null From IP of Activity',	'2023-01-23 21:00:42'),
('20220429D',	'Drop Non Null From Sender of Notifications',	'2023-01-23 21:00:42'),
('20220614A',	'Rename Hook Trigger to Event',	'2023-01-23 21:00:42'),
('20220801A',	'Update Notifications Timestamp Column',	'2023-01-23 21:00:42'),
('20220802A',	'Add Custom Aspect Ratios',	'2023-01-23 21:00:42'),
('20220826A',	'Add Origin to Accountability',	'2023-01-23 21:00:42');

DROP TABLE IF EXISTS `directus_notifications`;
CREATE TABLE `directus_notifications` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(255) DEFAULT 'inbox',
  `recipient` char(36) NOT NULL,
  `sender` char(36) DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text,
  `collection` varchar(64) DEFAULT NULL,
  `item` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_notifications_recipient_foreign` (`recipient`),
  KEY `directus_notifications_sender_foreign` (`sender`),
  CONSTRAINT `directus_notifications_recipient_foreign` FOREIGN KEY (`recipient`) REFERENCES `directus_users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `directus_notifications_sender_foreign` FOREIGN KEY (`sender`) REFERENCES `directus_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `directus_operations`;
CREATE TABLE `directus_operations` (
  `id` char(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `key` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `position_x` int NOT NULL,
  `position_y` int NOT NULL,
  `options` json DEFAULT NULL,
  `resolve` char(36) DEFAULT NULL,
  `reject` char(36) DEFAULT NULL,
  `flow` char(36) NOT NULL,
  `date_created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_created` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `directus_operations_resolve_unique` (`resolve`),
  UNIQUE KEY `directus_operations_reject_unique` (`reject`),
  KEY `directus_operations_flow_foreign` (`flow`),
  KEY `directus_operations_user_created_foreign` (`user_created`),
  CONSTRAINT `directus_operations_flow_foreign` FOREIGN KEY (`flow`) REFERENCES `directus_flows` (`id`) ON DELETE CASCADE,
  CONSTRAINT `directus_operations_reject_foreign` FOREIGN KEY (`reject`) REFERENCES `directus_operations` (`id`),
  CONSTRAINT `directus_operations_resolve_foreign` FOREIGN KEY (`resolve`) REFERENCES `directus_operations` (`id`),
  CONSTRAINT `directus_operations_user_created_foreign` FOREIGN KEY (`user_created`) REFERENCES `directus_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `directus_panels`;
CREATE TABLE `directus_panels` (
  `id` char(36) NOT NULL,
  `dashboard` char(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `icon` varchar(30) DEFAULT NULL,
  `color` varchar(10) DEFAULT NULL,
  `show_header` tinyint(1) NOT NULL DEFAULT '0',
  `note` text,
  `type` varchar(255) NOT NULL,
  `position_x` int NOT NULL,
  `position_y` int NOT NULL,
  `width` int NOT NULL,
  `height` int NOT NULL,
  `options` json DEFAULT NULL,
  `date_created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_created` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_panels_dashboard_foreign` (`dashboard`),
  KEY `directus_panels_user_created_foreign` (`user_created`),
  CONSTRAINT `directus_panels_dashboard_foreign` FOREIGN KEY (`dashboard`) REFERENCES `directus_dashboards` (`id`) ON DELETE CASCADE,
  CONSTRAINT `directus_panels_user_created_foreign` FOREIGN KEY (`user_created`) REFERENCES `directus_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `directus_permissions`;
CREATE TABLE `directus_permissions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `role` char(36) DEFAULT NULL,
  `collection` varchar(64) NOT NULL,
  `action` varchar(10) NOT NULL,
  `permissions` json DEFAULT NULL,
  `validation` json DEFAULT NULL,
  `presets` json DEFAULT NULL,
  `fields` text,
  PRIMARY KEY (`id`),
  KEY `directus_permissions_collection_foreign` (`collection`),
  KEY `directus_permissions_role_foreign` (`role`),
  CONSTRAINT `directus_permissions_role_foreign` FOREIGN KEY (`role`) REFERENCES `directus_roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `directus_permissions` (`id`, `role`, `collection`, `action`, `permissions`, `validation`, `presets`, `fields`) VALUES
(7,	NULL,	'directus_files',	'read',	'{}',	'{}',	NULL,	'*'),
(16,	NULL,	'changemakers',	'read',	'{}',	'{}',	NULL,	'*'),
(17,	NULL,	'changemakers',	'create',	'{}',	'{}',	NULL,	'*'),
(18,	NULL,	'changemakers',	'update',	'{}',	'{}',	NULL,	'*'),
(19,	NULL,	'changemakers',	'share',	'{}',	'{}',	NULL,	'*'),
(20,	NULL,	'changemakers',	'delete',	'{}',	'{}',	NULL,	'*'),
(21,	NULL,	'findYourSpark',	'create',	'{}',	'{}',	NULL,	'*'),
(22,	NULL,	'findYourSpark',	'read',	'{}',	'{}',	NULL,	'*'),
(23,	NULL,	'findYourSpark',	'delete',	'{}',	'{}',	NULL,	'*'),
(24,	NULL,	'findYourSpark',	'update',	'{}',	'{}',	NULL,	'*'),
(25,	NULL,	'findYourSpark',	'share',	'{}',	'{}',	NULL,	'*'),
(26,	NULL,	'directus_files',	'create',	'{}',	'{}',	NULL,	'*'),
(27,	NULL,	'directus_files',	'update',	'{}',	'{}',	NULL,	'*'),
(28,	NULL,	'directus_files',	'delete',	'{}',	'{}',	NULL,	'*'),
(29,	NULL,	'directus_files',	'share',	'{}',	'{}',	NULL,	'*'),
(40,	NULL,	'visitorPosters',	'create',	'{}',	'{}',	NULL,	'*'),
(41,	NULL,	'visitorPosters',	'update',	'{}',	'{}',	NULL,	'*'),
(42,	NULL,	'visitorPosters',	'delete',	'{}',	'{}',	NULL,	'*'),
(43,	NULL,	'visitorPosters',	'share',	'{}',	'{}',	NULL,	'*'),
(44,	NULL,	'visitorPosters',	'read',	'{}',	'{}',	NULL,	'*'),
(45,	NULL,	'issueNames',	'read',	'{}',	'{}',	NULL,	'*'),
(46,	NULL,	'issueNames',	'create',	'{}',	'{}',	NULL,	'*'),
(47,	NULL,	'issueNames',	'delete',	'{}',	'{}',	NULL,	'*'),
(48,	NULL,	'issueNames',	'update',	'{}',	'{}',	NULL,	'*'),
(49,	NULL,	'issueNames',	'share',	'{}',	'{}',	NULL,	'*'),
(50,	NULL,	'qualityNames',	'update',	'{}',	'{}',	NULL,	'*'),
(51,	NULL,	'qualityNames',	'create',	'{}',	'{}',	NULL,	'*'),
(52,	NULL,	'qualityNames',	'share',	'{}',	'{}',	NULL,	'*'),
(53,	NULL,	'qualityNames',	'delete',	'{}',	'{}',	NULL,	'*'),
(54,	NULL,	'qualityNames',	'read',	'{}',	'{}',	NULL,	'*'),
(55,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'directus_files',	'create',	'{}',	NULL,	NULL,	'*'),
(57,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'directus_files',	'update',	'{}',	NULL,	NULL,	'*'),
(58,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'directus_files',	'delete',	'{}',	NULL,	NULL,	'*'),
(59,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'directus_dashboards',	'create',	'{}',	NULL,	NULL,	'*'),
(60,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'directus_dashboards',	'read',	'{}',	NULL,	NULL,	'*'),
(61,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'directus_dashboards',	'update',	'{}',	NULL,	NULL,	'*'),
(62,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'directus_dashboards',	'delete',	'{}',	NULL,	NULL,	'*'),
(63,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'directus_panels',	'create',	'{}',	NULL,	NULL,	'*'),
(64,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'directus_panels',	'read',	'{}',	NULL,	NULL,	'*'),
(65,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'directus_panels',	'update',	'{}',	NULL,	NULL,	'*'),
(66,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'directus_panels',	'delete',	'{}',	NULL,	NULL,	'*'),
(67,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'directus_folders',	'create',	'{}',	NULL,	NULL,	'*'),
(69,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'directus_folders',	'update',	'{}',	NULL,	NULL,	'*'),
(70,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'directus_folders',	'delete',	'{}',	NULL,	NULL,	NULL),
(71,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'directus_users',	'read',	'{}',	NULL,	NULL,	'*'),
(72,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'directus_users',	'update',	'{\"id\": {\"_eq\": \"$CURRENT_USER\"}}',	NULL,	NULL,	'first_name,last_name,email,password,location,title,description,avatar,language,theme,tfa_secret'),
(73,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'directus_roles',	'read',	'{}',	NULL,	NULL,	'*'),
(74,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'directus_shares',	'read',	'{\"_or\": [{\"role\": {\"_eq\": \"$CURRENT_ROLE\"}}, {\"role\": {\"_null\": true}}]}',	NULL,	NULL,	'*'),
(75,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'directus_shares',	'create',	'{}',	NULL,	NULL,	'*'),
(76,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'directus_shares',	'update',	'{\"user_created\": {\"_eq\": \"$CURRENT_USER\"}}',	NULL,	NULL,	'*'),
(77,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'directus_shares',	'delete',	'{\"user_created\": {\"_eq\": \"$CURRENT_USER\"}}',	NULL,	NULL,	'*'),
(78,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'directus_flows',	'read',	'{\"trigger\": {\"_eq\": \"manual\"}}',	NULL,	NULL,	'id,name,icon,color,options,trigger'),
(79,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'changemakers',	'read',	'{}',	'{}',	NULL,	'*'),
(80,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'changemakers',	'create',	'{}',	'{}',	NULL,	'*'),
(81,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'changemakers',	'update',	'{}',	'{}',	NULL,	'*'),
(82,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'changemakers',	'share',	'{}',	'{}',	NULL,	'*'),
(83,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'changemakers',	'delete',	'{}',	'{}',	NULL,	'*'),
(84,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'findYourSpark',	'create',	'{}',	'{}',	NULL,	'*'),
(85,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'findYourSpark',	'read',	'{}',	'{}',	NULL,	'*'),
(86,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'findYourSpark',	'update',	'{}',	'{}',	NULL,	'*'),
(87,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'findYourSpark',	'delete',	'{}',	'{}',	NULL,	'*'),
(88,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'findYourSpark',	'share',	'{}',	'{}',	NULL,	'*'),
(89,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'issueNames',	'read',	'{}',	'{}',	NULL,	'*'),
(90,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'issueNames',	'create',	'{}',	'{}',	NULL,	'*'),
(91,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'issueNames',	'update',	'{}',	'{}',	NULL,	'*'),
(92,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'issueNames',	'share',	'{}',	'{}',	NULL,	'*'),
(93,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'issueNames',	'delete',	'{}',	'{}',	NULL,	'*'),
(94,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'qualityNames',	'read',	'{}',	'{}',	NULL,	'*'),
(95,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'qualityNames',	'create',	'{}',	'{}',	NULL,	'*'),
(96,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'qualityNames',	'update',	'{}',	'{}',	NULL,	'*'),
(97,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'qualityNames',	'delete',	'{}',	'{}',	NULL,	'*'),
(98,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'qualityNames',	'share',	'{}',	'{}',	NULL,	'*'),
(99,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'visitorPosters',	'create',	'{}',	'{}',	NULL,	'*'),
(100,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'visitorPosters',	'read',	'{}',	'{}',	NULL,	'*'),
(101,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'visitorPosters',	'delete',	'{}',	'{}',	NULL,	'*'),
(102,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'visitorPosters',	'update',	'{}',	'{}',	NULL,	'*'),
(103,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'visitorPosters',	'share',	'{}',	'{}',	NULL,	'*'),
(104,	NULL,	'quizAttributes',	'delete',	'{}',	'{}',	NULL,	'*'),
(105,	NULL,	'quizAttributes',	'read',	'{}',	'{}',	NULL,	'*'),
(106,	NULL,	'quizAttributes',	'share',	'{}',	'{}',	NULL,	'*'),
(107,	NULL,	'quizAttributes',	'update',	'{}',	'{}',	NULL,	'*'),
(108,	NULL,	'quizAttributes',	'create',	'{}',	'{}',	NULL,	'*'),
(109,	NULL,	'quizCategories',	'create',	'{}',	'{}',	NULL,	'*'),
(110,	NULL,	'quizCategories',	'read',	'{}',	'{}',	NULL,	'*'),
(111,	NULL,	'quizCategories',	'update',	'{}',	'{}',	NULL,	'*'),
(112,	NULL,	'quizCategories',	'delete',	'{}',	'{}',	NULL,	'*'),
(113,	NULL,	'quizCategories',	'share',	'{}',	'{}',	NULL,	'*'),
(114,	NULL,	'superpowerChangemakers',	'read',	'{}',	'{}',	NULL,	'*'),
(115,	NULL,	'superpowerChangemakers',	'create',	'{}',	'{}',	NULL,	'*'),
(116,	NULL,	'superpowerChangemakers',	'update',	'{}',	'{}',	NULL,	'*'),
(117,	NULL,	'superpowerChangemakers',	'delete',	'{}',	'{}',	NULL,	'*'),
(118,	NULL,	'superpowerChangemakers',	'share',	'{}',	'{}',	NULL,	'*'),
(119,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'quizAttributes',	'update',	'{}',	'{}',	NULL,	'*'),
(120,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'quizAttributes',	'create',	'{}',	'{}',	NULL,	'*'),
(121,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'quizAttributes',	'read',	'{}',	'{}',	NULL,	'*'),
(122,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'quizAttributes',	'share',	'{}',	'{}',	NULL,	'*'),
(123,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'quizAttributes',	'delete',	'{}',	'{}',	NULL,	'*'),
(124,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'quizCategories',	'create',	'{}',	'{}',	NULL,	'*'),
(125,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'quizCategories',	'update',	'{}',	'{}',	NULL,	'*'),
(126,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'quizCategories',	'read',	'{}',	'{}',	NULL,	'*'),
(127,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'quizCategories',	'delete',	'{}',	'{}',	NULL,	'*'),
(128,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'quizCategories',	'share',	'{}',	'{}',	NULL,	'*'),
(129,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'superpowerChangemakers',	'create',	'{}',	'{}',	NULL,	'*'),
(130,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'superpowerChangemakers',	'read',	'{}',	'{}',	NULL,	'*'),
(131,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'superpowerChangemakers',	'update',	'{}',	'{}',	NULL,	'*'),
(132,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'superpowerChangemakers',	'delete',	'{}',	'{}',	NULL,	'*'),
(133,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'superpowerChangemakers',	'share',	'{}',	'{}',	NULL,	'*'),
(134,	NULL,	'ping',	'read',	'{}',	'{}',	NULL,	'*'),
(135,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'ping',	'read',	'{}',	'{}',	NULL,	'*'),
(136,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'directus_users',	'create',	'{}',	NULL,	NULL,	'first_name,last_name,email,password,avatar,location,title,description,tags,preferences_divider,language,theme,tfa_secret,email_notifications,admin_divider,status,token,id,last_page,last_access,provider,external_identifier,auth_data'),
(137,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'directus_files',	'read',	'{}',	'{}',	NULL,	'*'),
(138,	'e9e725cd-25a0-4c96-8677-1a0dc4793150',	'directus_folders',	'read',	'{}',	'{}',	NULL,	'*'),
(139,	NULL,	'ping',	'create',	'{}',	'{}',	NULL,	'*');

DROP TABLE IF EXISTS `directus_presets`;
CREATE TABLE `directus_presets` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `bookmark` varchar(255) DEFAULT NULL,
  `user` char(36) DEFAULT NULL,
  `role` char(36) DEFAULT NULL,
  `collection` varchar(64) DEFAULT NULL,
  `search` varchar(100) DEFAULT NULL,
  `layout` varchar(100) DEFAULT 'tabular',
  `layout_query` json DEFAULT NULL,
  `layout_options` json DEFAULT NULL,
  `refresh_interval` int DEFAULT NULL,
  `filter` json DEFAULT NULL,
  `icon` varchar(30) NOT NULL DEFAULT 'bookmark_outline',
  `color` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_presets_collection_foreign` (`collection`),
  KEY `directus_presets_user_foreign` (`user`),
  KEY `directus_presets_role_foreign` (`role`),
  CONSTRAINT `directus_presets_role_foreign` FOREIGN KEY (`role`) REFERENCES `directus_roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `directus_presets_user_foreign` FOREIGN KEY (`user`) REFERENCES `directus_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `directus_presets` (`id`, `bookmark`, `user`, `role`, `collection`, `search`, `layout`, `layout_query`, `layout_options`, `refresh_interval`, `filter`, `icon`, `color`) VALUES
(1,	NULL,	NULL,	NULL,	'directus_users',	NULL,	'cards',	'{\"cards\": {\"page\": 1, \"sort\": [\"email\"]}}',	'{\"cards\": {\"icon\": \"account_circle\", \"size\": 4, \"title\": \"{{ first_name }} {{ last_name }}\", \"subtitle\": \"{{ email }}\"}}',	NULL,	NULL,	'bookmark_outline',	NULL),
(3,	NULL,	NULL,	NULL,	'findYourSpark',	NULL,	'cards',	'{\"cards\": {\"page\": 1}}',	'{\"cards\": {\"icon\": \"person\", \"title\": \"{{name}}\", \"imageFit\": \"crop\", \"subtitle\": \"{{dateAdded}}\"}}',	NULL,	NULL,	'person',	NULL),
(5,	NULL,	NULL,	NULL,	'changemakers',	NULL,	'cards',	NULL,	'{\"cards\": {\"title\": \"{{name}}\", \"subtitle\": \"Approved: {{approved}}\", \"imageSource\": \"changemakerImage\"}}',	NULL,	NULL,	'account_circle',	NULL),
(10,	NULL,	NULL,	NULL,	'directus_presets',	NULL,	NULL,	'{\"tabular\": {\"fields\": [\"bookmark\", \"collection\", \"id\", \"role\", \"user\"]}}',	'{\"tabular\": {\"widths\": {\"user\": 354, \"collection\": 237}}}',	NULL,	NULL,	'bookmark_outline',	NULL),
(13,	NULL,	NULL,	NULL,	'visitorPosters',	NULL,	'cards',	'{\"tabular\": {\"page\": 1}}',	'{\"cards\": {\"size\": 5, \"title\": \"{{quality.name}} about {{issue.name}}\", \"imageFit\": \"contain\", \"subtitle\": \"{{dateAdded}}\"}}',	NULL,	NULL,	'bookmark_outline',	NULL),
(14,	NULL,	NULL,	NULL,	'qualityNames',	NULL,	'tabular',	'{\"tabular\": {\"page\": 1, \"sort\": [\"name\"], \"fields\": [\"name\"]}}',	'{\"tabular\": {\"widths\": {\"key\": 104, \"name\": 343}}}',	NULL,	NULL,	'bookmark_outline',	NULL),
(15,	NULL,	NULL,	NULL,	'issueNames',	NULL,	'tabular',	'{\"tabular\": {\"page\": 1, \"sort\": [\"name\"], \"fields\": [\"name\"]}}',	'{\"tabular\": {\"widths\": {\"key\": 109, \"name\": 358}}}',	NULL,	NULL,	'bookmark_outline',	NULL),
(16,	NULL,	NULL,	NULL,	'quizCategories',	NULL,	'tabular',	'{\"tabular\": {\"page\": 1, \"fields\": [\"category\"]}}',	'{\"tabular\": {\"widths\": {\"category\": 328}}}',	NULL,	NULL,	'bookmark_outline',	NULL),
(17,	NULL,	NULL,	NULL,	'quizAttributes',	NULL,	'tabular',	'{\"tabular\": {\"page\": 1}}',	'{\"tabular\": {\"widths\": {\"attribute\": 227}}}',	NULL,	NULL,	'bookmark_outline',	NULL),
(18,	NULL,	NULL,	NULL,	'superpowerChangemakers',	NULL,	'cards',	NULL,	'{\"cards\": {\"size\": 5, \"title\": \"{{name}} / {{title}}\", \"imageFit\": \"contain\", \"subtitle\": \"{{matches}}\"}}',	NULL,	NULL,	'bookmark_outline',	NULL),
(23,	NULL,	NULL,	NULL,	'visitorPosters',	NULL,	'cards',	'{\"tabular\": {\"page\": 1}}',	'{\"cards\": {\"size\": 5, \"title\": \"{{quality.name}} about {{issue.name}}\", \"imageFit\": \"contain\", \"subtitle\": \"{{dateAdded}}\", \"imageSource\": \"posterImage\"}}',	NULL,	NULL,	'bookmark_outline',	NULL),
(36,	NULL,	NULL,	NULL,	'directus_files',	NULL,	'cards',	'{\"cards\": {\"page\": 1, \"sort\": [\"-uploaded_on\"]}}',	'{\"cards\": {\"icon\": \"insert_drive_file\", \"size\": 4, \"title\": \"{{ title }}\", \"imageFit\": \"crop\", \"subtitle\": \"{{ type }} • {{ filesize }}\"}}',	NULL,	NULL,	'bookmark_outline',	NULL);

DROP TABLE IF EXISTS `directus_relations`;
CREATE TABLE `directus_relations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `many_collection` varchar(64) NOT NULL,
  `many_field` varchar(64) NOT NULL,
  `one_collection` varchar(64) DEFAULT NULL,
  `one_field` varchar(64) DEFAULT NULL,
  `one_collection_field` varchar(64) DEFAULT NULL,
  `one_allowed_collections` text,
  `junction_field` varchar(64) DEFAULT NULL,
  `sort_field` varchar(64) DEFAULT NULL,
  `one_deselect_action` varchar(255) NOT NULL DEFAULT 'nullify',
  PRIMARY KEY (`id`),
  KEY `directus_relations_many_collection_foreign` (`many_collection`),
  KEY `directus_relations_one_collection_foreign` (`one_collection`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `directus_relations` (`id`, `many_collection`, `many_field`, `one_collection`, `one_field`, `one_collection_field`, `one_allowed_collections`, `junction_field`, `sort_field`, `one_deselect_action`) VALUES
(1,	'findYourSpark',	'personImage',	'directus_files',	NULL,	NULL,	NULL,	NULL,	NULL,	'nullify'),
(3,	'changemakers',	'changemakerImage',	'directus_files',	NULL,	NULL,	NULL,	NULL,	NULL,	'nullify'),
(10,	'visitorPosters',	'posterImage',	'directus_files',	NULL,	NULL,	NULL,	NULL,	NULL,	'nullify'),
(12,	'visitorPosters',	'quality',	'qualityNames',	NULL,	NULL,	NULL,	NULL,	NULL,	'nullify'),
(13,	'visitorPosters',	'issue',	'issueNames',	NULL,	NULL,	NULL,	NULL,	NULL,	'nullify'),
(14,	'superpowerChangemakers',	'changemakerImage',	'directus_files',	NULL,	NULL,	NULL,	NULL,	NULL,	'nullify');

DROP TABLE IF EXISTS `directus_revisions`;
CREATE TABLE `directus_revisions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `activity` int unsigned NOT NULL,
  `collection` varchar(64) NOT NULL,
  `item` varchar(255) NOT NULL,
  `data` json DEFAULT NULL,
  `delta` json DEFAULT NULL,
  `parent` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_revisions_collection_foreign` (`collection`),
  KEY `directus_revisions_parent_foreign` (`parent`),
  KEY `directus_revisions_activity_foreign` (`activity`),
  CONSTRAINT `directus_revisions_activity_foreign` FOREIGN KEY (`activity`) REFERENCES `directus_activity` (`id`) ON DELETE CASCADE,
  CONSTRAINT `directus_revisions_parent_foreign` FOREIGN KEY (`parent`) REFERENCES `directus_revisions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `directus_roles`;
CREATE TABLE `directus_roles` (
  `id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `icon` varchar(30) NOT NULL DEFAULT 'supervised_user_circle',
  `description` text,
  `ip_access` text,
  `enforce_tfa` tinyint(1) NOT NULL DEFAULT '0',
  `admin_access` tinyint(1) NOT NULL DEFAULT '0',
  `app_access` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `directus_roles` (`id`, `name`, `icon`, `description`, `ip_access`, `enforce_tfa`, `admin_access`, `app_access`) VALUES
('d540be12-f2c9-46ce-a0fd-3b874b63daaf',	'Administrator',	'verified',	'$t:admin_description',	NULL,	0,	1,	1),
('e9e725cd-25a0-4c96-8677-1a0dc4793150',	'API Users',	'supervised_user_circle',	NULL,	NULL,	0,	0,	1);

DROP TABLE IF EXISTS `directus_sessions`;
CREATE TABLE `directus_sessions` (
  `token` varchar(64) NOT NULL,
  `user` char(36) DEFAULT NULL,
  `expires` timestamp NOT NULL,
  `ip` varchar(255) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `share` char(36) DEFAULT NULL,
  `origin` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`token`),
  KEY `directus_sessions_user_foreign` (`user`),
  KEY `directus_sessions_share_foreign` (`share`),
  CONSTRAINT `directus_sessions_share_foreign` FOREIGN KEY (`share`) REFERENCES `directus_shares` (`id`) ON DELETE CASCADE,
  CONSTRAINT `directus_sessions_user_foreign` FOREIGN KEY (`user`) REFERENCES `directus_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `directus_settings`;
CREATE TABLE `directus_settings` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `project_name` varchar(100) NOT NULL DEFAULT 'Directus',
  `project_url` varchar(255) DEFAULT NULL,
  `project_color` varchar(50) DEFAULT NULL,
  `project_logo` char(36) DEFAULT NULL,
  `public_foreground` char(36) DEFAULT NULL,
  `public_background` char(36) DEFAULT NULL,
  `public_note` text,
  `auth_login_attempts` int unsigned DEFAULT '25',
  `auth_password_policy` varchar(100) DEFAULT NULL,
  `storage_asset_transform` varchar(7) DEFAULT 'all',
  `storage_asset_presets` json DEFAULT NULL,
  `custom_css` text,
  `storage_default_folder` char(36) DEFAULT NULL,
  `basemaps` json DEFAULT NULL,
  `mapbox_key` varchar(255) DEFAULT NULL,
  `module_bar` json DEFAULT NULL,
  `project_descriptor` varchar(100) DEFAULT NULL,
  `translation_strings` json DEFAULT NULL,
  `default_language` varchar(255) NOT NULL DEFAULT 'en-US',
  `custom_aspect_ratios` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_settings_project_logo_foreign` (`project_logo`),
  KEY `directus_settings_public_foreground_foreign` (`public_foreground`),
  KEY `directus_settings_public_background_foreign` (`public_background`),
  KEY `directus_settings_storage_default_folder_foreign` (`storage_default_folder`),
  CONSTRAINT `directus_settings_project_logo_foreign` FOREIGN KEY (`project_logo`) REFERENCES `directus_files` (`id`),
  CONSTRAINT `directus_settings_public_background_foreign` FOREIGN KEY (`public_background`) REFERENCES `directus_files` (`id`),
  CONSTRAINT `directus_settings_public_foreground_foreign` FOREIGN KEY (`public_foreground`) REFERENCES `directus_files` (`id`),
  CONSTRAINT `directus_settings_storage_default_folder_foreign` FOREIGN KEY (`storage_default_folder`) REFERENCES `directus_folders` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `directus_settings` (`id`, `project_name`, `project_url`, `project_color`, `project_logo`, `public_foreground`, `public_background`, `public_note`, `auth_login_attempts`, `auth_password_policy`, `storage_asset_transform`, `storage_asset_presets`, `custom_css`, `storage_default_folder`, `basemaps`, `mapbox_key`, `module_bar`, `project_descriptor`, `translation_strings`, `default_language`, `custom_aspect_ratios`) VALUES
(1,	'What’s Your Story',	NULL,	'#B51A00',	NULL,	NULL,	NULL,	NULL,	25,	'/^.{8,}$/',	'all',	'[{\"fit\": \"cover\", \"key\": \"spark-image\", \"width\": 878, \"format\": \"jpeg\", \"height\": 960, \"quality\": 90, \"transforms\": [], \"withoutEnlargement\": true}, {\"fit\": \"cover\", \"key\": \"superpower\", \"width\": 620, \"format\": \"jpeg\", \"height\": 620, \"quality\": 90, \"transforms\": [[\"grayscale\"]], \"withoutEnlargement\": false}]',	'#app, #main-content, body {\n  --primary-alt: #F0D1CC !important;\n  --primary-10: #F0D1CC !important;\n  --primary-25: #E1A399 !important;\n  --primary-50: #D37666 !important;\n  --primary-75: #C44833 !important;\n  --primary-90: #B43A2A !important;\n\n  --primary: #B51A00 !important;\n\n  --primary-110: #911500 !important;\n  --primary-125: #741100 !important;\n  --primary-150: #5D0D00 !important;\n  --primary-175: #5A150D !important;\n  --primary-190: #4A0B00 !important;\n}\n',	NULL,	NULL,	NULL,	NULL,	'Client CMS',	NULL,	'en-US',	NULL);

DROP TABLE IF EXISTS `directus_shares`;
CREATE TABLE `directus_shares` (
  `id` char(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `collection` varchar(64) DEFAULT NULL,
  `item` varchar(255) DEFAULT NULL,
  `role` char(36) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `user_created` char(36) DEFAULT NULL,
  `date_created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `date_start` timestamp NULL DEFAULT NULL,
  `date_end` timestamp NULL DEFAULT NULL,
  `times_used` int DEFAULT '0',
  `max_uses` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_shares_collection_foreign` (`collection`),
  KEY `directus_shares_role_foreign` (`role`),
  KEY `directus_shares_user_created_foreign` (`user_created`),
  CONSTRAINT `directus_shares_collection_foreign` FOREIGN KEY (`collection`) REFERENCES `directus_collections` (`collection`) ON DELETE CASCADE,
  CONSTRAINT `directus_shares_role_foreign` FOREIGN KEY (`role`) REFERENCES `directus_roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `directus_shares_user_created_foreign` FOREIGN KEY (`user_created`) REFERENCES `directus_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `directus_users`;
CREATE TABLE `directus_users` (
  `id` char(36) NOT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `email` varchar(128) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `title` varchar(50) DEFAULT NULL,
  `description` text,
  `tags` json DEFAULT NULL,
  `avatar` char(36) DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `theme` varchar(20) DEFAULT 'auto',
  `tfa_secret` varchar(255) DEFAULT NULL,
  `status` varchar(16) NOT NULL DEFAULT 'active',
  `role` char(36) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `last_access` timestamp NULL DEFAULT NULL,
  `last_page` varchar(255) DEFAULT NULL,
  `provider` varchar(128) NOT NULL DEFAULT 'default',
  `external_identifier` varchar(255) DEFAULT NULL,
  `auth_data` json DEFAULT NULL,
  `email_notifications` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `directus_users_external_identifier_unique` (`external_identifier`),
  UNIQUE KEY `directus_users_email_unique` (`email`),
  UNIQUE KEY `directus_users_token_unique` (`token`),
  KEY `directus_users_role_foreign` (`role`),
  CONSTRAINT `directus_users_role_foreign` FOREIGN KEY (`role`) REFERENCES `directus_roles` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `directus_users` (`id`, `first_name`, `last_name`, `email`, `password`, `location`, `title`, `description`, `tags`, `avatar`, `language`, `theme`, `tfa_secret`, `status`, `role`, `token`, `last_access`, `last_page`, `provider`, `external_identifier`, `auth_data`, `email_notifications`) VALUES
('cf8fb5c7-2a30-419f-894d-531c11ddebe8',	'Admin',	'User',	'no-reply@directus.io',	'$argon2id$v=19$m=65536,t=3,p=4$jSoEbtVLV4mzF64T1MYg+w$mV4dz/AqXZ3++4UvcSRamnND81uBbNzrQjDeiv2qJ9o',	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'auto',	NULL,	'active',	'd540be12-f2c9-46ce-a0fd-3b874b63daaf',	'',	'2023-04-24 20:23:01',	'/content/findYourSpark',	'default',	NULL,	NULL,	1);

DROP TABLE IF EXISTS `directus_webhooks`;
CREATE TABLE `directus_webhooks` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `method` varchar(10) NOT NULL DEFAULT 'POST',
  `url` varchar(255) NOT NULL,
  `status` varchar(10) NOT NULL DEFAULT 'active',
  `data` tinyint(1) NOT NULL DEFAULT '1',
  `actions` varchar(100) NOT NULL,
  `collections` varchar(255) NOT NULL,
  `headers` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `findYourSpark`;
CREATE TABLE `findYourSpark` (
  `id` char(36) NOT NULL,
  `dateAdded` timestamp NOT NULL,
  `approved` tinyint(1) DEFAULT '1',
  `sticky` tinyint(1) DEFAULT '0',
  `name` varchar(255) NOT NULL,
  `prompt` varchar(255) NOT NULL DEFAULT 'and I want to live in a world where',
  `caresAbout` varchar(255) NOT NULL,
  `statement` varchar(255) NOT NULL,
  `personImage` char(36) DEFAULT NULL,
  `user_color` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `findyourspark_personimage_foreign` (`personImage`),
  CONSTRAINT `findyourspark_personimage_foreign` FOREIGN KEY (`personImage`) REFERENCES `directus_files` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `issueNames`;
CREATE TABLE `issueNames` (
  `key` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `issueNames` (`key`, `name`) VALUES
('AE',	'Arts & Entertainment'),
('CP',	'Cultural Preservation'),
('EDU',	'Education'),
('EHR',	'Equality & Human Rights'),
('EI',	'Entrepreneurship & Innovation'),
('ENV',	'The Environment'),
('GB',	'Giving Back'),
('GLB',	'Global'),
('HM',	'Health & Medicine'),
('OTH',	'eagles'),
('PS',	'Safety & Community'),
('REC',	'Sports & Recreation');

DROP TABLE IF EXISTS `ping`;
CREATE TABLE `ping` (
  `value` varchar(255) NOT NULL,
  PRIMARY KEY (`value`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `ping` (`value`) VALUES
('success');

DROP TABLE IF EXISTS `qualityNames`;
CREATE TABLE `qualityNames` (
  `key` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `qualityNames` (`key`, `name`) VALUES
('CO',	'Courage'),
('CR',	'Creativity'),
('CU',	'Curiosity'),
('DE',	'Determination'),
('EM',	'Empathy'),
('PA',	'Passion'),
('RE',	'Resilience');

DROP TABLE IF EXISTS `quizAttributes`;
CREATE TABLE `quizAttributes` (
  `key` varchar(255) NOT NULL,
  `attribute` varchar(255) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `quizAttributes` (`key`, `attribute`) VALUES
('courage',	'Courage'),
('creativity',	'Creativity'),
('curiosity',	'Curiosity'),
('determination',	'Determination'),
('empathy',	'Empathy'),
('passion',	'Passion'),
('resilience',	'Resilience');

DROP TABLE IF EXISTS `quizCategories`;
CREATE TABLE `quizCategories` (
  `key` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `quizCategories` (`key`, `category`) VALUES
('Arts & Culture',	'Arts & Culture'),
('Athletics & Outdoor Recreation',	'Athletics & Outdoor Recreation'),
('Business and Innovation',	'Business and Innovation'),
('Politics & Activism',	'Politics & Activism'),
('Science, Medicine, and Education',	'Science, Medicine, and Education'),
('SME',	'Science, Medicine, and Education');

DROP TABLE IF EXISTS `superpowerChangemakers`;
CREATE TABLE `superpowerChangemakers` (
  `id` char(36) NOT NULL,
  `dateAdded` timestamp NULL DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `bio` text NOT NULL,
  `changemakerImage` char(36) DEFAULT NULL,
  `matches` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `superpowerchangemakers_changemakerimage_foreign` (`changemakerImage`),
  CONSTRAINT `superpowerchangemakers_changemakerimage_foreign` FOREIGN KEY (`changemakerImage`) REFERENCES `directus_files` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `visitorPosters`;
CREATE TABLE `visitorPosters` (
  `id` char(36) NOT NULL,
  `dateAdded` timestamp NULL DEFAULT NULL,
  `approved` tinyint(1) DEFAULT '1',
  `sticky` tinyint(1) DEFAULT '1',
  `stationID` varchar(255) DEFAULT NULL,
  `posterImage` char(36) DEFAULT NULL,
  `quality` varchar(255) DEFAULT NULL,
  `issue` varchar(255) DEFAULT NULL,
  `otherValue` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `visitorposters_posterimage_foreign` (`posterImage`),
  KEY `visitorposters_quality_foreign` (`quality`),
  KEY `visitorposters_issue_foreign` (`issue`),
  CONSTRAINT `visitorposters_issue_foreign` FOREIGN KEY (`issue`) REFERENCES `issueNames` (`key`),
  CONSTRAINT `visitorposters_posterimage_foreign` FOREIGN KEY (`posterImage`) REFERENCES `directus_files` (`id`) ON DELETE CASCADE,
  CONSTRAINT `visitorposters_quality_foreign` FOREIGN KEY (`quality`) REFERENCES `qualityNames` (`key`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;