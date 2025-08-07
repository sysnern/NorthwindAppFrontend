import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';

const GlobalLoading = () => {
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    const handleRequestStart = () => {
      setRequestCount(prev => prev + 1);
      setIsLoading(true);
    };

    const handleRequestEnd = () => {
      setRequestCount(prev => {
        const newCount = prev - 1;
        if (newCount <= 0) {
          setIsLoading(false);
          return 0;
        }
        return newCount;
      });
    };

    window.addEventListener('api-request-start', handleRequestStart);
    window.addEventListener('api-request-end', handleRequestEnd);

    return () => {
      window.removeEventListener('api-request-start', handleRequestStart);
      window.removeEventListener('api-request-end', handleRequestEnd);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div className="bg-white p-4 rounded shadow-lg">
        <div className="d-flex align-items-center">
          <Spinner animation="border" variant="primary" size="sm" className="me-3" />
          <span>İşlem yapılıyor...</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoading; 