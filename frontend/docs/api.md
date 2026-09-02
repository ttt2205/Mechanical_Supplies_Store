# API Contract cho Mechanical Supplies Store

Tài liệu này tổng hợp các API frontend đang cần để thay thế dữ liệu mock/local bằng dữ liệu từ server.

## Quy ước chung

Base URL khi gọi từ frontend Next.js: `/api`.

Các API admin và API theo tài khoản người dùng cần header:

```http
Authorization: Bearer <accessToken>
Content-Type: application/json
```

Response thành công nên dùng cùng một cấu trúc:

```json
{
  "success": true,
  "message": "",
  "data": {},
  "meta": null
}
```

Response lỗi:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "field_name": ["Lý do lỗi"]
  }
}
```

Response danh sách có phân trang:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "totalPages": 9
  }
}
```

## Kiểu dữ liệu chính

### Product

```json
{
  "product_id": 1,
  "category_id": 10,
  "product_code": "VLG-001",
  "name": "Van bi inox 304",
  "is_featured": true,
  "is_contact_price": false,
  "base_price": 250000,
  "status": "active",
  "thumbnail": "/images/products/van-bi.jpg",
  "images": ["/images/products/van-bi.jpg"],
  "view_count": 120,
  "sold_count": 15,
  "brand": "KITZ",
  "origin": "Japan",
  "created_at": "2026-01-01T00:00:00.000Z",
  "updated_at": "2026-01-01T00:00:00.000Z",
  "deleted_at": null,
  "is_deleted": false
}
```

### Category

```json
{
  "category_id": 10,
  "parent_id": null,
  "name": "Van công nghiệp",
  "slug": "van-cong-nghiep",
  "description": "",
  "image": "/images/categories/valve.jpg",
  "icon": "settings",
  "level": 1,
  "display_order": 1,
  "status": "active",
  "created_at": "2026-01-01T00:00:00.000Z",
  "updated_at": "2026-01-01T00:00:00.000Z"
}
```

### Post

```json
{
  "post_id": 1,
  "category_id": 1,
  "title": "Hướng dẫn chọn van công nghiệp",
  "slug": "huong-dan-chon-van-cong-nghiep",
  "excerpt": "Nội dung tóm tắt",
  "content": "Nội dung HTML hoặc Markdown",
  "thumbnail": "/images/posts/post.jpg",
  "post_type": "news",
  "status": "published",
  "author": "Admin",
  "created_at": "2026-01-01T00:00:00.000Z",
  "updated_at": "2026-01-01T00:00:00.000Z",
  "deleted_at": null,
  "is_deleted": false
}
```

## 1. Auth và tài khoản

### Đăng nhập

| Method | URL |
| --- | --- |
| POST | `/api/auth/login` |

Dữ liệu gửi đi:

```json
{
  "username": "admin",
  "password": "123456"
}
```

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": {
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token",
    "user": {
      "account_id": "1",
      "role_id": "admin",
      "email": "admin@example.com",
      "username": "admin",
      "status": "active"
    }
  }
}
```

### Đăng ký

| Method | URL |
| --- | --- |
| POST | `/api/auth/register` |

Dữ liệu gửi đi:

```json
{
  "username": "nguyenvana",
  "full_name": "Nguyễn Văn A",
  "email": "a@example.com",
  "phone": "0900000000",
  "password": "123456",
  "accepted_terms": true
}
```

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": {
    "account_id": "100",
    "role_id": "customer",
    "email": "a@example.com",
    "username": "nguyenvana",
    "status": "active"
  }
}
```

### Lấy thông tin tài khoản hiện tại

| Method | URL |
| --- | --- |
| GET | `/api/auth/me` |

Dữ liệu gửi đi: không có body, cần `Authorization` header.

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": {
    "account_id": "100",
    "role_id": "customer",
    "email": "a@example.com",
    "username": "nguyenvana",
    "status": "active"
  }
}
```

### Đăng xuất

| Method | URL |
| --- | --- |
| POST | `/api/auth/logout` |

Dữ liệu gửi đi:

```json
{
  "refreshToken": "jwt_refresh_token"
}
```

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": {
    "loggedOut": true
  }
}
```

