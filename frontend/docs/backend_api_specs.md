# TÀI LIỆU ĐẶC TẢ API (BACKEND API SPECIFICATION)
Dự án: Mechanical Supplies Store

Tài liệu này đặc tả chi tiết các API cần thiết để Frontend giao tiếp với Backend, tập trung vào kiến trúc CSDL đã thiết kế (Bao gồm hệ thống quản lý File đa hình - Polymorphic Attachments).

---

## 1. QUY ƯỚC CHUNG

**Base URL**: `/api/v1`

**Headers bắt buộc (cho API cần xác thực)**:
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Cấu trúc Response chuẩn (Chuẩn hóa toàn hệ thống)**:
```json
{
  "success": true,      // true nếu gọi API thành công, false nếu lỗi
  "message": "...",     // Thông báo trả về cho người dùng (nếu cần hiển thị)
  "data": { ... },      // Dữ liệu chính (Object, Array, hoặc null)
  "meta": {             // Dữ liệu phụ (Thường dùng cho phân trang)
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  },
  "errors": null        // Danh sách lỗi chi tiết nếu success = false
}
```

---

## 2. API QUẢN LÝ TỆP TIN & HÌNH ẢNH (ATTACHMENT API)

Hệ thống File được chia làm 2 bước: 
1. **Upload File**: Đẩy file lên Server, Server lưu vào ổ cứng và ghi vào bảng `Attachment`. Trả về `AttachmentId`.
2. **Gắn File (Mapping)**: Khi lưu đối tượng (Product, Article), Frontend sẽ gửi kèm danh sách `AttachmentId` để Backend ghi vào bảng `AttachmentMapping`.

### 2.1 Upload File (Single / Multiple)
- **Endpoint**: `POST /api/v1/attachments/upload`
- **Mô tả**: Tải file lên server, lưu vào bảng `Attachment`.
- **Headers**: `Content-Type: multipart/form-data`
- **Request Body** (Form-Data):
  - `files`: File[] (Mảng các file tải lên)
  - `syntaxCode`: String (VD: `PRODUCT_IMAGE_PATH` - Trỏ đến `AttachmentSyntax` để biết lưu vào thư mục nào trên đĩa).
- **Response**:
```json
{
  "success": true,
  "message": "Tải file thành công",
  "data": [
    {
      "attachmentId": 1001,
      "fileName": "van-bi-inox.jpg",
      "fileUrl": "/uploads/products/2026/08/van-bi-inox-converted.jpg", // Đường dẫn Frontend có thể gọi để xem ảnh
      "size": 154000,
      "contentType": "image/jpeg"
    }
  ]
}
```

---

## 3. API SẢN PHẨM (PRODUCT API)

### 3.1 Lấy danh sách Sản phẩm (Có phân trang & Lọc)
- **Endpoint**: `GET /api/v1/products`
- **Query Parameters**:
  - `page`: int (Default: 1)
  - `limit`: int (Default: 12)
  - `keyword`: string (Tìm kiếm theo tên, mã)
  - `categoryId`: int (Lọc theo danh mục)
  - `sort`: string (vd: `price_asc`, `price_desc`, `newest`)
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "productCode": "VLG-001",
      "name": "Van bi inox 304",
      "slug": "van-bi-inox-304",
      "basePrice": 250000,
      "thumbnailUrl": "/uploads/products/2026/08/van-bi-inox-converted.jpg",
      "brand": "KITZ",
      "status": "ACTIVE"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 120,
    "totalPages": 10
  }
}
```

### 3.2 Lấy chi tiết Sản phẩm (Client hiển thị)
- **Endpoint**: `GET /api/v1/products/{slug}`
- **Mô tả**: Lấy thông tin chi tiết của sản phẩm. Backend cần JOIN (hoặc Include) bảng `AttachmentMapping` (với `ObjectType = 'PRODUCT'`) để lấy danh sách hình ảnh (images).
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "categoryId": 10,
    "productCode": "VLG-001",
    "name": "Van bi inox 304",
    "slug": "van-bi-inox-304",
    "isFeatured": true,
    "isContactPrice": false,
    "basePrice": 250000,
    "content": "<p>Nội dung chi tiết sản phẩm...</p>",
    "brand": "KITZ",
    "origin": "Japan",
    
    // Thuộc tính hình ảnh được bóc tách từ AttachmentMapping & Attachment
    "thumbnailUrl": "/uploads/products/2026/08/van-bi-inox-converted.jpg",
    "images": [
      {
        "attachmentId": 1001,
        "url": "/uploads/products/2026/08/van-bi-inox-converted.jpg",
        "order": 1,
        "isCurrent": true
      },
      {
        "attachmentId": 1002,
        "url": "/uploads/products/2026/08/van-bi-inox-side.jpg",
        "order": 2,
        "isCurrent": true
      }
    ]
  }
}
```

