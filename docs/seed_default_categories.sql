-- ==============================================================================
-- SCRIPT TẠO DỮ LIỆU DANH MỤC ĐẦY ĐỦ CHO HỆ THỐNG "MECHANICAL SUPPLIES STORE"
-- ==============================================================================
-- Bao gồm:
--   1. Thêm cột `Type` vào bảng `categories` nếu chưa có (PRODUCT / SERVICE / PARTNER).
--   2. CẤP 1 (Root Categories, ParentId = NULL) với MÃ CỐ ĐỊNH:
--      - 6 Danh mục Sản phẩm (PRODUCT): TBTL, TBTD, VCN, VTTH, DCMM, BHLD
--      - 3 Danh mục Dịch vụ (SERVICE): DV-BH, DV-GC, DV-LD
--      - 3 Danh mục Đối tác (PARTNER): DT-MN, DT-MT, DT-MB
--   3. CẤP 2 (Nhóm danh mục con trực thuộc từng danh mục cha tương ứng theo đúng Type).
--   4. CẤP 3 (Chi tiết phần tử con cho Sản phẩm, Dịch vụ và Đối tác).
--   5. Sử dụng INSERT ... ON DUPLICATE KEY UPDATE an toàn, chuẩn hóa mã & slug.
-- ==============================================================================

USE `mechanical_supplies_db`;

SET NAMES 'utf8mb4';
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------------------------
-- BƯỚC 0: THÊM CỘT `Type` VÀO BẢNG `categories` NẾU CHƯA CÓ
-- ------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS AddCategoryTypeColumnIfNotExists;
DELIMITER $$
CREATE PROCEDURE AddCategoryTypeColumnIfNotExists()
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
          AND TABLE_NAME = 'categories' 
          AND COLUMN_NAME = 'Type'
    ) THEN
        ALTER TABLE `categories` ADD COLUMN `Type` VARCHAR(50) NOT NULL DEFAULT 'PRODUCT' AFTER `Status`;
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.STATISTICS 
        WHERE TABLE_SCHEMA = DATABASE() 
          AND TABLE_NAME = 'categories' 
          AND INDEX_NAME = 'IX_categories_Type_IsDeleted'
    ) THEN
        ALTER TABLE `categories` ADD INDEX `IX_categories_Type_IsDeleted` (`Type`, `IsDeleted`);
    END IF;
END$$
DELIMITER ;

CALL AddCategoryTypeColumnIfNotExists();
DROP PROCEDURE IF EXISTS AddCategoryTypeColumnIfNotExists;

-- Chuẩn hóa dữ liệu cũ nếu có dòng nào Type bị NULL hoặc rỗng
UPDATE `categories` SET `Type` = 'PRODUCT' WHERE `Type` IS NULL OR `Type` = '';

-- ==============================================================================
-- 1. CẤP 1: DANH MỤC CHA GỐC (HỆ THỐNG - MÃ CỐ ĐỊNH, ParentId = NULL)
-- ==============================================================================

-- 1.1. DANH MỤC GỐC SẢN PHẨM (Type = 'PRODUCT')
INSERT INTO `categories` (
    `ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`
)
VALUES
(
    NULL, 'TBTL', 'Thiết bị & Phụ tùng Thủy lực', 'thiet-bi-va-phu-tung-thuy-luc', 'PRODUCT',
    'Hệ thống bơm thủy lực, van thủy lực cao áp, xi lanh, ống mềm và linh kiện chuyên dụng cho dây chuyền và xe cơ giới.',
    'Sliders', 1, 'ACTIVE', NOW(6), 0
),
(
    NULL, 'TBTD', 'Thiết bị Truyền động Cơ khí', 'thiet-bi-truyen-dong-co-khi', 'PRODUCT',
    'Vòng bi công nghiệp, bạc đạn chính hãng, dây curoa chịu tải, nhông xích và các bộ khớp nối cơ khí kỹ thuật cao.',
    'Cog', 2, 'ACTIVE', NOW(6), 0
),
(
    NULL, 'VCN', 'Van Công nghiệp & Phụ kiện Đường ống', 'van-cong-nghiep-va-phu-kien-duong-ong', 'PRODUCT',
    'Các loại van bi, van bướm, van cầu, van một chiều, mặt bích tiêu chuẩn JIS/DIN/ANSI và phụ kiện nối ống công nghiệp.',
    'GitBranch', 3, 'ACTIVE', NOW(6), 0
),
(
    NULL, 'VTTH', 'Vật tư Kim khí & Tiêu hao', 'vat-tu-kim-khi-va-tieu-hao', 'PRODUCT',
    'Bu lông, đai ốc inox/thép cường độ cao, phốt chặn dầu thủy lực, que hàn, đá cắt và vật liệu làm kín công nghiệp.',
    'Package', 4, 'ACTIVE', NOW(6), 0
),
(
    NULL, 'DCMM', 'Dụng cụ Kỹ thuật & Thiết bị Xưởng', 'dung-cu-ky-thuat-va-thiet-bi-xuong', 'PRODUCT',
    'Dụng cụ cầm tay chuyên dụng, máy bấm đầu ống thủy lực, máy hàn, thiết bị đo lường cơ khí chính xác.',
    'Wrench', 5, 'ACTIVE', NOW(6), 0
),
(
    NULL, 'BHLD', 'Trang thiết bị Bảo hộ Lao động', 'trang-thiet-bi-bao-ho-lao-dong', 'PRODUCT',
    'Giày bảo hộ mũi thép chống đinh, găng tay cơ khí chống dầu, kính và mũ bảo hộ đạt chuẩn an toàn lao động.',
    'Shield', 6, 'ACTIVE', NOW(6), 0
),

-- 1.2. DANH MỤC GỐC DỊCH VỤ (Type = 'SERVICE')
(
    NULL, 'DV-BH', 'Bảo hành & Bảo trì', 'bao-hanh-va-bao-tri', 'SERVICE',
    'Dịch vụ hậu mãi, bảo dưỡng định kỳ và duy trì hiệu suất hoạt động thiết bị chuyên nghiệp.',
    'Shield', 7, 'ACTIVE', NOW(6), 0
),
(
    NULL, 'DV-GC', 'Gia công Kỹ thuật', 'gia-cong-ky-thuat', 'SERVICE',
    'Gia công cơ khí, bấm ống thủy lực và sản xuất linh kiện kỹ thuật theo yêu cầu chính xác.',
    'Wrench', 8, 'ACTIVE', NOW(6), 0
),
(
    NULL, 'DV-LD', 'Lắp đặt & Chuyển giao Thiết bị', 'lap-dat-va-chuyen-giao-thiet-bi', 'SERVICE',
    'Dịch vụ tư vấn, khảo sát, lắp đặt hoàn thiện và chuyển giao công nghệ hệ thống cơ khí, thủy lực.',
    'Cog', 9, 'ACTIVE', NOW(6), 0
),

