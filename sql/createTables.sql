create table movies (
    id SERIAL primary key,
    name VARCHAR(50) unique not null,
    description TEXT,
    duration INTEGER not null,
    price INTEGER not null
);