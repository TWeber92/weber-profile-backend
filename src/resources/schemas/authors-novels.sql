DROP SCHEMA IF EXISTS novels CASCADE;
CREATE SCHEMA novels;
SET search_path TO novels;

CREATE TABLE author (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE novel (
  id INT PRIMARY KEY, 
  title VARCHAR(200) NOT NULL,
  year INT,
  auth_id INT REFERENCES author(id) ON DELETE CASCADE
);


INSERT INTO author (id, name) VALUES
(1001, 'Charles'),
(1002, 'Some John'),
(1003, 'Jane Doe'),
(1033, 'Doyle the third'),
(1234, 'hamilton jay 9999999'),
(3456, 'New Auth uuu dar'),
(6666, 'shgdhg'),
(9897, 'Some name');


INSERT INTO novel (id, title, year, auth_id) VALUES
(14, 'New Novel', 2020, 1001),
(15, 'Climbing for Experts', 2009, 1003),
(16, '39839', NULL, NULL),
(19, 'New Novel From AddNovel Component', 2999, 1001),
(20, 'New Ages Two', 2000, 1003),
(23, 'Bridgerton', 2021, 1033),
(29, 'SOme Novel', 2023, 1003),
(31, 'kwjk', 2021, 1002),
(32, 'klhfejher2kjf', 2021, 1001),
(33, 'jhekjfh', 2021, 1001),
(34, 'e2ff', 2021, 1001),
(36, 'kjk', 2021, 1001);