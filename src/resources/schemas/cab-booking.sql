DROP SCHEMA IF EXISTS cab_booking CASCADE;

CREATE SCHEMA cab_booking;

SET
  search_path TO cab_booking;

CREATE TABLE cabs (
  cab_no INT PRIMARY KEY,
  model_name VARCHAR(10) NOT NULL,
  driver_phone_no BIGINT NOT NULL,
  availability VARCHAR(4) NOT NULL
);

CREATE TABLE bookings (
  booking_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  customer_name VARCHAR(20) NOT NULL,
  phone_no BIGINT NOT NULL,
  booking_type VARCHAR(20) NOT NULL,
  cab_no INT UNIQUE REFERENCES cabs (cab_no)
);

INSERT INTO
  cabs
VALUES
  (451678, 'Honda', 9823478234, 'No'),
  (567897, 'Mahindra', 9643345654, 'No'),
  (234987, 'Toyota', 9643675654, 'No'),
  (456783, 'Toyota', 9947835654, 'Yes'),
  (159723, 'Maruti', 8744435654, 'Yes');

INSERT INTO
  bookings (customer_name, phone_no, booking_type, cab_no)
VALUES
  ('Michel', 9867542341, 'Shared', 451678),
  ('Robert', 8745316754, 'Personal', 567897),
  ('Peter', 9645336766, 'Shared', 234987);
