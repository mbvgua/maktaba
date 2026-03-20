-- create and use the db
CREATE DATABASE maktaba;
USE maktaba;

-- users table
-- NOTE:
-- * in mysql, all boolean values resolve to TINYINT(1)
-- * zero == false/False/FALSE
-- * non-zero == true/True/TRUE
-- * went with DATETIME(1000-9999) and not TIMESTAMP(1970-2038) 
CREATE TABLE users(
    id VARCHAR(250) PRIMARY KEY DEFAULT (UUID()),
    username VARCHAR(250) NOT NULL UNIQUE,
    email VARCHAR(250) NOT NULL UNIQUE,
    hashed_password VARCHAR(250) NOT NULL,
    role ENUM('admin','student') NOT NULL,
    created_at DATETIME NOT NULL DEFAULT NOW(),
    updated_at DATETIME NOT NULL DEFAULT NOW(),
    forgot_password BOOLEAN DEFAULT false, -- if true send change password email
    is_welcomed BOOlEAN DEFAULT false, -- if false send welcome email
    is_verified BOOLEAN DEFAULT false, -- if false send verify email
    is_leaving BOOLEAN DEFAULT false, -- if true send goodbye email
    is_deleted BOOLEAN DEFAULT false -- if is_leaving is true, make this true
);

-- courses table
-- NOTE:
-- * all free courses should have a price of 0.0
CREATE TABLE courses(
    id VARCHAR(250) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(250) UNIQUE,
    description MEDIUMTEXT NOT NULL,
    category ENUM("business","computer science","medicine","mathematics","languages","engineering") NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    access_type ENUM('free','premium') NOT NULL,
    created_by VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT NOW(),
    updated_at DATETIME DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT false,
    FOREIGN KEY (created_by) REFERENCES users (id)
);


-- course overview table
-- NOTE:
-- * not implemented now,later alongside the ratings table
CREATE TABLE course_overview(
    id VARCHAR(250) PRIMARY KEY DEFAULT (UUID()),
    course_id VARCHAR(250),
    taught_by VARCHAR(250) NOT NULL, -- implement later for now ink them all to admin
    requirements JSON NOT NULL,
    content JSON NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses (id),
    FOREIGN KEY (taught_by) REFERENCES users (id)
);


-- subscriptions table
-- NOTE:
-- * the end_date time is automatically generated based on (start_date+duration)
-- * unsure if it works as is, test thoroughly
CREATE TABLE subscriptions(
    id VARCHAR(250) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(250),
    course_id VARCHAR(250),
    payment_status ENUM('pending','paid','expired') NOT NULL,
    start_date DATETIME DEFAULT NOW(),
    duration_in_months INT NOT NULL,
    end_date DATETIME AS (DATE_ADD(start_date, INTERVAL duration_in_months MONTH)) STORED,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (course_id) REFERENCES courses (id)
);


-- payments table
CREATE TABLE payments(
    id VARCHAR(250) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(250),
    course_id VARCHAR(250),
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('mpesa','paystack') NOT NULL,
    is_successful BOOlEAN DEFAULT false,
    created_at DATETIME DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT false,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (course_id) REFERENCES courses (id)
);
