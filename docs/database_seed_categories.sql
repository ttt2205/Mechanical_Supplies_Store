-- ==============================================================================
-- SCRIPT TẠO DỮ LIỆU DANH MỤC MẶC ĐỊNH CHO HỆ THỐNG "MECHANICAL SUPPLIES STORE"
-- ==============================================================================
-- Bao gồm:
--   1. Thêm cột `Type` vào bảng `categories` nếu chưa có (PRODUCT / SERVICE / PARTNER).
--   2. Tạo các DANH MỤC CHA GỐC (Root Categories, ParentId = NULL) với MÃ CỐ ĐỊNH:
--      - 6 Danh mục Sản phẩm (PRODUCT): TBTL, TBTD, VCN, VTTH, DCMM, BHLD
--      - 3 Danh mục Dịch vụ (SERVICE): DV-BH, DV-GC, DV-LD
--      - 3 Danh mục Đối tác (PARTNER): DT-MN, DT-MT, DT-MB
--   3. Tạo các DANH MỤC CON mẫu trực thuộc từng danh mục cha tương ứng theo đúng Type.
--   4. Sử dụng INSERT ... ON DUPLICATE KEY UPDATE an toàn, không làm mất dữ liệu hiện tại.
-- ==============================================================================

USE `mechanical_supplies_db`;

-- Tạm thời tắt kiểm tra khóa ngoại nếu cần đồng bộ
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

-- ------------------------------------------------------------------------------
-- 1. TẠO CÁC DANH MỤC CHA GỐC (HỆ THỐNG - MÃ CỐ ĐỊNH, ParentId = NULL)
-- ------------------------------------------------------------------------------

-- 1.1. DANH MỤC CHA SẢN PHẨM (Type = 'PRODUCT')
INSERT INTO `categories` (
    `ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`
)
VALUES
(
    NULL,
    'TBTL',
    'Thiết bị & Phụ tùng Thủy lực',
    'thiet-bi-va-phu-tung-thuy-luc',
    'PRODUCT',
    'Hệ thống bơm thủy lực, van thủy lực cao áp, xi lanh, ống mềm và linh kiện chuyên dụng cho dây chuyền và xe cơ giới.',
    'Sliders',
    1,
    'ACTIVE',
    NOW(6),
    0
),
(
    NULL,
    'TBTD',
    'Thiết bị Truyền động Cơ khí',
    'thiet-bi-truyen-dong-co-khi',
    'PRODUCT',
    'Vòng bi công nghiệp, bạc đạn chính hãng, dây curoa chịu tải, nhông xích và các bộ khớp nối cơ khí kỹ thuật cao.',
    'Cog',
    2,
    'ACTIVE',
    NOW(6),
    0
),
(
    NULL,
    'VCN',
    'Van Công nghiệp & Phụ kiện Đường ống',
    'van-cong-nghiep-va-phu-kien-duong-ong',
    'PRODUCT',
    'Các loại van bi, van bướm, van cầu, van một chiều, mặt bích tiêu chuẩn JIS/DIN/ANSI và phụ kiện nối ống công nghiệp.',
    'GitBranch',
    3,
    'ACTIVE',
    NOW(6),
    0
),
(
    NULL,
    'VTTH',
    'Vật tư Kim khí & Tiêu hao',
    'vat-tu-kim-khi-va-tieu-hao',
    'PRODUCT',
    'Bu lông, đai ốc inox/thép cường độ cao, phốt chặn dầu thủy lực, que hàn, đá cắt và vật liệu làm kín công nghiệp.',
    'Package',
    4,
    'ACTIVE',
    NOW(6),
    0
),
(
    NULL,
    'DCMM',
    'Dụng cụ Kỹ thuật & Thiết bị Xưởng',
    'dung-cu-ky-thuat-va-thiet-bi-xuong',
    'PRODUCT',
    'Dụng cụ cầm tay chuyên dụng, máy bấm đầu ống thủy lực, máy hàn, thiết bị đo lường cơ khí chính xác.',
    'Wrench',
    5,
    'ACTIVE',
    NOW(6),
    0
),
(
    NULL,
    'BHLD',
    'Trang thiết bị Bảo hộ Lao động',
    'trang-thiet-bi-bao-ho-lao-dong',
    'PRODUCT',
    'Giày bảo hộ mũi thép chống đinh, găng tay cơ khí chống dầu, kính và mũ bảo hộ đạt chuẩn an toàn lao động.',
    'Shield',
    6,
    'ACTIVE',
    NOW(6),
    0
),

