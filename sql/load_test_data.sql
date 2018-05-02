INSERT INTO `ap_locations` (`name`)
VALUES
    ('Chicago'),
    ('DC'),
    ('Houston'),
    ('Los Angeles'),
    ('New York City'),
    ('Phoneix'),
    ('San Antonio'),
    ('San Diego');

INSERT INTO `ap_users` (`user_id`, `wp_user_id`, `name`, `location`, `phone`, `email`, `role`)
VALUES
    (1, NULL, 'Zhao', 'New York City', '(111) 111-1111', 'zhao@ap', 'customer'),
    (2, NULL, 'Qian', 'New York City', '(222) 222-2222', 'qian@ap', 'provider'),
    (3, NULL, 'Sun', 'Los Angeles', '(333) 333-3333', 'sun@ap', 'provider'),
    (4, NULL, 'Li', 'Los Angeles', '(444) 444-4444', 'li@ap', 'customer');
    
INSERT INTO `ap_appt_types` (`appt_type_id`, `title`, `description`, `icon`, `duration`)
VALUES
    (1, 'Cosmetic', 'With the help of cosmetic dentistry, you can improve your smile and have teeth you are proud of. Aspen Dental practices offer several cosmetic dentistry options, including teeth whitening and veneers.', NULL, 2),
    (2, 'Filling', 'Most people need at least one tooth filling in their lifetime. Dental fillings are most commonly used to treat cavities, but they’re also used to repair cracked or broken teeth, or teeth that have been worn down over time.', NULL, 2),
    (3, 'Implant', 'Dental implants can help you smile more confidently. A dental implant is permanent and is an effective, attractive, secure way to fill gaps in your smile—all while preserving your existing teeth. ', NULL, 4),
    (4, 'Root Canal', 'Root canals are common procedures and can help save your tooth from extraction. Dentists at Aspen Dental practices have been safely and expertly performing root canal procedures for over two decades. ', NULL, 4),
    (5, 'Crowns', 'Dental crowns are a secure way to fill gaps and help restore your smile if you have missing or damaged teeth. A crown can also help you bite and chew better, which can positively impact other systems in your body, such as a your digestive system.', NULL, 3),
    (6, 'Tooth Extraction ', 'Natural teeth are ideal for biting, chewing and maintaining mouth and jawbone structure, which is why a dentist’s first priority is to help restore, save and repair your natural teeth. However, sometimes a tooth extraction is unavoidable.', NULL, 2);
    
INSERT INTO `ap_provider_appt_types` (`provider_id`, `appt_type_id`)
VALUES
    (2, 1),
    (2, 2),
    (2, 3),
    (2, 4),
    (2, 5),
    (3, 1),
    (3, 2),
    (3, 3),
    (3, 4),
    (3, 5),
    (3, 6);

