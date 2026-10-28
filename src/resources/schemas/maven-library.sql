DROP SCHEMA IF EXISTS library CASCADE;

CREATE SCHEMA library;

SET
  search_path TO library;

CREATE TABLE members (
  member_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL
);

CREATE TABLE books (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(200) NOT NULL,
  author VARCHAR(100) NOT NULL,
  isbn VARCHAR(20) NOT NULL,
  member_id INT REFERENCES members (member_id) ON DELETE SET NULL
);

INSERT INTO
  members (first_name, last_name)
VALUES
  ('Tad', 'Weber'),
  ('Charles', 'Smith');

INSERT INTO
  books (title, author, isbn, member_id)
VALUES
  (
    'The Great Adventure',
    'J.R.R. Tolkien',
    '2345678901',
    1
  ),
  ('Harry Potter', 'JK. Rowling', '1234567890', 2);
