# TÀI LIỆU THIẾT KẾ CƠ SỞ DỮ LIỆU (DATABASE SCHEMA)
Dự án: Mechanical Supplies Store
Hệ quản trị CSDL: SQL Server

Tài liệu này đặc tả chi tiết cấu trúc các bảng trong cơ sở dữ liệu để phục vụ cho việc phát triển Backend.

## 1. QUY ƯỚC CHUNG (CONVENTIONS)

Tất cả các bảng trong hệ thống đều sẽ bắt buộc có các trường Audit (kiểm vết) sau:
- `CreationTime` (DATETIME2) NOT NULL - Thời gian tạo
- `CreatorUserId` (BIGINT) NULL - ID người tạo
- `LastModificationTime` (DATETIME2) NULL - Thời gian sửa cuối
- `LastModifierUserId` (BIGINT) NULL - ID người sửa cuối
- `IsDeleted` (BIT) NOT NULL DEFAULT (0) - Trạng thái xóa mềm (Soft delete)
- `DeleterUserId` (BIGINT) NULL - ID người xóa
- `DeletionTime` (DATETIME2) NULL - Thời gian xóa

---

## 2. NHÓM BẢNG QUẢN LÝ TỆP TIN VÀ HÌNH ẢNH (ATTACHMENT MODULE)

### 2.1 Bảng `AttachmentSyntax`
Quản lý cấu hình, đường dẫn lưu trữ thư mục tùy theo môi trường.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| Id | INT | PK, IDENTITY | Khóa chính |
| Code | NVARCHAR(500) | | Mã cấu hình (vd: `PRODUCT_IMAGE_PATH`) |
| Name | NVARCHAR(MAX) | | Tên hiển thị cấu hình |
| SyntaxPath | NVARCHAR(MAX) | | Định dạng đường dẫn lưu file (vd: `/uploads/{yyyy}/{mm}`) |
| IsDefault | BIT | DEFAULT 0 | Là cấu hình mặc định? |
| SyntaxName | NVARCHAR(MAX) | | Tên gợi nhớ cho code/hệ thống |

### 2.2 Bảng `Attachment`
Lưu trữ thông tin chi tiết của các file/hình ảnh vật lý đã được tải lên máy chủ.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| Id | INT | PK, IDENTITY | Khóa chính |
| TenantId | INT | NULL | ID khách hàng (nếu hệ thống có multitenant) |
| FileName | NVARCHAR(MAX) | | Tên file hiển thị (gốc) |
| DiskFileName | NVARCHAR(MAX) | | Tên file đã mã hóa/đổi tên lưu trên ổ đĩa |
| FileSize | INT | | Kích thước file (bytes) |
| ContentType | NVARCHAR(255) | | Định dạng file (vd: `image/jpeg`, `application/pdf`) |
| DiskDirectory | NVARCHAR(MAX) | | Thư mục vật lý lưu trữ |
| ConvertFileName | NVARCHAR(MAX) | | Tên file sau khi convert (nếu có nén/resize) |
| ConvertDiskDirectory| NVARCHAR(MAX) | | Thư mục chứa file sau convert |
| AuthorId | BIGINT | NULL | ID người tải lên |
| Version | INT | NULL | Phiên bản file |

### 2.3 Bảng `AttachmentMapping` (Bảng trung gian Polymorphic)
Làm nhiệm vụ map (gắn) 1 `Attachment` bất kỳ vào các đối tượng hệ thống như `Product`, `Post`, `Category`, `Partner`,... mà không cần phải tạo ra nhiều bảng phụ như `ProductAttachment`, `PostAttachment`.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| Id | BIGINT | PK, IDENTITY | Khóa chính |
| AttachmentId | INT | FK, NOT NULL | Khóa ngoại trỏ đến bảng `Attachment` |
| ObjectId | NVARCHAR(128) | NOT NULL | ID của đối tượng (vd: `1`, `vlg-001`, `uuid...`) |
| ObjectType | NVARCHAR(100) | NOT NULL | Loại đối tượng (vd: `PRODUCT`, `ARTICLE`, `CATEGORY`, `AVATAR`) |
| Order | INT | DEFAULT 0 | Thứ tự sắp xếp hiển thị ảnh/file |
| IsCurrent | BIT | DEFAULT 1 | Dùng để cờ đánh dấu ảnh nào đang active |

**Ví dụ thực tế về cách dữ liệu hoạt động trong bảng AttachmentMapping:**
Giả sử bạn có 1 Sản phẩm (Product Id = 15) có 2 hình ảnh (Attachment Id = 101, 102), và 1 Bài viết (Article Id = 99) có đính kèm 1 file (Attachment Id = 205). Dữ liệu trong bảng mapping sẽ trông như sau:

