'use client'
import React, { useState } from 'react';
import { Modal, useFormFields, useModal } from '@payloadcms/ui';
import { useField } from '@payloadcms/ui';
import SearchIcon from '@/components/icons/SearchIcon';

const UserSearchModal: React.FC<{
  onSelect: (user: any) => void;
  modalSlug: string;
}> = ({ onSelect, modalSlug }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const { toggleModal } = useModal();

  const searchUsers = async (term: string) => {
    if (!term.trim()) {
      setUsers([]);
      return;
    }

    try {
      const response = await fetch(`/api/users?where[or][0][name][contains]=${term}&where[or][1][email][contains]=${term}&where[or][2][mailing_name][contains]=${term}&where[or][3][cif_dni_nie][contains]=${term}&where[role][in]=user,pro`);
      const data = await response.json();
      setUsers(data.docs);
    } catch (error) {
      console.error('Error buscando usuarios:', error);
    }
  };

  return (
    <div className="user-search-modal">
      <input
        type="text"
        placeholder="Buscar usuario..."
        onChange={(e) => {
          setSearchTerm(e.target.value);
          searchUsers(e.target.value);
        }}
        style={{ width: '100%', padding: '8px', marginBottom: '16px' }}
      />
      <div style={{ height: '400px', overflowY: 'auto' }}>
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => {
              onSelect(user);
              toggleModal(modalSlug);
            }}
            style={{ 
              padding: '8px', 
              cursor: 'pointer',
              borderBottom: '1px solid #eee',
            }}
          >
            <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
              <strong>{user.email}</strong>
              <div>{user.name || 'Sin nombre'}</div>
              <div>{user.cif_dni_nie || 'Sin CIF/DNI/NIE'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const UserSearchField: React.FC = () => {
  const { value } = useField<string>({ path: 'user_id' });
  const { dispatch } = useFormFields(([_, dispatch]) => ({ dispatch }));
  const { value: userId, setValue: setUserId } = useField({ path: 'user_id' });
  const { toggleModal } = useModal();
  const modalSlug = 'select-user';

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

  return (
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', width: '100px', flexWrap: 'wrap' }}>
        <label style={{ width: '100%' }}>ID Usuario:</label>
        <button
        type="button"
        onClick={() => toggleModal(modalSlug)}
        style={{ 
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #ccc',
          borderRadius: '5px',
          background: 'white',
          cursor: 'pointer'
        }}
      >
       <SearchIcon />
      </button>
      <input
        style={{ 
          padding: '10px', 
          borderRadius: '5px', 
          border: '1px solid #ccc',
          backgroundColor: '#f5f5f5',
          width: '50px'
        }}
        type="text"
        value={value || ''}
        disabled
      />
      
      <Modal slug={modalSlug} style={modalStyles}>
        <div>
          <button
            onClick={() => toggleModal(modalSlug)}
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
          <h2 style={{ marginBottom: '20px' }}>Seleccionar Usuario</h2>
          <UserSearchModal
            modalSlug={modalSlug}
            onSelect={(user) => {
              // Primero actualizamos todos los campos con sus nuevos valores
              const fieldsToUpdate = {
                'user_id': user.id,
                'cif_dni_nie': user.cif_dni_nie || '',

                // Billing fields in Orders.ts
                'customer': user.mailing_name || user.name || '',
                'mailing_address': user.mailing_address || user.address || '',
                'mailing_city': user.mailing_city || user.city || '',
                'mailing_cp': user.mailing_cp || user.cp || '',
                'mailing_province': user.mailing_province || user.province || '',

                // Shipping fields in Orders.ts (these are the ones named 'name', 'address', 'city', 'cp', 'province')
                'name': user.name || '', 
                'address': user.address || '', 
                'city': user.city || '',
                'cp': user.cp || '',
                'province': user.province || ''
              };

              // Actualizamos cada campo y forzamos el cambio usando siblingData
              Object.entries(fieldsToUpdate).forEach(([path, value]) => {
                dispatch({
                  type: 'UPDATE',
                  path,
                  value,
                });
              });
              //actualizamos el valor del campo user_id
              setUserId(user.id);
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default UserSearchField;