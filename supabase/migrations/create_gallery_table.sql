-- SQL to create the gallery table
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    "desc" TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: Enable RLS
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read access" ON gallery
    FOR SELECT USING (true);

-- Allow authenticated (admin) write access
CREATE POLICY "Admin write access" ON gallery
    FOR ALL USING (auth.role() = 'authenticated');

-- Seed with initial data from static array
INSERT INTO gallery (url, title, "desc") VALUES
('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200', 'The Coronation', 'The magical moment the Black Barbie Ambassador 2025 was crowned.'),
('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1200', 'Evening Gown Runway', 'Elegance and poise demonstrated by the top finalists.'),
('https://images.unsplash.com/photo-1514525253361-b83f859b73c0?auto=format&fit=crop&q=80&w=1200', 'Grand Finale Opening', 'A spectacular performance to kick off the most awaited night.'),
('https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&q=80&w=1200', 'Behind the Scenes', 'Exclusive look at the preparation and sisterhood backstage.'),
('https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&q=80&w=1200', 'Cultural Showcase', 'Celebrating diversity and rich heritage through fashion.'),
('https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1200', 'The Award Night', 'Honoring excellence and community impact.');