### 3.3 Tạo mới / Cập nhật Sản phẩm (Admin CMS)
- **Endpoint**: `POST /api/v1/admin/products` (Tạo mới) hoặc `PUT /api/v1/admin/products/{id}` (Cập nhật)
- **Mô tả**: API này nhận Dữ liệu sản phẩm và Mảng các `attachmentId`. Backend có nhiệm vụ insert/update bảng `Product` VÀ tạo các record vào bảng `AttachmentMapping`.
- **Request Body**:
```json
{
  "categoryId": 10,
  "productCode": "VLG-002",
  "name": "Van bướm tay quay",
  "basePrice": 450000,
  "isContactPrice": false,
  "brand": "AUT",
  "origin": "Malaysia",
  "content": "<p>Mô tả chi tiết...</p>",
  
  // Danh sách ID hình ảnh vừa upload thành công (Từ API 2.1)
  "attachments": [
    { "attachmentId": 1005, "order": 1 },
    { "attachmentId": 1006, "order": 2 }
  ]
}
```
- **Xử lý phía Backend đối với attachments**:
  - Xóa mềm (`IsDeleted = 1`) các mapping cũ của Product này (dựa vào `ObjectType = 'PRODUCT'` và `ObjectId = {productId}`).
  - Insert các dòng mới vào `AttachmentMapping` với `AttachmentId`, `ObjectId = {productId}`, `ObjectType = 'PRODUCT'`, `Order = 1, 2...`.

---

## 4. API BÀI VIẾT / TIN TỨC (ARTICLE API)

### 4.1 Lấy danh sách Bài viết
- **Endpoint**: `GET /api/v1/posts`
- **Query Parameters**:
  - `type`: string (`NEWS`, `BLOG`, `PARTNER`, `SERVICE`)
  - `page`: int
  - `limit`: int
- **Response**: Trả về danh sách bài viết tương tự Sản phẩm. Cover Image (Thumbnail) của bài viết được lấy ra từ file đầu tiên (`order = 1`) trong `AttachmentMapping` (với `ObjectType = 'ARTICLE'`).

### 4.2 Lấy chi tiết Bài viết
- **Endpoint**: `GET /api/v1/posts/{slug}`
- **Response**: Trả về toàn bộ trường dữ liệu của `Post`.

### 4.3 Tạo/Sửa Bài viết (Admin CMS)
- **Endpoint**: `POST /api/v1/admin/posts`
- **Request Body**:
```json
{
  "postType": "NEWS",
  "title": "Hội chợ cơ khí 2026",
  "excerpt": "Trích dẫn nội dung...",
  "content": "Nội dung bài viết...",
  "status": "PUBLISHED",
  "attachments": [
    { "attachmentId": 2041, "order": 1 } // Ảnh bìa bài viết
  ]
}
```
- **Xử lý Backend**: Lưu bài viết. Sau đó ghim `attachmentId` vào `AttachmentMapping` với `ObjectType = 'ARTICLE'`, `ObjectId = {postId}`.

---

## 5. TÓM TẮT DÀNH CHO BACKEND DEVELOPER

Để làm Backend hoạt động trơn tru với Frontend, Developer cần chú ý:
1. **Tuyệt đối tuân thủ chuẩn Response Model**: Luôn trả về `success`, `message`, `data`.
2. **Logic Tải và Gắn File**: Việc đẩy file vật lý lên Server tách biệt hoàn toàn với thao tác "Lưu sản phẩm". Admin up ảnh -> Server trả về `attachmentId`. Admin điền text sản phẩm xong bấm "Lưu" -> Gọi API lưu sản phẩm kèm theo danh sách `attachmentId` -> Server map ID đó vào đối tượng qua bảng `AttachmentMapping`.
3. **Audit Fields**: Đừng quên cắm cờ `CreationTime`, `IsDeleted` ở mọi câu lệnh Insert/Update. API Public tuyệt đối **KHÔNG LẤY** các record có `IsDeleted = 1`.