-- 1.3. DANH MỤC GỐC ĐỐI TÁC (Type = 'PARTNER')
(
    NULL, 'DT-MN', 'Đối tác Khu vực Miền Nam', 'mien-nam', 'PARTNER',
    'Khu vực kinh tế trọng điểm phía Nam với hệ thống đối tác, nhà phân phối rộng khắp.',
    'MapPin', 10, 'ACTIVE', NOW(6), 0
),
(
    NULL, 'DT-MT', 'Đối tác Khu vực Miền Trung', 'mien-trung', 'PARTNER',
    'Kết nối các đối tác chiến lược và nhà phân phối tại khu vực duyên hải miền Trung và Tây Nguyên.',
    'MapPin', 11, 'ACTIVE', NOW(6), 0
),
(
    NULL, 'DT-MB', 'Đối tác Khu vực Miền Bắc', 'mien-bac', 'PARTNER',
    'Mạng lưới đối tác, đại lý ủy quyền tại Hà Nội và các khu công nghiệp trọng điểm miền Bắc.',
    'MapPin', 12, 'ACTIVE', NOW(6), 0
)
ON DUPLICATE KEY UPDATE 
    `Name` = VALUES(`Name`),
    `Type` = VALUES(`Type`),
    `Description` = VALUES(`Description`),
    `Icon` = VALUES(`Icon`),
    `DisplayOrder` = VALUES(`DisplayOrder`),
    `Status` = VALUES(`Status`),
    `IsDeleted` = 0;


