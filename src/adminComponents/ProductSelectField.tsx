'use client'
import React, { useState, useMemo } from 'react';
import { useField } from '@payloadcms/ui';
import type { RelationshipFieldClientComponent } from 'payload';
import { Modal, useModal } from '@faceless-ui/modal';
import { Brand, Media, Product } from '@/payload-types';
import Image from 'next/image';

const ProductSelectField: RelationshipFieldClientComponent = ({ path, field, ...props }) => {
  const { value, setValue } = useField({ path });
  const { toggleModal } = useModal();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const modalStyles = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    width: '80%',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflow: 'auto'
  } as const;

  // Cargar productos cuando cambia el valor
  React.useEffect(() => {
    const loadProducts = async () => {
      if (!value || !Array.isArray(value) || value.length === 0) {
        setSelectedProducts([]);
        return;
      }

      try {
        const productIds = value.map(id => typeof id === 'object' ? id.id : id).filter(Boolean);
        if (productIds.length === 0) return;

        const response = await fetch(`/api/products?where[id][in]=${productIds.join(',')}`);
        const data = await response.json();
        
        // Mantener el orden original
        const orderedProducts = productIds.map(id => 
          data.docs.find((product: Product) => product.id === id)
        ).filter(Boolean);
        
        setSelectedProducts(orderedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };

    loadProducts();
  }, [value]);

  const ProductSearchModal: React.FC<{
    onSelect: (product: Product) => void;
    modalSlug: string;
  }> = ({ onSelect, modalSlug }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const { toggleModal } = useModal();

    const searchProducts = async (term: string) => {
      if (!term.trim()) {
        setProducts([]);
        return;
      }
      try {
        const response = await fetch(`/api/products?where[title][like]=${term}`);
        const data = await response.json();
        setProducts(data.docs);
      } catch (error) {
        console.error('Error searching products:', error);
      }
    };

    return (
      <div className="product-search-modal">
        <input
          type="text"
          placeholder="Buscar producto..."
          onChange={(e) => {
            setSearchTerm(e.target.value);
            searchProducts(e.target.value);
          }}
          style={{ width: '100%', padding: '8px', marginBottom: '16px' }}
        />
        <div style={{ height: '400px', overflowY: 'auto' }}>
          {products.map((product: Product) => {
            const isAlreadySelected = value && Array.isArray(value) && 
              value.some(id => (typeof id === 'object' ? id.id : id) === product.id);
            
            return (
              <div
                key={product.id}
                onClick={() => {
                  if (!isAlreadySelected) {
                    onSelect(product);
                    toggleModal(modalSlug);
                  }
                }}
                style={{
                  padding: '8px',
                  cursor: isAlreadySelected ? 'not-allowed' : 'pointer',
                  borderBottom: '1px solid #eee',
                  opacity: isAlreadySelected ? 0.5 : 1,
                  backgroundColor: isAlreadySelected ? '#f5f5f5' : 'transparent'
                }}
              >
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <Image
                    src={(product?.image as Media) ? `/media/${(product?.image as Media)?.filename}` : '/logo-default-image.png'}
                    alt={(product?.image as Media)?.alt || product.title}
                    width={50}
                    height={50}
                    className="object-cover"
                  />
                  <div>
                    <strong>{product.title}</strong>
                    <div>{product.price.toFixed(2)}€</div>
                    <div>{(product.brand as Brand)?.title}</div>
                    {isAlreadySelected as boolean && 
                      <div style={{ color: '#666', fontSize: '12px' }}>Ya seleccionado</div>
                    }
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    
    const currentValue = Array.isArray(value) ? value : [];
    const newValue = [...currentValue];
    const draggedItem = newValue[draggedIndex];
    newValue.splice(draggedIndex, 1);
    newValue.splice(dropIndex, 0, draggedItem);
    
    setValue(newValue);
    setDraggedIndex(null);
  };

  const addProduct = (product: Product) => {
    const currentValue = Array.isArray(value) ? value : [];
    const newValue = [...currentValue, product.id];
    setValue(newValue);
  };

  const removeProduct = (index: number) => {
    const currentValue = Array.isArray(value) ? value : [];
    const newValue = currentValue.filter((_: any, idx: number) => idx !== index);
    setValue(newValue);
  };

  const ProductList = useMemo(
    () => (
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <button
            type="button"
            onClick={() => toggleModal('select-product-new')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007cba',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Añadir Producto
          </button>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ccc', width: '10%' }}>Orden</th>
              <th style={{ borderBottom: '1px solid #ccc', width: '60%' }}>Producto</th>
              <th style={{ borderBottom: '1px solid #ccc', width: '15%' }}>Precio</th>
              <th style={{ borderBottom: '1px solid #ccc', width: '15%' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {selectedProducts?.map((product, idx) => (
              <tr
                key={`product_${product.id}`}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, idx)}
                style={{
                  cursor: 'move',
                  backgroundColor: draggedIndex === idx ? '#f0f0f0' : 'transparent',
                }}
              >
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <span style={{ fontSize: '1.2em' }}>⋮⋮</span>
                  {idx + 1}
                </td>
                <td style={{ padding: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Image
                      src={(product?.image as Media) ? `/media/${(product?.image as Media)?.filename}` : '/logo-default-image.png'}
                      alt={(product?.image as Media)?.alt || product.title}
                      width={50}
                      height={50}
                      className="object-cover"
                    />
                    <div>
                      <strong>{product.title}</strong>
                      <div>{(product.brand as Brand)?.title}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  {product.price.toFixed(2)}€
                </td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => removeProduct(idx)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Modal slug="select-product-new" style={modalStyles}>
          <ProductSearchModal
            onSelect={addProduct}
            modalSlug="select-product-new"
          />
        </Modal>
      </div>
    ),
    [selectedProducts, draggedIndex, toggleModal, value, setValue]
  );

  return ProductList;
};

export default ProductSelectField;