### Gửi OTP quên mật khẩu

| Method | URL |
| --- | --- |
| POST | `/api/auth/forgot-password/request` |

Dữ liệu gửi đi:

```json
{
  "username": "nguyenvana"
}
```

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": {
    "delivery": "email",
    "otp_expires_in": 300
  }
}
```

### Xác thực OTP

| Method | URL |
| --- | --- |
| POST | `/api/auth/forgot-password/verify` |

Dữ liệu gửi đi:

```json
{
  "username": "nguyenvana",
  "otp": "123456"
}
```

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": {
    "reset_token": "reset_token"
  }
}
```

### Đặt lại mật khẩu

| Method | URL |
| --- | --- |
| POST | `/api/auth/forgot-password/reset` |

Dữ liệu gửi đi:

```json
{
  "reset_token": "reset_token",
  "new_password": "new_password"
}
```

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": {
    "updated": true
  }
}
```

## 2. Sản phẩm public

### Danh sách sản phẩm

| Method | URL |
| --- | --- |
| GET | `/api/products` |

Query gửi đi:

| Tên | Kiểu | Ghi chú |
| --- | --- | --- |
| `q` | string | Từ khóa tìm kiếm theo tên hoặc mã sản phẩm |
| `categorySlug` | string | Slug danh mục hiện tại, ví dụ `van-cong-nghiep` |
| `categoryId` | number | ID danh mục nếu không dùng slug |
| `sub` | string | Slug danh mục con |
| `maxPrice` | number | Giá tối đa |
| `sort` | string | `newest`, `az`, `price-asc`, `price-desc` |
| `page` | number | Mặc định `1` |
| `limit` | number | Mặc định `12` |
| `featured` | boolean | Lọc sản phẩm nổi bật |

Dữ liệu gửi đi: không có body.

Ví dụ URL:

```http
GET /api/products?categorySlug=van-cong-nghiep&sub=van-bi&maxPrice=5000000&sort=price-asc&page=1&limit=12
```

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": [
    {
      "product_id": 1,
      "category_id": 10,
      "product_code": "VLG-001",
      "name": "Van bi inox 304",
      "is_featured": true,
      "is_contact_price": false,
      "base_price": 250000,
      "status": "active",
      "thumbnail": "/images/products/van-bi.jpg",
      "images": ["/images/products/van-bi.jpg"],
      "brand": "KITZ",
      "origin": "Japan",
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "is_deleted": false
    }
  ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 30,
    "totalPages": 3,
    "filters": {
      "q": "",
      "categorySlug": "van-cong-nghiep",
      "sub": "van-bi",
      "maxPrice": 5000000,
      "sort": "price-asc"
    }
  }
}
```

### Gợi ý tìm kiếm sản phẩm trên header

| Method | URL |
| --- | --- |
| GET | `/api/products/search` |

Query gửi đi:

| Tên | Kiểu | Ghi chú |
| --- | --- | --- |
| `q` | string | Bắt buộc, từ khóa người dùng nhập |
| `limit` | number | Mặc định `6` |

Ví dụ URL:

```http
GET /api/products/search?q=van&limit=6
```

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": [
    {
      "product_id": 1,
      "product_code": "VLG-001",
      "name": "Van bi inox 304",
      "thumbnail": "/images/products/van-bi.jpg",
      "base_price": 250000,
      "is_contact_price": false,
      "url": "/product/vlg-001"
    }
  ]
}
```

### Chi tiết sản phẩm

| Method | URL |
| --- | --- |
| GET | `/api/products/{product_code}` |

Dữ liệu gửi đi: không có body.

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": {
    "product_id": 1,
    "category_id": 10,
    "product_code": "VLG-001",
    "name": "Van bi inox 304",
    "description": "Mô tả ngắn",
    "details_content": "Nội dung chi tiết HTML hoặc Markdown",
    "is_featured": true,
    "is_contact_price": false,
    "base_price": 250000,
    "status": "active",
    "thumbnail": "/images/products/van-bi.jpg",
    "images": [
      "/images/products/van-bi-1.jpg",
      "/images/products/van-bi-2.jpg"
    ],
    "brand": "KITZ",
    "origin": "Japan",
    "category": {
      "category_id": 10,
      "name": "Van công nghiệp",
      "slug": "van-cong-nghiep"
    },
    "variants": [
      {
        "product_variant_id": 1,
        "product_id": 1,
        "sku": "VLG-001-DN15",
        "attributes": {
          "size": "DN15",
          "material": "Inox 304"
        },
        "is_contact_price": false,
        "price_override": 250000,
        "is_default": true,
        "created_at": "2026-01-01T00:00:00.000Z",
        "updated_at": "2026-01-01T00:00:00.000Z"
      }
    ],
    "related_products": []
  }
}
```

