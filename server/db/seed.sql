-- Seed data for Fujifilm Recipe Database

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
('X100VI', '5th Gen', 1, 1, 1, 1);

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

-- Note: 'urban', 'nature', 'indoor' are used across categories but stored once

-- Insert recipes

-- 1. Classic Chrome - Everyday
INSERT INTO recipes (name, description, film_simulation, white_balance, white_balance_shift_red, white_balance_shift_blue, dynamic_range, highlight, shadow, color, sharpness, noise_reduction, grain_effect, grain_size, color_chrome_effect, color_chrome_fx_blue, clarity, exposure_compensation, sample_images) VALUES
('Classic Chrome Everyday', 'A versatile everyday recipe with muted colors and classic film look. Great for street and documentary photography.', 'Classic Chrome', 'Auto', 0, 0, 'DR200', 0, 1, -1, 0, -2, 'Weak', 'Small', 'Weak', 'Off', 0, '-1/3', '["https://images.unsplash.com/photo-1476973422084-e0fa66ff9456?w=400","https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400","https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400"]');

-- 2. Portra 400 Inspired
INSERT INTO recipes (name, description, film_simulation, white_balance, white_balance_shift_red, white_balance_shift_blue, dynamic_range, highlight, shadow, color, sharpness, noise_reduction, grain_effect, grain_size, color_chrome_effect, color_chrome_fx_blue, clarity, exposure_compensation, sample_images) VALUES
('Portra 400 Inspired', 'Emulates the legendary Kodak Portra 400 with warm skin tones and soft contrast. Perfect for portraits and golden hour.', 'Pro Neg Hi', 'Daylight', 3, -2, 'DR200', -1, 1, 1, -1, -2, 'Weak', 'Large', 'Weak', 'Off', 0, '+2/3', '["https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400","https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=400","https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400"]');

-- 3. Kodachrome Look
INSERT INTO recipes (name, description, film_simulation, white_balance, white_balance_shift_red, white_balance_shift_blue, dynamic_range, highlight, shadow, color, sharpness, noise_reduction, grain_effect, grain_size, color_chrome_effect, color_chrome_fx_blue, clarity, exposure_compensation, sample_images) VALUES
('Kodachrome Vibrant', 'Bold, saturated colors inspired by Kodachrome slide film. Excellent for travel and landscapes with punchy reds and blues.', 'Velvia', 'Daylight', 1, -2, 'DR100', 0, -1, 2, 1, -3, 'Off', 'Small', 'Strong', 'Weak', 0, '0', '["https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400","https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400","https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400"]');

-- 4. Cinematic Teal & Orange
INSERT INTO recipes (name, description, film_simulation, white_balance, white_balance_shift_red, white_balance_shift_blue, dynamic_range, highlight, shadow, color, sharpness, noise_reduction, grain_effect, grain_size, color_chrome_effect, color_chrome_fx_blue, clarity, exposure_compensation, sample_images) VALUES
('Cinematic Teal & Orange', 'Hollywood-inspired color grading with teal shadows and warm highlights. Great for urban night scenes and moody portraits.', 'Eterna', 'Shade', 2, 3, 'DR400', -2, 2, -1, -2, -2, 'Weak', 'Large', 'Strong', 'Strong', -2, '+1/3', '["https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400","https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=400","https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400"]');

-- 5. High Contrast B&W
INSERT INTO recipes (name, description, film_simulation, white_balance, white_balance_shift_red, white_balance_shift_blue, dynamic_range, highlight, shadow, color, sharpness, noise_reduction, grain_effect, grain_size, color_chrome_effect, color_chrome_fx_blue, clarity, exposure_compensation, sample_images) VALUES
('High Contrast B&W', 'Bold black and white with deep blacks and bright whites. Inspired by Tri-X pushed to 1600. Perfect for street photography.', 'Acros+R', 'Auto', 0, 0, 'DR100', 2, -2, 0, 2, -4, 'Strong', 'Large', 'Off', 'Off', 2, '+1/3', '["https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400","https://images.unsplash.com/photo-1495344517868-8ebaf0a2044a?w=400","https://images.unsplash.com/photo-1518005068251-37900150dfca?w=400"]');

