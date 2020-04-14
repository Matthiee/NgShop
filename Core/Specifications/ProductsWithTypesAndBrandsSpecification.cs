using Core.Entities;

namespace Core.Specifications
{
    public class ProductsWithTypesAndBrandsSpecification : BaseSpecification<Product>
    {
        public ProductsWithTypesAndBrandsSpecification(ProductSpecParams @params)
            : base(x =>
                (string.IsNullOrEmpty(@params.Search) || x.Name.ToLower().Contains(@params.Search)) &&
                (!@params.BrandId.HasValue || x.ProductBrandId == @params.BrandId) &&
                (!@params.TypeId.HasValue || x.ProductTypeId == @params.TypeId)
            )
        {
            AddInclude(p => p.ProductBrand);
            AddInclude(p => p.ProductType);
            AddOrderBy(x => x.Name);

            ApplyPaging(@params.PageSize * (@params.PageIndex - 1), @params.PageSize);

            if (!string.IsNullOrEmpty(@params.Sort))
            {
                switch (@params.Sort)
                {
                    case "priceAsc":
                        AddOrderBy(p => p.Price);
                        break;
                    case "priceDesc":
                        AddOrderByDescending(p => p.Price);
                        break;
                }
            }
        }

        public ProductsWithTypesAndBrandsSpecification(int id)
            : base(p => p.Id == id)
        {
            AddInclude(p => p.ProductBrand);
            AddInclude(p => p.ProductType);
        }
    }
}
