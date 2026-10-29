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
  ('Charles', 'Smith'),
  ('Jane', 'Doe'),
  ('Arthur', 'Conan Doyle'),
  ('Isaac', 'Asimov'),
  ('Mary', 'Shelley');

INSERT INTO
  books (title, author, isbn, member_id)
VALUES
  ('The Great Adventure', 'J.R.R. Tolkien', '2345678901', 1),
  ('Harry Potter', 'JK. Rowling', '1234567890', 2),
  ('Harry Potter', 'JK. Rowling', '1234567890', 2),
  ('The Hound of the Baskervilles', 'Arthur Conan Doyle', '3456789012', 4),
  ('Foundation', 'Isaac Asimov', '4567890123', 5),
  ('Frankenstein', 'Mary Shelley', '5678901234', 6),
  ('The Hobbit', 'J.R.R. Tolkien', '6789012345', 1),
  ('A Study in Scarlet', 'Arthur Conan Doyle', '7890123456', 4),
  ('I, Robot', 'Isaac Asimov', '8901234567', NULL),
  ('The Time Machine', 'H.G. Wells', '9012345678', NULL);