| Id | AttachmentId | ObjectId | ObjectType | Order | IsCurrent |
|---|---|---|---|---|---|
| 1 | 101 | 15 | `PRODUCT` | 1 | 1 |
| 2 | 102 | 15 | `PRODUCT` | 2 | 1 |
| 3 | 205 | 99 | `ARTICLE` | 1 | 1 |

Cách thiết kế này giúp hệ thống quản lý file tập trung, mở rộng dễ dàng cho bất kỳ module nào trong tương lai.

---

## 3. NHÓM BẢNG QUẢN LÝ SẢN PHẨM (PRODUCT MODULE)

### 3.1 Bảng `Category`
Quản lý danh mục sản phẩm (Đa cấp độ).

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| Id | INT | PK, IDENTITY | Khóa chính |
| ParentId | INT | FK, NULL | Danh mục cha (NULL nếu là danh mục gốc) |
| Code | NVARCHAR(50) | UNIQUE | Mã danh mục |
| Name | NVARCHAR(255) | NOT NULL | Tên danh mục |
| Slug | NVARCHAR(255) | UNIQUE | URL Slug thân thiện |
| Description | NVARCHAR(MAX) | | Mô tả danh mục |
| Icon | NVARCHAR(255) | | Icon hiển thị (font/class/image path) |
| DisplayOrder| INT | DEFAULT 0 | Thứ tự hiển thị |
| Status | VARCHAR(50) | DEFAULT 'ACTIVE'| Trạng thái (`ACTIVE`, `INACTIVE`) |

### 3.2 Bảng `Product`
Thông tin chi tiết của thiết bị/phụ tùng cơ khí. Hình ảnh được quản lý qua bảng `AttachmentMapping`.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| Id | BIGINT | PK, IDENTITY | Khóa chính |
| CategoryId | INT | FK, NOT NULL | Thuộc danh mục nào |
| ProductCode | NVARCHAR(50) | UNIQUE, NOT NULL| Mã sản phẩm (SKU) |
| Name | NVARCHAR(255) | NOT NULL | Tên sản phẩm |
| Slug | NVARCHAR(255) | UNIQUE | URL slug |
| IsFeatured | BIT | DEFAULT 0 | Là sản phẩm nổi bật? |
| IsContactPrice| BIT | DEFAULT 0 | Có phải giá "Liên hệ"? |
| BasePrice | DECIMAL(18,2)| | Giá cơ bản / Giá bán |
| SalePrice | DECIMAL(18,2)| | Giá khuyến mãi (nếu có) |
| Status | VARCHAR(50) | DEFAULT 'ACTIVE'| Trạng thái (`ACTIVE`, `OUT_OF_STOCK`, `HIDDEN`) |
| ViewCount | INT | DEFAULT 0 | Lượt xem |
| SoldCount | INT | DEFAULT 0 | Số lượng đã bán |
| Brand | NVARCHAR(255) | | Thương hiệu |
| Origin | NVARCHAR(255) | | Xuất xứ (vd: Japan, Korea) |
| ShortDescription| NVARCHAR(MAX)| | Mô tả ngắn |
| Content | NVARCHAR(MAX) | | Nội dung/Thông số chi tiết (HTML) |
| StockQuantity| INT | DEFAULT 0 | Số lượng tồn kho |

---

## 4. NHÓM BẢNG NỘI DUNG (CMS MODULE)

### 4.1 Bảng `Post` (Tin tức / Bài viết)
| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| Id | BIGINT | PK, IDENTITY | Khóa chính |
| PostType | VARCHAR(50) | NOT NULL | Loại (`NEWS`, `BLOG`, `GUIDE`, `PARTNER`, `SERVICE`) |
| Title | NVARCHAR(500) | NOT NULL | Tiêu đề |
| Slug | NVARCHAR(500) | UNIQUE | URL slug |
| Excerpt | NVARCHAR(MAX) | | Trích dẫn ngắn |
| Content | NVARCHAR(MAX) | | Nội dung chi tiết |
| AuthorId | BIGINT | | ID tác giả |
| ViewCount | INT | DEFAULT 0 | Lượt xem |
| Status | VARCHAR(50) | DEFAULT 'PUBLISHED' | Trạng thái (`DRAFT`, `PUBLISHED`, `HIDDEN`) |

*(Ảnh cover của bài viết, hoặc tài liệu đính kèm sẽ được lưu trữ qua `AttachmentMapping` với `ObjectType = 'ARTICLE'`)*

---
*Lưu ý: Mọi bảng trên đều bắt buộc phải được Generate thêm 7 trường Hệ thống Audit như đã định nghĩa ở phần 1.*
