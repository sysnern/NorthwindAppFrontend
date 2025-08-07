import axios from "axios";
import { toast } from 'react-toastify';
import config from '../config/config';

// Request deduplication için cache
const pendingRequests = new Map();
const responseCache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 dakika

// Ana axios instance - interceptor'lar ile
const api = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

// Deduplication için ayrı axios instance - interceptor'sız
const deduplicationApi = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request deduplication fonksiyonu - düzeltildi
const deduplicateRequest = async (config) => {
  const requestKey = `${config.method}:${config.url}:${JSON.stringify(config.params || {})}:${JSON.stringify(config.data || {})}`;
  
  // Cache'den kontrol et
  const cachedResponse = responseCache.get(requestKey);
  if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_DURATION) {
    return cachedResponse.data;
  }
  
  // Pending request kontrol et
  if (pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey);
  }
  
  // Yeni request oluştur - deduplicationApi kullan (interceptor'sız)
  const requestPromise = deduplicationApi.request(config).then(response => {
    // Cache'e kaydet
    responseCache.set(requestKey, {
      data: response,
      timestamp: Date.now()
    });
    pendingRequests.delete(requestKey);
    return response;
  }).catch(error => {
    pendingRequests.delete(requestKey);
    throw error;
  });
  
  pendingRequests.set(requestKey, requestPromise);
  return requestPromise;
};

// Request interceptor - sadece ana api instance için
api.interceptors.request.use(
  (config) => {
    // Add loading indicator
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('api-request-start'));
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - sadece ana api instance için
api.interceptors.response.use(
  (response) => {
    // Remove loading indicator
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('api-request-end'));
    }
    return response;
  },
  (error) => {
    // Remove loading indicator
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('api-request-end'));
    }

    let message = 'Bir hata oluştu';
    
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          message = data?.message || 'Geçersiz istek';
          break;
        case 401:
          message = 'Yetkilendirme hatası';
          break;
        case 403:
          message = 'Bu işlem için yetkiniz yok';
          break;
        case 404:
          message = 'İstenen kaynak bulunamadı';
          break;
        case 409:
          message = data?.message || 'Çakışma hatası';
          break;
        case 422:
          message = data?.message || 'Geçersiz veri';
          break;
        case 500:
          message = 'Sunucu hatası';
          break;
        default:
          message = data?.message || `Hata: ${status}`;
      }
    } else if (error.request) {
      // Network error
      message = 'Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin.';
    } else {
      // Other error
      message = error.message || 'Bilinmeyen hata';
    }

    // Show error toast
    if (typeof window !== 'undefined' && window.toast) {
      window.toast.error(message);
    } else {
      try { 
        toast.error(message); 
      } catch (e) {
        // Ignore toast errors
      }
    }
    
    return Promise.reject(error);
  }
);

// Cache temizleme fonksiyonu
export const clearCache = () => {
  responseCache.clear();
  pendingRequests.clear();
};

// CRUD işlemlerinden sonra cache temizleme
export const invalidateCache = () => {
  clearCache();
};

// Deduplicated API methods - interceptor'sız
export const deduplicatedApi = {
  get: (url, config = {}) => deduplicateRequest({ ...config, method: 'GET', url }),
  post: (url, data, config = {}) => deduplicateRequest({ ...config, method: 'POST', url, data }),
  put: (url, data, config = {}) => deduplicateRequest({ ...config, method: 'PUT', url, data }),
  delete: (url, config = {}) => deduplicateRequest({ ...config, method: 'DELETE', url }),
  patch: (url, data, config = {}) => deduplicateRequest({ ...config, method: 'PATCH', url, data })
};

// Normal API methods - interceptor'lı (CRUD işlemleri için)
export const normalApi = {
  get: (url, config = {}) => api.get(url, config),
  post: (url, data, config = {}) => api.post(url, data, config),
  put: (url, data, config = {}) => api.put(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
  patch: (url, data, config = {}) => api.patch(url, data, config)
};

export default api;
