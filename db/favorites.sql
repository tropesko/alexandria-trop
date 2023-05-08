-- Active: 1677589976237@@localhost@null@postgres@public
CREATE TABLE IF NOT EXISTS favorites(
    id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    github_id VARCHAR(255),
    is_favorite BOOLEAN,
    ip VARCHAR(255),
    timezone VARCHAR(255),
    date DATE,
    hour VARCHAR(255)
);
