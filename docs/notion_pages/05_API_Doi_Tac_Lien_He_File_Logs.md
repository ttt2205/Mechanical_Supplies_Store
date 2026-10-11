# TRANG 5: CHI TIẾT API ĐỐI TÁC, LIÊN HỆ, FILE, DASHBOARD & SYSTEM
> **Dùng cho Notion**: Trang 5 - Partners, Contacts, Files Upload, Dashboard & System APIs  

---

## 1. PHẦN ĐỐI TÁC & KHU VỰC (`/api/Partners`)

### 1.1 GET /api/Partners - Lấy danh sách đối tác
- **Method + URL**: `GET /api/Partners`
- **Response mẫu (HTTP 200 OK)**:
  ```json
  {
    "success": true,
    "message": "Success",
    "data": [
      {
        "id": 1,
        "name": "Công ty TNHH KSB Việt Nam",
        "region_id": 4,
        "region_name": "KCN VSIP 1, Bình Dương",
        "status": "ACTIVE",
        "logo": "/uploads/partners/ksb.png",
        "description": "Nhà cung cấp máy nén khí & van công nghiệp."
      }
    ]
  }
  ```

---

## 2. PHẦN YÊU CẦU LIÊN HỆ (`/api/Contacts`)

### 2.1 POST /api/Contacts - Gửi thông tin tư vấn / Báo giá (Public)
- **Method + URL**: `POST /api/Contacts`
- **Permissions**: `[AllowAnonymous]` (Công khai)
- **Request Body**:
  | Trường | Kiểu | Bắt buộc | Mô tả | Ví dụ |
  | :--- | :--- | :--- | :--- | :--- |
  | `fullName` | `string` | Có | Họ tên khách hàng | `Trần Văn B` |
  | `phone` | `string` | Có | Số điện thoại | `0912345678` |
  | `email` | `string` | Không | Email liên hệ | `tranvanb@gmail.com` |
  | `service` | `string` | Không | Dịch vụ/Sản phẩm quan tâm | `Bảo dưỡng van` |
  | `message` | `string` | Có | Lời nhắn chi tiết | `Cần khảo sát trạm nguồn tại KCN Amata.` |

---

## 3. PHẦN TẢI LÊN FILE & HÌNH ẢNH (`/api/Files`)

### 3.1 POST /api/Files/upload - Upload file/ảnh
- **Method + URL**: `POST /api/Files/upload`
- **Headers**: `Authorization: Bearer <Token>`, `Content-Type: multipart/form-data`
- **Form Data**:
  - `file`: File nhị phân (ảnh JPG, PNG, WEBP, PDF...).
  - `objectType`: `product` / `post` / `partner`.
  - `objectId`: `101`.

- **Response mẫu**:
  ```json
  {
    "success": true,
    "message": "File uploaded successfully",
    "data": {
      "data": {
        "fileId": 45,
        "fileName": "sanpham_101.jpg",
        "filePath": "uploads/product/sanpham_101.jpg",
        "fileSize": 245120
      },
      "url": "http://localhost:5117/api/Files/view/product/sanpham_101.jpg"
    }
  }
  ```

---

## 4. PHẦN THỐNG KÊ DASHBOARD (`/api/admin/dashboard`)

### 4.1 GET /api/admin/dashboard/overview - Thống kê tổng quan
- **Method + URL**: `GET /api/admin/dashboard/overview`
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `from` (`2026-09-10`), `to` (`2026-10-10`)
- **Response mẫu (HTTP 200 OK)**:
  ```json
  {
    "success": true,
    "message": "Success",
    "data": {
      "totalProducts": 142,
      "totalCategories": 35,
      "totalServices": 18,
      "totalInquiries": 89,
      "newInquiriesToday": 4,
      "totalViews": 12450
    }
  }
  ```

---

## 5. PHẦN NHẬT KÝ HỆ THỐNG (`/api/Logs`)

### 5.1 GET /api/Logs/errors - Nhật ký lỗi hệ thống
- **Method + URL**: `GET /api/Logs/errors`
- **Response mẫu**:
  ```json
  {
    "success": true,
    "message": "Success",
    "data": [
      {
        "id": 1,
        "error_message": "Category ID not found",
        "stack_trace": "at backend.Services.CategoryService...",
        "creation_time": "2026-10-10T12:00:00Z"
      }
    ]
  }
  ```
