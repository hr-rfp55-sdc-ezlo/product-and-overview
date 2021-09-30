-- Below commands are performed on Command line and copied here for documentation purposes.

create database po;

CREATE TABLE products (product_id INTEGER PRIMARY KEY, name TEXT, slogan TEXT, description TEXT, category TEXT, default_price INTEGER)
COPY products FROM '/users/wanglibo/downloads/product.csv' WITH (FORMAT csv, DELIMITER ',', HEADER true);

CREATE TABLE features (id INTEGER PRIMARY KEY, product_id INTEGER FOREIGN KEY, feature TEXT, value TEXT);
CREATE TABLE features (id INTEGER PRIMARY KEY, product_id INTEGER, feature TEXT, value TEXT, FOREIGN KEY (product_id));
CREATE TABLE features (id INTEGER PRIMARY KEY, product_id INTEGER, feature TEXT, value TEXT, FOREIGN KEY product_id);

CREATE TABLE features (id INTEGER PRIMARY KEY, product_id INTEGER, feature TEXT, value TEXT, FOREIGN KEY (product_id) );

CREATE TABLE features (id INTEGER PRIMARY KEY, product_id INTEGER, feature TEXT, value TEXT);

COPY features FROM '/users/wanglibo/downloads/features.csv' WITH (FORMAT csv, DELIMITER ',', HEADER true);
CREATE TABLE photos (id INTEGER PRIMARY KEY, style_id INTEGER, url TEXT, thumbnail_url TEXT);
COPY photos FROM '/users/wanglibo/downloads/photos.csv' WITH (FORMAT csv, DELIMITER ',', HEADER true);
CREATE TABLE related (id INTEGER PRIMARY KEY, product_id INTEGER, related_product_id INTEGER);
COPY related FROM '/users/wanglibo/downloads/related.csv' WITH (FORMAT csv, DELIMITER ',', HEADER true);
CREATE TABLE skus (id INTEGER PRIMARY KEY, style_id INTEGER, size TEXT, quantity INTEGER);
COPY skus FROM '/users/wanglibo/downloads/skus.csv' WITH (FORMAT csv, DELIMITER ',', HEADER true);
CREATE TABLE styles (style_id INTEGER PRIMARY KEY, product_id INTEGER, name TEXT, sale_price INTEGER, original_price INTEGER, default INTEGER);
CREATE TABLE styles (style_id INTEGER PRIMARY KEY, product_id INTEGER, name TEXT, sale_price INTEGER, original_price INTEGER, default_style INTEGER);
COPY styles FROM '/users/wanglibo/downloads/styles.csv' WITH (FORMAT csv, DELIMITER ',', HEADER true);
CREATE TABLE styles (style_id INTEGER PRIMARY KEY, product_id INTEGER, name TEXT, sale_price TEXT, original_price TEXT, default_style BOOLEAN);
COPY styles FROM '/users/wanglibo/downloads/styles.csv' WITH (FORMAT csv, DELIMITER ',', HEADER true);


ALTER TABLE features ADD CONSTRAINT fk_features_products FOREIGN KEY (product_id) REFERENCES products (product_id);
ALTER TABLE styles ADD CONSTRAINT fk_styles_products FOREIGN KEY (product_id) REFERENCES products (product_id);
ALTER TABLE skus ADD CONSTRAINT fk_skus_styles FOREIGN KEY (style_id) REFERENCES styles (style_id);
ALTER TABLE photos ADD CONSTRAINT fk_photos_styles FOREIGN KEY (style_id) REFERENCES styles (style_id);


ALTER TABLE styles DROP CONSTRAINT fk_styles_products;

ALTER TABLE products ALTER COLUMN default_price TYPE TEXT;

ALTER TABLE skus ALTER COLUMN style_id TYPE TEXT;

ALTER TABLE skus ALTER COLUMN id TYPE TEXT;



--           List of relations
--  Schema |   Name   | Type  |  Owner
-- --------+----------+-------+----------
--  public | features | table | wanglibo
--  public | photos   | table | wanglibo
--  public | products | table | wanglibo
--  public | related  | table | wanglibo
--  public | skus     | table | wanglibo
--  public | styles   | table | wanglibo
-- (6 rows)