-- 6. Soft Pastel
INSERT INTO recipes (name, description, film_simulation, white_balance, white_balance_shift_red, white_balance_shift_blue, dynamic_range, highlight, shadow, color, sharpness, noise_reduction, grain_effect, grain_size, color_chrome_effect, color_chrome_fx_blue, clarity, exposure_compensation, sample_images) VALUES
('Soft Pastel Dream', 'Light and airy with lifted shadows and muted pastels. Ideal for fashion, lifestyle, and spring/summer scenes.', 'Astia', 'Cloudy', 1, 2, 'DR400', -2, 2, -2, -2, 0, 'Off', 'Small', 'Off', 'Off', -2, '+1', '["https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400","https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400","https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=400"]');

-- 7. Fuji Superia 400
INSERT INTO recipes (name, description, film_simulation, white_balance, white_balance_shift_red, white_balance_shift_blue, dynamic_range, highlight, shadow, color, sharpness, noise_reduction, grain_effect, grain_size, color_chrome_effect, color_chrome_fx_blue, clarity, exposure_compensation, sample_images) VALUES
('Superia 400 Nostalgic', 'Warm, nostalgic look inspired by Fujifilm Superia 400. Great everyday film look with characteristic greens.', 'Classic Chrome', 'Auto', 2, -3, 'DR200', 0, 0, 0, -1, -2, 'Weak', 'Small', 'Weak', 'Off', 0, '+1/3', '["https://images.unsplash.com/photo-1501426026826-31c667bdf23d?w=400","https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400","https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400"]');

-- 8. Moody Street
INSERT INTO recipes (name, description, film_simulation, white_balance, white_balance_shift_red, white_balance_shift_blue, dynamic_range, highlight, shadow, color, sharpness, noise_reduction, grain_effect, grain_size, color_chrome_effect, color_chrome_fx_blue, clarity, exposure_compensation, sample_images) VALUES
('Moody Street Night', 'Designed for night street photography with crushed blacks and neon-friendly colors. Works great in Tokyo/Hong Kong style environments.', 'Classic Neg', 'Auto', 0, 2, 'DR100', 1, -2, 1, 0, -3, 'Strong', 'Large', 'Strong', 'Strong', 0, '-2/3', '["https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400","https://images.unsplash.com/photo-1545893835-abaa50cbe628?w=400","https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=400"]');

-- 9. Golden Hour Portrait
INSERT INTO recipes (name, description, film_simulation, white_balance, white_balance_shift_red, white_balance_shift_blue, dynamic_range, highlight, shadow, color, sharpness, noise_reduction, grain_effect, grain_size, color_chrome_effect, color_chrome_fx_blue, clarity, exposure_compensation, sample_images) VALUES
('Golden Hour Portrait', 'Optimized for warm sunset portraits with beautiful skin tones and soft highlights. Enhanced warmth and glow.', 'Pro Neg Std', 'Shade', 4, -4, 'DR400', -2, 1, 0, -2, -1, 'Weak', 'Small', 'Weak', 'Off', -1, '+2/3', '["https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400","https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400","https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"]');

-- 10. Cool Urban
INSERT INTO recipes (name, description, film_simulation, white_balance, white_balance_shift_red, white_balance_shift_blue, dynamic_range, highlight, shadow, color, sharpness, noise_reduction, grain_effect, grain_size, color_chrome_effect, color_chrome_fx_blue, clarity, exposure_compensation, sample_images) VALUES
('Cool Urban Modern', 'Clean, modern aesthetic with cool tones. Perfect for architecture, minimalist, and contemporary urban photography.', 'Classic Chrome', 'Fluorescent 1', -2, 3, 'DR200', 0, 0, -1, 1, -2, 'Off', 'Small', 'Off', 'Weak', 1, '0', '["https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400","https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=400","https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400"]');

-- 11. Autumn Warmth
INSERT INTO recipes (name, description, film_simulation, white_balance, white_balance_shift_red, white_balance_shift_blue, dynamic_range, highlight, shadow, color, sharpness, noise_reduction, grain_effect, grain_size, color_chrome_effect, color_chrome_fx_blue, clarity, exposure_compensation, sample_images) VALUES
('Autumn Warmth', 'Rich, warm tones that enhance fall foliage and golden light. Saturated oranges and reds with earthy undertones.', 'Velvia', 'Shade', 3, -4, 'DR200', -1, 0, 1, 0, -2, 'Weak', 'Small', 'Strong', 'Off', 0, '+1/3', '["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400","https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=400","https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=400"]');

