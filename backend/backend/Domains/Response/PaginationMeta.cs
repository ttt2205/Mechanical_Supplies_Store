namespace backend.Domains.Response
{
    public class PaginationMeta
    {
        public int Page { get; set; }
        public int Limit { get; set; }
        public int Total { get; set; }
        public int TotalPages => Limit > 0 ? (int)Math.Ceiling((double)Total / Limit) : 0;

        public PaginationMeta() { }

        public PaginationMeta(int page, int limit, int total)
        {
            Page = page;
            Limit = limit;
            Total = total;
        }
    }
}
