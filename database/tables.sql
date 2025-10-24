CREATE DATABASE maktaba;
GO
PRINT 'Maktaba database created successfully.'

USE maktaba;
GO

CREATE TABLE users(
    id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role  w,
    area_of_interest JSON NOT NULL,
    created_at,
    updated_at,
    is_deleted,
)
