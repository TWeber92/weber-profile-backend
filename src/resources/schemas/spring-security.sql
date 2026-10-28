DROP SCHEMA IF EXISTS security CASCADE;

CREATE SCHEMA security;

SET
  search_path TO security;

CREATE TABLE customer (
  customer_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email_id VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  date_of_birth DATE
);

INSERT INTO
  customer (email_id, name, date_of_birth)
VALUES
  (
    'charles@example.com',
    'Charles Smith',
    '1985-04-12'
  ),
  ('jane@example.com', 'Jane Doe', '1990-07-23'),
  (
    'robert@example.com',
    'Robert Brown',
    '1978-11-05'
  );
