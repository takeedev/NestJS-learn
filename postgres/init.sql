CREATE TABLE IF NOT EXISTS todos (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  completed boolean NOT NULL DEFAULT false
);
