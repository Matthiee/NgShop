using Core.Entities;
using Core.Interfaces;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly StoreContext context;
        private Hashtable repositories;

        public UnitOfWork(StoreContext context)
        {
            this.context = context;
        }

        public async Task<int> Complete()
        {
            return await context.SaveChangesAsync();
        }

        public void Dispose()
        {
            context.Dispose();
        }

        public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
        {
            if (repositories == null) repositories = new Hashtable();

            var type = typeof(TEntity).Name;

            if (!repositories.ContainsKey(type))
            {
                var repoType = typeof(GenericRepository<>);
                var repoInstance = Activator.CreateInstance(repoType.MakeGenericType(typeof(TEntity)), context);

                repositories.Add(type, repoInstance);
            }

            return (IGenericRepository<TEntity>)repositories[type];
        }
    }
}