-- 12. Noir Classic
INSERT INTO recipes (name, description, film_simulation, white_balance, white_balance_shift_red, white_balance_shift_blue, dynamic_range, highlight, shadow, color, sharpness, noise_reduction, grain_effect, grain_size, color_chrome_effect, color_chrome_fx_blue, clarity, exposure_compensation, sample_images) VALUES
('Noir Classic', 'Classic film noir look with smooth gradations and gentle contrast. Great for moody portraits and dramatic lighting.', 'Acros', 'Auto', 0, 0, 'DR200', 0, 0, 0, 0, -2, 'Weak', 'Large', 'Off', 'Off', 0, '0', '["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400","https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400","https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400"]');

-- 13. Bright & Airy
INSERT INTO recipes (name, description, film_simulation, white_balance, white_balance_shift_red, white_balance_shift_blue, dynamic_range, highlight, shadow, color, sharpness, noise_reduction, grain_effect, grain_size, color_chrome_effect, color_chrome_fx_blue, clarity, exposure_compensation, sample_images) VALUES
('Bright & Airy', 'Light, overexposed look popular for lifestyle and wedding photography. Clean whites with preserved skin tones.', 'Pro Neg Hi', 'Cloudy', 1, 0, 'DR400', -2, 2, -1, -1, 0, 'Off', 'Small', 'Off', 'Off', -2, '+1 1/3', '["https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400","https://images.unsplash.com/photo-1519741497674-611481863552?w=400","https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400"]');

-- 14. Vintage Fade
INSERT INTO recipes (name, description, film_simulation, white_balance, white_balance_shift_red, white_balance_shift_blue, dynamic_range, highlight, shadow, color, sharpness, noise_reduction, grain_effect, grain_size, color_chrome_effect, color_chrome_fx_blue, clarity, exposure_compensation, sample_images) VALUES
('Vintage Fade', 'Faded, lifted blacks reminiscent of old photographs. Perfect for nostalgic scenes and retro aesthetics.', 'Classic Chrome', 'Daylight', 1, -1, 'DR200', -1, 2, -2, -2, -2, 'Strong', 'Large', 'Off', 'Off', -3, '+1/3', '["https://images.unsplash.com/photo-1504618223053-559bdef9dd5a?w=400","https://images.unsplash.com/photo-1516575334481-f85287c2c82d?w=400","https://images.unsplash.com/photo-1485550409059-9afb054cada4?w=400"]');

-- 15. Nature Documentary
INSERT INTO recipes (name, description, film_simulation, white_balance, white_balance_shift_red, white_balance_shift_blue, dynamic_range, highlight, shadow, color, sharpness, noise_reduction, grain_effect, grain_size, color_chrome_effect, color_chrome_fx_blue, clarity, exposure_compensation, sample_images) VALUES
('Nature Documentary', 'Natural, true-to-life colors with excellent dynamic range. Ideal for wildlife, nature, and outdoor documentary work.', 'Provia', 'Auto', 0, 0, 'DR400', -1, 1, 0, 0, -2, 'Off', 'Small', 'Weak', 'Off', 0, '0', '["https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=400","https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400","https://images.unsplash.com/photo-1504006833117-8886a355efbf?w=400"]');

-- 16. Rainy Day Blue
INSERT INTO recipes (name, description, film_simulation, white_balance, white_balance_shift_red, white_balance_shift_blue, dynamic_range, highlight, shadow, color, sharpness, noise_reduction, grain_effect, grain_size, color_chrome_effect, color_chrome_fx_blue, clarity, exposure_compensation, sample_images) VALUES
('Rainy Day Blue', 'Cool, melancholic tones perfect for overcast and rainy conditions. Enhanced blues and cyans with moody atmosphere.', 'Eterna', 'Fluorescent 2', -3, 4, 'DR200', -1, 1, 0, -1, -2, 'Weak', 'Small', 'Off', 'Strong', -1, '0', '["https://images.unsplash.com/photo-1501999635878-71cb5379c2d8?w=400","https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=400","https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400"]');

-- 17. Warm Film Portrait
INSERT INTO recipes (name, description, film_simulation, white_balance, white_balance_shift_red, white_balance_shift_blue, dynamic_range, highlight, shadow, color, sharpness, noise_reduction, grain_effect, grain_size, color_chrome_effect, color_chrome_fx_blue, clarity, exposure_compensation, sample_images) VALUES
('Warm Film Portrait', 'Classic warm film look with gorgeous skin tones. Inspired by 1970s photography with gentle contrast.', 'Nostalgic Neg', 'Daylight', 2, -2, 'DR200', -1, 1, 0, -1, -2, 'Weak', 'Large', 'Weak', 'Off', 0, '+2/3', '["https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400","https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400","https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400"]');