-- ==============================================================================
-- 2. CẤP 2: NHÓM DANH MỤC CON TRỰC THUỘC DANH MỤC GỐC
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 2.1. CẤP 2 CỦA SẢN PHẨM (Type = 'PRODUCT')
-- ------------------------------------------------------------------------------
-- Con của TBTL (Thiết bị Thủy lực)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'TBTL-BOM', 'Bơm thủy lực các loại', 'bom-thuy-luc-cac-loai', 'PRODUCT', 'Bơm bánh răng, bơm cánh gạt, bơm piston áp suất cao.', 'Package', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'TBTL' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'TBTL-VAN', 'Van thủy lực điều khiển', 'van-thuy-luc-dieu-khien', 'PRODUCT', 'Van phân phối tay/điện, van an toàn, van một chiều, van tiết lưu.', 'Sliders', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'TBTL' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'TBTL-ONG', 'Ống mềm & Đầu nối thủy lực', 'ong-mem-va-dau-noi-thuy-luc', 'PRODUCT', 'Ống cao áp 1SN/2SN/4SP, cút nối ren thủy lực JIS/BSPP/JIC.', 'Layers', 3, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'TBTL' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'TBTL-XIL', 'Xi lanh thủy lực công nghiệp', 'xi-lanh-thuy-luc-cong-nghiep', 'PRODUCT', 'Xi lanh tiêu chuẩn, xi lanh cơ giới, ben nâng hạ tải trọng lớn.', 'Box', 4, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'TBTL' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- Con của TBTD (Truyền động Cơ khí)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'TBTD-VB', 'Vòng bi & Bạc đạn công nghiệp', 'vong-bi-bac-dan-cong-nghiep', 'PRODUCT', 'Vòng bi cầu, vòng bi côn, gối đỡ Asahi/SKF/NSK chính hãng.', 'Cog', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'TBTD' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'TBTD-DAY', 'Dây curoa & Đai truyền động', 'day-curoa-dai-truyen-dong', 'PRODUCT', 'Dây đai thang, đai răng, đai công nghiệp Bando/Mitsuboshi.', 'Layers', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'TBTD' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'TBTD-XICH', 'Xích tải & Nhông đĩa xích', 'xich-tai-nhong-dia-xich', 'PRODUCT', 'Xích con lăn tiêu chuẩn ANSI/BS, nhông đơn, nhông đôi.', 'Box', 3, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'TBTD' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- Con của VCN (Van Công nghiệp)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'VCN-VB', 'Van bi công nghiệp (Ball Valve)', 'van-bi-cong-nghiep-ball-valve', 'PRODUCT', 'Van bi inox 304, 316, van bi thép tay gạt và điều khiển khí nén.', 'GitBranch', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'VCN' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'VCN-VBU', 'Van bướm (Butterfly Valve)', 'van-buom-butterfly-valve', 'PRODUCT', 'Van bướm thân gang đĩa inox, van bướm tay kẹp, tay quay.', 'Package', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'VCN' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'VCN-BICH', 'Mặt bích & Phụ kiện hàn/ren', 'mat-bich-phu-kien-han-ren', 'PRODUCT', 'Mặt bích tiêu chuẩn JIS 10K/20K, co, tê, bầu giảm inox/thép.', 'Layers', 3, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'VCN' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- Con của VTTH (Vật tư Tiêu hao)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'VTTH-BL', 'Bu lông, Đai ốc & Thanh ren', 'bu-long-dai-oc-thanh-ren', 'PRODUCT', 'Bu lông lục giác chìm, lục giác ngoài, inox 304, thép cấp bền 8.8/10.9.', 'Package', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'VTTH' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'VTTH-PHOT', 'Phốt ben & Gioăng làm kín', 'phot-ben-gioang-lam-kin', 'PRODUCT', 'Phốt thủy lực piston, cần gạt bụi, O-ring chịu dầu NBR/Viton.', 'Sliders', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'VTTH' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'VTTH-HAN', 'Vật liệu hàn & Đá cắt, đá mài', 'vat-lieu-han-da-cat-da-mai', 'PRODUCT', 'Que hàn inox, que hàn chịu lực, đá cắt sắt, đá mài mối hàn.', 'Box', 3, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'VTTH' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- Con của DCMM (Dụng cụ & Máy móc)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DCMM-CAM', 'Dụng cụ cầm tay chuyên dụng', 'dung-cu-cam-tay-chuyen-dung', 'PRODUCT', 'Bộ cờ lê, mỏ lết, tuýp vặn ốc, kìm bấm ống cao cấp.', 'Wrench', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DCMM' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DCMM-MAY', 'Thiết bị xưởng & Máy bấm ống', 'thiet-bi-xuong-may-bam-ong', 'PRODUCT', 'Máy bấm ống thủy lực thủ công và bán tự động, máy mài bàn.', 'Box', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DCMM' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- Con của BHLD (Bảo hộ Lao động)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'BHLD-GIAY', 'Giày bảo hộ công nghiệp', 'giay-bao-ho-cong-nghiep', 'PRODUCT', 'Giày bảo hộ mũi thép, đế chống trượt, chống đinh đạt chuẩn S3.', 'Shield', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'BHLD' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'BHLD-TAY', 'Găng tay chịu dầu & Cơ học', 'gang-tay-chiu-dau-co-hoc', 'PRODUCT', 'Găng tay sợi phủ Nitrile chống dầu mỡ trơn trượt, chống cắt.', 'Package', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'BHLD' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- ------------------------------------------------------------------------------
-- 2.2. CẤP 2 CỦA DỊCH VỤ (Type = 'SERVICE')
-- ------------------------------------------------------------------------------
-- Con của DV-BH (Bảo hành & Bảo trì)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-BH-MAY', 'Bảo hành máy móc & thiết bị', 'bao-hanh-may', 'SERVICE', 'Dịch vụ bảo hành, kiểm tra định kỳ các hệ thống máy cơ khí, thủy lực.', 'Wrench', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-BH' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-BH-DK', 'Bảo dưỡng định kỳ hệ thống', 'bao-hanh-dinh-ky', 'SERVICE', 'Bảo dưỡng định kỳ dây chuyền sản xuất, trạm nguồn thủy lực công nghiệp.', 'Sliders', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-BH' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-BH-SC', 'Sửa chữa cơ khí tận nơi', 'sua-chua-tan-noi', 'SERVICE', 'Hỗ trợ kỹ thuật khẩn cấp và sửa chữa thiết bị cơ giới, máy xưởng tận nơi.', 'Shield', 3, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-BH' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- Con của DV-GC (Gia công Kỹ thuật)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-GC-ONG', 'Gia công ống thành phẩm & thủy lực', 'gia-cong-ong-thanh-pham-ong-thuy-luc', 'SERVICE', 'Gia công ép đầu cốt, bấm ống thủy lực 1 lớp, 2 lớp, 4 lớp theo tiêu chuẩn.', 'Layers', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-GC' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-GC-BAM', 'Bấm đầu ống thủy lực lấy ngay', 'bam-dau-ong-thuy-luc', 'SERVICE', 'Gia công bấm đầu nối ống cao áp các bước ren tiêu chuẩn JIS, DIN, SAE.', 'Wrench', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-GC' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-GC-AP', 'Thử áp suất cao & Hiệu chuẩn', 'thu-ap-suat-cao', 'SERVICE', 'Kiểm tra độ kín khít, chịu áp của đường ống và van theo quy chuẩn an toàn.', 'Sliders', 3, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-GC' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- Con của DV-LD (Lắp đặt & Chuyển giao Thiết bị)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-LD-DC', 'Lắp đặt dây chuyền & hệ thống thủy lực', 'lap-dat-day-chuyen-he-thong-thuy-luc', 'SERVICE', 'Thi công hàn lắp đường ống dẫn dầu công nghiệp, xi lanh nâng hạ và tủ điều khiển.', 'Cog', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-LD' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-LD-TN', 'Lắp đặt trạm nguồn thủy lực công nghiệp', 'lap-dat-tram-nguon-thuy-luc-cong-nghiep', 'SERVICE', 'Lắp đặt cụm motor bơm, thùng dầu, két làm mát và căn chỉnh đồng tâm khớp nối.', 'Layers', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-LD' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-LD-CG', 'Chuyển giao công nghệ & Đào tạo vận hành', 'chuyen-giao-cong-nghe-va-dao-tao-van-hanh', 'SERVICE', 'Đào tạo kỹ năng vận hành an toàn, bàn giao sơ đồ kỹ thuật và quy trình bảo dưỡng.', 'Shield', 3, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-LD' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- ------------------------------------------------------------------------------
-- 2.3. CẤP 2 CỦA ĐỐI TÁC (Type = 'PARTNER')
-- ------------------------------------------------------------------------------
-- Con của DT-MN (Miền Nam)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DT-MN-HCM', 'Đối tác TP. Hồ Chí Minh', 'tp-ho-chi-minh', 'PARTNER', 'Hệ thống đối tác cung ứng và xưởng dịch vụ kỹ thuật tại TP.HCM.', 'MapPin', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DT-MN' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DT-MN-BD', 'Đối tác Bình Dương', 'binh-duong', 'PARTNER', 'Mạng lưới đối tác cung ứng vật tư công nghiệp cho các KCN Bình Dương.', 'MapPin', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DT-MN' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DT-MN-DN', 'Đối tác Đồng Nai', 'dong-nai', 'PARTNER', 'Đại lý phân phối thiết bị truyền động và phụ tùng thủy lực tại Đồng Nai.', 'MapPin', 3, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DT-MN' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- Con của DT-MT (Miền Trung)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DT-MT-DN', 'Đối tác Đà Nẵng', 'da-nang', 'PARTNER', 'Trung tâm đối tác cung cấp giải pháp cơ khí công nghiệp khu vực miền Trung.', 'MapPin', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DT-MT' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DT-MT-KH', 'Đối tác Khánh Hòa', 'khanh-hoa', 'PARTNER', 'Đối tác cung ứng vật tư kỹ thuật cho đóng tàu và công nghiệp duyên hải.', 'MapPin', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DT-MT' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- Con của DT-MB (Miền Bắc)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DT-MB-HN', 'Đối tác Hà Nội', 'ha-noi', 'PARTNER', 'Mạng lưới đại lý và phân phối chính thức tại khu vực Hà Nội.', 'MapPin', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DT-MB' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DT-MB-HP', 'Đối tác Hải Phòng', 'hai-phong', 'PARTNER', 'Đối tác cung ứng phụ kiện đường ống và thiết bị cơ khí cảng biển.', 'MapPin', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DT-MB' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;


