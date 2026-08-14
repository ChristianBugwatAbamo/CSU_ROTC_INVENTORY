-- HEADQUARTERS CARAGA STATE UNIVERSITY MAIN CAMPUS ROTC UNIT (ACTIVATED)
-- 1501 (ADN), 15TH (CARAGA) RCDG, ARESCOM, Ampayon, Butuan City
-- Prepared by: CHRISTIAN B ABAMO, CDT LTC (ROTC)1CL, S4 BDE Logistics
-- Official ROTC Inventory Database Seed File

DELETE FROM borrowings;
DELETE FROM items;

-- ==========================================
-- 1. ARMORY INVENTORY -> Armory Equipment
-- ==========================================
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Rifle (M16 / Garand Drill & Training)', 'Armory Equipment', 'pcs', 327, 64, 0, 'Standard cadet drill and training rifles.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Wooden Spine Board', 'Armory Equipment', 'pcs', 1, 0, 0, 'Emergency spinal immobilization board.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Rifle Stand', 'Armory Equipment', 'pcs', 2, 0, 0, 'Floor rifle storage racks.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Hanging Rifle Stand', 'Armory Equipment', 'pcs', 6, 0, 0, 'Wall-mounted hanging rifle racks.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Wooden Case', 'Armory Equipment', 'pcs', 1, 0, 0, 'Storage wooden case for armory tools.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Wooden Dice', 'Armory Equipment', 'pcs', 2, 0, 0, 'Training aids wooden dice.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Guidon Flag (Armory)', 'Armory Equipment', 'pcs', 4, 0, 0, 'Armory guidon flags.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Guidon Pole (Armory)', 'Armory Equipment', 'pcs', 5, 0, 0, 'Armory wooden guidon parade poles.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Guidon Stand (Armory)', 'Armory Equipment', 'pcs', 1, 0, 0, 'Guidon pole floor display stand.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Holster', 'Armory Equipment', 'pcs', 2, 0, 0, 'Sidearm holsters for parade and duty officers.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Base Drum', 'Armory Equipment', 'pcs', 1, 0, 0, 'ROTC Marching Band Base Drum.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Drum Stick', 'Armory Equipment', 'pairs', 2, 0, 0, 'Marching band drum sticks.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Green Table (Armory)', 'Armory Equipment', 'pcs', 1, 0, 0, 'Armory briefing green table.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Desk Chair (Armory)', 'Armory Equipment', 'pcs', 1, 0, 0, 'Armory duty desk chair.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('White Board (Armory)', 'Armory Equipment', 'pcs', 1, 0, 0, 'Instructional whiteboard for armory.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Fire Extinguisher (Armory)', 'Armory Equipment', 'pcs', 0, 1, 0, 'Armory Dry Powder Fire Extinguisher.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Straw Thread (Bundle)', 'Armory Equipment', 'bundles', 1, 0, 0, 'Heavy duty straw thread bundle.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Short Field Marker', 'Armory Equipment', 'pcs', 37, 0, 0, 'Cadet field exercise short tactical markers.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Long Field Marker', 'Armory Equipment', 'pcs', 11, 0, 0, 'Cadet field exercise long perimeter markers.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Wooden Box Marker', 'Armory Equipment', 'pcs', 1, 0, 0, 'Tactical field wooden box marker.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Short Splint', 'Armory Equipment', 'pcs', 4, 0, 0, 'First aid limb short splint.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Long Splint', 'Armory Equipment', 'pcs', 5, 0, 0, 'First aid limb long splint.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('White Rope', 'Armory Equipment', 'pcs', 8, 0, 0, 'Tactical utility white rope.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Armory Instruction Chart', 'Armory Equipment', 'pcs', 7, 0, 0, 'Military instruction charts.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Armory Calendar', 'Armory Equipment', 'pcs', 2, 0, 0, 'Armory schedule calendar.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Medicine Box', 'Armory Equipment', 'pcs', 1, 0, 0, 'First aid emergency medicine box.');

-- ==========================================
-- 2. SUPPLY ROOM INVENTORY
-- ==========================================

-- Supply Furniture
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Plastic Chair (Supply)', 'Supply Furniture', 'pcs', 10, 0, 0, 'Supply room plastic chairs.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Wooden Table (Supply)', 'Supply Furniture', 'pcs', 2, 0, 0, 'Supply room wooden tables.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Plastic Table (Supply)', 'Supply Furniture', 'pcs', 2, 0, 0, 'Supply room plastic tables.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Shoes Cabinet', 'Supply Furniture', 'pcs', 1, 0, 0, 'Footwear storage shoes cabinet.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Plate Plastic Cabinet', 'Supply Furniture', 'pcs', 1, 0, 0, 'Plastic plate storage cabinet.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Steel Cabinet (Supply)', 'Supply Furniture', 'pcs', 2, 0, 0, 'Supply room heavy duty steel cabinet.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Stainless Chair', 'Supply Furniture', 'pcs', 3, 0, 0, 'Stainless steel chairs.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('White Plastic Chair', 'Supply Furniture', 'pcs', 7, 1, 0, 'White plastic chairs.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Yellow Plastic Chair', 'Supply Furniture', 'pcs', 1, 0, 0, 'Yellow plastic chair.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Wooden Chair (Supply)', 'Supply Furniture', 'pcs', 1, 0, 0, 'Wooden supply chair.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Swivel Chair (Supply)', 'Supply Furniture', 'pcs', 2, 0, 0, 'Office swivel chairs.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Long Plastic Chair', 'Supply Furniture', 'pcs', 1, 0, 0, 'Long plastic bench chair.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Hanging Clothes Rack (Supply)', 'Supply Furniture', 'pcs', 1, 0, 0, 'Hanging clothes rack for uniforms.');

-- Supply Kitchenware
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Plastic Plate', 'Supply Kitchenware', 'pcs', 12, 0, 0, 'Dining plastic plates.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Glass Plate', 'Supply Kitchenware', 'pcs', 29, 0, 0, 'Dining glass plates.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Paper Plate Strainer', 'Supply Kitchenware', 'pcs', 1, 0, 0, 'Kitchen paper plate strainer.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Steel Spoon', 'Supply Kitchenware', 'pcs', 6, 0, 0, 'Stainless steel spoons.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Steel Fork', 'Supply Kitchenware', 'pcs', 18, 0, 0, 'Stainless steel forks.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Kitchen Knife', 'Supply Kitchenware', 'pcs', 1, 1, 0, 'Kitchen knives.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Big Calderon', 'Supply Kitchenware', 'pcs', 2, 0, 0, 'Large cooking calderon pots.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Cooking Pan', 'Supply Kitchenware', 'pcs', 3, 0, 0, 'Heavy duty cooking pans.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Small Calderon', 'Supply Kitchenware', 'pcs', 3, 0, 0, 'Small cooking calderon pots.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Sug-angan', 'Supply Kitchenware', 'pcs', 2, 0, 0, 'Traditional cooking stove stand.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Plastic Pitcher', 'Supply Kitchenware', 'pcs', 1, 0, 0, 'Water plastic pitcher.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Glass Pitcher', 'Supply Kitchenware', 'pcs', 1, 0, 0, 'Water glass pitcher.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Water Gallon', 'Supply Kitchenware', 'pcs', 9, 0, 0, 'Drinking water gallons.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Water Dispenser', 'Supply Kitchenware', 'pcs', 1, 0, 0, 'Drinking water dispenser unit.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Plastic Cup', 'Supply Kitchenware', 'pcs', 7, 0, 0, 'Drinking plastic cups.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Glass Cup', 'Supply Kitchenware', 'pcs', 3, 0, 0, 'Drinking glass cups.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Mug', 'Supply Kitchenware', 'pcs', 5, 0, 0, 'Coffee mugs.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Broken Handle Mug', 'Supply Kitchenware', 'pcs', 2, 0, 0, 'Coffee mugs with broken handles.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Cup Rack', 'Supply Kitchenware', 'pcs', 5, 0, 0, 'Cup storage racks.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Peeler', 'Supply Kitchenware', 'pcs', 1, 0, 0, 'Vegetable peeler.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Steel Ladle', 'Supply Kitchenware', 'pcs', 1, 0, 0, 'Stainless steel soup ladle.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Rice Plastic Ladle', 'Supply Kitchenware', 'pcs', 5, 0, 0, 'Plastic rice serving ladles.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Big Plastic Tupperware', 'Supply Kitchenware', 'pcs', 1, 0, 0, 'Large plastic food container.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Lunch Boxes', 'Supply Kitchenware', 'pcs', 5, 0, 0, 'Food lunch boxes.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Disposable Tupperware', 'Supply Kitchenware', 'pcs', 1, 0, 0, 'Disposable plastic food container.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Kitchen Strainer', 'Supply Kitchenware', 'pcs', 1, 0, 0, 'Food mesh strainer.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Tumbler', 'Supply Kitchenware', 'pcs', 2, 0, 0, 'Drinking water tumblers.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Small Plate (Platito)', 'Supply Kitchenware', 'pcs', 4, 0, 0, 'Small saucers / platito.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Bowl', 'Supply Kitchenware', 'pcs', 1, 0, 0, 'Soup bowl.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Plastic Basin', 'Supply Kitchenware', 'pcs', 1, 0, 0, 'Washing plastic basin.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Storage Box (Kitchen)', 'Supply Kitchenware', 'pcs', 1, 0, 0, 'Kitchen storage box.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Potholder', 'Supply Kitchenware', 'pcs', 1, 0, 0, 'Kitchen heat potholder.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Food Cover', 'Supply Kitchenware', 'pcs', 1, 0, 0, 'Table mesh food cover.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Ice Bucket', 'Supply Kitchenware', 'pcs', 1, 0, 0, 'Ice storage bucket.');

-- Supply Uniform & Clothing
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Old BDU Uniforms Set', 'Supply Uniform & Clothing', 'sets', 5, 0, 0, 'Old Battle Dress Uniform sets.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Philarpat Uniform Set', 'Supply Uniform & Clothing', 'sets', 20, 0, 0, 'Official Philarpat military uniform sets.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Black Combat Boots', 'Supply Uniform & Clothing', 'pairs', 21, 0, 0, 'Standard military black combat boots.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Green Combat Boots', 'Supply Uniform & Clothing', 'pairs', 11, 0, 0, 'Tactical green combat boots.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Cap', 'Supply Uniform & Clothing', 'pcs', 2, 0, 0, 'Military officer/cadet caps.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Shoes', 'Supply Uniform & Clothing', 'pairs', 18, 0, 0, 'Military parade and duty shoes.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Sandal', 'Supply Uniform & Clothing', 'pairs', 3, 0, 0, 'Duty sandals.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Army Green T-Shirt', 'Supply Uniform & Clothing', 'pcs', 4, 0, 0, 'Army green undershirts.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Short', 'Supply Uniform & Clothing', 'pcs', 12, 0, 0, 'Physical training shorts.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Towel', 'Supply Uniform & Clothing', 'pcs', 1, 0, 0, 'Bath towel.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Jacket', 'Supply Uniform & Clothing', 'pcs', 6, 0, 0, 'ROTC tactical jackets.');

-- Supply Ceremonial & Display
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Old Philippine Flag', 'Supply Ceremonial & Display', 'pcs', 0, 5, 0, 'Retired Philippine National Flags.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Old Guidon Flag', 'Supply Ceremonial & Display', 'pcs', 0, 2, 0, 'Retired unit guidon flags.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Old Normisist Flag', 'Supply Ceremonial & Display', 'pcs', 1, 0, 0, 'Historical NORMISIST unit flag.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Red Fabric', 'Supply Ceremonial & Display', 'pcs', 1, 0, 0, 'Ceremonial red display fabric.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Blue Fabric', 'Supply Ceremonial & Display', 'pcs', 7, 0, 0, 'Ceremonial blue display fabric.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('White Fabric', 'Supply Ceremonial & Display', 'pcs', 1, 0, 0, 'Ceremonial white display fabric.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Yellow Fabric', 'Supply Ceremonial & Display', 'pcs', 1, 0, 0, 'Ceremonial yellow display fabric.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Black Fabric', 'Supply Ceremonial & Display', 'pcs', 2, 0, 0, 'Ceremonial black display fabric.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Green Fabric', 'Supply Ceremonial & Display', 'pcs', 1, 0, 0, 'Ceremonial green display fabric.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Light Green Fabric', 'Supply Ceremonial & Display', 'pcs', 1, 0, 0, 'Ceremonial light green display fabric.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Violet Fabric', 'Supply Ceremonial & Display', 'pcs', 1, 0, 0, 'Ceremonial violet display fabric.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Green Tassel Lace', 'Supply Ceremonial & Display', 'pcs', 1, 0, 0, 'Ceremonial green lace tassels.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Random Cloth', 'Supply Ceremonial & Display', 'pcs', 3, 0, 0, 'Miscellaneous ceremonial display cloth.');

-- Supply Equipment
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Electric Wall Fan', 'Supply Equipment', 'pcs', 1, 0, 0, 'Supply room electric wall fan.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Ladder', 'Supply Equipment', 'pcs', 1, 0, 0, 'Heavy duty supply ladder.');

-- Supply Tools
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Hammer', 'Supply Tools', 'pcs', 1, 0, 0, 'Heavy duty claw hammer.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Saw', 'Supply Tools', 'pcs', 1, 0, 0, 'Hand wood saw.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Machete', 'Supply Tools', 'pcs', 1, 0, 0, 'Tactical utility machete.');

-- Supply Miscellaneous
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Pillow', 'Supply Miscellaneous', 'pcs', 3, 0, 0, 'Bedding pillows.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Blanket', 'Supply Miscellaneous', 'pcs', 3, 0, 0, 'Bedding blankets.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Mirror', 'Supply Miscellaneous', 'pcs', 1, 0, 0, 'Headquarters mirror.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Egg Tray', 'Supply Miscellaneous', 'pcs', 23, 0, 0, 'Egg storage trays.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Supply Clothes Hanger Rack', 'Supply Miscellaneous', 'pcs', 1, 0, 0, 'Clothes rack stand.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Hanger', 'Supply Miscellaneous', 'pcs', 37, 0, 0, 'Clothes hangers.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Tarpal', 'Supply Miscellaneous', 'pcs', 7, 0, 0, 'Heavy duty waterproof tarpaulin.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Sack', 'Supply Miscellaneous', 'pcs', 6, 0, 0, 'Storage sacks.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Dumbell', 'Supply Miscellaneous', 'pcs', 1, 0, 0, 'Physical training dumbbell.');

-- ==========================================
-- 3. OFFICE INVENTORY
-- ==========================================

-- Office Equipment
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Monitor', 'Office Equipment', 'pcs', 1, 0, 0, 'Desktop computer monitor.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('System Unit', 'Office Equipment', 'pcs', 0, 1, 0, 'Desktop PC system unit. Unserviceable.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Keyboard', 'Office Equipment', 'pcs', 1, 0, 0, 'USB computer keyboard.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Mouse', 'Office Equipment', 'pcs', 1, 0, 0, 'Optical mouse.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Secure 220V AVR', 'Office Equipment', 'pcs', 1, 0, 0, 'Automatic voltage regulator.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Mini Speaker', 'Office Equipment', 'sets', 2, 0, 0, 'Desktop audio speakers.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Printer', 'Office Equipment', 'pcs', 2, 0, 0, 'Document printer.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('VGA Cable', 'Office Equipment', 'pcs', 1, 0, 0, 'Display VGA cable.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('USB Cable', 'Office Equipment', 'pcs', 1, 0, 0, 'Peripheral USB cable.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('UTP Cable', 'Office Equipment', 'pcs', 1, 0, 0, 'Network ethernet cable.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Laptop', 'Office Equipment', 'pcs', 1, 0, 0, 'S4 BDE Logistics command laptop.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Laptop Charger', 'Office Equipment', 'pcs', 1, 0, 0, 'Command laptop power adapter.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Extension Wire', 'Office Equipment', 'pcs', 3, 0, 0, 'Heavy duty electrical extension power strip.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Electric Fan (Office)', 'Office Equipment', 'pcs', 2, 0, 0, 'Office cooling electric fan.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Ceiling Fan', 'Office Equipment', 'pcs', 2, 0, 0, 'Headquarters ceiling fan.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Ceiling Fan Switch', 'Office Equipment', 'pcs', 2, 0, 0, 'Ceiling fan wall control switch.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Gun Tacker', 'Office Equipment', 'pcs', 0, 1, 0, 'Heavy duty staple gun tacker.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Circuit Breaker', 'Office Equipment', 'pcs', 1, 0, 0, 'Electrical main circuit breaker box.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Puncher', 'Office Equipment', 'pcs', 1, 0, 0, 'Heavy duty paper hole puncher.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Fire Extinguisher (Office)', 'Office Equipment', 'pcs', 1, 0, 0, 'ABC Dry Powder Fire Extinguisher.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Mouse Pad', 'Office Equipment', 'pcs', 1, 0, 0, 'Computer mouse pad.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Laptop Bag', 'Office Equipment', 'pcs', 1, 0, 0, 'Protective laptop carrying bag.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('003 Yellow Refill Ink', 'Office Equipment', 'pcs', 1, 0, 0, 'Printer refill ink bottle (Yellow).');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('003 Cyan Refill Ink', 'Office Equipment', 'pcs', 2, 0, 0, 'Printer refill ink bottle (Cyan).');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('003 Magenta Refill Ink', 'Office Equipment', 'pcs', 1, 0, 0, 'Printer refill ink bottle (Magenta).');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('003 Black Refill Ink', 'Office Equipment', 'pcs', 1, 0, 0, 'Printer refill ink bottle (Black).');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Yellow Refill Ink', 'Office Equipment', 'pcs', 6, 0, 0, 'Printer refill ink bottles (Yellow).');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Cyan Refill Ink', 'Office Equipment', 'pcs', 8, 0, 0, 'Printer refill ink bottles (Cyan).');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Magenta Refill Ink', 'Office Equipment', 'pcs', 3, 0, 0, 'Printer refill ink bottles (Magenta).');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Double-Sided Tape', 'Office Equipment', 'pcs', 3, 0, 0, 'Heavy duty double sided adhesive tape.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Glue', 'Office Equipment', 'pcs', 2, 0, 0, 'Adhesive liquid glue.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Stapler', 'Office Equipment', 'pcs', 1, 1, 0, 'Heavy duty office stapler.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Stapler Wire (Box)', 'Office Equipment', 'boxes', 2, 0, 0, 'Standard stapler wire refills.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Gun Tacker Wire (Box)', 'Office Equipment', 'boxes', 1, 0, 0, 'Staple gun tacker wire refills.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Brown Bond Paper (Packs)', 'Office Equipment', 'packs', 100, 0, 0, 'Brown craft bond paper packs.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Starparch Paper', 'Office Equipment', 'sheets', 640, 0, 0, 'Official certificate Starparch paper.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Glossy Photo Paper', 'Office Equipment', 'packs', 1, 0, 0, 'High glossy photo paper.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Matte White Sticker Paper', 'Office Equipment', 'packs', 1, 0, 0, 'White sticker paper for labels.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Photo Paper', 'Office Equipment', 'packs', 5, 0, 0, 'Standard photo paper.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Brown Envelope Box', 'Office Equipment', 'boxes', 1, 0, 0, 'Box of brown envelopes.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Brown Envelope Commendation', 'Office Equipment', 'pcs', 1, 0, 0, 'Brown envelope for commendation.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('White Folder (387)', 'Office Equipment', 'pcs', 387, 0, 0, 'Standard white file folders.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Green Folder (Office)', 'Office Equipment', 'pcs', 8, 0, 0, 'ROTC Green official folders.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Office Chart', 'Office Equipment', 'pcs', 70, 0, 0, 'Office training and organizational charts.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Certificate', 'Office Equipment', 'pcs', 3, 0, 0, 'Blank completion certificates.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Certificate with Picture Frame', 'Office Equipment', 'pcs', 19, 0, 0, 'Framed official completion certificates.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Test Questionnaires Printed Bond', 'Office Equipment', 'copies', 700, 0, 0, 'Printed military science examination questionnaires.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Brown Envelope (Office 6)', 'Office Equipment', 'pcs', 6, 0, 0, 'Document brown envelopes.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Green Folder (Office Small)', 'Office Equipment', 'pcs', 2, 0, 0, 'Green file folders.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('White Folder (Office Small)', 'Office Equipment', 'pcs', 7, 0, 0, 'White file folders.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Instructional Package Printed Bond', 'Office Equipment', 'copies', 600, 0, 0, 'Cadet training instructional packages.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Brown Envelope (Office 5)', 'Office Equipment', 'pcs', 5, 0, 0, 'Document brown envelopes.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Brown Bond Paper Sheets', 'Office Equipment', 'sheets', 200, 0, 0, 'Brown craft bond paper sheets.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Yellow Pad Paper (70)', 'Office Equipment', 'pads', 70, 0, 0, 'Yellow pad paper pads.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('White Folder (Office 15)', 'Office Equipment', 'pcs', 15, 0, 0, 'White file folders.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Old Files Printed Bond', 'Office Equipment', 'copies', 2050, 0, 0, 'Archived printed bond files.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Yellow Pad Paper (300)', 'Office Equipment', 'pads', 300, 0, 0, 'Yellow pad paper pads.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('White Folder Attendance', 'Office Equipment', 'pcs', 41, 0, 0, 'Attendance white file folders.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Green Folder (Office 42)', 'Office Equipment', 'pcs', 42, 0, 0, 'Green file folders.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('White Folder (Office 28)', 'Office Equipment', 'pcs', 28, 0, 0, 'White file folders.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Brown Folder (Office 13)', 'Office Equipment', 'pcs', 13, 0, 0, 'Brown file folders.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Brown File Holder', 'Office Equipment', 'pcs', 1, 0, 0, 'Desk brown file holder.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Logbook (Office)', 'Office Equipment', 'pcs', 6, 0, 0, 'Headquarters visitor logbooks.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Box of Fastener', 'Office Equipment', 'boxes', 4, 0, 0, 'Paper fastener boxes.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Stand File Box (Office)', 'Office Equipment', 'pcs', 15, 0, 0, 'Desk stand file boxes.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Plastic Stand File Box', 'Office Equipment', 'pcs', 2, 0, 0, 'Plastic stand file boxes.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Green Lace Tassel (Office)', 'Office Equipment', 'pcs', 6, 0, 0, 'Green lace tassels.');

-- Office Furniture
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Office Chair', 'Office Furniture', 'pcs', 3, 0, 0, 'Command staff office chairs.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Green Wooden Chair', 'Office Furniture', 'pcs', 9, 0, 0, 'Headquarters green wooden chairs.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Green Plastic Monobloc Chair', 'Office Furniture', 'pcs', 14, 0, 0, 'Cadet instruction green monobloc chairs.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Black Plastic Monobloc Chair', 'Office Furniture', 'pcs', 1, 0, 0, 'Black monobloc chair.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Wooden Long Table', 'Office Furniture', 'pcs', 1, 0, 0, 'Headquarters conference wooden table.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Brown Wooden Table', 'Office Furniture', 'pcs', 2, 0, 0, 'Staff brown wooden desk.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Green Wooden Big Table', 'Office Furniture', 'pcs', 2, 0, 0, 'Command staff green wooden table.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Blue Wooden Long Cabinet (Filing Cabinet)', 'Office Furniture', 'pcs', 1, 0, 0, 'Document filing wooden cabinet.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Dirty White Wooden Long Cabinet (Open Shelves)', 'Office Furniture', 'pcs', 4, 0, 0, 'Open shelf storage wooden cabinets.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Steel Cabinet (Office Furniture)', 'Office Furniture', 'pcs', 1, 0, 0, 'Secure steel cabinet.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Wooden Large Cabinet (Open & Close Shelves)', 'Office Furniture', 'pcs', 1, 0, 0, 'Large wooden supply cabinet with open & close shelves.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Bulletin Board', 'Office Furniture', 'pcs', 1, 0, 0, 'Cadet announcement bulletin board.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('White Board (Office Furniture)', 'Office Furniture', 'pcs', 2, 0, 0, 'Instructional whiteboards.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Calendar of Activity Board', 'Office Furniture', 'pcs', 1, 0, 0, 'Annual training schedule board.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Unit Accomplished Board', 'Office Furniture', 'pcs', 1, 0, 0, 'ROTC Unit awards & achievements board.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Sponsors & Escorts Board', 'Office Furniture', 'pcs', 1, 0, 0, 'Unit sponsors and escorts roster board.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Corps of Cadet Officer Board', 'Office Furniture', 'pcs', 1, 0, 0, 'Cadet officers organizational hierarchy board.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('CMO Board', 'Office Furniture', 'pcs', 1, 0, 0, 'Civil-Military Operations board.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Picture Frame', 'Office Furniture', 'pcs', 26, 0, 0, 'Official portrait and commendation frames.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Green Curtain', 'Office Furniture', 'sets', 10, 0, 0, 'Office green window curtains.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Wooden Stand (Office)', 'Office Furniture', 'pcs', 1, 0, 0, 'Display wooden stand.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Trash Bin (Office)', 'Office Furniture', 'pcs', 3, 0, 0, 'Headquarters waste trash bins.');

-- Office Flag & Decoration
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Philippine Flag', 'Office Flag & Decoration', 'pcs', 1, 0, 0, 'Official Philippine National Flag.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Unit Flag', 'Office Flag & Decoration', 'pcs', 1, 0, 0, 'Official CSU ROTC Unit Flag.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('ASEAN Flag', 'Office Flag & Decoration', 'pcs', 1, 0, 0, 'Association of Southeast Asian Nations Flag.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('CSU Flag', 'Office Flag & Decoration', 'pcs', 1, 0, 0, 'Caraga State University Flag.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Flag Pole', 'Office Flag & Decoration', 'pcs', 2, 0, 0, 'Parade flag poles.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Pole Stand', 'Office Flag & Decoration', 'pcs', 2, 0, 0, 'Flag pole floor bases.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Champion Banner', 'Office Flag & Decoration', 'pcs', 2, 0, 0, 'RCDG Competition Champion Banners.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('DIY Lei', 'Office Flag & Decoration', 'pcs', 14, 0, 0, 'Ceremonial leis for VIP guests.');
INSERT INTO items (name, category, unit_of_measure, serviceable_qty, repairable_qty, condemned_qty, description) VALUES ('Wall of Achievement', 'Office Flag & Decoration', 'pcs', 1, 0, 0, 'ROTC Unit Wall of Achievement display.');
