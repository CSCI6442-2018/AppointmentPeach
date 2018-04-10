INSERT INTO `ap_locations` (`name`)
    VALUES
    ('DC'),
    ('LA'),
    ('NYC');

INSERT INTO `ap_users` (`user_id`, `location`, `phone`, `role`)
    VALUES
    (3, 'NYC', '(888) 888-8888', 'provider'),
    (2, 'DC', '(999) 999-9999', 'provider'),
    (1, 'NYC', '(111) 111-1111', 'customer');

INSERT INTO `ap_time_slots` (`provider_id`, `date`, `time`, `appt_id`)
    VALUES
    (2, '2018-04-01', 18, NULL),
    (2, '2018-04-01', 19, NULL),
    (2, '2018-04-01', 20, 1),
    (2, '2018-04-01', 21, NULL),
    (2, '2018-04-01', 22, NULL),
    (2, '2018-04-01', 23, NULL),
    (2, '2018-04-02', 18, NULL),
    (2, '2018-04-02', 19, NULL),
    (2, '2018-04-02', 20, NULL),
    (2, '2018-04-02', 21, NULL),
    (2, '2018-04-02', 22, NULL),
    (2, '2018-04-02', 23, NULL),
    (3, '2018-04-01', 18, NULL),
    (3, '2018-04-01', 19, NULL),
    (3, '2018-04-01', 20, NULL),
    (3, '2018-04-01', 21, NULL),
    (3, '2018-04-01', 22, 2),
    (3, '2018-04-01', 23, 2),
    (3, '2018-04-02', 18, NULL),
    (3, '2018-04-02', 19, NULL),
    (3, '2018-04-02', 20, NULL),
    (3, '2018-04-02', 21, NULL),
    (3, '2018-04-02', 22, NULL),
    (3, '2018-04-02', 23, NULL);

INSERT INTO `ap_appt_types` (`id`, `title`, `description`, `icon`, `time`)
    VALUES
    (1, 'Cleaning', 'A standard teeth cleaning.', NULL, 1),
    (2, 'Whitening', 'An intense teeth whitening.', NULL, 2),
    (3, 'Cavity Filling', 'Filling a cavity.', NULL, 2);

INSERT INTO `ap_appointments` (`id`, `provider_id`, `customer_id`, `appt_type_id`, `status`)
    VALUES
    (1, 2, 1, 1, 'pending'),
    (2, 3, 1, 2, 'completed');

INSERT INTO `ap_provider_appt_types` (`provider_id`, `appt_type_id`)
    VALUES
    (2, 1),
    (2, 2),
    (3, 3),
    (3, 2);