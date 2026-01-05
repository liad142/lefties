-- Create type/enum for item types
CREATE TYPE item_type AS ENUM ('surprise_bag', 'specific_item');

-- Add column to items table
ALTER TABLE items ADD COLUMN type item_type DEFAULT 'specific_item';

-- Update existing dummy items
UPDATE items 
SET type = 'surprise_bag' 
WHERE name ILIKE '%Surprise Bag%';

UPDATE items 
SET type = 'specific_item' 
WHERE name NOT ILIKE '%Surprise Bag%';