-- 1.2. DANH MỤC CHA DỊCH VỤ (Type = 'SERVICE')
(
    NULL,
    'DV-BH',
    'Bảo hành & Bảo trì',
    'bao-hanh-va-bao-tri',
    'SERVICE',
    'Dịch vụ hậu mãi, bảo dưỡng định kỳ và duy trì hiệu suất hoạt động thiết bị chuyên nghiệp.',
    'Shield',
    7,
    'ACTIVE',
    NOW(6),
    0
),
(
    NULL,
    'DV-GC',
    'Gia công Kỹ thuật',
    'gia-cong-ky-thuat',
    'SERVICE',
    'Gia công cơ khí, bấm ống thủy lực và sản xuất linh kiện kỹ thuật theo yêu cầu chính xác.',
    'Wrench',
    8,
    'ACTIVE',
    NOW(6),
    0
),
(
    NULL,
    'DV-LD',
    'Lắp đặt & Chuyển giao Thiết bị',
    'lap-dat-va-chuyen-giao-thiet-bi',
    'SERVICE',
    'Dịch vụ tư vấn, khảo sát, lắp đặt hoàn thiện và chuyển giao công nghệ hệ thống cơ khí, thủy lực.',
    'Cog',
    9,
    'ACTIVE',
    NOW(6),
    0
),

-- 1.3. DANH MỤC CHA ĐỐI TÁC (Type = 'PARTNER')
(
    NULL,
    'DT-MN',
    'Đối tác Khu vực Miền Nam',
    'mien-nam',
    'PARTNER',
    'Khu vực kinh tế trọng điểm phía Nam với hệ thống đối tác, nhà phân phối rộng khắp.',
    'MapPin',
    10,
    'ACTIVE',
    NOW(6),
    0
),
(
    NULL,
    'DT-MT',
    'Đối tác Khu vực Miền Trung',
    'mien-trung',
    'PARTNER',
    'Kết nối các đối tác chiến lược và nhà phân phối tại khu vực duyên hải miền Trung và Tây Nguyên.',
    'MapPin',
    11,
    'ACTIVE',
    NOW(6),
    0
),
(
    NULL,
    'DT-MB',
    'Đối tác Khu vực Miền Bắc',
    'mien-bac',
    'PARTNER',
    'Mạng lưới đối tác, đại lý ủy quyền tại Hà Nội và các khu công nghiệp trọng điểm miền Bắc.',
    'MapPin',
    12,
    'ACTIVE',
    NOW(6),
    0
)
ON DUPLICATE KEY UPDATE 
    `Name` = VALUES(`Name`),
    `Type` = VALUES(`Type`),
    `Description` = VALUES(`Description`),
    `Icon` = VALUES(`Icon`),
    `DisplayOrder` = VALUES(`DisplayOrder`),
    `Status` = VALUES(`Status`),
    `IsDeleted` = 0;


-- ------------------------------------------------------------------------------
-- 2. TẠO CÁC DANH MỤC CON MẪU (BẮT BUỘC TRỎ VÀO ID DANH MỤC CHA TƯƠNG ỨNG CÙNG TYPE)
-- ------------------------------------------------------------------------------

-- ==============================================================================
-- 2.1. DANH MỤC CON CỦA SẢN PHẨM (Type = 'PRODUCT')
-- ==============================================================================

-- 2.1.1. Con của TBTL (Thiết bị & Phụ tùng Thủy lực)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'TBTL-BOM', 'Bơm thủy lực các loại', 'bom-thuy-luc-cac-loai', 'PRODUCT', 'Bơm bánh răng, bơm cánh gạt, bơm piston áp suất cao.', 'Package', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'TBTL' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'TBTL-VAN', 'Van thủy lực điều khiển', 'van-thuy-luc-dieu-khien', 'PRODUCT', 'Van phân phối tay/điện, van an toàn, van một chiều, van tiết lưu.', 'Sliders', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'TBTL' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'TBTL-ONG', 'Ống mềm & Đầu nối thủy lực', 'ong-mem-va-dau-noi-thuy-luc', 'PRODUCT', 'Ống cao áp 1SN/2SN/4SP, cút nối ren thủy lực JIS/BSPP/JIC.', 'Layers', 3, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'TBTL' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'TBTL-XIL', 'Xi lanh thủy lực công nghiệp', 'xi-lanh-thuy-luc-cong-nghiep', 'PRODUCT', 'Xi lanh tiêu chuẩn, xi lanh cơ giới, ben nâng hạ tải trọng lớn.', 'Box', 4, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'TBTL' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `IsDeleted` = 0;

-- 2.1.2. Con của TBTD (Thiết bị Truyền động Cơ khí)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'TBTD-VB', 'Vòng bi & Bạc đạn công nghiệp', 'vong-bi-bac-dan-cong-nghiep', 'PRODUCT', 'Vòng bi cầu, vòng bi côn, gối đỡ Asahi/SKF/NSK chính hãng.', 'Cog', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'TBTD' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'TBTD-DAY', 'Dây curoa & Đai truyền động', 'day-curoa-dai-truyen-dong', 'PRODUCT', 'Dây đai thang, đai răng, đai công nghiệp Bando/Mitsuboshi.', 'Layers', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'TBTD' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'TBTD-XICH', 'Xích tải & Nhông đĩa xích', 'xich-tai-nhong-dia-xich', 'PRODUCT', 'Xích con lăn tiêu chuẩn ANSI/BS, nhông đơn, nhông đôi.', 'Box', 3, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'TBTD' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `IsDeleted` = 0;

