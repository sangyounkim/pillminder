INSERT INTO user_info (first_name, last_name, email, password) VALUES ('Kevin', 'Chen', 'k85chen@edu.uwaterloo.ca', '12345');
INSERT INTO device_token VALUES (1, '12345');
INSERT INTO container VALUES ('1', '1', 'Reactine', '21:00:00', '24', NOW());
INSERT INTO container VALUES ('2', '1', 'Test', '10:00:00', '12', NOW());

INSERT INTO user_push_token (user_id, push_token)
SELECT id, 'gibberish_token_xyz' FROM user_info WHERE email = 'k85chen@edu.uwaterloo.ca';
-- INSERT INTO notification_job (run_at) VALUES (current_timestamp + interval '6 minute');