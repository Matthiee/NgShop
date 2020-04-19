using System.Collections.Generic;

namespace API.Pagination
{
    public class Pagination<T> 
        where T : class
    {

        public Pagination(int pageIndex, int pageSize, int totalItems, IReadOnlyList<T> productsToReturn)
        {
            PageIndex = pageIndex;
            PageSize = pageSize;
            Count = totalItems;
            Data = productsToReturn;
        }

        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public int Count { get; set; }
        public IReadOnlyList<T> Data { get; set; }
    }
}
