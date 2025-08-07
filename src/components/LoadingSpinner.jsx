import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ 
  size = 'border', 
  variant = 'primary', 
  text = 'Yükleniyor...',
  className = '',
  fullScreen = false 
}) => {
  const spinner = (
    <div className={`text-center ${fullScreen ? 'vh-100 d-flex align-items-center justify-content-center' : 'py-5'} ${className}`}>
      <Spinner animation={size} variant={variant} role="status">
        <span className="visually-hidden">{text}</span>
      </Spinner>
      {text && (
        <div className="mt-2 text-muted">
          {text}
        </div>
      )}
    </div>
  );

  return spinner;
};

export default LoadingSpinner; 