### Danh mục sản phẩm

| Method | URL |
| --- | --- |
| GET | `/api/product-categories` |

Query gửi đi:

| Tên | Kiểu | Ghi chú |
| --- | --- | --- |
| `parentId` | number | Lấy danh mục con theo danh mục cha |
| `level` | number | Lọc theo cấp danh mục |
| `includeInactive` | boolean | Mặc định `false` |

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": [
    {
      "category_id": 10,
      "parent_id": null,
      "name": "Van công nghiệp",
      "slug": "van-cong-nghiep",
      "description": "",
      "image": "/images/categories/valve.jpg",
      "icon": "settings",
      "level": 1,
      "display_order": 1,
      "status": "active",
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

## 3. Nội dung public

### Nội dung trang giới thiệu

| Method | URL |
| --- | --- |
| GET | `/api/introduce-content` |

Dữ liệu gửi đi: không có body.

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": {
    "hero": {
      "eyebrow": "Về chúng tôi",
      "title": "Đơn vị cung cấp vật tư cơ khí",
      "highlight": "uy tín",
      "excerpt": "Nội dung mô tả ngắn",
      "thumbnail": "/images/about/hero.jpg"
    },
    "story": {
      "heading": "Câu chuyện doanh nghiệp",
      "body": "Nội dung câu chuyện"
    },
    "vision": {
      "heading": "Tầm nhìn",
      "body": "Nội dung tầm nhìn"
    },
    "mission": {
      "heading": "Sứ mệnh",
      "body": "Nội dung sứ mệnh"
    },
    "reasonsHeading": "Vì sao chọn chúng tôi",
    "reasons": [
      {
        "title": "Hàng hóa rõ nguồn gốc",
        "body": "Nội dung"
      }
    ],
    "showcase": {
      "image": "/images/about/showcase.jpg",
      "alt": "Kho hàng",
      "caption": "Hình ảnh kho hàng"
    },
    "contact": {
      "heading": "Liên hệ",
      "addressLabel": "Địa chỉ",
      "address": "Địa chỉ công ty",
      "hotlineLabel": "Hotline",
      "hotline": "0900000000",
      "emailLabel": "Email",
      "email": "info@example.com",
      "hoursLabel": "Thời gian làm việc",
      "hours": "Thứ 2 - Thứ 7",
      "cta": "Liên hệ tư vấn"
    }
  }
}
```

### Danh sách tin tức

| Method | URL |
| --- | --- |
| GET | `/api/news` |

Query gửi đi:

| Tên | Kiểu | Ghi chú |
| --- | --- | --- |
| `q` | string | Từ khóa tìm kiếm |
| `categoryId` | number | Lọc theo danh mục |
| `page` | number | Mặc định `1` |
| `limit` | number | Mặc định `9` |

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": [
    {
      "post_id": 1,
      "category_id": 1,
      "title": "Tin tức ngành cơ khí",
      "slug": "tin-tuc-nganh-co-khi",
      "excerpt": "Tóm tắt",
      "thumbnail": "/images/news/news.jpg",
      "post_type": "news",
      "status": "published",
      "author": "Admin",
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "is_deleted": false
    }
  ],
  "meta": {
    "page": 1,
    "limit": 9,
    "total": 20,
    "totalPages": 3
  }
}
```

### Chi tiết tin tức

