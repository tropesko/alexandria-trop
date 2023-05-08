-- Active: 1677589976237@@localhost@null@postgres@public
CREATE TABLE IF NOT EXISTS repositories(
    id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    github_id VARCHAR(255),
    node_id VARCHAR(255),
    name VARCHAR(255),
    full_name VARCHAR(255),
    description VARCHAR(255),
    url VARCHAR(255),
    language VARCHAR(255)
);
