using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Core.Specifications
{
    public abstract class BaseSpecification<T> 
        : ISpecification<T>
    {
        public Expression<Func<T, bool>> Criteria { get; }
        public List<Expression<Func<T, object>>> Includes { get; }

        public BaseSpecification()
        {
            Criteria = null;
            Includes = new List<Expression<Func<T, object>>>();
        }

        public BaseSpecification(Expression<Func<T, bool>> criteria)
        {
            Criteria = criteria ?? throw new ArgumentNullException(nameof(criteria));
            Includes = new List<Expression<Func<T, object>>>();
        }

        protected void AddInclude(Expression<Func<T, object>> includeExpression)
        {
            Includes.Add(includeExpression);
        }
    }
}
