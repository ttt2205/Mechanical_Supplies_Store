# TRANG 3: CHI TIẾT API DANH MỤC & SẢN PHẨM
> **Dùng cho Notion**: Trang 3 - Categories & Products APIs  

---

## 1. PHÂN LOẠI DANH MỤC (`/api/Categories`)

### 1.1 GET /api/Categories - Lấy danh sách danh mục (Lọc theo Type)
- **Method + URL**: `GET /api/Categories`
- **Query Params**:
  - `type` (`string`, tùy chọn): Phân loại danh mục (`PRODUCT`, `SERVICE`, `PARTNER`).
- **Response mẫu (HTTP 200 OK)**:
  ```json
  {
    "success": true,
    "message": "Category fetched successfully",
    "data": [
      {
        "category_id": 1,
        "name": "Bơm thủy lực",
        "code": "SP-BTH",
        "type": "PRODUCT",
        "parent_id": null,
        "display_order": 1,
        "status": "ACTIVE",
        "icon": "Package",
        "description": "Danh mục bơm thủy lực công nghiệp"
      },
      {
        "category_id": 14,
        "name": "Bơm bánh răng",
        "code": "SP-BTH-BR",
        "type": "PRODUCT",
        "parent_id": 1,
        "display_order": 2,
        "status": "ACTIVE",
        "icon": "Box",
        "description": "Bơm bánh răng ăn khớp ngoài & trong"
      }
    ]
  }
  ```

### 1.2 POST /api/Categories - Tạo danh mục mới
- **Method + URL**: `POST /api/Categories`
- **Permissions**: Bearer Token + Quyền `category:create`
- **Request Body**:
  | Trường | Kiểu | Bắt buộc | Mô tả | Ví dụ |
  | :--- | :--- | :--- | :--- | :--- |
  | `name` | `string` | Có | Tên danh mục | `Bảo dưỡng van khí nén` |
  | `code` | `string` | Có | Mã danh mục | `DV-BD-VVKN` |
  | `type` | `string` | Có | Loai danh mục (`PRODUCT`/`SERVICE`/`PARTNER`) | `SERVICE` |
  | `parentId` | `number` | Có | ID danh mục cha | `2` |
  | `displayOrder` | `number` | Không | Thứ tự hiển thị | `1` |
  | `status` | `string` | Không | Trạng thái (`ACTIVE`/`INACTIVE`) | `ACTIVE` |

  *JSON Request Mẫu*:
  ```json
  {
    "name": "Bảo dưỡng van khí nén",
    "code": "DV-BD-VVKN",
    "type": "SERVICE",
    "parentId": 2,
    "displayOrder": 1,
    "status": "ACTIVE"
  }
  ```

---

## 2. QUẢN LÝ SẢN PHẨM (`/api/Products`)

### 2.1 GET /api/Products - Danh sách sản phẩm (Tìm kiếm & Phân trang)
- **Method + URL**: `GET /api/Products`
- **Query Params**:
  - `page` (`integer`, default `1`): Số trang
  - `limit` (`integer`, default `10`): Số sản phẩm/trang
  - `search` (`string`, tùy chọn): Từ khóa tìm theo tên hoặc mã SKU.
- **Response mẫu (HTTP 200 OK)**:
  ```json
  {
    "success": true,
    "message": "Products fetched successfully",
    "data": [
      {
        "id": 101,
        "name": "Bơm Piston Thủy Lực Parker PV063",
        "productCode": "SKU-PARKER-PV063",
        "slug": "bom-piston-thuy-luc-parker-pv063",
        "categoryId": 14,
        "basePrice": 15500000,
        "isContactPrice": false,
        "isFeatured": true,
        "stockQuantity": 25,
        "status": "ACTIVE",
        "thumbnail": "/uploads/products/parker-pv063.jpg",
        "viewCount": 340
      }
    ]
  }
  ```

### 2.2 GET /api/Products/{slug} - Chi tiết sản phẩm
- **Method + URL**: `GET /api/Products/{slug}`
- **URL Param**: `slug` = `bom-piston-thuy-luc-parker-pv063`
- **Response mẫu**:
  ```json
  {
    "success": true,
    "message": "Product details fetched successfully",
    "data": {
      "id": 101,
      "name": "Bơm Piston Thủy Lực Parker PV063",
      "productCode": "SKU-PARKER-PV063",
      "slug": "bom-piston-thuy-luc-parker-pv063",
      "categoryId": 14,
      "basePrice": 15500000,
      "isContactPrice": false,
      "isFeatured": true,
      "stockQuantity": 25,
      "status": "ACTIVE",
      "thumbnail": "/uploads/products/parker-pv063.jpg",
      "shortDescription": "Bơm piston áp suất cao chuyên dụng cho trạm nguồn công nghiệp.",
      "content": "<h2>Thông số kỹ thuật chi tiết</h2><p>Áp suất tối đa 350 bar...</p>",
      "viewCount": 341
    }
  }
  ```

### 2.3 POST /api/Products/{slug}/view - Tăng lượt xem sản phẩm
- **Method + URL**: `POST /api/Products/{slug}/view`
- **Response**: `{"success": true, "data": true}`