-- ==============================================================================
-- 3. CẤP 3: CHI TIẾT PHẦN TỬ CON (LEVEL 3)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 3.1. CẤP 3 CỦA SẢN PHẨM (Type = 'PRODUCT')
-- ------------------------------------------------------------------------------
-- 3.1.1. Con của TBTL-BOM
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'TBTL-BOM-BR', 'Bơm bánh răng thủy lực (Gear Pump)', 'bom-banh-rang-thuy-luc', 'PRODUCT', 'Bơm bánh răng ăn khớp ngoài, áp suất làm việc 200 - 250 bar.', 'Package', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'TBTL-BOM' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'TBTL-BOM-CG', 'Bơm cánh gạt thủy lực (Vane Pump)', 'bom-canh-gat-thuy-luc', 'PRODUCT', 'Bơm cánh gạt lưu lượng ổn định, độ ồn thấp cho máy ép nhựa.', 'Package', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'TBTL-BOM' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'TBTL-BOM-PS', 'Bơm piston áp suất cao (Piston Pump)', 'bom-piston-ap-suat-cao', 'PRODUCT', 'Bơm piston hướng trục và hướng kính, áp suất cực đại lên tới 400 bar.', 'Package', 3, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'TBTL-BOM' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- 3.1.2. Con của TBTL-VAN
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'TBTL-VAN-PP', 'Van phân phối điện từ & Tay gạt', 'van-phan-phoi-dien-tu-tay-gat', 'PRODUCT', 'Van điện từ 220V/24V Yuken, Rexroth và van gạt tay xe công trình.', 'Sliders', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'TBTL-VAN' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'TBTL-VAN-AT', 'Van an toàn & Van cân bằng thủy lực', 'van-an-toan-van-can-bang', 'PRODUCT', 'Van xả tràn bảo vệ mạch thủy lực và van chống rơi tải cho xi lanh.', 'Sliders', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'TBTL-VAN' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'TBTL-VAN-TL', 'Van tiết lưu & Van một chiều áp cao', 'van-tiet-luu-van-mot-chieu', 'PRODUCT', 'Điều chỉnh tốc độ di chuyển của xi lanh và khóa dòng dầu an toàn.', 'Sliders', 3, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'TBTL-VAN' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- 3.1.3. Con của TBTL-ONG
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'TBTL-ONG-12', 'Ống tuy-ô thủy lực 1 - 2 lớp thép', 'ong-tuy-o-thuy-luc-1-2-lop-thep', 'PRODUCT', 'Ống mềm áp suất trung bình tiêu chuẩn SAE 100 R1AT, R2AT.', 'Layers', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'TBTL-ONG' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'TBTL-ONG-4S', 'Ống thủy lực 4 lớp thép siêu áp 4SP/4SH', 'ong-thuy-luc-4-lop-thep-sieu-ap', 'PRODUCT', 'Ống dẫn dầu áp lực siêu cao cho máy xúc đào, máy ép cọc tải nặng.', 'Layers', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'TBTL-ONG' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'TBTL-ONG-KN', 'Khớp nối nhanh & Cút nối ren cong/thẳng', 'khop-noi-nhanh-cut-noi-ren', 'PRODUCT', 'Đầu ren BSPP, JIC 37 độ, JIS Nhật Bản và đầu bích nối nhanh.', 'Layers', 3, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'TBTL-ONG' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- 3.1.4. Con của TBTL-XIL
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'TBTL-XIL-TC', 'Xi lanh thủy lực vuông tiêu chuẩn', 'xi-lanh-thuy-luc-vuong-tieu-chuan', 'PRODUCT', 'Xi lanh 4 thanh giằng hành trình đa dạng cho khuôn ép gạch, máy uốn.', 'Box', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'TBTL-XIL' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'TBTL-XIL-CT', 'Xi lanh cán tròn tải trọng nặng', 'xi-lanh-can-tron-tai-trong-nang', 'PRODUCT', 'Xi lanh hàn vỏ dày cho ben xe ben, máy xúc và cẩu trục cảng biển.', 'Box', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'TBTL-XIL' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'TBTL-XIL-NT', 'Xi lanh tầng nhiều đốt nâng hạ', 'xi-lanh-tang-nhieu-dot-nang-ha', 'PRODUCT', 'Xi lanh nhiều tầng hành trình dài đẩy thùng xe tự đổ.', 'Box', 3, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'TBTL-XIL' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- 3.1.5. Con của TBTD-VB
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'TBTD-VB-CAU', 'Vòng bi cầu rãnh sâu tiêu chuẩn', 'vong-bi-cau-ranh-sau-tieu-chuan', 'PRODUCT', 'Vòng bi cầu dòng 6000, 6200, 6300 SKF/NSK tốc độ cao.', 'Cog', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'TBTD-VB' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'TBTD-VB-CON', 'Vòng bi côn chịu tải hỗn hợp', 'vong-bi-con-chiu-tai-hon-hop', 'PRODUCT', 'Vòng bi côn hệ mét và hệ inch chịu lực hướng kính và dọc trục lớn.', 'Cog', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'TBTD-VB' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'TBTD-VB-GD', 'Gối đỡ vòng bi Asahi/SKF/NSK', 'goi-do-vong-bi-asahi-skf-nsk', 'PRODUCT', 'Gối đỡ UCP, UCFL, UCF, UCT đúc từ gang chịu lực bền bỉ.', 'Cog', 3, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'TBTD-VB' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- 3.1.6. Con của TBTD-DAY
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'TBTD-DAY-TH', 'Dây curoa thang tiêu chuẩn A, B, C, D', 'day-curoa-thang-tieu-chuan', 'PRODUCT', 'Dây đai truyền động bản trơn Bando/Mitsuboshi chịu dầu, chịu nhiệt.', 'Layers', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'TBTD-DAY' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'TBTD-DAY-RG', 'Dây đai răng đồng bộ Timing Belt', 'day-dai-rang-dong-bo-timing-belt', 'PRODUCT', 'Dây đai răng bước 3M, 5M, 8M, 14M, XL, L, H định vị chính xác.', 'Layers', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'TBTD-DAY' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- 3.1.7. Con của TBTD-XICH
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'TBTD-XICH-CL', 'Xích con lăn đơn & Xích đôi tiêu chuẩn', 'xich-con-lan-don-xich-doi', 'PRODUCT', 'Xích con lăn tiêu chuẩn ANSI 40, 50, 60, 80, 100 thép cường lực.', 'Box', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'TBTD-XICH' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'TBTD-XICH-ND', 'Nhông đĩa xích đơn & Nhông đôi', 'nhong-dia-xich-don-nhong-doi', 'PRODUCT', 'Đĩa xích thành phẩm gia công lỗ cốt và rãnh then chuẩn cơ khí.', 'Box', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'TBTD-XICH' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- 3.1.8. Con của VCN-VB
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'VCN-VB-IN', 'Van bi inox 304/316 ren tay gạt', 'van-bi-inox-304-316-tay-gat', 'PRODUCT', 'Van bi inox 1 mảnh, 2 mảnh, 3 mảnh chịu axit và hóa chất công nghiệp.', 'GitBranch', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'VCN-VB' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'VCN-VB-MB', 'Van bi mặt bích tiêu chuẩn JIS 10K', 'van-bi-mat-bich-jis-10k', 'PRODUCT', 'Van bi gang đúc nối bích tiêu chuẩn JIS 10K, ANSI 150LB.', 'GitBranch', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'VCN-VB' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- 3.1.9. Con của VCN-VBU
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'VCN-VBU-TK', 'Van bướm tay kẹp thân gang đĩa inox', 'van-buom-tay-kep-than-gang', 'PRODUCT', 'Van bướm kiểu kẹp Wafer đĩa inox 304, đệm làm kín EPDM/PTFE.', 'Package', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'VCN-VBU' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'VCN-VBU-TQ', 'Van bướm tay quay vô lăng cỡ lớn', 'van-buom-tay-quay-vo-lang', 'PRODUCT', 'Van bướm hộp số tay quay điều khiển êm ái cho đường ống từ DN100 - DN500.', 'Package', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'VCN-VBU' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- 3.1.10. Con của VCN-BICH
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'VCN-BICH-JIS', 'Mặt bích JIS 10K/20K & ANSI 150LB', 'mat-bich-jis-10k-20k', 'PRODUCT', 'Mặt bích rỗng hàn lồng (SO), mặt bích mù (BL) thép carbon và inox.', 'Layers', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'VCN-BICH' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'VCN-BICH-CO', 'Co 90 độ, co lơ ren & phụ kiện hàn', 'co-90-do-co-lo-ren-han', 'PRODUCT', 'Co hàn SCH20/SCH40, co lơ inox và tê giảm áp lực cao.', 'Layers', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'VCN-BICH' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- 3.1.11. Con của VTTH-BL
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'VTTH-BL-IN', 'Bu lông lục giác inox 304, 316', 'bu-long-luc-giac-inox-304-316', 'PRODUCT', 'Bu lông lục giác chìm, lục giác ngoài chống gỉ sét trong môi trường biển.', 'Package', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'VTTH-BL' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'VTTH-BL-CB', 'Bu lông cường độ cao cấp bền 8.8, 10.9', 'bu-long-cuong-do-cao-88-109', 'PRODUCT', 'Bu lông chịu lực kết cấu nhà xưởng, cầu trục và chân đế máy móc.', 'Package', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'VTTH-BL' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- 3.1.12. Con của VTTH-PHOT
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'VTTH-PHOT-PI', 'Phốt ben piston thủy lực chịu nhiệt', 'phot-ben-piston-thuy-luc', 'PRODUCT', 'Phốt nén piston chất liệu PU/PTFE chịu áp 400 bar, chịu nhiệt cao.', 'Sliders', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'VTTH-PHOT' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'VTTH-PHOT-OR', 'Gioăng O-ring chịu dầu NBR/Viton', 'gioang-o-ring-chiu-dau-nbr-viton', 'PRODUCT', 'Hộp ron O-ring tiêu chuẩn và gia công gioăng mặt bích làm kín.', 'Sliders', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'VTTH-PHOT' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- 3.1.13. Con của VTTH-HAN
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'VTTH-HAN-QH', 'Que hàn điện chịu lực & Que hàn inox', 'que-han-dien-chiu-luc', 'PRODUCT', 'Que hàn Kiswel, Kim Tín KT-421, que hàn chịu tải 7018 chuyên dụng.', 'Box', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'VTTH-HAN' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'VTTH-HAN-DC', 'Đá cắt sắt bén ngọt & Không vỡ', 'da-cat-sat-ben-ngot', 'PRODUCT', 'Đá cắt Hải Dương, đá mài mối hàn kim loại độ bền vượt trội.', 'Box', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'VTTH-HAN' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- 3.1.14. Con của DCMM-CAM
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DCMM-CAM-CL', 'Bộ cờ lê mỏ lết chrome vanadium', 'bo-co-le-mo-let-chrome-vanadium', 'PRODUCT', 'Bộ cờ lê tròng miệng, mỏ lết lực thương hiệu Kingtony, Asaki.', 'Wrench', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DCMM-CAM' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DCMM-CAM-TP', 'Bộ tuýp đầu khẩu & Cần siết lực', 'bo-tuyp-dau-khau-can-siet-luc', 'PRODUCT', 'Cần siết lực kiểm soát moment xoắn chính xác khi siết ốc bu lông.', 'Wrench', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DCMM-CAM' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- 3.1.15. Con của DCMM-MAY
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DCMM-MAY-BO', 'Máy bấm đầu ống thủy lực bán tự động', 'may-bam-dau-ong-thuy-luc-ban-tu-dong', 'PRODUCT', 'Máy ép cos ống tuy-ô thủy lực từ 1/4 inch đến 2 inch độ chính xác micro.', 'Box', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DCMM-MAY' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DCMM-MAY-VC', 'Bộ vam cảo bạc đạn vòng bi thủy lực', 'bo-vam-cao-bac-dan-thuy-luc', 'PRODUCT', 'Vam cảo đĩa 3 chấu lực kéo 5 tấn, 10 tấn, 20 tấn an toàn và nhanh chóng.', 'Box', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DCMM-MAY' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- 3.1.16. Con của BHLD-GIAY
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'BHLD-GIAY-MT', 'Giày bảo hộ mũi thép chống đinh Hans', 'giay-bao-ho-mui-thep-hans', 'PRODUCT', 'Giày bảo hộ siêu nhẹ phong cách thể thao, lót Kevlar chống đâm xuyên.', 'Shield', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'BHLD-GIAY' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'BHLD-GIAY-JG', 'Giày bảo hộ da Jogger nhập khẩu', 'giay-bao-ho-da-jogger', 'PRODUCT', 'Giày da bò thật chịu nước, đế PU 2 lớp chống trơn trượt dầu mỡ S3.', 'Shield', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'BHLD-GIAY' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- 3.1.17. Con của BHLD-TAY
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'BHLD-TAY-NT', 'Găng tay phủ cao su Nitrile chống dầu trơn', 'gang-tay-phu-nitrile-chong-dau', 'PRODUCT', 'Độ bám dính cực tốt khi tiếp xúc với dầu thủy lực và linh kiện cơ khí.', 'Package', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'BHLD-TAY' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'BHLD-TAY-CC', 'Găng tay dệt sợi chống cắt cấp 5', 'gang-tay-chong-cat-cap-5', 'PRODUCT', 'Sợi HPPE siêu bền bảo vệ bàn tay khỏi phoi tiện kim loại và mép tôn sắc nhọn.', 'Package', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'BHLD-TAY' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;


