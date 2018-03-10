TRUNCATE TABLE user_info CASCADE;
INSERT INTO user_info (first_name, last_name, email, password) VALUES ('Kevin', 'Chen', 'k85chen@edu.uwaterloo.ca', '12345');
INSERT INTO user_info (first_name, last_name, email, password) VALUES ('Sangyoun', 'Kim', 's@k', '12');

INSERT INTO device_token
SELECT id, '12345' FROM user_info WHERE email = 'k85chen@edu.uwaterloo.ca';

INSERT INTO container
SELECT 1, id, 'Reactine', NOW() AT TIME ZONE 'utc' FROM user_info WHERE email = 'k85chen@edu.uwaterloo.ca';
INSERT INTO container
SELECT 2, id, 'Test', NOW() AT TIME ZONE 'utc' FROM user_info WHERE email = 'k85chen@edu.uwaterloo.ca';
INSERT INTO container
SELECT 3, id, 'TYLENOL Regular Strength', NOW() AT TIME ZONE 'utc' FROM user_info WHERE email = 's@k';
INSERT INTO container
SELECT 4, id, 'ADVIL', NOW() AT TIME ZONE 'utc' FROM user_info WHERE email = 's@k';
INSERT INTO container
SELECT 5, id, 'Reactine', NOW() AT TIME ZONE 'utc' FROM user_info WHERE email = 's@k';

INSERT INTO user_push_token (user_id, push_token)
SELECT id, 'gibberish_token_xyz' FROM user_info WHERE email = 'k85chen@edu.uwaterloo.ca';

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
INSERT INTO reminder (container_id, reminder_time, label, frequency)
VALUES (3, '09:00', 'morning', 24);
INSERT INTO reminder (container_id, reminder_time, label, frequency)
VALUES (3, '12:30', 'afternoon', 24);
INSERT INTO reminder (container_id, reminder_time, label, frequency)
VALUES (3, '18:30', 'evening', 24);
INSERT INTO reminder (container_id, reminder_time, label, frequency)
VALUES (4, '09:30', 'morning', 24);
INSERT INTO reminder (container_id, reminder_time, label, frequency)
VALUES (4, '19:00', 'evening', 24);
