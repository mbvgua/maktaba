-- create and use the db
CREATE DATABASE maktaba;
USE maktaba;

-- users table
CREATE TABLE users(
    id VARCHAR(250) PRIMARY KEY DEFAULT (UUID()),
    username VARCHAR(250) UNIQUE NOT NULL,
    email VARCHAR(250) UNIQUE NOT NULL,
    hashed_password VARCHAR(250) NOT NULL,
    role ENUM('admin','teacher','student') NOT NULL,
    created_at DATETIME DEFAULT NOW(),
    updated_at DATETIME DEFAULT NOW(),
    -- no true boolean value in mysql, all resolve to TINYINT(1)
    -- zero -> false/FALSE/False
    -- non-zero -> true/TRUE/True
    is_verified BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE courses(
    id VARCHAR(250) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(250) UNIQUE,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    access_type ENUM('free','premium') NOT NULL,
    created_by VARCHAR(50) NOT NULL,
    -- CURRENT_TIMESTAMP() == CURRENT_TIMESTAMP == NOW()
    created_at DATETIME DEFAULT NOW(),
    updated_at DATETIME DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT false,
    FOREIGN KEY (created_by) REFERENCES users (id)
);

CREATE TABLE course_overview (
    id VARCHAR(250) PRIMARY KEY DEFAULT (UUID()),
    course_id VARCHAR(250),
    taught_by VARCHAR(250) NOT NULL,
    requirements JSON NOT NULL,
    content JSON NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses (id),
    FOREIGN KEY (taught_by) REFERENCES users (id)
);


CREATE TABLE ratings (
    id VARCHAR(250) PRIMARY KEY DEFAULT (UUID()),
    -- rating_about will be like:
    -- 'course':'data science for good'
    -- 'instructor':'john doe'
    rating_about JSON NOT NULL,
    stars ENUM('1','2','3','4','5') NOT NULL,
    description TEXT NOT NULL,
    is_deleted BOOLEAN DEFAULT false
);


CREATE TABLE subscriptions (
    id VARCHAR(250) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(250),
    course_id VARCHAR(250),
    payment_status ENUM('pending','paid','expired') NOT NULL,
    start_date TIMESTAMP DEFAULT NOW(),
    duration_in_months INT NOT NULL,
    -- this is a generated column: values auto-calculated based on
    -- valeus from other columns. no manual input from users
    end_date TIMESTAMP AS (DATE_ADD(start_date, INTERVAL duration_in_months MONTH)) STORED,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (course_id) REFERENCES courses (id)
);


CREATE TABLE payments (
    id VARCHAR(250) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(250),
    course_id VARCHAR(250),
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('mpesa','paystack','bank') NOT NULL,
    status ENUM('in-progress','failed','success') NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT false,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (course_id) REFERENCES courses (id)
);