-- ------------------------------------------------------------------------------
-- 3.2. CẤP 3 CỦA DỊCH VỤ (Type = 'SERVICE')
-- ------------------------------------------------------------------------------
-- 3.2.1. Con của DV-BH-MAY (Bảo hành máy móc & thiết bị)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-BH-MAY-BOM', 'Bảo hành bơm & van thủy lực', 'bao-hanh-bom-van-thuy-luc', 'SERVICE', 'Dịch vụ bảo hành, kiểm tra và phục hồi bơm van thủy lực định kỳ.', 'Wrench', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-BH-MAY' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-BH-MAY-XL', 'Kiểm định xi lanh & bộ nguồn', 'kiem-dinh-xi-lanh-bo-nguon', 'SERVICE', 'Đo đạc áp suất làm việc, lưu lượng và phát hiện rò rỉ ty ben chuyên sâu.', 'Wrench', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-BH-MAY' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-BH-MAY-HA', 'Khắc phục sự cố tụt áp hệ thống', 'khac-phuc-su-co-tut-ap', 'SERVICE', 'Xử lý triệt để hiện tượng tụt áp, nóng dầu và rung giật trạm nguồn.', 'Wrench', 3, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-BH-MAY' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- 3.2.2. Con của DV-BH-DK (Bảo dưỡng định kỳ hệ thống)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-BH-DK-PB', 'Thay thế phốt ben & lọc dầu định kỳ', 'thay-the-phot-ben-loc-dau', 'SERVICE', 'Cung cấp và thay mới gioăng phốt xi lanh, lõi lọc dầu thủy lực đúng hạn.', 'Sliders', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-BH-DK' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-BH-DK-SR', 'Súc rửa & làm sạch đường ống thủy lực', 'suc-rua-lam-sach-duong-ong', 'SERVICE', 'Tẩy rửa cặn carbon, mạt sắt trong hệ thống ống ngầm và thùng chứa dầu.', 'Sliders', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-BH-DK' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-BH-DK-CD', 'Kiểm tra độ rung & cân bằng động trục', 'kiem-tra-do-rung-can-bang-truc', 'SERVICE', 'Phân tích dao động gối đỡ và cân bằng trục motor tránh phá hủy bạc đạn.', 'Sliders', 3, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-BH-DK' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- 3.2.3. Con của DV-BH-SC (Sửa chữa cơ khí tận nơi)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-BH-SC-TN', 'Sửa chữa trạm nguồn thủy lực tại chỗ', 'sua-chua-tram-nguon-thuy-luc', 'SERVICE', 'Đội cơ động xử lý sự cố trực tiếp tại nhà máy giúp giảm thời gian dừng chuyền.', 'Shield', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-BH-SC' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-BH-SC-TB', 'Phục hồi ty ben xi lanh mòn xước', 'phuc-hoi-ty-ben-xi-lanh', 'SERVICE', 'Mạ crom cứng phục hồi ty ben bị rỗ, xước sâu và tiện ren mới chuẩn xác.', 'Shield', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-BH-SC' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-BH-SC-TR', 'Thay thế dây đai curoa & nhông xích máy', 'thay-the-day-dai-nhong-xich', 'SERVICE', 'Hỗ trợ kỹ thuật thay đai tải, xích truyền động cho máy cán, máy nghiền.', 'Shield', 3, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-BH-SC' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- 3.2.4. Con của DV-GC-ONG (Gia công ống thành phẩm & thủy lực)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-GC-ONG-12', 'Gia công ống mềm 1-2 lớp thép chịu tải', 'gia-cong-ong-mem-1-2-lop-thep', 'SERVICE', 'Bấm cos ống mềm dẫn dầu truyền động theo kích thước và áp yêu cầu.', 'Layers', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-GC-ONG' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-GC-ONG-46', 'Gia công ống tuy-ô 4-6 lớp siêu áp', 'gia-cong-ong-tuy-o-4-6-lop-sieu-ap', 'SERVICE', 'Gia công ép đầu bích và đầu rắc-co chịu áp suất va đập lên tới 500 bar.', 'Layers', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-GC-ONG' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-GC-ONG-BV', 'Bọc vỏ thép lò xo chống cọ xát & tia lửa', 'boc-vo-thep-lo-xo-chong-co-xat', 'SERVICE', 'Lồng vỏ bảo vệ sợi thủy tinh bọc silicone chống cháy lan và chống vỡ ống.', 'Layers', 3, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-GC-ONG' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- 3.2.5. Con của DV-GC-BAM (Bấm đầu ống thủy lực lấy ngay)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-GC-BAM-RN', 'Bấm đầu cốt ren JIS/DIN/SAE lấy liền', 'bam-dau-cot-ren-jis-din-sae', 'SERVICE', 'Bấm cút ren thẳng, cong 45 độ, cong 90 độ chuẩn xác trong 15 phút.', 'Wrench', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-GC-BAM' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-GC-BAM-MB', 'Bấm đầu nối mặt bích cao áp chuyên dụng', 'bam-dau-noi-mat-bich-cao-ap', 'SERVICE', 'Gia công mặt bích Code 61 và Code 62 tiêu chuẩn SAE quốc tế.', 'Wrench', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-GC-BAM' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-GC-BAM-NN', 'Gia công bấm cút nối nhanh tự ngắt', 'gia-cong-bam-cut-noi-nhanh', 'SERVICE', 'Tích hợp khớp nối nhanh thủy lực tiện tháo lắp không trào dầu.', 'Wrench', 3, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-GC-BAM' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- 3.2.6. Con của DV-GC-AP (Thử áp suất cao & Hiệu chuẩn)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-GC-AP-TT', 'Thử áp tĩnh đường ống đến 700 bar', 'thu-ap-tinh-duong-ong-700-bar', 'SERVICE', 'Kiểm tra độ giãn nở và áp nổ của ống dẫn bằng trạm thử thủy lực khép kín.', 'Sliders', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-GC-AP' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-GC-AP-HC', 'Cân chỉnh & hiệu chuẩn van an toàn', 'can-chinh-hieu-chuan-van-an-toan', 'SERVICE', 'Đặt ngưỡng áp suất kích hoạt chính xác cho van chống tràn và van an toàn.', 'Sliders', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-GC-AP' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-GC-AP-CC', 'Cấp tem & biên bản kiểm tra áp suất', 'cap-tem-bien-ban-kiem-tra-ap-suat', 'SERVICE', 'Xuất chứng nhận thử tải áp lực chuẩn quy chuẩn an toàn trước khi bàn giao.', 'Sliders', 3, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-GC-AP' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- 3.2.7. Con của DV-LD-DC (Lắp đặt dây chuyền & hệ thống thủy lực)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-LD-DC-DO', 'Thi công hàn lắp đường ống dẫn dầu', 'thi-cong-han-lap-duong-ong-dau', 'SERVICE', 'Thi công hệ thống ống cứng thép đúc chịu áp lực cao cho nhà xưởng.', 'Cog', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-LD-DC' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-LD-DC-XL', 'Lắp đặt cơ cấu xi lanh ben nâng hạ', 'lap-dat-co-cau-xi-lanh-nang-ha', 'SERVICE', 'Gia công gá đặt chân đế xi lanh và cân chỉnh phương chuyển động cơ học.', 'Cog', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-LD-DC' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-LD-DC-TD', 'Thi công đấu nối tủ điện điều khiển', 'thi-cong-dau-noi-tu-dien-thuy-luc', 'SERVICE', 'Kết nối cảm biến hành trình, rơ-le áp suất và lập trình PLC điều khiển.', 'Cog', 3, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-LD-DC' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- 3.2.8. Con của DV-LD-TN (Lắp đặt trạm nguồn thủy lực công nghiệp)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-LD-TN-MB', 'Lắp đặt cụm động cơ điện & bơm thủy lực', 'lap-dat-cum-dong-co-bom', 'SERVICE', 'Định vị động cơ, gá bơm và giảm rung chấn đế trạm nguồn chuyên nghiệp.', 'Layers', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-LD-TN' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-LD-TN-LM', 'Lắp đặt bộ làm mát dầu gió & két nước', 'lap-dat-bo-lam-mat-dau', 'SERVICE', 'Lắp đặt két tản nhiệt cưỡng bức duy trì nhiệt độ dầu lý tưởng dưới 55 độ C.', 'Layers', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-LD-TN' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-LD-TN-KN', 'Căn chỉnh độ đồng tâm khớp nối trục máy', 'can-chinh-do-dong-tam-khop-noi', 'SERVICE', 'Sử dụng đồng hồ so cân chỉnh độ lệch tâm trục động cơ và trục bơm.', 'Layers', 3, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-LD-TN' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- 3.2.9. Con của DV-LD-CG (Chuyển giao công nghệ & Đào tạo vận hành)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-LD-CG-VH', 'Hướng dẫn quy trình vận hành an toàn', 'huong-dan-quy-trinh-van-hanh-an-toan', 'SERVICE', 'Tập huấn kỹ năng thao tác áp lực, xử lý khẩn cấp khi xảy ra sự cố.', 'Shield', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-LD-CG' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-LD-CG-BT', 'Đào tạo kỹ năng bảo dưỡng phòng ngừa', 'dao-tao-ky-nang-bao-duong-phong-ngua', 'SERVICE', 'Hướng dẫn kỹ sư nhà máy kiểm tra dầu định kỳ, thay lọc và kiểm soát áp.', 'Shield', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-LD-CG' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-LD-CG-TL', 'Bàn giao hồ sơ kỹ thuật & sơ đồ thủy lực', 'ban-giao-ho-so-ky-thuat-so-do-thuy-luc', 'SERVICE', 'Bàn giao trọn gói bản vẽ nguyên lý mạch dầu và catalogue thiết bị.', 'Shield', 3, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-LD-CG' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;


