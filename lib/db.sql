CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('todo', 'in_progress', 'done')),
    assignee TEXT,
    projectId INTEGER REFERENCES projects(id),
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP
);