| Method | URL |
| --- | --- |
| GET | `/api/news/{slug}` |

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": {
    "post_id": 1,
    "category_id": 1,
    "title": "Tin tức ngành cơ khí",
    "slug": "tin-tuc-nganh-co-khi",
    "excerpt": "Tóm tắt",
    "content": "Nội dung chi tiết",
    "thumbnail": "/images/news/news.jpg",
    "post_type": "news",
    "status": "published",
    "author": "Admin",
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "related_posts": []
  }
}
```

### Danh sách dịch vụ

| Method | URL |
| --- | --- |
| GET | `/api/services` |

Query gửi đi: `q`, `categoryId`, `page`, `limit`.

Dữ liệu phản hồi: giống danh sách tin tức, nhưng `post_type` nên là `service`.

### Chi tiết dịch vụ

| Method | URL |
| --- | --- |
| GET | `/api/services/{slug}` |

Dữ liệu phản hồi: giống chi tiết tin tức, nhưng `post_type` nên là `service`.

### Danh mục dịch vụ

| Method | URL |
| --- | --- |
| GET | `/api/service-categories` |

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": [
    {
      "category_id": 1,
      "name": "Gia công cơ khí",
      "slug": "gia-cong-co-khi"
    }
  ]
}
```

### Danh sách đối tác hoặc nhà cung cấp public

| Method | URL |
| --- | --- |
| GET | `/api/partners` |

Query gửi đi: `q`, `categoryId`, `regionId`, `page`, `limit`.

**⚠️ [Nghiệp vụ quan trọng - Business Logic]**
- **Hiển thị hỗn hợp (Mixed Content):** Một danh mục đối tác bất kỳ (dù là Miền, Tỉnh/Thành hay Quận/Huyện) đều có thể chứa đồng thời **danh mục con** VÀ **bài viết (đối tác)** của riêng nó.
- Nếu danh mục có chứa các danh mục con, danh sách các danh mục con sẽ được hiển thị ở phần "Khu vực trực thuộc". Nếu danh mục đó cũng có chứa các đối tác (bài viết), danh sách các đối tác này sẽ được hiển thị ngay bên dưới phần "Khu vực trực thuộc". Backend không cần giới hạn việc chỉ được tạo bài viết ở danh mục cấp thấp nhất.

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": [
    {
      "partner_id": 1,
      "name": "Nhà cung cấp A",
      "slug": "nha-cung-cap-a",
      "logo": "/images/partners/a.png",
      "region_id": "mn",
      "address": "TP.HCM",
      "phone": "0900000000",
      "email": "partner@example.com",
      "website": "https://example.com",
      "status": "active",
      "description": "Mô tả ngắn"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 10,
    "totalPages": 1
  }
}
```

### Chi tiết đối tác hoặc nhà cung cấp public

| Method | URL |
| --- | --- |
| GET | `/api/partners/{slug}` |

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": {
    "partner_id": 1,
    "name": "Nhà cung cấp A",
    "slug": "nha-cung-cap-a",
    "logo": "/images/partners/a.png",
    "region_id": "mn",
    "address": "TP.HCM",
    "phone": "0900000000",
    "email": "partner@example.com",
    "website": "https://example.com",
    "status": "active",
    "description": "Mô tả chi tiết"
  }
}
```

### Danh mục đối tác

| Method | URL |
| --- | --- |
| GET | `/api/partner-categories` |

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": [
    {
      "category_id": 1,
      "name": "Miền Nam",
      "slug": "mien-nam"
    }
  ]
}
```

## 4. Tương tác người dùng

### Ghi nhận lượt xem sản phẩm

| Method | URL |
| --- | --- |
| POST | `/api/view-logs` |

Dữ liệu gửi đi:

```json
{
  "product_id": 1,
  "user_id": "100",
  "viewed_at": "2026-01-01T00:00:00.000Z"
}
```

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": {
    "view_log_id": 1,
    "recorded": true
  }
}
```

### Gửi liên hệ

| Method | URL |
| --- | --- |
| POST | `/api/contact-requests` |

Dữ liệu gửi đi:

