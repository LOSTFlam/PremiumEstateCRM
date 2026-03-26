import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import PropertyView from 'views/admin/property/View';
import { getApi } from 'services/api';

/**
 * Wrapper component that finds a property by publicSlug and displays it
 */
export default function PropertyViewBySlug() {
  const { slug } = useParams();
  const [propertyId, setPropertyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const findPropertyBySlug = async () => {
      setLoading(true);
      try {
        const response = await getApi('api/property/public');
        const properties = Array.isArray(response) ? response : Array.isArray(response?.data) ? response.data : [];
        
        const property = properties.find(p => p?.publicSlug === slug || p?.seo?.slug === slug);
        
        if (property) {
          setPropertyId(property._id);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error finding property by slug:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    findPropertyBySlug();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: '#0F172A'
      }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          border: '4px solid rgba(212, 175, 55, 0.3)',
          borderTop: '4px solid #D4AF37',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (notFound || !propertyId) {
    return <Navigate to="/dashboard" replace />;
  }

  return <PropertyView />;
}
