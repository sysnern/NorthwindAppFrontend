# Northwind App Frontend

Modern React tabanlı Northwind veritabanı yönetim uygulaması.

## 🚀 Özellikler

- **CRUD İşlemleri**: Tüm entity'ler için tam CRUD desteği
- **Filtreleme ve Arama**: Gelişmiş filtreleme ve arama özellikleri
- **Sıralama**: Tüm kolonlar için sıralama desteği
- **Sayfalama**: Server-side pagination
- **Soft Delete**: `isDeleted` durumu ile soft delete
- **Responsive Design**: Mobile-first responsive tasarım
- **Error Handling**: Kapsamlı hata yönetimi
- **Loading States**: Global ve component-level loading states
- **Accessibility**: ARIA labels ve keyboard navigation

## 📋 Gereksinimler

- Node.js 16+
- npm veya yarn

## 🛠️ Kurulum

1. **Repository'yi klonlayın**
   ```bash
   git clone <repository-url>
   cd NorthwindAppFrontend
   ```

2. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   ```

3. **Environment dosyasını oluşturun**
   ```bash
   cp .env.example .env
   ```

4. **Uygulamayı başlatın**
   ```bash
   npm start
   ```

## 🔧 Konfigürasyon

### Environment Variables

`.env` dosyasında aşağıdaki değişkenleri tanımlayın:

```env
REACT_APP_API_URL=http://localhost:7137
```

### API Konfigürasyonu

`src/config/config.js` dosyasında API ayarlarını düzenleyebilirsiniz:

```javascript
const config = {
  api: {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:7137',
    timeout: 10000,
  },
  // ...
};
```

## 📁 Proje Yapısı

```
src/
├── components/          # Reusable components
│   ├── ErrorBoundary.jsx
│   ├── GlobalLoading.jsx
│   ├── LoadingSpinner.jsx
│   ├── Pagination.jsx
│   └── SortableHeader.jsx
├── config/             # Configuration files
│   ├── config.js
│   └── contact.js
├── pages/              # Page components
│   ├── HomePage.jsx
│   ├── ProductsPage.jsx
│   ├── CategoriesPage.jsx
│   ├── CustomersPage.jsx
│   ├── SuppliersPage.jsx
│   ├── EmployeesPage.jsx
│   └── OrdersPage.jsx
├── services/           # API services
│   ├── api.js
│   ├── ProductService.js
│   ├── CategoryService.js
│   ├── CustomerService.js
│   ├── SupplierService.js
│   ├── EmployeeService.js
│   └── OrderService.js
├── utils/              # Utility functions
│   └── validation.js
└── App.jsx            # Main app component
```

## 🎯 Kullanılan Teknolojiler

- **React 19**: Modern React hooks ve functional components
- **React Router**: Client-side routing
- **React Bootstrap**: UI component library
- **Axios**: HTTP client
- **Formik + Yup**: Form management ve validation
- **React Toastify**: Toast notifications
- **React Icons**: Icon library

## 🔍 API Endpoints

Uygulama aşağıdaki API endpoint'lerini kullanır:

- `GET /api/Product/list` - Ürün listesi
- `POST /api/Product/create` - Yeni ürün
- `PUT /api/Product/update` - Ürün güncelleme
- `DELETE /api/Product/delete/{id}` - Ürün silme

Benzer endpoint'ler diğer entity'ler için de mevcuttur.

## 🚀 Build ve Deploy

### Development
```bash
npm start
```

### Production Build
```bash
npm run build
```

### Test
```bash
npm test
```

## 🐛 Hata Ayıklama

### Yaygın Sorunlar

1. **API Bağlantı Hatası**
   - Backend'in çalıştığından emin olun
   - API URL'ini kontrol edin
   - CORS ayarlarını kontrol edin

2. **Filtreleme Çalışmıyor**
   - Backend'de filtreleme desteğinin olduğundan emin olun
   - API parametrelerini kontrol edin

3. **Loading State Sorunları**
   - Network tab'ını kontrol edin
   - API response'larını kontrol edin

## 📝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 İletişim

- **Email**: info@northwindapp.com
- **Telefon**: +90 (212) 123 45 67
- **Adres**: Örnek Mah. 123. Sok. No:45, İstanbul, Türkiye