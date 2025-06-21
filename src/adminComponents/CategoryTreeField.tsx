'use client'
import React, { useEffect, useState } from 'react';
import { useField, useForm } from '@payloadcms/ui'; // Import useField
import { usePayloadAPI } from '@payloadcms/ui';
import { Category } from '@/payload-types'; // Assuming payload-types is accessible
import { useParams } from 'next/navigation';
import { getCategoryAndSubcategoryIds } from 'utils/consts';

interface CategoryTreeFieldProps {
  path: string; // The path of the field in the form (e.g., 'parent')
  label?: string; // The label for the field
}

const CategoryTreeField: React.FC<CategoryTreeFieldProps> = ({ path, label }) => {
  const { fields } = useForm(); // Use useForm to access form-related context
  const { value, setValue } = useField<number | null>({ path });
  const  params  = useParams(); // Use useParams to get the current category ID from the URL
  const id =parseInt((params.segments as string[])[2]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryIds, setCategoryIds] = useState<number[]>([]); // State to store selected category IDs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [{ data, isLoading, isError }, {setParams}] = usePayloadAPI(
    '/api/categories',
    { initialParams: { depth: 2, pagination: false } }
  );
  useEffect(() => {
    setParams({ depth: new Date().getTime(), pagination: false })
  },[fields])
  useEffect(() => {
    if (!isLoading && !isError && data && data.docs) {
      const categoriesResult = data.docs as Category[];
      setCategories(categoriesResult);
      setLoading(false);
    } else if (isError) {
      setError('Error fetching categories');
      setLoading(false);
    }
  }, [data, isLoading, isError]);
  useEffect(() => {
    const category = (findCategoryById(id)); 
    const categoriesTree = buildCategoryTree(categories);
    const categoryIdsResult = category ? getCategoryAndSubcategoryIds(category.slug as string, categoriesTree) : []
    setCategoryIds(categoryIdsResult);
  }, [categories]);
  // Función para encontrar una categoría por su ID en la lista plana
  const findCategoryById = (id: number | null): Category | undefined => {
    if (id === null) return undefined;
    return categories.find(cat => cat.id === id);
  };

  // Determinar el título de la categoría padre
  const parentCategoryTitle = value !== null 
    ? findCategoryById(value)?.title || 'Categoría padre no encontrada' 
    : 'Categoría raíz';

  const renderCategoryTree = (items: Category[], currentLevel = 0) => {
    // Render the category tree using the provided items and currentLevel
    // You can customize the appearance and behavior of the tree as needed
    // For example, you can add checkboxes or other interactio
    return items.map((category) => {
      const isCurrentCategory = categoryIds.includes(category.id); // Use currentCategoryId from URL
     
      const hasSubcategories = category.subcategories && category.subcategories.length > 0;
      const isRootCategory = category.parent === null;
      
      return (
        <div key={category.id} style={{ paddingLeft: `${currentLevel * 20}px` }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: isCurrentCategory ? 'not-allowed' : 'pointer',
            fontWeight: isRootCategory ? 'bold' : 'normal',
            textDecoration: isRootCategory ? 'underline' : 'none'
          }}>
            <input
              type="radio"
              name="parentCategory"
              value={category.id}
              checked={value === category.id}
              onChange={()=>setValue(category.id)}
              disabled={isCurrentCategory} // Disable if it's the current category
              style={{ marginRight: '8px' }}
            />
            {!isRootCategory && (hasSubcategories ? '📂' : '📄')} {category.title}
          </label>
          {hasSubcategories && renderCategoryTree(category.subcategories as Category[], currentLevel + 1)}
        </div>
      );
    });
  };

  const buildCategoryTree = (flatCategories: Category[]): Category[] => {
    const categoryMap = new Map<number | null, Category[]>();
    flatCategories.forEach(category => {
      const parentId = typeof category.parent === 'object' && category.parent !== null 
        ? category.parent.id 
        : (category.parent === null ? null : null);

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
      <label className="field-label">Categoría Padre</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <input
          type="text"
          value={parentCategoryTitle}
          disabled
          style={{
            flexGrow: 1,
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#f0f0f0',
            cursor: 'not-allowed',
          }}
        />
        {value !== null && (
          <button
            type="button"
            onClick={() => setValue(null)}
            style={{
              padding: '8px 12px',
              backgroundColor: '#e0e0e0',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            {/* Placeholder for icon, you can replace with an actual icon component */}
            <span>&times;</span> Deseleccionar
          </button>
        )}
      </div>
      {label && <label className="field-label">{label}</label>}
      {renderCategoryTree(categoryTree)}
    </div>
  );
};

export default CategoryTreeField;