```json
{
  "full_name": "Nguyễn Văn A",
  "phone": "0900000000",
  "email": "a@example.com",
  "subject": "Yêu cầu báo giá",
  "message": "Tôi cần tư vấn sản phẩm"
}
```

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": {
    "contact_request_id": 1,
    "status": "new"
  }
}
```

### Danh sách yêu thích của tôi

| Method | URL |
| --- | --- |
| GET | `/api/me/favorites` |

Dữ liệu gửi đi: không có body, cần `Authorization` header.

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": [
    {
      "product_id": 1,
      "product_code": "VLG-001",
      "name": "Van bi inox 304",
      "thumbnail": "/images/products/van-bi.jpg",
      "base_price": 250000,
      "is_contact_price": false
    }
  ]
}
```

### Thêm sản phẩm yêu thích

| Method | URL |
| --- | --- |
| POST | `/api/me/favorites` |

Dữ liệu gửi đi:

```json
{
  "product_id": 1
}
```

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": {
    "product_id": 1,
    "favorited": true
  }
}
```

### Xóa sản phẩm yêu thích

| Method | URL |
| --- | --- |
| DELETE | `/api/me/favorites/{product_id}` |

Dữ liệu gửi đi: không có body.

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": {
    "product_id": 1,
    "favorited": false
  }
}
```

## 5. Admin sản phẩm

### Danh sách sản phẩm admin

| Method | URL |
| --- | --- |
| GET | `/api/admin/products` |

Query gửi đi: `q`, `categoryId`, `status`, `page`, `limit`.

Dữ liệu phản hồi: giống `/api/products`, nhưng có thể trả cả sản phẩm `inactive` và trường quản trị như `stock`, `description`.

### Tạo sản phẩm

| Method | URL |
| --- | --- |
| POST | `/api/admin/products` |

Dữ liệu gửi đi:

```json
{
  "category_id": 10,
  "product_code": "VLG-001",
  "name": "Van bi inox 304",
  "description": "Mô tả ngắn",
  "details_content": "Nội dung chi tiết",
  "is_featured": true,
  "is_contact_price": false,
  "base_price": 250000,
  "status": "active",
  "thumbnail": "/images/products/van-bi.jpg",
  "images": ["/images/products/van-bi-1.jpg"],
  "brand": "KITZ",
  "origin": "Japan",
  "variants": [
    {
      "sku": "VLG-001-DN15",
      "attributes": {
        "size": "DN15"
      },
      "is_contact_price": false,
      "price_override": 250000,
      "is_default": true
    }
  ]
}
```

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": {
    "product_id": 1,
    "product_code": "VLG-001",
    "created": true
  }
}
```

### Chi tiết sản phẩm admin

| Method | URL |
| --- | --- |
| GET | `/api/admin/products/{product_id}` |

Dữ liệu phản hồi: giống chi tiết sản phẩm public, bao gồm cả dữ liệu quản trị.

### Cập nhật sản phẩm

| Method | URL |
| --- | --- |
| PATCH | `/api/admin/products/{product_id}` |

Dữ liệu gửi đi: gửi các trường cần cập nhật, cùng cấu trúc với API tạo sản phẩm.

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": {
    "product_id": 1,
    "updated": true
  }
}
```

### Xóa mềm sản phẩm

| Method | URL |
| --- | --- |
| DELETE | `/api/admin/products/{product_id}` |

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": {
    "product_id": 1,
    "deleted": true
  }
}
```

### Tải ảnh sản phẩm

| Method | URL |
| --- | --- |
| POST | `/api/admin/products/{product_id}/images` |

Dữ liệu gửi đi: `multipart/form-data` với field `files`.

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": [
    {
      "image_id": 1,
      "url": "/uploads/products/van-bi-1.jpg",
      "display_order": 1
    }
  ]
}
```

### Xóa ảnh sản phẩm