-- 18. Beach Summer
INSERT INTO recipes (name, description, film_simulation, white_balance, white_balance_shift_red, white_balance_shift_blue, dynamic_range, highlight, shadow, color, sharpness, noise_reduction, grain_effect, grain_size, color_chrome_effect, color_chrome_fx_blue, clarity, exposure_compensation, sample_images) VALUES
('Beach Summer', 'Bright, vibrant summer look with enhanced cyans and warm skin tones. Perfect for beach and pool photography.', 'Astia', 'Daylight', 0, 2, 'DR200', -1, 0, 1, 0, -2, 'Off', 'Small', 'Off', 'Strong', 0, '+2/3', '["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400","https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=400","https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=400"]');

-- 19. Low Light Indoor
INSERT INTO recipes (name, description, film_simulation, white_balance, white_balance_shift_red, white_balance_shift_blue, dynamic_range, highlight, shadow, color, sharpness, noise_reduction, grain_effect, grain_size, color_chrome_effect, color_chrome_fx_blue, clarity, exposure_compensation, sample_images) VALUES
('Low Light Indoor', 'Designed for indoor and low light situations. Preserves ambient lighting atmosphere with controlled noise.', 'Classic Neg', 'Incandescent', 1, -1, 'DR400', -1, 2, 0, -1, 0, 'Weak', 'Small', 'Weak', 'Off', 0, '+1/3', '["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400","https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400","https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400"]');

-- 20. Harsh Daylight
INSERT INTO recipes (name, description, film_simulation, white_balance, white_balance_shift_red, white_balance_shift_blue, dynamic_range, highlight, shadow, color, sharpness, noise_reduction, grain_effect, grain_size, color_chrome_effect, color_chrome_fx_blue, clarity, exposure_compensation, sample_images) VALUES
('Harsh Daylight', 'Tames harsh midday sun while maintaining contrast. Works well for street photography in challenging light.', 'Classic Chrome', 'Daylight', 0, 0, 'DR400', -2, 2, 0, 0, -2, 'Off', 'Small', 'Strong', 'Off', 0, '-1/3', '["https://images.unsplash.com/photo-1476973422084-e0fa66ff9456?w=400","https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=400","https://images.unsplash.com/photo-1416339684178-3a239570f315?w=400"]');

-- Associate recipes with tags

-- Recipe 1: Classic Chrome Everyday
INSERT INTO recipe_tags (recipe_id, tag_id, weight) SELECT 1, id, 1.0 FROM tags WHERE name IN ('daylight', 'overcast', 'street', 'documentary', 'travel', 'natural', 'muted', 'urban', 'city');

-- Recipe 2: Portra 400 Inspired
INSERT INTO recipe_tags (recipe_id, tag_id, weight) SELECT 2, id, 1.0 FROM tags WHERE name IN ('golden_hour', 'soft_light', 'portrait', 'warm', 'filmic', 'dreamy', 'natural');

-- Recipe 3: Kodachrome Vibrant
INSERT INTO recipe_tags (recipe_id, tag_id, weight) SELECT 3, id, 1.0 FROM tags WHERE name IN ('daylight', 'landscape', 'travel', 'vibrant', 'contrasty', 'summer', 'nature', 'beach', 'mountain');

-- Recipe 4: Cinematic Teal & Orange
INSERT INTO recipe_tags (recipe_id, tag_id, weight) SELECT 4, id, 1.0 FROM tags WHERE name IN ('night', 'low_light', 'portrait', 'urban', 'cinematic', 'moody', 'teal_orange', 'city', 'dramatic');

-- Recipe 5: High Contrast B&W
INSERT INTO recipe_tags (recipe_id, tag_id, weight) SELECT 5, id, 1.0 FROM tags WHERE name IN ('daylight', 'harsh_light', 'street', 'documentary', 'contrasty', 'dramatic', 'monochrome', 'urban', 'city');

-- Recipe 6: Soft Pastel Dream
INSERT INTO recipe_tags (recipe_id, tag_id, weight) SELECT 6, id, 1.0 FROM tags WHERE name IN ('soft_light', 'overcast', 'portrait', 'dreamy', 'soft', 'pastel', 'spring', 'summer', 'cafe');

