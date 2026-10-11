# TRANG 2: CHI TIẾT API XÁC THỰC & QUẢN LÝ TÀI KHOẢN
> **Dùng cho Notion**: Trang 2 - Authentication & Account Management APIs  

---

## 1. POST /api/Authentication/login - Đăng nhập Hệ thống
- **Mô tả**: Đăng nhập tài khoản quản trị/người dùng và lấy JWT Bearer Token.
- **Method + URL**: `POST /api/Authentication/login`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  | Trường | Kiểu | Bắt buộc | Mô tả | Ví dụ |
  | :--- | :--- | :--- | :--- | :--- |
  | `username` | `string` | Có | Tên đăng nhập | `admin` |
  | `password` | `string` | Có | Mật khẩu | `Password123!` |

  *JSON Request Mẫu*:
  ```json
  {
    "username": "admin",
    "password": "Password123!"
  }
  ```

- **Response thành công (HTTP 200 OK)**:
  ```json
  {
    "success": true,
    "message": "Đăng nhập thành công.",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
      "refreshToken": "e7b9a2c1-4567-89ab-cdef-0123456789ab",
      "username": "admin",
      "fullName": "Quản Trị Viên Hệ Thống"
    }
  }
  ```

---

## 2. POST /api/Authentication/refresh-token - Làm mới Token
- **Mô tả**: Xin cấp Access Token mới khi token hiện tại đã hết hạn.
- **Method + URL**: `POST /api/Authentication/refresh-token`
- **Request Body**:
  | Trường | Kiểu | Bắt buộc | Mô tả | Ví dụ |
  | :--- | :--- | :--- | :--- | :--- |
  | `refreshToken` | `string` | Có | Chuỗi Refresh Token | `e7b9a2c1-4567-89ab-cdef-0123456789ab` |

  *JSON Request Mẫu*:
  ```json
  {
    "refreshToken": "e7b9a2c1-4567-89ab-cdef-0123456789ab"
  }
  ```

---

## 3. GET /api/Admin/accounts - Danh sách tài khoản người dùng
- **Mô tả**: Lấy danh sách toàn bộ tài khoản trong hệ thống.
- **Method + URL**: `GET /api/Admin/accounts`
- **Headers**: `Authorization: Bearer <token>`
- **Permissions**: Quyền `user:manage`
- **Response thành công (HTTP 200 OK)**:
  ```json
  {
    "success": true,
    "message": "Success",
    "data": [
      {
        "id": 1,
        "username": "admin",
        "email": "admin@mechanicalsupplies.vn",
        "fullname": "Quản Trị Viên",
        "status": "ACTIVE",
        "roles": ["ADMIN"]
      }
    ]
  }
  ```

---

## 4. POST /api/Admin/accounts - Tạo tài khoản quản trị mới
- **Method + URL**: `POST /api/Admin/accounts`
- **Request Body**:
  | Trường | Kiểu | Bắt buộc | Mô tả | Ví dụ |
  | :--- | :--- | :--- | :--- | :--- |
  | `username` | `string` | Có | Tên tài khoản | `kithuatsuachua` |
  | `password` | `string` | Có | Mật khẩu | `SecurePass123!` |
  | `fullName` | `string` | Có | Họ và tên | `Trần Văn Kỹ Thuật` |
  | `email` | `string` | Có | Địa chỉ Email | `kithuat@mechanicalsupplies.vn` |

  *JSON Request Mẫu*:
  ```json
  {
    "username": "kithuatsuachua",
    "password": "SecurePass123!",
    "fullName": "Trần Văn Kỹ Thuật",
    "email": "kithuat@mechanicalsupplies.vn"
  }
  ```
