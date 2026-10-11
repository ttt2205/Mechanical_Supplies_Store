using backend.Domains.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Account> Accounts { get; set; } = null!;
        public DbSet<Role> Roles { get; set; } = null!;
        public DbSet<Permission> Permissions { get; set; } = null!;
        public DbSet<RolePermission> RolePermissions { get; set; } = null!;
        public DbSet<RevokedToken> RevokedTokens { get; set; } = null!;

        // Product Module
        public DbSet<Category> Categories { get; set; } = null!;
        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<ProductSection> ProductSections { get; set; } = null!;
        public DbSet<ProductVariant> ProductVariants { get; set; } = null!;

        // CMS Module
        public DbSet<PostCategory> PostCategories { get; set; } = null!;
        public DbSet<Post> Posts { get; set; } = null!;
        public DbSet<PostSection> PostSections { get; set; } = null!;
        public DbSet<PostStatistics> PostStatistics { get; set; } = null!;

        // Attachment Module
        public DbSet<AttachmentSyntax> AttachmentSyntaxes { get; set; } = null!;
        public DbSet<Attachment> Attachments { get; set; } = null!;
        public DbSet<AttachmentMapping> AttachmentMappings { get; set; } = null!;
        public DbSet<Partner> Partners { get; set; } = null!;
        public DbSet<SystemLog> SystemLogs { get; set; } = null!;
        public DbSet<SystemError> SystemErrors { get; set; } = null!;
        public DbSet<DailyStatistic> DailyStatistics { get; set; } = null!;
        public DbSet<ContactInquiry> ContactInquiries { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Role
            modelBuilder.Entity<Role>(entity =>
            {
                entity.ToTable("roles");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Code).HasMaxLength(50).IsRequired();
                entity.HasIndex(e => e.Code).IsUnique();
                entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
                entity.Property(e => e.IsAdmin).HasDefaultValue(false);
            });

            // Configure Account
            modelBuilder.Entity<Account>(entity =>
            {
                entity.ToTable("accounts");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Username).HasMaxLength(100).IsRequired();
                entity.Property(e => e.Email).HasMaxLength(255).IsRequired();
                entity.Property(e => e.PasswordHash).IsRequired();
                
                entity.HasIndex(e => e.Username).IsUnique();
                entity.HasIndex(e => e.Email).IsUnique();

                // Relationship
                entity.HasOne(e => e.Role)
                      .WithMany(r => r.Accounts)
                      .HasForeignKey(e => e.RoleId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure Auth Module
            modelBuilder.Entity<Permission>(entity =>
            {
                entity.ToTable("permissions");
                entity.HasIndex(e => e.Code).IsUnique();
            });

            modelBuilder.Entity<RolePermission>(entity =>
            {
                entity.ToTable("role_permissions");
                entity.HasKey(e => new { e.RoleId, e.PermissionId });
                entity.HasOne(e => e.Role)
                      .WithMany()
                      .HasForeignKey(e => e.RoleId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.Permission)
                      .WithMany(p => p.RolePermissions)
                      .HasForeignKey(e => e.PermissionId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<RevokedToken>(entity =>
            {
                entity.ToTable("revoked_tokens");
                entity.HasKey(e => e.Token); // using token as PK
                entity.HasIndex(e => e.ExpiryDate); // index for cleanup
            });

            // Configure Category
            modelBuilder.Entity<Category>(entity =>
            {
                entity.ToTable("categories");
                
                // Virtual Generated Columns for Soft Delete
                entity.Property(e => e.ActiveCode)
                      .HasComputedColumnSql("CASE WHEN IsDeleted = 0 THEN Code ELSE NULL END", stored: true);
                entity.Property(e => e.ActiveSlug)
                      .HasComputedColumnSql("CASE WHEN IsDeleted = 0 THEN Slug ELSE NULL END", stored: true);
                      
                entity.Property(e => e.Type).HasMaxLength(50).HasDefaultValue("PRODUCT");
                entity.HasIndex(e => new { e.Type, e.IsDeleted });
                
                entity.HasIndex(e => e.ActiveCode).IsUnique();
                entity.HasIndex(e => e.ActiveSlug).IsUnique();
                
                entity.HasOne(e => e.Parent)
                      .WithMany(p => p.Children)
                      .HasForeignKey(e => e.ParentId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure Product
            modelBuilder.Entity<Product>(entity =>
            {
                entity.ToTable("products");
                
                // Virtual Generated Columns for Soft Delete
                entity.Property(e => e.ActiveProductCode)
                      .HasComputedColumnSql("CASE WHEN IsDeleted = 0 THEN ProductCode ELSE NULL END", stored: true);
                entity.Property(e => e.ActiveSlug)
                      .HasComputedColumnSql("CASE WHEN IsDeleted = 0 THEN Slug ELSE NULL END", stored: true);
                
                entity.HasIndex(e => e.ActiveProductCode).IsUnique();
                entity.HasIndex(e => e.ActiveSlug).IsUnique();
                
                // Listing & Filtering Composite Indexes
                entity.HasIndex(e => new { e.CategoryId, e.Status, e.IsDeleted, e.CreationTime });
                entity.HasIndex(e => new { e.Status, e.IsDeleted, e.CreationTime });
                
                entity.HasOne(e => e.Category)
                      .WithMany(c => c.Products)
                      .HasForeignKey(e => e.CategoryId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<ProductSection>().ToTable("product_sections");
            modelBuilder.Entity<ProductVariant>(entity =>
            {
                entity.ToTable("product_variants");
                entity.Property(e => e.ActiveSku)
                      .HasComputedColumnSql("CASE WHEN IsDeleted = 0 THEN Sku ELSE NULL END", stored: true);
                entity.HasIndex(e => e.ActiveSku).IsUnique();
            });

            // Configure CMS
            modelBuilder.Entity<PostCategory>(entity =>
            {
                entity.ToTable("post_categories");
                entity.Property(e => e.ActiveSlug)
                      .HasComputedColumnSql("CASE WHEN IsDeleted = 0 THEN Slug ELSE NULL END", stored: true);
                entity.HasIndex(e => e.ActiveSlug).IsUnique();
            });

            modelBuilder.Entity<Post>(entity =>
            {
                entity.ToTable("posts");
                entity.Property(e => e.ActiveSlug)
                      .HasComputedColumnSql("CASE WHEN IsDeleted = 0 THEN Slug ELSE NULL END", stored: true);
                entity.HasIndex(e => e.ActiveSlug).IsUnique();
                
                // Listing & Filtering Composite Index
                entity.HasIndex(e => new { e.CategoryId, e.Status, e.IsDeleted, e.CreationTime });
                
                entity.HasOne(e => e.Category)
                      .WithMany(c => c.Posts)
                      .HasForeignKey(e => e.CategoryId)
                      .OnDelete(DeleteBehavior.SetNull);
                      
                entity.HasOne(e => e.Author)
                      .WithMany()
                      .HasForeignKey(e => e.AuthorId)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<PostSection>().ToTable("post_sections");

            modelBuilder.Entity<PostStatistics>(entity =>
            {
                entity.ToTable("post_statistics");
                entity.HasKey(e => e.PostId);
                entity.HasOne(e => e.Post)
                      .WithOne(p => p.Statistics)
                      .HasForeignKey<PostStatistics>(e => e.PostId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure Attachment
            modelBuilder.Entity<AttachmentSyntax>(entity =>
            {
                entity.ToTable("attachment_syntaxes");
                entity.HasAlternateKey(e => e.Code); // Sets as Unique and usable as FK
            });
            
            modelBuilder.Entity<Attachment>().ToTable("attachments");
            
            modelBuilder.Entity<Partner>().ToTable("partners");
            modelBuilder.Entity<SystemLog>().ToTable("system_logs");
            modelBuilder.Entity<SystemError>().ToTable("system_errors");
            
            modelBuilder.Entity<AttachmentMapping>(entity =>
            {
                entity.ToTable("attachment_mappings");
                
                // Composite Indexes for queries
                entity.HasIndex(e => new { e.ObjectType, e.ObjectId });
                entity.HasIndex(e => new { e.ObjectType, e.ObjectId, e.SyntaxCode });
                
                entity.HasOne(e => e.Attachment)
                      .WithMany()
                      .HasForeignKey(e => e.AttachmentId)
                      .OnDelete(DeleteBehavior.Cascade);
                      
                entity.HasOne(e => e.Syntax)
                      .WithMany()
                      .HasPrincipalKey(s => s.Code)
                      .HasForeignKey(e => e.SyntaxCode)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<DailyStatistic>(entity =>
            {
                entity.ToTable("daily_statistics");
                entity.HasIndex(e => e.Date).IsUnique();
            });

            modelBuilder.Entity<ContactInquiry>(entity =>
            {
                entity.ToTable("contact_inquiries");
                entity.Property(e => e.FullName).HasMaxLength(150).IsRequired();
                entity.Property(e => e.Phone).HasMaxLength(50).IsRequired();
                entity.Property(e => e.Email).HasMaxLength(150);
                entity.Property(e => e.Service).HasMaxLength(100);
                entity.Property(e => e.Status).HasMaxLength(50).HasDefaultValue("NEW");
            });
        }
    }
}
