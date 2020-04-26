using API.Dto;
using API.Resolvers;
using AutoMapper;
using Core.Entities;
using Core.Entities.Identity;

namespace API.Profiles
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Product, ProductToReturnDto>()
                .ForMember(d => d.ProductBrand, o => o.MapFrom(p => p.ProductBrand.Name))
                .ForMember(d => d.ProductType, o => o.MapFrom(p => p.ProductType.Name))
                .ForMember(d => d.PictureUrl, o => o.MapFrom<ProductUrlResolver>());

            CreateMap<Address, AddressDto>().ReverseMap();

            CreateMap<Basket, BasketDto>().ReverseMap();
            CreateMap<BasketItem, BasketItemDto>().ReverseMap();

            CreateMap<AddressDto, Core.Entities.OrderAggregate.Address>();
        }
    }
}
