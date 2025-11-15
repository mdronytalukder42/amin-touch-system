-- Clear existing users (optional, comment out if you want to keep existing data)
-- DELETE FROM users;

-- Insert demo users
INSERT INTO users (username, password, name, email, role, loginMethod) VALUES
('admin9197', 'Admin9197', 'AL AMIN', 'alamin@amintouch.com', 'admin', 'password'),
('ronytalukder', '@jead2016R', 'RONY TALUKDER', 'rony@amintouch.com', 'user', 'password'),
('mahir', 'Mahir3', 'MAHIR', 'mahir@amintouch.com', 'user', 'password'),
('sakiladnan', 'Sakiladnan', 'SAKIL ADNAN', 'sakil@amintouch.com', 'user', 'password')
ON DUPLICATE KEY UPDATE
  password = VALUES(password),
  name = VALUES(name),
  email = VALUES(email),
  role = VALUES(role);