| Method | URL |
| --- | --- |
| DELETE | `/api/admin/products/{product_id}/images/{image_id}` |

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": {
    "image_id": 1,
    "deleted": true
  }
}
```

### CRUD danh mục sản phẩm admin

| Method | URL | Dữ liệu gửi đi | Dữ liệu phản hồi |
| --- | --- | --- | --- |
| GET | `/api/admin/product-categories` | Query: `q`, `parentId`, `status` | Danh sách `Category[]` |
| POST | `/api/admin/product-categories` | `Category` không có `category_id` | Category vừa tạo |
| PATCH | `/api/admin/product-categories/{category_id}` | Các trường cần cập nhật | `{ "updated": true }` |
| DELETE | `/api/admin/product-categories/{category_id}` | Không có body | `{ "deleted": true }` |

## 6. Admin nội dung

### CRUD bài viết admin

Dùng chung cho tin tức, dịch vụ, bài hướng dẫn. Trường `post_type` nên nhận các giá trị `news`, `service`, `guide`, `blog`.

| Method | URL | Dữ liệu gửi đi | Dữ liệu phản hồi |
| --- | --- | --- | --- |
| GET | `/api/admin/posts` | Query: `q`, `postType`, `categoryId`, `status`, `page`, `limit` | Danh sách `Post[]` |
| POST | `/api/admin/posts` | Dữ liệu bài viết | Bài viết vừa tạo |
| GET | `/api/admin/posts/{post_id}` | Không có body | Chi tiết bài viết |
| PATCH | `/api/admin/posts/{post_id}` | Các trường cần cập nhật | `{ "updated": true }` |
| DELETE | `/api/admin/posts/{post_id}` | Không có body | `{ "deleted": true }` |

Ví dụ dữ liệu tạo bài viết:

```json
{
  "category_id": 1,
  "title": "Tin tức ngành cơ khí",
  "slug": "tin-tuc-nganh-co-khi",
  "excerpt": "Tóm tắt",
  "content": "Nội dung chi tiết",
  "thumbnail": "/images/news/news.jpg",
  "post_type": "news",
  "status": "published",
  "author": "Admin"
}
```

### CRUD danh mục bài viết admin

| Method | URL | Dữ liệu gửi đi | Dữ liệu phản hồi |
| --- | --- | --- | --- |
| GET | `/api/admin/post-categories` | Query: `postType`, `status` | Danh sách danh mục |
| POST | `/api/admin/post-categories` | `{ "name", "slug", "post_type", "status" }` | Danh mục vừa tạo |
| PATCH | `/api/admin/post-categories/{category_id}` | Các trường cần cập nhật | `{ "updated": true }` |
| DELETE | `/api/admin/post-categories/{category_id}` | Không có body | `{ "deleted": true }` |

### Cập nhật nội dung trang giới thiệu

API này đang tồn tại trong frontend tại route `/api/admin/introduce-content`.

| Method | URL |
| --- | --- |
| GET | `/api/admin/introduce-content` |

Dữ liệu gửi đi: không có body.

Dữ liệu phản hồi: `IntroducePageContent`, cùng cấu trúc với `/api/introduce-content`.

| Method | URL |
| --- | --- |
| PUT | `/api/admin/introduce-content` |

Dữ liệu gửi đi:

```json
{
  "hero": {
    "eyebrow": "Về chúng tôi",
    "title": "Đơn vị cung cấp vật tư cơ khí",
    "highlight": "uy tín",
    "excerpt": "Nội dung mô tả ngắn",
    "thumbnail": "/images/about/hero.jpg"
  },
  "story": {
    "heading": "Câu chuyện doanh nghiệp",
    "body": "Nội dung câu chuyện"
  },
  "vision": {
    "heading": "Tầm nhìn",
    "body": "Nội dung tầm nhìn"
  },
  "mission": {
    "heading": "Sứ mệnh",
    "body": "Nội dung sứ mệnh"
  },
  "reasonsHeading": "Vì sao chọn chúng tôi",
  "reasons": [
    {
      "title": "Hàng hóa rõ nguồn gốc",
      "body": "Nội dung"
    }
  ],
  "showcase": {
    "image": "/images/about/showcase.jpg",
    "alt": "Kho hàng",
    "caption": "Hình ảnh kho hàng"
  },
  "contact": {
    "heading": "Liên hệ",
    "addressLabel": "Địa chỉ",
    "address": "Địa chỉ công ty",
    "hotlineLabel": "Hotline",
    "hotline": "0900000000",
    "emailLabel": "Email",
    "email": "info@example.com",
    "hoursLabel": "Thời gian làm việc",
    "hours": "Thứ 2 - Thứ 7",
    "cta": "Liên hệ tư vấn"
  }
}
```

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": {
    "updated": true
  }
}
```

