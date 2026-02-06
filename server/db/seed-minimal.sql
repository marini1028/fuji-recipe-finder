-- Minimal seed data - only cameras and tags (recipes will be imported from web)

-- Insert cameras
INSERT INTO cameras (model, generation, has_grain_effect, has_color_chrome_effect, has_color_chrome_fx_blue, has_clarity) VALUES
('X-T5', '5th Gen', 1, 1, 1, 1),
('X-T4', '4th Gen', 1, 1, 1, 0),
('X-T3', '4th Gen', 1, 1, 0, 0),
('X-T30 II', '4th Gen', 1, 1, 1, 0),
('X-S20', '5th Gen', 1, 1, 1, 1),
('X-S10', '4th Gen', 1, 1, 1, 0),
('X-Pro3', '4th Gen', 1, 1, 1, 0),
('X-H2S', '5th Gen', 1, 1, 1, 1),
('X-H2', '5th Gen', 1, 1, 1, 1),
('X100V', '4th Gen', 1, 1, 1, 0),
('X100VI', '5th Gen', 1, 1, 1, 1),
('X-E4', '4th Gen', 1, 1, 1, 0),
('X-T50', '5th Gen', 1, 1, 1, 1);

-- Insert tags
-- Lighting conditions
INSERT OR IGNORE INTO tags (name, category) VALUES
('daylight', 'lighting'),
('golden_hour', 'lighting'),
('blue_hour', 'lighting'),
('overcast', 'lighting'),
('indoor', 'lighting'),
('low_light', 'lighting'),
('night', 'lighting'),
('harsh_light', 'lighting'),
('soft_light', 'lighting');

-- Subject types
INSERT OR IGNORE INTO tags (name, category) VALUES
('portrait', 'subject'),
('street', 'subject'),
('landscape', 'subject'),
('architecture', 'subject'),
('nature', 'subject'),
('urban', 'subject'),
('food', 'subject'),
('travel', 'subject'),
('documentary', 'subject');

-- Mood/Style
INSERT OR IGNORE INTO tags (name, category) VALUES
('cinematic', 'mood'),
('vintage', 'mood'),
('modern', 'mood'),
('moody', 'mood'),
('dreamy', 'mood'),
('contrasty', 'mood'),
('soft', 'mood'),
('dramatic', 'mood'),
('natural', 'mood'),
('filmic', 'mood');

-- Color preferences
INSERT OR IGNORE INTO tags (name, category) VALUES
('warm', 'color'),
('cool', 'color'),
('neutral', 'color'),
('vibrant', 'color'),
('muted', 'color'),
('pastel', 'color'),
('monochrome', 'color'),
('earthy', 'color'),
('teal_orange', 'color');

-- Location/Environment
INSERT OR IGNORE INTO tags (name, category) VALUES
('beach', 'location'),
('mountain', 'location'),
('city', 'location'),
('cafe', 'location'),
('studio', 'location');

-- Season
INSERT OR IGNORE INTO tags (name, category) VALUES
('summer', 'season'),
('autumn', 'season'),
('winter', 'season'),
('spring', 'season');
