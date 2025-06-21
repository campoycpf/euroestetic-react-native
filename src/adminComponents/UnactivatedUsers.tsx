'use client'
import React, { useEffect, useState } from 'react';
import { useDocumentEvents, usePayloadAPI } from '@payloadcms/ui';
import Link from 'next/link';

const UnactivatedUsers= () => {
  const [count, setCount] = useState(0);
  const { mostRecentUpdate } = useDocumentEvents()

  const [{data}, {setParams}] = usePayloadAPI(
     '/api/app/users/inactive-professionals',
    { initialParams: { depth: 1 } }
  );

  useEffect(() => {
    if(data?.data?.totalDocs >= 0){
      setCount(data.data.totalDocs);
    }
  
  }, [data]);
  useEffect(() => {
    if(mostRecentUpdate){
      if(mostRecentUpdate.entitySlug === 'users') {
        setParams({ depth: new Date().getTime()})
      }
    }
  }, [mostRecentUpdate]);

  return (
    <div className="dashboard-card" style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      padding: '16px',
      margin: '12px 0',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}>
      <Link 
        href="/admin/collections/users?where[and][0][role][equals]=pro&where[and][1][activated][equals]=false" 
        style={{ 
          textDecoration: 'none',
          display: 'block',
          width: '100%',
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px',
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: count > 0 ? '#e53935' : '#4caf50',
            marginBottom: '8px',
          }}>
            {count}
          </div>
          <div style={{
            fontSize: '16px',
            color: '#333333',
            textAlign: 'center',
          }}>
            {count > 0 ? 
              `Profesional${count !== 1 ? 'es' : ''} sin activar` : 
              'Todos los profesionales activados'
            }
          </div>
          {count > 0 && (
            <div style={{
              backgroundColor: '#ffebee',
              color: '#e53935',
              borderRadius: '20px',
              padding: '6px 12px',
              fontSize: '14px',
              marginTop: '8px',
              fontWeight: '500',
            }}>
              Requiere atención
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default UnactivatedUsers;