-- ------------------------------------------------------------------------------
-- 3.3. CẤP 3 CỦA ĐỐI TÁC (Type = 'PARTNER')
-- ------------------------------------------------------------------------------
-- 3.3.1. Con của DT-MN-HCM (TP. Hồ Chí Minh)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DT-MN-HCM-Q1', 'Đại lý phân phối Trung tâm Quận 1', 'dai-ly-phan-phoi-trung-tam-quan-1', 'PARTNER', 'Đại lý ủy quyền phân phối thiết bị van và phụ tùng cơ khí tại trung tâm TP.HCM.', 'MapPin', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DT-MN-HCM' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DT-MN-HCM-TB', 'Tổng kho thủy lực KCN Tân Bình', 'tong-kho-thuy-luc-kcn-tan-binh', 'PARTNER', 'Kho lưu trữ ống cao áp, cút nối ren và trung tâm dịch vụ bấm ống lấy ngay.', 'MapPin', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DT-MN-HCM' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DT-MN-HCM-TT', 'Đại lý vật tư KCN Tân Tạo - Bình Tân', 'dai-ly-vat-tu-kcn-tan-tao', 'PARTNER', 'Cung ứng bu lông, đai ốc cường độ cao và vật tư tiêu hao cho doanh nghiệp.', 'MapPin', 3, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DT-MN-HCM' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DT-MN-HCM-TD', 'Trung tâm dịch vụ kỹ thuật TP. Thủ Đức', 'trung-tam-dich-vu-tp-thu-duc', 'PARTNER', 'Hỗ trợ kỹ thuật, lắp đặt và bảo hành hệ thống truyền động cơ khí khu công nghệ cao.', 'MapPin', 4, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DT-MN-HCM' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- 3.3.2. Con của DT-MN-BD (Bình Dương)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DT-MN-BD-VS', 'Đại lý ủy quyền KCN VSIP 1 & 2', 'dai-ly-uy-quyen-kcn-vsip', 'PARTNER', 'Đại lý chiến lược cung ứng vòng bi bạc đạn và dây curoa chính hãng.', 'MapPin', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DT-MN-BD' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DT-MN-BD-ST', 'Kho vật tư kỹ thuật Sóng Thần - Dĩ An', 'kho-vat-tu-song-than-di-an', 'PARTNER', 'Trung tâm phân phối van bướm, van bi và phụ kiện đường ống công nghiệp.', 'MapPin', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DT-MN-BD' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DT-MN-BD-MP', 'Đại lý phụ tùng truyền động KCN Mỹ Phước', 'dai-ly-phu-tung-kcn-my-phuoc', 'PARTNER', 'Cung ứng xích tải công nghiệp, nhông đĩa xích và khớp nối cơ khí chất lượng cao.', 'MapPin', 3, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DT-MN-BD' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- 3.3.3. Con của DT-MN-DN (Đồng Nai)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DT-MN-DN-BH', 'Tổng kho phân phối KCN Biên Hòa 1 & 2', 'tong-kho-kcn-bien-hoa', 'PARTNER', 'Tổng kho phân phối thiết bị cơ khí, máy ép tuy-ô và xi lanh thủy lực.', 'MapPin', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DT-MN-DN' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DT-MN-DN-NT', 'Đại lý van & ống thủy lực KCN Nhơn Trạch', 'dai-ly-van-ong-kcn-nhon-trach', 'PARTNER', 'Đại lý chuyên sâu về phụ kiện áp lực cao và van điều khiển khí nén.', 'MapPin', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DT-MN-DN' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DT-MN-DN-AM', 'Trạm dịch vụ kỹ thuật KCN Amata', 'tram-dich-vu-ky-thuat-kcn-amata', 'PARTNER', 'Bảo dưỡng định kỳ trạm nguồn thủy lực và phục hồi ty ben cho các nhà máy.', 'MapPin', 3, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DT-MN-DN' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- 3.3.4. Con của DT-MT-DN (Đà Nẵng)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DT-MT-DN-HK', 'Tổng kho thủy lực KCN Hòa Khánh', 'tong-kho-thuy-luc-kcn-hoa-khanh', 'PARTNER', 'Cung cấp linh kiện thủy lực khí nén và dịch vụ gia công ống công nghiệp miền Trung.', 'MapPin', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DT-MT-DN' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DT-MT-DN-LC', 'Đại lý thiết bị truyền động Liên Chiểu', 'dai-ly-truyen-dong-lien-chieu', 'PARTNER', 'Phân phối bạc đạn vòng bi SKF, Asahi và dây curoa Mitsuboshi chính hãng.', 'MapPin', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DT-MT-DN' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- 3.3.5. Con của DT-MT-KH (Khánh Hòa)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DT-MT-KH-NT', 'Đại lý phụ tùng hàng hải TP. Nha Trang', 'dai-ly-phu-tung-hang-hai-nha-trang', 'PARTNER', 'Cung cấp thiết bị thủy lực tời kéo, van inox và vật tư chống ăn mòn nước biển.', 'MapPin', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DT-MT-KH' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DT-MT-KH-CR', 'Trạm vật tư đóng tàu Cam Ranh', 'tram-vat-tu-dong-tau-cam-ranh', 'PARTNER', 'Hỗ trợ kỹ thuật lắp đặt ống cao áp và mặt bích JIS/DIN cho tàu biển và xưởng đóng tàu.', 'MapPin', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DT-MT-KH' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- 3.3.6. Con của DT-MB-HN (Hà Nội)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DT-MB-HN-TL', 'Tổng kho cơ khí kỹ thuật KCN Thăng Long', 'tong-kho-co-khi-kcn-thang-long', 'PARTNER', 'Trung tâm trung chuyển vật tư kỹ thuật và thiết bị thủy lực công nghiệp phía Bắc.', 'MapPin', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DT-MB-HN' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DT-MB-HN-HBT', 'Đại lý vòng bi bạc đạn Hai Bà Trưng', 'dai-ly-vong-bi-hai-ba-trung', 'PARTNER', 'Đại lý phân phối vòng bi côn, gối đỡ và nhông xích truyền động tại nội thành Hà Nội.', 'MapPin', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DT-MB-HN' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DT-MB-HN-DA', 'Trung tâm thủy lực công nghiệp Đông Anh', 'trung-tam-thuy-luc-dong-anh', 'PARTNER', 'Gia công bấm ống thủy lực 4 lớp và phân phối van áp lực cao cho cơ giới.', 'MapPin', 3, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DT-MB-HN' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

