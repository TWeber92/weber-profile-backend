DROP SCHEMA IF EXISTS novels CASCADE;

CREATE SCHEMA novels;

SET
  search_path TO novels;

CREATE TABLE author (id INT PRIMARY KEY, name VARCHAR(100) NOT NULL);

CREATE TABLE novel (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(200) NOT NULL,
  year INT,
  auth_id INT REFERENCES author (id) ON DELETE CASCADE
);

INSERT INTO
  author (id, name)
VALUES
  (1001, 'Charles'),
  (1002, 'Some John'),
  (1003, 'Jane Doe');

INSERT INTO
  novel (title, year, auth_id)
VALUES
  ('New Novel', 2020, 1001),
  ('Climbing for Experts', 2009, 1003);
