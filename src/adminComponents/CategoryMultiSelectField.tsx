'use client'
import React, { useEffect, useState, useCallback } from 'react';
import { useField } from '@payloadcms/ui';
import { usePayloadAPI } from '@payloadcms/ui';
import { Category } from '@/payload-types';

interface CategoryMultiSelectFieldProps {
  path: string;
  label?: string;
}

const CategoryMultiSelectField: React.FC<CategoryMultiSelectFieldProps> = ({ path, label }) => {
  const { value, setValue } = useField<number[] | null>({ path });
  const selectedCategoryIds = Array.isArray(value) ? value : [];

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [{ data, isLoading, isError }] = usePayloadAPI(
    '/api/categories',
    { initialParams: { depth: 2, pagination: false } }
  );

  useEffect(() => {
    if (!isLoading && !isError && data && data.docs) {
      setCategories(data.docs);
      setLoading(false);
    } else if (isError) {
      setError('Error fetching categories');
      setLoading(false);
    }
  }, [data, isLoading, isError]);

  const findCategoryById = useCallback((id: number): Category | undefined => {
    return categories.find(cat => cat.id === id);
  }, [categories]);

 
  const handleCheckboxChange = (categoryId: number) => {
    const ids = value ? [...value, categoryId] : [categoryId]
    setValue(ids)
  };

  const handleRemoveSelected = (categoryId: number) => {
    let ids = value ? [...value] : []
    ids = ids.filter(id => id!== categoryId)
    setValue(ids)
  };

  const renderCategoryTree = (items: Category[], currentLevel = 0) => {
    return (
      <ul style={{ paddingLeft: `${currentLevel * 20}px`, listStyle: 'none' }}>
        {items.map(category => {
          const hasSubcategories = category.subcategories && category.subcategories.length > 0;
          const isRootCategory = category.parent === null;

          return (
            <li key={`cat_${category.id}`} style={{ marginBottom: '5px' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                fontWeight: isRootCategory ? 'bold' : 'normal',
                textDecoration: isRootCategory ? 'underline' : 'none'
              }}>
                <input
                  type="checkbox"
                  value={category.id}
                  checked={selectedCategoryIds.includes(category.id)}
                  onChange={(e) =>{
                     if(e.target.checked){
                       handleCheckboxChange(category.id)
                       return
                     }
                     handleRemoveSelected(category.id)
                    }}
                  style={{ marginRight: '8px' }}
                />
                {!isRootCategory && <span>{hasSubcategories ? '📂' : '📄'}</span>}
                <span style={{ marginLeft: '5px' }}>{category.title}</span>
              </label>
              {hasSubcategories && (
                renderCategoryTree(category.subcategories as Category[], currentLevel + 1)
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  const buildCategoryTree = (flatCategories: Category[]): Category[] => {
    const categoryMap = new Map<number | null, Category[]>();

    flatCategories.forEach(category => {
      const parentId = typeof category.parent === 'object' && category.parent !== null
        ? category.parent.id
        : null;

      if (!categoryMap.has(parentId)) {
        categoryMap.set(parentId, []);
      }
      categoryMap.get(parentId)?.unshift(category);
    });

    const buildTree = (parentId: number | null): Category[] => {
      const children = categoryMap.get(parentId) || [];

      return children.map(category => ({
        ...category,
        subcategories: buildTree(category.id)
      }));
    };

    return buildTree(null);
  };

  const categoryTree = buildCategoryTree(categories);

  if (loading) {
    return <div>Cargando categorías...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <label className="field-label">Categorías</label>
      <div style={{ marginBottom: '10px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
        {selectedCategoryIds.length > 0 ? (
          selectedCategoryIds.map(id => {
            const category = findCategoryById(id);
            return category ? (
              <span
                key={id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '4px',
                  padding: '5px 10px',
                  fontSize: '0.9em',
                }}
              >
                {category.title}
                <button
                  type="button"
                  onClick={() => handleRemoveSelected(id)}
                  style={{
                    marginLeft: '8px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#666',
                    fontSize: '1.1em',
                    lineHeight: '1',
                    padding: '0',
                  }}
                >
                  &times;
                </button>
              </span>
            ) : null;
          })
        ) : (
          <div style={{ color: 'red', marginBottom: '10px' }}>
            Tienes que elegir al menos una categoría
          </div>
        )}
      </div>
      {renderCategoryTree(categoryTree)}
    </div>
  );
};

export default CategoryMultiSelectField;