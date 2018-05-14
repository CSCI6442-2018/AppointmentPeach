CREATE TABLE `ap_time_slots` (
  `provider_id` INT UNSIGNED NOT NULL,
  `date`        date         NOT NULL,
  `time`        INT          NOT NULL,
  `appt_id`     INT UNSIGNED DEFAULT NULL
);
CREATE TABLE `ap_appt_types` (
  `appt_type_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title`        VARCHAR(255) NOT NULL DEFAULT '',
  `description`  text,
  `icon`         VARCHAR(255)          DEFAULT NULL,
  `duration`     INT          NOT NULL,
  `active`       INT                   DEFAULT 1,
  PRIMARY KEY (`appt_type_id`)
);
CREATE TABLE `ap_appointments` (
  `appt_id`        INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `provider_id`    INT UNSIGNED NOT NULL,
  `customer_id`    INT UNSIGNED NOT NULL,
  `appt_type_id`   INT UNSIGNED NOT NULL,
  `note`           text,
  `status`         VARCHAR(255)          DEFAULT NULL,
  `request`        VARCHAR(50)           DEFAULT NULL,
  `request_note`   text,
  `request_status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`appt_id`)
);
CREATE TABLE `ap_provider_appt_types` (
  `provider_id`  INT UNSIGNED NOT NULL,
  `appt_type_id` INT UNSIGNED NOT NULL
);