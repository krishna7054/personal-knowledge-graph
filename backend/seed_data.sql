INSERT INTO notes (title, content) VALUES
('Note A', 'This is related to [[Note B]] and [[Note C]]'),
('Note B', 'Backlink example'),
('Note C', 'Another note with tags'),
('Note D', 'Standalone note');

INSERT INTO tags (name) VALUES
('productivity'),
('research');

INSERT INTO note_tags (note_id, tag_id) VALUES
(3, 1),
(3, 2);

INSERT INTO links (source_id, target_id) VALUES
(1, 2),
(1, 3);