-- Recipe 7: Superia 400 Nostalgic
INSERT INTO recipe_tags (recipe_id, tag_id, weight) SELECT 7, id, 1.0 FROM tags WHERE name IN ('daylight', 'street', 'travel', 'vintage', 'warm', 'filmic', 'urban');

-- Recipe 8: Moody Street Night
INSERT INTO recipe_tags (recipe_id, tag_id, weight) SELECT 8, id, 1.0 FROM tags WHERE name IN ('night', 'low_light', 'street', 'urban', 'moody', 'dramatic', 'city', 'contrasty');

-- Recipe 9: Golden Hour Portrait
INSERT INTO recipe_tags (recipe_id, tag_id, weight) SELECT 9, id, 1.0 FROM tags WHERE name IN ('golden_hour', 'soft_light', 'portrait', 'warm', 'dreamy', 'soft', 'nature', 'beach');

-- Recipe 10: Cool Urban Modern
INSERT INTO recipe_tags (recipe_id, tag_id, weight) SELECT 10, id, 1.0 FROM tags WHERE name IN ('overcast', 'architecture', 'urban', 'modern', 'cool', 'city', 'winter');

-- Recipe 11: Autumn Warmth
INSERT INTO recipe_tags (recipe_id, tag_id, weight) SELECT 11, id, 1.0 FROM tags WHERE name IN ('golden_hour', 'landscape', 'nature', 'warm', 'vibrant', 'earthy', 'autumn', 'mountain');

-- Recipe 12: Noir Classic
INSERT INTO recipe_tags (recipe_id, tag_id, weight) SELECT 12, id, 1.0 FROM tags WHERE name IN ('low_light', 'indoor', 'portrait', 'moody', 'dramatic', 'monochrome', 'studio');

-- Recipe 13: Bright & Airy
INSERT INTO recipe_tags (recipe_id, tag_id, weight) SELECT 13, id, 1.0 FROM tags WHERE name IN ('daylight', 'soft_light', 'portrait', 'dreamy', 'soft', 'pastel', 'spring', 'summer', 'cafe', 'indoor');

-- Recipe 14: Vintage Fade
INSERT INTO recipe_tags (recipe_id, tag_id, weight) SELECT 14, id, 1.0 FROM tags WHERE name IN ('daylight', 'portrait', 'street', 'vintage', 'soft', 'muted', 'urban');

-- Recipe 15: Nature Documentary
INSERT INTO recipe_tags (recipe_id, tag_id, weight) SELECT 15, id, 1.0 FROM tags WHERE name IN ('daylight', 'overcast', 'landscape', 'nature', 'natural', 'neutral', 'mountain');

-- Recipe 16: Rainy Day Blue
INSERT INTO recipe_tags (recipe_id, tag_id, weight) SELECT 16, id, 1.0 FROM tags WHERE name IN ('overcast', 'street', 'urban', 'moody', 'cool', 'city', 'winter', 'autumn');

-- Recipe 17: Warm Film Portrait
INSERT INTO recipe_tags (recipe_id, tag_id, weight) SELECT 17, id, 1.0 FROM tags WHERE name IN ('golden_hour', 'indoor', 'portrait', 'vintage', 'warm', 'filmic', 'soft');

-- Recipe 18: Beach Summer
INSERT INTO recipe_tags (recipe_id, tag_id, weight) SELECT 18, id, 1.0 FROM tags WHERE name IN ('daylight', 'harsh_light', 'portrait', 'vibrant', 'warm', 'summer', 'beach');

-- Recipe 19: Low Light Indoor
INSERT INTO recipe_tags (recipe_id, tag_id, weight) SELECT 19, id, 1.0 FROM tags WHERE name IN ('low_light', 'indoor', 'portrait', 'documentary', 'natural', 'warm', 'cafe');

-- Recipe 20: Harsh Daylight
INSERT INTO recipe_tags (recipe_id, tag_id, weight) SELECT 20, id, 1.0 FROM tags WHERE name IN ('daylight', 'harsh_light', 'street', 'urban', 'natural', 'muted', 'city', 'summer');

-- Associate all recipes with all cameras (they're mostly compatible)
INSERT INTO recipe_cameras (recipe_id, camera_id)
SELECT r.id, c.id FROM recipes r, cameras c;
