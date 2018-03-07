TRUNCATE TABLE user_info CASCADE;
INSERT INTO user_info (first_name, last_name, email, password) VALUES ('Kevin', 'Chen', 'k85chen@edu.uwaterloo.ca', '12345');
INSERT INTO user_info (first_name, last_name, email, password) VALUES ('Sangyoun', 'Kim', 's@k', '12');

INSERT INTO device_token
SELECT id, '12345' FROM user_info WHERE email = 'k85chen@edu.uwaterloo.ca';

INSERT INTO container
SELECT 1, id, 'Reactine', '21:00:00', '24', NOW() FROM user_info WHERE email = 'k85chen@edu.uwaterloo.ca';
INSERT INTO container
SELECT 2, id, 'Test', '10:00:00', '12', NOW() FROM user_info WHERE email = 'k85chen@edu.uwaterloo.ca';
INSERT INTO container
SELECT 3, id, 'TYLENOL Regular Strength', '10:00:00', '12', NOW() FROM user_info WHERE email = 's@k';
INSERT INTO container
SELECT 4, id, 'ADVIL', '10:00:00', '12', NOW() FROM user_info WHERE email = 's@k';
INSERT INTO container
SELECT 5, id, 'Reactine', '10:00:00', '12', NOW() FROM user_info WHERE email = 's@k';

INSERT INTO user_push_token (user_id, push_token)
SELECT id, 'gibberish_token_xyz' FROM user_info WHERE email = 'k85chen@edu.uwaterloo.ca';
-- INSERT INTO notification_job (run_at) VALUES (current_timestamp + interval '6 minute');

TRUNCATE TABLE drug_info;
INSERT INTO drug_info (brand_name, indications_and_usage, purpose, manufacturer_name, substance_name, brand_primary_color, brand_secondary_color)
VALUES (
    'TYLENOL Regular Strength',
    'Temporarily relieves minor aches and pains due to: headache muscular aches backache minor pain of arthritis the common cold toothache premenstrual and menstrual cramps temporarily reduces fever',
    'Pain reliever/fever reducer',
    'Johnson & Johnson Consumer Inc., McNeil Consumer Healthcare Division',
    'ACETAMINOPHEN',
    '#EB3040',
    '#FCFEFB'
);
INSERT INTO drug_info (brand_name, indications_and_usage, purpose, manufacturer_name, substance_name, brand_primary_color, brand_secondary_color)
VALUES (
    'ADVIL',
    'Temporarily relieves minor aches and pains due to: headache toothache backache menstrual cramps the common cold muscular aches minor pain of arthritis temporarily reduces fever',
    'Pain reliever/Fever reducer',
    'Wyeth Consumer Healthcare LLC',
    'IBUPROFEN',
    '#084668',
    '#FEE83D'
);

TRUNCATE TABLE reminder;
INSERT INTO reminder (container_id, reminder_time, label)
VALUES (4, '09:00', 'morning');
INSERT INTO reminder (container_id, reminder_time, label)
VALUES (4, '12:30', 'afternoon');
INSERT INTO reminder (container_id, reminder_time, label)
VALUES (4, '18:30', 'evening');
INSERT INTO reminder (container_id, reminder_time, label)
VALUES (5, '09:30', 'morning');
INSERT INTO reminder (container_id, reminder_time, label)
VALUES (5, '19:00', 'evening');
