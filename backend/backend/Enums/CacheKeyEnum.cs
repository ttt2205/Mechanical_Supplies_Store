using System.ComponentModel;

namespace backend.Enums
{
    /// <summary>
    /// Enum định nghĩa các Cache Key Prefix để dễ dàng quản lý và tránh hardcode string.
    /// Sử dụng chung với thuộc tính [Description] nếu muốn định dạng chuỗi tuỳ chỉnh.
    /// </summary>
    public enum CacheKeyEnum
    {
        [Description("Products:All")]
        AllProducts,

        [Description("Products:Id:{0}")]
        ProductById,

        [Description("Products:Slug:{0}")]
        ProductBySlug,

        [Description("Products:Category:{0}")]
        ProductsByCategory,

        [Description("Products:Featured")]
        FeaturedProducts,

        [Description("Posts:All")]
        AllPosts,

        [Description("Posts:Id:{0}")]
        PostById,

        [Description("Posts:Slug:{0}")]
        PostBySlug,

        [Description("Posts:Category:{0}")]
        PostsByCategory,

        [Description("Categories:All")]
        AllCategories,

        [Description("Categories:Id:{0}")]
        CategoryById,

        [Description("Users:Profile:{0}")]
        UserProfile,

        [Description("Roles:Permissions:{0}")]
        RolePermissions
    }
}
