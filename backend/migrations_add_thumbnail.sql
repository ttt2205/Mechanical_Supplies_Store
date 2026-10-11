-- Thêm cột Thumbnail vào bảng products và posts để lưu trữ URL hình ảnh
ALTER TABLE `products` ADD COLUMN `Thumbnail` TEXT NULL AFTER `StockQuantity`;
ALTER TABLE `posts` ADD COLUMN `Thumbnail` TEXT NULL AFTER `Status`;
