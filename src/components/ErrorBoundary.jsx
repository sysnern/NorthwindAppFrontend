import React from 'react';
import { Alert, Button, Container } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      // Development ortamında hata loglaması devre dışı bırakıldı
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="py-5">
          <div className="text-center">
            <Alert variant="danger">
              <Alert.Heading>
                <i className="bi bi-exclamation-triangle me-2"></i>
                Bir hata oluştu
              </Alert.Heading>
              <p>
                Uygulama beklenmeyen bir hata ile karşılaştı. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
                  <summary>Hata Detayları</summary>
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </details>
              )}
              <hr />
              <Button variant="outline-danger" onClick={this.handleReload}>
                <i className="bi bi-arrow-clockwise me-2"></i>
                Sayfayı Yenile
              </Button>
            </Alert>
          </div>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 