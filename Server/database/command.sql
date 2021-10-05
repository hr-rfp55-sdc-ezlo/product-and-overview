-- Below commands are performed on Command line and copied here for documentation purposes.

create database localpo;

CREATE TABLE products (product_id INTEGER PRIMARY KEY, name TEXT, slogan TEXT, description TEXT, category TEXT, default_price TEXT)
COPY products FROM '/users/wanglibo/downloads/product.csv' WITH (FORMAT csv, DELIMITER ',', HEADER true);

CREATE TABLE features (id INTEGER PRIMARY KEY, product_id INTEGER, feature TEXT, value TEXT);
COPY features FROM '/users/wanglibo/downloads/features.csv' WITH (FORMAT csv, DELIMITER ',', HEADER true);
CREATE TABLE photos (id INTEGER PRIMARY KEY, style_id INTEGER, url TEXT, thumbnail_url TEXT);
COPY photos FROM '/users/wanglibo/downloads/photos.csv' WITH (FORMAT csv, DELIMITER ',', HEADER true);
CREATE TABLE related (id INTEGER PRIMARY KEY, product_id INTEGER, related_product_id INTEGER);
COPY related FROM '/users/wanglibo/downloads/related.csv' WITH (FORMAT csv, DELIMITER ',', HEADER true);
CREATE TABLE skus (id TEXT PRIMARY KEY, style_id INTEGER, size TEXT, quantity INTEGER);
COPY skus FROM '/users/wanglibo/downloads/skus.csv' WITH (FORMAT csv, DELIMITER ',', HEADER true);
CREATE TABLE styles (style_id INTEGER PRIMARY KEY, product_id INTEGER, name TEXT, sale_price TEXT, original_price TEXT, "default?" BOOLEAN);
COPY styles FROM '/users/wanglibo/downloads/styles.csv' WITH (FORMAT csv, DELIMITER ',', HEADER true);


ALTER TABLE features ADD CONSTRAINT fk_features_products FOREIGN KEY (product_id) REFERENCES products (product_id);
ALTER TABLE skus ADD CONSTRAINT fk_skus_styles FOREIGN KEY (style_id) REFERENCES styles (style_id);
ALTER TABLE photos ADD CONSTRAINT fk_photos_styles FOREIGN KEY (style_id) REFERENCES styles (style_id);

CREATE INDEX idx_features_product_id ON features(product_id);
CREATE INDEX idx_photos_style_id ON photos(style_id);
CREATE INDEX idx_skus_id ON skus(id);
CREATE INDEX idx_related_product_id ON related(product_id);
CREATE INDEX idx_related_related_product_id ON related(related_product_id);
CREATE INDEX idx_styles_product_id ON styles(product_id);
CREATE INDEX idx_styles_style_id ON styles(style_id);






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