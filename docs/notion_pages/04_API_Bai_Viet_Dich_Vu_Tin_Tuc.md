# TRANG 4: CHI TIẾT API BÀI VIẾT, DỊCH VỤ & TIN TỨC
> **Dùng cho Notion**: Trang 4 - Posts, Services & News APIs  

---

## 1. GET /api/Posts - Lấy danh sách bài viết / Dịch vụ
- **Method + URL**: `GET /api/Posts`
- **Query Params**:
  - `page` (`integer`, default `1`): Trang hiện tại.
  - `limit` (`integer`, default `10`): Số bài viết/trang.
  - `type` (`string`, tùy chọn): Phân loại bài viết: `service` (Bài viết dịch vụ), `news` (Tin tức), `about` (Trang giới thiệu).

- **Response mẫu (HTTP 200 OK)**:
  ```json
  {
    "success": true,
    "message": "Success",
    "data": [
      {
        "id": 50,
        "title": "Dịch vụ Thiết kế & Chế tạo Trạm nguồn Thủy lực Theo Yêu cầu",
        "slug": "dich-vu-thiet-ke-che-tao-tram-nguon-thuy-luc",
        "category_id": "service",
        "category_name": "Thiết kế & Chế tạo",
        "excerpt": "Cung cấp giải pháp trạm nguồn thủy lực công suất từ 5HP đến 100HP.",
        "thumbnail": "/uploads/services/tram-nguon.jpg",
        "status": "ACTIVE",
        "creation_time": "2026-10-01T08:30:00Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 15,
      "totalPages": 2
    }
  }
  ```

---

## 2. GET /api/Posts/{slug} - Chi tiết bài viết / Dịch vụ theo Slug
- **Method + URL**: `GET /api/Posts/{slug}`
- **URL Param**: `slug` (VD: `dich-vu-thiet-ke-che-tao-tram-nguon-thuy-luc`)
- **Response mẫu (HTTP 200 OK)**:
  ```json
  {
    "success": true,
    "message": "Success",
    "data": {
      "id": 50,
      "title": "Dịch vụ Thiết kế & Chế tạo Trạm nguồn Thủy lực Theo Yêu cầu",
      "slug": "dich-vu-thiet-ke-che-tao-tram-nguon-thuy-luc",
      "category_id": "service",
      "excerpt": "Cung cấp giải pháp trạm nguồn thủy lực công suất từ 5HP đến 100HP.",
      "content": "<h2>Quy trình thiết kế trạm nguồn</h2><p>Bước 1: Khảo sát thông số...</p>",
      "thumbnail": "/uploads/services/tram-nguon.jpg",
      "status": "ACTIVE",
      "author_id": 1,
      "creation_time": "2026-10-01T08:30:00Z"
    }
  }
  ```

---

## 3. POST /api/Posts - Tạo bài viết / Dịch vụ mới
- **Method + URL**: `POST /api/Posts`
- **Permissions**: Bearer Token + Quyền `post:create`
- **Request Body**:
  | Trường | Kiểu | Bắt buộc | Mô tả | Ví dụ |
  | :--- | :--- | :--- | :--- | :--- |
  | `title` | `string` | Có | Tiêu đề bài viết | `Bảo dưỡng van tỷ lệ Parker` |
  | `categoryId` | `string` | Có | ID/Type danh mục (`service`/`news`) | `service` |
  | `excerpt` | `string` | Không | Tóm tắt ngắn | `Quy trình kiểm tra & căn chỉnh van tỷ lệ.` |
  | `content` | `string` | Có | Nội dung bài viết (HTML / JSON Sections) | `<p>Nội dung chi tiết...</p>` |
  | `thumbnail` | `string` | Không | Đường dẫn ảnh đại diện | `/uploads/posts/van-ty-le.jpg` |
  | `status` | `string` | Không | Trạng thái (`ACTIVE`/`DRAFT`) | `ACTIVE` |

  *JSON Request Mẫu*:
  ```json
  {
    "title": "Bảo dưỡng van tỷ lệ Parker",
    "categoryId": "service",
    "excerpt": "Quy trình kiểm tra & căn chỉnh van tỷ lệ.",
    "content": "<p>Nội dung chi tiết bài viết dịch vụ bảo dưỡng van...</p>",
    "thumbnail": "/uploads/posts/van-ty-le.jpg",
    "status": "ACTIVE"
  }
  ```
