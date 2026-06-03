-- USER
INSERT INTO users (email, password_hash) VALUES ('demo@privacyscanner.ia', 'hashed_password');

-- WEBSITE
INSERT INTO websites (domain, normalized_url) VALUES (
    'www.google.com', 'https://google.com'
);

-- ANALYSIS
INSERT INTO analyses (user_id, website_id, url, global_score, rating, status, summary) VALUES 
(
    (SELECT id FROM users LIMIT 1),
    (SELECT id FROM websites LIMIT 1),
    'https://google.com/privacy',
    90,
    'green',
    'completed',
    'This website shares user data with third parties.'
    );

-- CLAUSES
INSERT INTO clauses (analysis_id, category, severity, score_impact, title, explanation, extracted_text) VALUES
(
    (SELECT id FROM analyses LIMIT 1),
    'third_party',
    'medium',
    -10,
    'third-party data sharing',
    'User data may be shared with advertising partners.',
    'We may share information with trusted third parties.'
);