-- 2.1.3. Con của VCN (Van Công nghiệp & Phụ kiện Đường ống)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'VCN-VB', 'Van bi công nghiệp (Ball Valve)', 'van-bi-cong-nghiep-ball-valve', 'PRODUCT', 'Van bi inox 304, 316, van bi thép tay gạt và điều khiển khí nén.', 'GitBranch', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'VCN' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'VCN-VBU', 'Van bướm (Butterfly Valve)', 'van-buom-butterfly-valve', 'PRODUCT', 'Van bướm thân gang đĩa inox, van bướm tay kẹp, tay quay.', 'Package', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'VCN' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'VCN-BICH', 'Mặt bích & Phụ kiện hàn/ren', 'mat-bich-phu-kien-han-ren', 'PRODUCT', 'Mặt bích tiêu chuẩn JIS 10K/20K, co, tê, bầu giảm inox/thép.', 'Layers', 3, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'VCN' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `IsDeleted` = 0;

-- 2.1.4. Con của VTTH (Vật tư Kim khí & Tiêu hao)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'VTTH-BL', 'Bu lông, Đai ốc & Thanh ren', 'bu-long-dai-oc-thanh-ren', 'PRODUCT', 'Bu lông lục giác chìm, lục giác ngoài, inox 304, thép cấp bền 8.8/10.9.', 'Package', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'VTTH' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'VTTH-PHOT', 'Phốt ben & Gioăng làm kín', 'phot-ben-gioang-lam-kin', 'PRODUCT', 'Phốt thủy lực piston, cần gạt bụi, O-ring chịu dầu NBR/Viton.', 'Sliders', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'VTTH' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'VTTH-HAN', 'Vật liệu hàn & Đá cắt, đá mài', 'vat-lieu-han-da-cat-da-mai', 'PRODUCT', 'Que hàn inox, que hàn chịu lực, đá cắt sắt, đá mài mối hàn.', 'Box', 3, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'VTTH' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `IsDeleted` = 0;

-- 2.1.5. Con của DCMM (Dụng cụ Kỹ thuật & Thiết bị Xưởng)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DCMM-CAM', 'Dụng cụ cầm tay chuyên dụng', 'dung-cu-cam-tay-chuyen-dung', 'PRODUCT', 'Bộ cờ lê, mỏ lết, tuýp vặn ốc, kìm bấm ống cao cấp.', 'Wrench', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DCMM' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DCMM-MAY', 'Thiết bị xưởng & Máy bấm ống', 'thiet-bi-xuong-may-bam-ong', 'PRODUCT', 'Máy bấm ống thủy lực thủ công và bán tự động, máy mài bàn.', 'Box', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DCMM' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `IsDeleted` = 0;

-- 2.1.6. Con của BHLD (Trang thiết bị Bảo hộ Lao động)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'BHLD-GIAY', 'Giày bảo hộ công nghiệp', 'giay-bao-ho-cong-nghiep', 'PRODUCT', 'Giày bảo hộ mũi thép, đế chống trượt, chống đinh đạt chuẩn S3.', 'Shield', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'BHLD' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'BHLD-TAY', 'Găng tay chịu dầu & Cơ học', 'gang-tay-chiu-dau-co-hoc', 'PRODUCT', 'Găng tay sợi phủ Nitrile chống dầu mỡ trơn trượt, chống cắt.', 'Package', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'BHLD' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `IsDeleted` = 0;


-- ==============================================================================
-- 2.2. DANH MỤC CON CỦA DỊCH VỤ (Type = 'SERVICE')
-- ==============================================================================

-- 2.2.1. Con của DV-BH (Bảo hành & Bảo trì)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-BH-MAY', 'Bảo hành máy móc & thiết bị', 'bao-hanh-may', 'SERVICE', 'Dịch vụ bảo hành, kiểm tra định kỳ các hệ thống máy cơ khí, thủy lực.', 'Wrench', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-BH' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-BH-DK', 'Bảo dưỡng định kỳ hệ thống', 'bao-hanh-dinh-ky', 'SERVICE', 'Bảo dưỡng định kỳ dây chuyền sản xuất, trạm nguồn thủy lực công nghiệp.', 'Sliders', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-BH' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-BH-SC', 'Sửa chữa cơ khí tận nơi', 'sua-chua-tan-noi', 'SERVICE', 'Hỗ trợ kỹ thuật khẩn cấp và sửa chữa thiết bị cơ giới, máy xưởng tận nơi.', 'Shield', 3, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-BH' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `IsDeleted` = 0;

