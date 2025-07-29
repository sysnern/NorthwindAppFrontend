import React from 'react';
import { Container, Row, Col, Button, Card, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <>
      {/* --- HERO SECTION --- */}
      <div
        className="py-5 text-white text-center"
        style={{
          backgroundImage: 'url(https://via.placeholder.com/1200x400)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container>
          <h1 className="display-3 fw-bold">NorthwindApp</h1>
          <p className="lead">Modern Frontend Alt Yapınızla Tanışın</p>
          <Button as={Link} to="/products" size="lg" variant="light">
            Ürünleri Görüntüle
          </Button>
        </Container>
      </div>

      {/* --- MODÜLLER SECTION --- */}
      <Container className="py-5">
        <h2 className="mb-4 text-center">Modüller</h2>
        <Row className="g-4">
          {[
            { to: '/products',   title: 'Ürünler',     icon: 'bi-box-seam' },
            { to: '/categories', title: 'Kategoriler', icon: 'bi-tags' },
            { to: '/customers',  title: 'Müşteriler',  icon: 'bi-people' },
            { to: '/suppliers',  title: 'Tedarikçiler',icon: 'bi-truck' },
            { to: '/employees',  title: 'Çalışanlar',  icon: 'bi-person-badge' },
            { to: '/orders',     title: 'Siparişler',  icon: 'bi-card-checklist' },
          ].map(item => (
            <Col key={item.to} sm={6} md={4}>
              <Card className="h-100 text-center shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <i className={`bi ${item.icon} fs-1 text-primary mb-3`} />
                  <Card.Title>{item.title}</Card.Title>
                  <Button as={Link} to={item.to} variant="primary" className="mt-auto">
                    Git
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* --- HAKKIMIZDA SECTION --- */}
      <Container fluid className="py-5 bg-light">
        <Container>
          <Row className="align-items-center g-4">
            <Col md={6}>
              <Image
                src="https://via.placeholder.com/600x400"
                fluid
                rounded
                alt="Northwind"
              />
            </Col>
            <Col md={6}>
              <h2>Hakkımızda</h2>
              <p>
                NorthwindApp, popüler Northwind veritabanını modern bir .NET Core Web API ve React tabanlı şık
                bir ön uç arayüzü ile birleştiren bir uygulamadır. Ürün, kategori, müşteri, tedarikçi, çalışan ve sipariş
                yönetimi modülleri ile işletmenizin tüm ihtiyaçlarına kapsamlı çözümler sunar.
              </p>
            </Col>
          </Row>
        </Container>
      </Container>

      {/* --- İLETİŞİM SECTION --- */}
      <Container className="py-5">
        <h2 className="text-center mb-4">İletişim</h2>
        <Row className="justify-content-center">
          <Col md={8}>
            <p><strong>Adres:</strong> Örnek Mah. 123. Sok. No:45, İstanbul, Türkiye</p>
            <p><strong>Telefon:</strong> +90 (212) 123 45 67</p>
            <p><strong>Email:</strong> info@northwindapp.com</p>
          </Col>
        </Row>
      </Container>

      {/* --- FOOTER --- */}
      <footer className="bg-dark text-white text-center py-3">
        <Container>
          © {new Date().getFullYear()} NorthwindApp. Tüm hakları saklıdır.
        </Container>
      </footer>
    </>
  );
}
