using Core.Entities;

namespace Core.Specifications
{
    public class ProductWithFiltersForCountSpecification : BaseSpecification<Product>
    {
        public ProductWithFiltersForCountSpecification(ProductSpecParams @params)
            : base(x =>
                (string.IsNullOrEmpty(@params.Search) || x.Name.ToLower().Contains(@params.Search)) &&
                (!@params.BrandId.HasValue || x.ProductBrandId == @params.BrandId) &&
                (!@params.TypeId.HasValue || x.ProductTypeId == @params.TypeId)
            )
        {
        }
    }
}
