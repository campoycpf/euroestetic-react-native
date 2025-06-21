'use client'
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useField, useForm, useFormFields, useWatchForm } from '@payloadcms/ui';
import type { ArrayFieldClientComponent} from 'payload'
// Removed duplicate useState import
import { Modal, useModal } from '@faceless-ui/modal';
import { Brand, Media, Product, User } from '@/payload-types'; // Added User type
import Image from 'next/image';
import SearchIcon from '@/components/icons/SearchIcon';

const OrderItemsTable: ArrayFieldClientComponent = ({path, field,...props}) => {
    const {rows} = useField({path, hasRows: true});
    const { addFieldRow, removeFieldRow } = useForm();
    const { dispatch} = useFormFields(([_,dispatch]) => ({dispatch}))
    const { fields } = useWatchForm(); // To get user_id from the main form
    const { value: currentTotal, setValue: setTotal } = useField({ path: 'total' });
    const { value: currentTotalIva, setValue: setTotalIva } = useField({ path: 'total_iva' });
    const { toggleModal } = useModal();

    const [userRole, setUserRole] = useState<User['role'] | null>(null); // State for user's role

    const userId = fields?.user_id?.value as string | undefined;

    useEffect(() => {
      const fetchUserRole = async () => {
        if (userId) {
          try {
            const response = await fetch(`/api/users/${userId}`);
            if (response.ok) {
              const userData: User = await response.json();
              setUserRole(userData.role);
            } else {
              console.error('Error fetching user data:', response.statusText);
              setUserRole(null); // Reset or handle error appropriately
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            setUserRole(null); // Reset or handle error appropriately
          }
        } else {
          setUserRole(null); // No user_id, so no specific role
        }
      };

      fetchUserRole();
    }, [userId]); // Re-run effect if userId changes

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

    /**
     * Obtengo los valores de order_items
     */
    const orderItems = useFormFields(([fields]) => 
        rows?.map((row, idx) => ({
            product_id: fields[`${path}.${idx}.product_id`]?.value || '',  // Add this line
            product_name: fields[`${path}.${idx}.product_name`]?.value || '',
            quantity: fields[`${path}.${idx}.quantity`]?.value || 0,
            price: fields[`${path}.${idx}.price`]?.value || 0,
        }))
    );

    // Add this component at the top of the file
    const ProductSearchModal: React.FC<{
      onSelect: (product: any) => void;
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
            {products.map((product: Product) => (
              <div
                key={product.id}
                onClick={() => {
                  onSelect(product);
                  toggleModal(modalSlug);
                }}
                style={{ 
                  padding: '8px', 
                  cursor: 'pointer',
                  borderBottom: '1px solid #eee',
                }}
              >
               <div style={{display: 'flex',gap: '10px', justifyContent: 'flex-start', alignItems: 'center'}}>
                    <Image src={(product?.image as Media) ? `/media/${(product?.image as Media)?.filename}`: '/logo-default-image.png'}
                        alt={(product?.image as Media)?.alt || product.title}
                        width={50}
                        height={50}
                        className="object-cover"
                    />
                    <div>           
                        <strong>{product.title}</strong>
                        <div>{userRole && userRole === 'pro' ? product.price_wholesale.toFixed(2) : product.price.toFixed(2)}€</div>
                        <div>{(product.brand as Brand).title}</div>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    };
    
    // Modify the input fields in OrderItemsList
    const OrderItemsList = useMemo(
      () => (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ccc', width:'8%', minWidth: '80px'}}>ID Producto</th>
              <th style={{ borderBottom: '1px solid #ccc', width:'65%'}}>Producto</th>
              <th style={{ borderBottom: '1px solid #ccc', width:'8%', minWidth: '80px' }}>Cantidad</th>
              <th style={{ borderBottom: '1px solid #ccc', width:'8%', minWidth: '80px' }}>Precio</th>
              <th style={{ borderBottom: '1px solid #ccc', width:'8%', minWidth: '80px' }}>Total</th>
              <th style={{ borderBottom: '1px solid #ccc' }}></th>
            </tr>
          </thead>
          <tbody>
            {orderItems?.map((item, idx) => (
              <tr key={`item_${idx}`}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                  <button
                      type="button"
                      onClick={() => toggleModal(`select-product-${idx}`)}
                      style={{ 
                        padding: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        background: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      <SearchIcon/>
                    </button>
                    <input
                      style={{ 
                        padding: '10px', 
                        borderRadius: '5px', 
                        border: '1px solid #ccc', 
                        textAlign:'center',
                        backgroundColor: '#f5f5f5'
                      }}
                      type="text"
                      value={item.product_id as string || ''}
                      disabled
                    />
                  </div>
                  
                  <Modal slug={`select-product-${idx}`} style={modalStyles} open={true}>
                  <div style={{ position: 'relative' }}>
                    <button
                    onClick={() => toggleModal(`select-product-${idx}`)}
                    style={{
                        position: 'absolute',
                        right: '10px',
                        top: '10px',
                        background: 'none',
                        border: 'none',
                        fontSize: '20px',
                        cursor: 'pointer'
                    }}
                    >
                    ×
                    </button>
                    <h2 style={{ marginBottom: '20px' }}>Seleccionar Producto</h2>
                    <ProductSearchModal
                      modalSlug={`select-product-${idx}`}
                      onSelect={(product) => {
                        let priceToSet = product.price; // Default to regular price
                        if (userRole === 'pro' && product.price_wholesale !== undefined) {
                          priceToSet = product.price_wholesale;
                        } else if (userRole === 'user' || !userRole) {
                          priceToSet = product.price;
                        }
                        // If product.price_wholesale is undefined for a 'pro' user, it will fall back to product.price
                        // or you might want to handle this case specifically, e.g., show an error or use a default.

                        dispatch({
                          type: 'UPDATE',
                          path: `${path}.${idx}.product_id`,
                          value: product.id
                        });
                        dispatch({
                          type: 'UPDATE',
                          path: `${path}.${idx}.product_name`,
                          value: product.title
                        });
                        dispatch({
                          type: 'UPDATE',
                          path: `${path}.${idx}.price`,
                          value: priceToSet // Use the determined price
                        });
                      }}
                    />
                    </div>
                  </Modal>
                </td>
                <td>
                  <input
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', textAlign:'center'}}
                    type="text"
                    value={item.product_name as string}
                    name='product_name'
                    onChange={(e) => updateItem(idx, e)}
                    />
                </td>
                <td>
                  <input
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', textAlign:'center'}}
                    type="number"
                    value={item.quantity as number}
                    min={1}
                    step={1}
                    name='quantity'
                    onChange={(e) => updateItem(idx, e)}
                    />
                </td>
                <td>
                  <input
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', textAlign:'center'}}
                    type="number"
                    value={item.price as number}
                    min={0}
                    step={0.01}
                    name='price'
                    onChange={(e) => updateItem(idx, e)}
                    />
                </td>
                <td>
                  <input
                    style={{ 
                      padding: '10px', 
                      borderRadius: '5px', 
                      border: '1px solid #ccc', 
                      width: '100%', 
                      textAlign:'center',
                      backgroundColor: '#f5f5f5'
                    }}
                    type="text"
                    value={`${((item.price as number) * (item.quantity as number)).toFixed(2)} €`}
                    disabled
                  />
                </td>
                <td>
                  <button type="button" onClick={() => removeRow(idx)} style={{ color: 'red', paddingInline: '8px', paddingBlock: '7px', cursor: 'pointer' }}>
                  ✕
                  </button>
                </td>
                </tr>
            ))}
          </tbody>
        </table>
      ),
      [orderItems]
    );
  
  // Extraer el IVA real
  const iva = typeof fields?.iva?.value === 'number' ? fields.iva.value : parseFloat(fields?.iva?.value as string) || 0;    
 
  const { subtotal, totalIva, total } = useMemo(() => {
    // El total con IVA es la suma de todos los items
    const totalConIva = (orderItems?.reduce((acc, item) => acc + (item.price as number) * (item.quantity as number), 0)) ?? 0;
    // Calculamos el subtotal (base imponible) dividiendo el total entre (1 + IVA/100)
    const subtotal = totalConIva / (1 + (iva / 100));
    // El IVA es la diferencia entre el total y el subtotal
    const totalIva = parseFloat((totalConIva - subtotal).toFixed(2));
    const total = parseFloat((totalConIva).toFixed(2));

    return { subtotal, totalIva, total };
  }, [orderItems, iva]);


  React.useEffect(() => {
    if (currentTotal !== total) {
        setTotal(total);
    }
    if (currentTotalIva !== totalIva) {
      setTotalIva(totalIva);
    }
  }, [total, totalIva, currentTotal, currentTotalIva]);

  const updateItem = (index: number, e:ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const key = e.target.name;
    
    // Actualizar el valor en el campo correspondiente
    dispatch({
      type: 'UPDATE',
      path: `${path}.${index}.${key}`,
      value: key === 'product_name' ? newValue : Number(newValue) || 0,
    });
  };

  const addRow = () => {
    const newIndex = orderItems?.length || 0;
    
    // Add the row structure first
    addFieldRow({
        path,
        rowIndex: newIndex,
        schemaPath: `${path}.${newIndex}`
    });

    // Then dispatch the default values
    dispatch({
      type: 'UPDATE',
      path: `${path}.${newIndex}.product_name`,
      value: ''
    });
    dispatch({
      type: 'UPDATE',
      path: `${path}.${newIndex}.quantity`,
      value: 1
    });
    dispatch({
      type: 'UPDATE',
      path: `${path}.${newIndex}.price`,
      value: 0
    });
  };

  const removeRow = (index: number) => {
    removeFieldRow({
        path,
        rowIndex: index,
      });
  };


  return (
    <div>
      {OrderItemsList}
      <button type="button" onClick={addRow} style={{padding: '8px'}}>
        + Añadir producto
      </button>
      <div style={{ display:'flex', gap:'20px', justifyContent: 'center', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', marginTop: '1rem' }}>
      <p><strong>Subtotal:</strong> {subtotal.toFixed(2)} €</p>
      <p><strong>IVA ({iva}%):</strong> {totalIva.toFixed(2)} €</p>
      <p><strong>Total:</strong> {total.toFixed(2)} €</p>
    </div>
    </div>
  );
};

export default OrderItemsTable;
