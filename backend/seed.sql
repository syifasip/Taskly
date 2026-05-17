
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS workspaces (
    workspace_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    custom_url VARCHAR(100) UNIQUE NOT NULL,
    color VARCHAR(20) DEFAULT 'blue',
    access_type VARCHAR(20) DEFAULT 'invite',
    owner_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS roles (
    role_id SERIAL PRIMARY KEY,
    workspace_id INTEGER NOT NULL REFERENCES workspaces(workspace_id) ON DELETE CASCADE,
    role_name VARCHAR(50) NOT NULL,
    view_tasks BOOLEAN DEFAULT TRUE,
    create_tasks BOOLEAN DEFAULT FALSE,
    update_tasks BOOLEAN DEFAULT FALSE,
    delete_tasks BOOLEAN DEFAULT FALSE,
    manage_roles BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS workspace_members (
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    workspace_id INTEGER NOT NULL REFERENCES workspaces(workspace_id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(role_id) ON DELETE SET NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, workspace_id)
);

CREATE TABLE IF NOT EXISTS tasks (
    task_id SERIAL PRIMARY KEY,
    workspace_id INTEGER NOT NULL REFERENCES workspaces(workspace_id) ON DELETE CASCADE,
    creator_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    assignee_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    due_date TIMESTAMP,
    priority VARCHAR(20) DEFAULT 'medium',
    is_pinned BOOLEAN DEFAULT FALSE,
    color VARCHAR(20) DEFAULT 'yellow',
    status VARCHAR(20) DEFAULT 'pending',
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    message_id SERIAL PRIMARY KEY,
    workspace_id INTEGER NOT NULL REFERENCES workspaces(workspace_id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    reply_to INTEGER REFERENCES messages(message_id) ON DELETE SET NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS task_reminders (
    reminder_id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL REFERENCES tasks(task_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    remind_at TIMESTAMP NOT NULL,
    is_sent BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS activity_log (
    log_id SERIAL PRIMARY KEY,
    workspace_id INTEGER NOT NULL REFERENCES workspaces(workspace_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    target_title VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TRIGGER: auto-fill completed_at
-- =============================================

CREATE OR REPLACE FUNCTION set_completed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at = NOW();
  END IF;
  IF NEW.status != 'completed' AND OLD.status = 'completed' THEN
    NEW.completed_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_completed_at
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION set_completed_at();

-- =============================================
-- INSERT SAMPLE DATA
-- =============================================

INSERT INTO users (full_name, email, password) VALUES
('Syifa Rahman', 'syifa@example.com', '$2b$10$9DtbGXv7rqf3IXw7LUCSU.3GdeBc6mnOSVqZFvajImIlWS/DW9vC.'),
('Dimas Aulia', 'dimas@example.com', '$2b$10$ilibROd7gIHhlQSWQ32n0OdGzPuPYVxQzR3LMfR7WF2GglADcuUWK'),
('Rizki Adi', 'rizki@example.com', '$2b$10$Ep/lp/gzriH41bSOQKGCrujr6W5lUBpbdmGupAaMJzoYB2TxGTGYO'),
('Maya Kusuma', 'maya@example.com', '$2b$10$9DtbGXv7rqf3IXw7LUCSU.3GdeBc6mnOSVqZFvajImIlWS/DW9vC.');

INSERT INTO workspaces (name, custom_url, color, access_type, owner_id) VALUES
('SBD Team 2026', 'sbd-team-2026', 'yellow', 'invite', 1),
('Personal', 'syifa-personal', 'blue', 'private', 1),
('Family', 'rahman-family', 'green', 'invite', 1);

INSERT INTO roles (workspace_id, role_name, view_tasks, create_tasks, update_tasks, delete_tasks, manage_roles) VALUES
(1, 'Admin', TRUE, TRUE, TRUE, TRUE, TRUE),
(1, 'Project Lead', TRUE, TRUE, TRUE, FALSE, TRUE),
(1, 'Editor', TRUE, TRUE, TRUE, FALSE, FALSE),
(1, 'Viewer', TRUE, FALSE, FALSE, FALSE, FALSE);

INSERT INTO workspace_members (user_id, workspace_id, role_id) VALUES
(1, 1, 2),
(2, 1, 3),
(3, 1, 1),
(4, 1, 4);

INSERT INTO tasks (workspace_id, creator_id, assignee_id, title, description, due_date, priority, is_pinned, color, status) VALUES
(1, 1, 2, 'Finalize SBD Modul 10 Report', 'Compile screenshots, tulis IEEE references, export ke PDF sebelum 22:00', NOW() + INTERVAL '2 days', 'high', TRUE, 'yellow', 'pending'),
(1, 3, 1, 'Review Pull Request #284', 'Frontend redesign — fokus ke role permissions modal dan responsiveness', NOW() + INTERVAL '1 day', 'high', TRUE, 'blue', 'pending'),
(1, 1, 1, 'Daily standup notes', 'Catat hasil standup hari ini', NOW(), 'low', FALSE, 'green', 'completed'),
(1, 2, 4, 'Brainstorm Q1 product roadmap', 'Whiteboard session bareng design + eng team', NOW() + INTERVAL '7 days', 'medium', FALSE, 'yellow', 'pending'),
(1, 3, 2, 'Deploy staging v2', 'Push ke Vercel, cek environment variables', NOW() + INTERVAL '3 days', 'high', FALSE, 'blue', 'pending');

INSERT INTO messages (workspace_id, sender_id, content, reply_to) VALUES
(1, 2, 'Hei guys, deadline laporan modul 10 besok ya? Ada yang udah mulai?', NULL),
(1, 3, '@Dimas udah mulai bagian screenshotnya, tinggal nulis referensi IEEE aja', 1),
(1, 4, 'Wah mantap! @Syifa lu bagian deploy-nya gimana?', 2),
(1, 1, 'Udah done! Link Vercel sudah aku share di task Final Demo ya 🚀', NULL),
(1, 2, 'Nice! Oke semua ingat deadline jam 22:00 malam ini ya. Jangan sampai telat 🔥', NULL);

INSERT INTO task_reminders (task_id, user_id, remind_at, is_sent) VALUES
(1, 1, NOW() + INTERVAL '1 day', FALSE),
(2, 1, NOW() + INTERVAL '12 hours', FALSE),
(4, 4, NOW() + INTERVAL '6 days', FALSE);

INSERT INTO activity_log (workspace_id, user_id, action, target_title) VALUES
(1, 2, 'completed', 'PR review'),
(1, 4, 'tagged', 'Final demo'),
(1, 3, 'created', 'Deploy v2');