## 7. Admin đối tác, nhà cung cấp

### CRUD nhà cung cấp

| Method | URL | Dữ liệu gửi đi | Dữ liệu phản hồi |
| --- | --- | --- | --- |
| GET | `/api/admin/suppliers` | Query: `q`, `regionId`, `status`, `page`, `limit` | Danh sách nhà cung cấp |
| POST | `/api/admin/suppliers` | Dữ liệu nhà cung cấp | Nhà cung cấp vừa tạo |
| GET | `/api/admin/suppliers/{supplier_id}` | Không có body | Chi tiết nhà cung cấp |
| PATCH | `/api/admin/suppliers/{supplier_id}` | Các trường cần cập nhật | `{ "updated": true }` |
| DELETE | `/api/admin/suppliers/{supplier_id}` | Không có body | `{ "deleted": true }` |

Ví dụ dữ liệu nhà cung cấp:

```json
{
  "name": "Nhà cung cấp A",
  "slug": "nha-cung-cap-a",
  "logo": "/images/partners/a.png",
  "region_id": "mn",
  "address": "TP.HCM",
  "phone": "0900000000",
  "email": "partner@example.com",
  "website": "https://example.com",
  "status": "active",
  "description": "Mô tả"
}
```

## 8. Admin người dùng và phân quyền

### CRUD người dùng

| Method | URL | Dữ liệu gửi đi | Dữ liệu phản hồi |
| --- | --- | --- | --- |
| GET | `/api/admin/users` | Query: `q`, `roleId`, `status`, `page`, `limit` | Danh sách người dùng |
| POST | `/api/admin/users` | Dữ liệu người dùng | Người dùng vừa tạo |
| GET | `/api/admin/users/{account_id}` | Không có body | Chi tiết người dùng |
| PATCH | `/api/admin/users/{account_id}` | Các trường cần cập nhật | `{ "updated": true }` |
| DELETE | `/api/admin/users/{account_id}` | Không có body | `{ "deleted": true }` |

Ví dụ dữ liệu người dùng:

```json
{
  "username": "staff01",
  "full_name": "Nhân viên 01",
  "email": "staff01@example.com",
  "phone": "0900000001",
  "password": "123456",
  "role_id": "staff",
  "status": "active"
}
```

### Đặt lại mật khẩu người dùng

| Method | URL |
| --- | --- |
| POST | `/api/admin/users/{account_id}/reset-password` |

Dữ liệu gửi đi:

```json
{
  "new_password": "123456"
}
```

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": {
    "account_id": "100",
    "updated": true
  }
}
```

### CRUD vai trò

| Method | URL | Dữ liệu gửi đi | Dữ liệu phản hồi |
| --- | --- | --- | --- |
| GET | `/api/admin/roles` | Query: `q`, `status` | Danh sách vai trò |
| POST | `/api/admin/roles` | Dữ liệu vai trò | Vai trò vừa tạo |
| GET | `/api/admin/roles/{role_id}` | Không có body | Chi tiết vai trò |
| PATCH | `/api/admin/roles/{role_id}` | Các trường cần cập nhật | `{ "updated": true }` |
| DELETE | `/api/admin/roles/{role_id}` | Không có body | `{ "deleted": true }` |

Ví dụ dữ liệu vai trò:

```json
{
  "name": "Quản lý sản phẩm",
  "code": "product_manager",
  "permissions": ["products", "view_logs"],
  "status": "active"
}
```

### Danh sách quyền

| Method | URL |
| --- | --- |
| GET | `/api/admin/permissions` |

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": [
    {
      "permission_id": "products",
      "name": "Quản lý sản phẩm",
      "description": "Tạo, sửa, xóa sản phẩm"
    },
    {
      "permission_id": "posts",
      "name": "Quản lý bài viết",
      "description": "Tạo, sửa, xóa bài viết"
    },
    {
      "permission_id": "partners",
      "name": "Quản lý đối tác",
      "description": "Tạo, sửa, xóa đối tác"
    },
    {
      "permission_id": "users",
      "name": "Quản lý người dùng",
      "description": "Quản lý tài khoản và vai trò"
    },
    {
      "permission_id": "view_logs",
      "name": "Xem thống kê lượt xem",
      "description": "Theo dõi hành vi xem sản phẩm"
    }
  ]
}
```

