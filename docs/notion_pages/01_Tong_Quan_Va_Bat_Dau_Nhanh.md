# TRANG 1: TỔNG QUAN HỆ THỐNG & HƯỚNG DẪN BẮT ĐẦU NHANH
> **Tài liệu hệ thống**: Mechanical Supplies Store  
> **Dùng cho Notion**: Trang 1 - General Overview & Quickstart  

---

## 1. PHẦN A – TỔNG QUAN

### 1.1 Giới thiệu
Hệ thống **Mechanical Supplies Store** cung cấp giao diện quản lý và cửa hàng trực tuyến bán thiết bị, linh kiện cơ khí, dịch vụ bảo dưỡng và thông tin đối tác công nghiệp.  
Hệ thống Backend được xây dựng trên **.NET 8 Web API** kết hợp cơ sở dữ liệu **MySQL**, giao tiếp qua giao thức RESTful API sử dụng JSON chuẩn `application/json`.

### 1.2 Thông tin chung
- **Base URL Development**: `http://localhost:5117`
- **Base URL Production**: `https://api.mechanicalsupplies.vn`
- **Phiên bản API**: `v1.0.0`
- **Định dạng dữ liệu**: JSON (`application/json; charset=utf-8`)
- **Múi giờ hệ thống**: UTC ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`)

### 1.3 Lịch sử thay đổi (Changelog)
| Phiên bản | Ngày | Nội dung | Người cập nhật |
| :--- | :--- | :--- | :--- |
| `v1.0.0` | 10/10/2026 | Khởi tạo tài liệu toàn bộ API hệ thống bao gồm Danh mục 3 cấp, Sản phẩm, Dịch vụ, Tin tức, Đối tác, Liên hệ và Thống kê. | Technical Writer |

### 1.4 Thuật ngữ & Viết tắt
| Thuật ngữ | Ý nghĩa |
| :--- | :--- |
| **JWT** | JSON Web Token - Chuỗi mã hóa xác thực người dùng qua HTTP Header. |
| **Bearer Token** | Chuỗi token truyền qua header dạng `Authorization: Bearer <Token>`. |
| **SKU** | Stock Keeping Unit - Mã quản lý kho độc nhất của sản phẩm. |
| **Category Type** | Loại danh mục: `PRODUCT` (Sản phẩm), `SERVICE` (Dịch vụ), `PARTNER` (Khu vực đối tác). |

---

## 2. PHẦN B – BẮT ĐẦU NHANH & QUY ƯỚC

### 2.1 Cơ chế Xác thực & Phân quyền
Mọi API trong hệ thống có yêu cầu bảo mật đều phải đính kèm Header:
```http
Authorization: Bearer <token_jwt_da_cap>
```

### 2.2 Đóng gói Kết quả Response (`ApiResponseWrapper`)
Tất cả kết quả trả về từ API đều bọc trong cấu trúc chuẩn:
```json
{
  "success": true,
  "message": "Thông điệp phản hồi",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### 2.3 Ví dụ cURL Đăng nhập & Gọi API bảo vệ
```bash
# Bước 1: Đăng nhập lấy Token
curl -X POST "http://localhost:5117/api/Authentication/login" \
     -H "Content-Type: application/json" \
     -d '{
           "username": "admin",
           "password": "Password123!"
         }'

# Bước 2: Gọi API bảo vệ với Token đã nhận được
curl -X GET "http://localhost:5117/api/Admin/accounts" \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6..."
```