-- 3.3.7. Con của DT-MB-HP (Hải Phòng)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DT-MB-HP-HA', 'Đại lý thiết bị cơ khí cảng biển Hải An', 'dai-ly-co-khi-cang-hai-an', 'PARTNER', 'Cung cấp phụ tùng thủy lực xe cẩu container, cáp cẩu và thiết bị xếp dỡ cảng biển.', 'MapPin', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DT-MB-HP' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DT-MB-HP-DV', 'Tổng kho vật tư đường ống KCN Đình Vũ', 'tong-kho-duong-ong-kcn-dinh-vu', 'PARTNER', 'Tổng kho van công nghiệp, mặt bích tiêu chuẩn và gioăng phốt làm kín hóa chất.', 'MapPin', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DT-MB-HP' AND `IsDeleted` = 0 LIMIT 1
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `Description` = VALUES(`Description`), `IsDeleted` = 0;


-- Bật lại kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------------------------
-- KIỂM TRA TỔNG QUAN KẾT QUẢ SAU KHI NẠP DỮ LIỆU
-- ------------------------------------------------------------------------------
SELECT 
    `Type`,
    CASE 
        WHEN `ParentId` IS NULL THEN 'CẤP 1 (GỐC)'
        WHEN `ParentId` IN (SELECT Id FROM categories WHERE ParentId IS NULL) THEN 'CẤP 2'
        ELSE 'CẤP 3'
    END AS `LevelName`,
    COUNT(*) AS `TotalCount`
FROM `categories`
WHERE `IsDeleted` = 0
GROUP BY `Type`, `LevelName`
ORDER BY `Type`, `LevelName`;