-- 2.2.2. Con của DV-GC (Gia công Kỹ thuật)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-GC-ONG', 'Gia công ống thành phẩm & thủy lực', 'gia-cong-ong-thanh-pham-ong-thuy-luc', 'SERVICE', 'Gia công ép đầu cốt, bấm ống thủy lực 1 lớp, 2 lớp, 4 lớp theo tiêu chuẩn.', 'Layers', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-GC' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-GC-BAM', 'Bấm đầu ống thủy lực lấy ngay', 'bam-dau-ong-thuy-luc', 'SERVICE', 'Gia công bấm đầu nối ống cao áp các bước ren tiêu chuẩn JIS, DIN, SAE.', 'Wrench', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-GC' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DV-GC-AP', 'Thử áp suất cao & Hiệu chuẩn', 'thu-ap-suat-cao', 'SERVICE', 'Kiểm tra độ kín khít, chịu áp của đường ống và van theo quy chuẩn an toàn.', 'Sliders', 3, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DV-GC' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `IsDeleted` = 0;


-- ==============================================================================
-- 2.3. DANH MỤC CON CỦA ĐỐI TÁC (Type = 'PARTNER')
-- ==============================================================================

-- 2.3.1. Con của DT-MN (Miền Nam)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DT-MN-HCM', 'Đối tác TP. Hồ Chí Minh', 'tp-ho-chi-minh', 'PARTNER', 'Hệ thống đối tác cung ứng và xưởng dịch vụ kỹ thuật tại TP.HCM.', 'MapPin', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DT-MN' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DT-MN-BD', 'Đối tác Bình Dương', 'binh-duong', 'PARTNER', 'Mạng lưới đối tác cung ứng vật tư công nghiệp cho các KCN Bình Dương.', 'MapPin', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DT-MN' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DT-MN-DN', 'Đối tác Đồng Nai', 'dong-nai', 'PARTNER', 'Đại lý phân phối thiết bị truyền động và phụ tùng thủy lực tại Đồng Nai.', 'MapPin', 3, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DT-MN' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `IsDeleted` = 0;

-- 2.3.2. Con của DT-MT (Miền Trung)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DT-MT-DN', 'Đối tác Đà Nẵng', 'da-nang', 'PARTNER', 'Trung tâm đối tác cung cấp giải pháp cơ khí công nghiệp khu vực miền Trung.', 'MapPin', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DT-MT' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DT-MT-KH', 'Đối tác Khánh Hòa', 'khanh-hoa', 'PARTNER', 'Đối tác cung ứng vật tư kỹ thuật cho đóng tàu và công nghiệp duyên hải.', 'MapPin', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DT-MT' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `IsDeleted` = 0;

-- 2.3.3. Con của DT-MB (Miền Bắc)
INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DT-MB-HN', 'Đối tác Hà Nội', 'ha-noi', 'PARTNER', 'Mạng lưới đại lý và phân phối chính thức tại khu vực Hà Nội.', 'MapPin', 1, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DT-MB' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `IsDeleted` = 0;

INSERT INTO `categories` (`ParentId`, `Code`, `Name`, `Slug`, `Type`, `Description`, `Icon`, `DisplayOrder`, `Status`, `CreationTime`, `IsDeleted`)
SELECT Id, 'DT-MB-HP', 'Đối tác Hải Phòng', 'hai-phong', 'PARTNER', 'Đối tác cung ứng phụ kiện đường ống và thiết bị cơ khí cảng biển.', 'MapPin', 2, 'ACTIVE', NOW(6), 0
FROM `categories` WHERE `Code` = 'DT-MB' AND `ParentId` IS NULL
ON DUPLICATE KEY UPDATE `Name` = VALUES(`Name`), `Type` = VALUES(`Type`), `ParentId` = VALUES(`ParentId`), `IsDeleted` = 0;


-- Bật lại kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------------------------
-- KIỂM TRA KẾT QUẢ SAU KHI NẠP DỮ LIỆU
-- ------------------------------------------------------------------------------
SELECT 
    c.Id AS CategoryId,
    c.Code AS CategoryCode,
    c.Name AS CategoryName,
    c.Type AS CategoryType,
    CASE WHEN c.ParentId IS NULL THEN 'DANH MỤC GỐC (CHA)' ELSE p.Name END AS ParentCategoryName,
    c.Slug,
    c.Status
FROM `categories` c
LEFT JOIN `categories` p ON c.ParentId = p.Id
WHERE c.IsDeleted = 0
ORDER BY c.Type, COALESCE(c.ParentId, c.Id), c.ParentId IS NOT NULL, c.DisplayOrder;
