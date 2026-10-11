using System.ComponentModel;
using System.Reflection;
using backend.Enums;

namespace backend.Constants.Cache
{
    /// <summary>
    /// Các hàm tiện ích để tạo ra Cache Key chuẩn xác từ Enum `CacheKeyEnum`.
    /// </summary>
    public static class CacheKeyGenerator
    {
        /// <summary>
        /// Lấy ra chuỗi format định nghĩa trong thuộc tính [Description] của Enum.
        /// </summary>
        public static string GetEnumDescription(this CacheKeyEnum value)
        {
            FieldInfo fi = value.GetType().GetField(value.ToString());

            DescriptionAttribute[] attributes = 
                (DescriptionAttribute[])fi.GetCustomAttributes(
                typeof(DescriptionAttribute), 
                false);

            if (attributes != null && attributes.Length > 0)
                return attributes[0].Description;
            else
                return value.ToString();
        }

        /// <summary>
        /// Sinh Cache Key động dựa trên Enum và các tham số (ID, Slug...) truyền vào.
        /// </summary>
        /// <param name="keyEnum">Enum định nghĩa key</param>
        /// <param name="args">Các tham số như Id, Slug để thay thế vào {0}, {1}...</param>
        /// <returns>Chuỗi Cache Key hoàn chỉnh</returns>
        public static string GetKey(CacheKeyEnum keyEnum, params object[] args)
        {
            string formatString = keyEnum.GetEnumDescription();
            
            // Nếu có tham số truyền vào thì dùng string.Format để thay thế vào {0}, {1}
            if (args != null && args.Length > 0)
            {
                return string.Format(formatString, args);
            }
            
            return formatString;
        }

        // ================= CÁC HÀM GỌI NHANH ĐỂ CODE GỌN HƠN (Tùy chọn) =================
        
        public static string GetProductKey(int id) => GetKey(CacheKeyEnum.ProductById, id);
        public static string GetAllProductsKey() => GetKey(CacheKeyEnum.AllProducts);
        
        public static string GetPostKey(int id) => GetKey(CacheKeyEnum.PostById, id);
        public static string GetAllPostsKey() => GetKey(CacheKeyEnum.AllPosts);
    }
}