## 9. Admin log và thống kê

### Danh sách log lượt xem

| Method | URL |
| --- | --- |
| GET | `/api/admin/view-logs` |

Query gửi đi:

| Tên | Kiểu | Ghi chú |
| --- | --- | --- |
| `q` | string | Tìm theo sản phẩm, mã sản phẩm, người dùng |
| `productId` | number | Lọc theo sản phẩm |
| `userId` | string | Lọc theo người dùng |
| `dateFrom` | string | ISO date |
| `dateTo` | string | ISO date |
| `page` | number | Mặc định `1` |
| `limit` | number | Mặc định `20` |

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": [
    {
      "view_log_id": 1,
      "product_id": 1,
      "product_code": "VLG-001",
      "product_name": "Van bi inox 304",
      "user_id": "100",
      "username": "nguyenvana",
      "ip_address": "127.0.0.1",
      "user_agent": "Mozilla/5.0",
      "viewed_at": "2026-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Xuất log lượt xem

| Method | URL |
| --- | --- |
| GET | `/api/admin/view-logs/export` |

Query gửi đi: giống `/api/admin/view-logs`.

Dữ liệu phản hồi: file Excel hoặc CSV.

Header đề xuất:

```http
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="view-logs.xlsx"
```

### Danh sách log lỗi hệ thống

| Method | URL |
| --- | --- |
| GET | `/api/admin/system-error-logs` |

Query gửi đi:

| Tên | Kiểu | Ghi chú |
| --- | --- | --- |
| `q` | string | Tìm theo message, module |
| `level` | string | `info`, `warning`, `error`, `critical` |
| `status` | string | `new`, `reviewing`, `resolved` |
| `module` | string | Module phát sinh lỗi |
| `page` | number | Mặc định `1` |
| `limit` | number | Mặc định `20` |

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": [
    {
      "error_log_id": 1,
      "level": "error",
      "module": "products",
      "message": "Không tải được sản phẩm",
      "stack": "Error stack",
      "status": "new",
      "created_at": "2026-01-01T00:00:00.000Z",
      "resolved_at": null
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 10,
    "totalPages": 1
  }
}
```

### Cập nhật trạng thái log lỗi

| Method | URL |
| --- | --- |
| PATCH | `/api/admin/system-error-logs/{error_log_id}` |

Dữ liệu gửi đi:

```json
{
  "status": "resolved",
  "note": "Đã xử lý"
}
```

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": {
    "error_log_id": 1,
    "updated": true
  }
}
```

## 10. Upload file dùng chung

### Upload ảnh

| Method | URL |
| --- | --- |
| POST | `/api/admin/uploads/images` |

Dữ liệu gửi đi: `multipart/form-data` với field `files`.

Dữ liệu phản hồi:

```json
{
  "success": true,
  "data": [
    {
      "file_id": 1,
      "url": "/uploads/images/file.jpg",
      "filename": "file.jpg",
      "mime_type": "image/jpeg",
      "size": 120000
    }
  ]
}
```

## Ghi chú triển khai server

- Các API public chỉ trả dữ liệu có `status = active` hoặc `status = published` và `is_deleted = false`.
- Các API admin cần kiểm tra quyền theo `role_id` hoặc danh sách `permissions`.
- Xóa dữ liệu nên ưu tiên xóa mềm bằng `is_deleted`, `deleted_at` để tránh mất dữ liệu quản trị.
- `product_code` nên unique và dùng làm slug cho trang chi tiết sản phẩm.
- `slug` của danh mục, bài viết, dịch vụ và đối tác nên unique trong từng nhóm nội dung.
- Trang sản phẩm đang tối ưu SSR theo query URL, vì vậy API `/api/products` cần hỗ trợ đầy đủ `q`, `sub`, `maxPrice`, `sort`, `page`, `limit`.
- Trang chi tiết sản phẩm cần trường `images` là mảng ảnh để slider và thao tác kéo ảnh hoạt động đúng.