INSERT INTO `ap_time_slots` (`provider_id`, `date`, `time`, `appt_id`)
VALUES
    (2, '2018-04-09', 18, 1),
    (2, '2018-04-09', 19, 1),
    (2, '2018-04-09', 20, NULL),
    (2, '2018-04-09', 21, NULL),
    (2, '2018-04-09', 22, NULL),
    (2, '2018-04-09', 23, NULL),
    (2, '2018-04-09', 26, NULL),
    (2, '2018-04-09', 27, NULL),
    (2, '2018-04-09', 28, NULL),
    (2, '2018-04-09', 29, NULL),
    (2, '2018-04-09', 30, NULL),
    (2, '2018-04-09', 31, NULL),
    (2, '2018-04-09', 32, NULL),
    (2, '2018-04-09', 33, NULL),
    (2, '2018-04-09', 34, NULL),
    (2, '2018-04-10', 18, NULL),
    (2, '2018-04-10', 19, NULL),
    (2, '2018-04-10', 20, 2),
    (2, '2018-04-10', 21, 2),
    (2, '2018-04-10', 22, NULL),
    (2, '2018-04-10', 23, NULL),
    (2, '2018-04-10', 26, NULL),
    (2, '2018-04-10', 27, NULL),
    (2, '2018-04-10', 28, NULL),
    (2, '2018-04-10', 29, NULL),
    (2, '2018-04-10', 30, NULL),
    (2, '2018-04-10', 31, NULL),
    (2, '2018-04-10', 32, NULL),
    (2, '2018-04-10', 33, NULL),
    (2, '2018-04-10', 34, NULL),
    (2, '2018-04-11', 18, NULL),
    (2, '2018-04-11', 19, NULL),
    (2, '2018-04-11', 20, NULL),
    (2, '2018-04-11', 21, 3),
    (2, '2018-04-11', 22, 3),
    (2, '2018-04-11', 23, 3),
    (2, '2018-04-11', 24, 3),
    (2, '2018-04-11', 25, NULL),
    (2, '2018-04-11', 28, NULL),
    (2, '2018-04-11', 29, NULL),
    (2, '2018-04-11', 30, NULL),
    (2, '2018-04-11', 31, NULL),
    (2, '2018-04-11', 32, NULL),
    (2, '2018-04-11', 33, NULL),
    (2, '2018-04-11', 34, NULL),
    (2, '2018-04-12', 18, NULL),
    (2, '2018-04-12', 19, NULL),
    (2, '2018-04-12', 20, NULL),
    (2, '2018-04-12', 21, NULL),
    (2, '2018-04-12', 22, NULL),
    (2, '2018-04-12', 23, NULL),
    (2, '2018-04-12', 24, NULL),
    (2, '2018-04-12', 25, NULL),
    (2, '2018-04-12', 28, NULL),
    (2, '2018-04-12', 29, NULL),
    (2, '2018-04-12', 30, NULL),
    (2, '2018-04-12', 31, NULL),
    (2, '2018-04-12', 32, NULL),
    (2, '2018-04-12', 33, NULL),
    (2, '2018-04-12', 34, NULL),
    (2, '2018-04-16', 18, NULL),
    (2, '2018-04-16', 19, NULL),
    (2, '2018-04-16', 20, NULL),
    (2, '2018-04-16', 21, NULL),
    (2, '2018-04-16', 22, NULL),
    (2, '2018-04-16', 23, NULL),
    (2, '2018-04-16', 24, NULL),
    (2, '2018-04-16', 25, NULL),
    (2, '2018-04-16', 28, NULL),
    (2, '2018-04-16', 29, NULL),
    (2, '2018-04-16', 30, 4),
    (2, '2018-04-16', 31, 4),
    (2, '2018-04-16', 32, 4),
    (2, '2018-04-16', 33, 4),
    (2, '2018-04-16', 34, NULL),
    (2, '2018-04-17', 18, NULL),
    (2, '2018-04-17', 19, NULL),
    (2, '2018-04-17', 20, NULL),
    (2, '2018-04-17', 21, NULL),
    (2, '2018-04-17', 22, NULL),
    (2, '2018-04-17', 23, NULL),
    (2, '2018-04-17', 24, 5),
    (2, '2018-04-17', 25, 5),
    (2, '2018-04-17', 28, 5),
    (2, '2018-04-17', 29, NULL),
    (2, '2018-04-17', 30, NULL),
    (2, '2018-04-17', 31, NULL),
    (2, '2018-04-17', 32, NULL),
    (2, '2018-04-17', 33, NULL),
    (2, '2018-04-17', 34, NULL),
    (3, '2018-04-09', 18, NULL),
    (3, '2018-04-09', 19, NULL),
    (3, '2018-04-09', 20, NULL),
    (3, '2018-04-09', 21, NULL),
    (3, '2018-04-09', 22, NULL),
    (3, '2018-04-09', 23, NULL),
    (3, '2018-04-09', 26, NULL),
    (3, '2018-04-09', 27, 6),
    (3, '2018-04-09', 28, 6),
    (3, '2018-04-09', 29, NULL),
    (3, '2018-04-09', 30, NULL),
    (3, '2018-04-09', 31, NULL),
    (3, '2018-04-09', 32, NULL),
    (3, '2018-04-09', 33, NULL),
    (3, '2018-04-09', 34, NULL),
    (3, '2018-04-10', 18, NULL),
    (3, '2018-04-10', 19, NULL),
    (3, '2018-04-10', 20, NULL),
    (3, '2018-04-10', 21, NULL),
    (3, '2018-04-10', 22, NULL),
    (3, '2018-04-10', 23, NULL),
    (3, '2018-04-10', 26, NULL),
    (3, '2018-04-10', 27, NULL),
    (3, '2018-04-10', 28, NULL),
    (3, '2018-04-10', 29, NULL),
    (3, '2018-04-10', 30, NULL),
    (3, '2018-04-10', 31, NULL),
    (3, '2018-04-10', 32, NULL),
    (3, '2018-04-10', 33, NULL),
    (3, '2018-04-10', 34, NULL),
    (3, '2018-04-11', 18, NULL),
    (3, '2018-04-11', 19, NULL),
    (3, '2018-04-11', 20, NULL),
    (3, '2018-04-11', 21, 7),
    (3, '2018-04-11', 22, 7),
    (3, '2018-04-11', 23, NULL),
    (3, '2018-04-11', 24, NULL),
    (3, '2018-04-11', 25, NULL),
    (3, '2018-04-11', 28, NULL),
    (3, '2018-04-11', 29, NULL),
    (3, '2018-04-11', 30, NULL),
    (3, '2018-04-11', 31, NULL),
    (3, '2018-04-11', 32, NULL),
    (3, '2018-04-11', 33, NULL),
    (3, '2018-04-11', 34, NULL),
    (3, '2018-04-12', 18, NULL),
    (3, '2018-04-12', 19, NULL),
    (3, '2018-04-12', 20, NULL),
    (3, '2018-04-12', 21, NULL),
    (3, '2018-04-12', 22, NULL),
    (3, '2018-04-12', 23, NULL),
    (3, '2018-04-12', 24, NULL),
    (3, '2018-04-12', 25, NULL),
    (3, '2018-04-12', 28, NULL),
    (3, '2018-04-12', 29, 8),
    (3, '2018-04-12', 30, 8),
    (3, '2018-04-12', 31, 8),
    (3, '2018-04-12', 32, 8),
    (3, '2018-04-12', 33, NULL),
    (3, '2018-04-12', 34, NULL),
    (3, '2018-04-16', 18, NULL),
    (3, '2018-04-16', 19, NULL),
    (3, '2018-04-16', 20, NULL),
    (3, '2018-04-16', 21, NULL),
    (3, '2018-04-16', 22, NULL),
    (3, '2018-04-16', 23, 9),
    (3, '2018-04-16', 24, 9),
    (3, '2018-04-16', 25, 9),
    (3, '2018-04-16', 28, 9),
    (3, '2018-04-16', 29, NULL),
    (3, '2018-04-16', 30, NULL),
    (3, '2018-04-16', 31, NULL),
    (3, '2018-04-16', 32, NULL),
    (3, '2018-04-16', 33, NULL),
    (3, '2018-04-16', 34, NULL),
    (3, '2018-04-17', 18, NULL),
    (3, '2018-04-17', 19, NULL),
    (3, '2018-04-17', 20, NULL),
    (3, '2018-04-17', 21, NULL),
    (3, '2018-04-17', 22, NULL),
    (3, '2018-04-17', 23, NULL),
    (3, '2018-04-17', 24, 10),
    (3, '2018-04-17', 25, 10),
    (3, '2018-04-17', 28, NULL),
    (3, '2018-04-17', 29, NULL),
    (3, '2018-04-17', 30, NULL),
    (3, '2018-04-17', 31, NULL),
    (3, '2018-04-17', 32, NULL),
    (3, '2018-04-17', 33, NULL),
    (3, '2018-04-17', 34, NULL);
    
INSERT INTO `ap_appointments` (`appt_id`, `provider_id`, `customer_id`, `appt_type_id`, `status`)
VALUES
    (1, 2, 1, 1, 'completed'),
    (2, 2, 1, 2, 'approved'),
    (3, 2, 1, 3, 'approved'),
    (4, 2, 1, 4, 'pending'),
    (5, 2, 1, 5, 'pending'),
    (6, 3, 4, 1, 'completed'),
    (7, 3, 4, 2, 'approved'),
    (8, 3, 4, 3, 'approved'),
    (9, 3, 4, 4, 'pending'),
    (10, 3, 4, 6, 'pending');

INSERT INTO `ap_settings` (`key`, `value`)
VALUES
    ('business_type', 'dental'),
    ('granularity', '30');