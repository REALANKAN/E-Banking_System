import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  
  // Features for the rotating highlight
  const features = [
    "Bank-grade security protocols",
    "Zero-fee international transfers",
    "Intelligent spending insights",
    "24/7 dedicated customer support"
  ];
  
  // Animation effects when component mounts
  useEffect(() => {
    setIsLoaded(true);
    
    // Rotate featured text every 3 seconds
    const featureInterval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    
    return () => clearInterval(featureInterval);
  }, []);

  return (
    <div className="home-container d-flex flex-column justify-content-center align-items-center vh-100 position-relative overflow-hidden" 
         style={{ 
           background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
           backgroundSize: "cover"
         }}>
      {/* Animated background elements */}
      <div className="position-absolute top-0 end-0 mt-3 me-3 d-none d-md-block">
        <div className="bg-primary rounded-circle" 
             style={{ 
               width: "350px", 
               height: "350px", 
               opacity: "0.05", 
               transform: `translateX(${isLoaded ? '150px' : '300px'})`,
               transition: "all 1.2s ease-out"
             }}></div>
      </div>
      <div className="position-absolute bottom-0 start-0 d-none d-md-block">
        <div className="bg-secondary rounded-circle" 
             style={{ 
               width: "250px", 
               height: "250px", 
               opacity: "0.05", 
               transform: `translateY(${isLoaded ? '100px' : '200px'})`,
               transition: "all 1.2s ease-out 0.3s"
             }}></div>
      </div>
      
      {/* Floating dots decoration */}
      <div className="position-absolute" style={{ top: "15%", left: "15%", zIndex: 0 }}>
        <div className="bg-primary rounded-circle" style={{ width: "10px", height: "10px", opacity: "0.2" }}></div>
      </div>
      <div className="position-absolute" style={{ top: "30%", right: "20%", zIndex: 0 }}>
        <div className="bg-warning rounded-circle" style={{ width: "8px", height: "8px", opacity: "0.2" }}></div>
      </div>
      <div className="position-absolute" style={{ bottom: "25%", left: "25%", zIndex: 0 }}>
        <div className="bg-info rounded-circle" style={{ width: "12px", height: "12px", opacity: "0.2" }}></div>
      </div>

      {/* Main content card with enhanced animation */}
      <div className={`card shadow-lg text-center p-4 p-md-5 ${isLoaded ? 'opacity-100 transform-none' : 'opacity-0 translate-y-25'}`} 
           style={{ 
             maxWidth: "800px", 
             borderRadius: "24px", 
             transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
             border: "none",
             boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
             transform: isLoaded ? 'translateY(0)' : 'translateY(25px)',
             zIndex: 10
           }}>
        {/* Premium badge */}
        <div className="position-absolute" 
             style={{ 
               top: "-15px", 
               right: "-15px",
               opacity: isLoaded ? 1 : 0,
               transition: "opacity 0.5s ease-in 1.2s"
             }}>
          <div className="bg-warning text-dark fw-bold small py-1 px-3 rounded-pill shadow-sm">
            <i className="bi bi-star-fill me-1"></i> Premium Banking
          </div>
        </div>
        
        {/* Enhanced header section */}
        <div className="mb-4">
          <div className="d-flex justify-content-center align-items-center mb-3">
            <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3" 
                 style={{ 
                   transition: "all 0.5s ease",
                   transform: isLoaded ? 'scale(1)' : 'scale(0.8)'
                 }}>
              <i className="bi bi-bank text-primary fs-1"></i>
            </div>
            <h1 className="text-primary fw-bold mb-0" style={{ fontSize: "2.5rem" }}>E-Banking</h1>
          </div>
          <p className="text-muted fw-light mb-0" style={{ fontSize: "1.1rem" }}>
            Your trusted and secure online banking solution
          </p>
        </div>

        {/* Animated tagline with rotating features */}
        <div className="bg-gradient-light p-4 rounded-4 mb-4 border-start border-primary border-4"
             style={{ 
               background: "linear-gradient(90deg, rgba(13, 110, 253, 0.05) 0%, rgba(255, 255, 255, 0.5) 100%)",
               transition: "all 0.3s ease"
             }}>
          <p className="mb-0 text-dark fw-medium" style={{ fontSize: "1.15rem" }}>
            Experience seamless transactions with
            <span className="d-inline-block position-relative mx-2 text-primary fw-semibold"
                  style={{ minWidth: "220px" }}>
              {features.map((feature, index) => (
                <span 
                  key={index}
                  className="position-absolute start-0 w-100"
                  style={{ 
                    opacity: currentFeature === index ? 1 : 0,
                    transform: currentFeature === index ? 'translateY(0)' : 'translateY(10px)',
                    transition: "all 0.5s ease",
                  }}>
                  {feature}
                </span>
              ))}
            </span>
          </p>
        </div>

        {/* Improved Call-to-Action Buttons */}
        <div className="d-flex flex-column flex-md-row justify-content-center gap-3 mb-4">
          <Link 
            to="/login" 
            className="btn btn-primary btn-lg px-4 py-3 shadow-sm fw-medium position-relative overflow-hidden"
            style={{ 
              borderRadius: "12px",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <i className="bi bi-box-arrow-in-right me-2"></i>Login to Your Account
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-white" 
                 style={{ 
                   opacity: "0.1",
                   transform: "translateX(-100%)",
                   transition: "transform 0.5s ease"
                 }}></div>
          </Link>
          <Link 
            to="/register" 
            className="btn btn-outline-primary btn-lg px-4 py-3 fw-medium position-relative overflow-hidden"
            style={{ 
              borderRadius: "12px",
              borderWidth: "2px",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <i className="bi bi-person-plus me-2"></i>Create New Account
          </Link>
        </div>

        {/* Enhanced Features Section with Hover Effects */}
        <div className="mt-2 text-start">
          <h4 className="text-dark fw-bold mb-3 d-flex align-items-center">
            <span className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
              <i className="bi bi-check2-circle text-primary"></i>
            </span>
            Why Choose Our E-Banking Platform
          </h4>
          <div className="row g-3">
            {[
              {
                icon: "bi-shield-lock-fill",
                title: "Enhanced Security",
                description: "End-to-end encryption and multi-factor authentication for your peace of mind",
                bgClass: "bg-primary bg-opacity-5"
              },
              {
                icon: "bi-clock-history",
                title: "24/7 Access",
                description: "Manage your finances anytime, anywhere with our always-on platform",
                bgClass: "bg-success bg-opacity-5"
              },
              {
                icon: "bi-lightning-charge-fill",
                title: "Instant Transfers",
                description: "Send money in seconds with our quick transfer technology",
                bgClass: "bg-warning bg-opacity-5"
              },
              {
                icon: "bi-graph-up-arrow",
                title: "Smart Analytics",
                description: "Track and analyze your spending with personalized financial insights",
                bgClass: "bg-info bg-opacity-5"
              }
            ].map((feature, index) => (
              <div className="col-md-6" key={index}>
                <div 
                  className={`p-4 rounded-4 h-100 border ${feature.bgClass} d-flex flex-column`}
                  style={{ 
                    transition: "all 0.3s ease",
                    transform: `translateY(${isLoaded ? '0' : '20px'})`,
                    opacity: isLoaded ? 1 : 0,
                    transitionDelay: `${0.3 + index * 0.1}s`,
                    cursor: "pointer",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.03)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.03)';
                  }}
                >
                  <div className="d-flex align-items-center mb-2">
                    <div className="text-primary me-3">
                      <i className={`bi ${feature.icon} fs-3`}></i>
                    </div>
                    <h5 className="mb-0 fw-semibold">{feature.title}</h5>
                  </div>
                  <p className="text-muted small mb-0">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Trust indicators */}
        <div className="mt-4 pt-3 border-top">
          <div className="d-flex justify-content-center align-items-center flex-wrap gap-4">
            <div className="d-flex align-items-center px-3 py-2 rounded-pill bg-light">
              <i className="bi bi-patch-check-fill text-primary me-2 fs-5"></i>
              <span className="text-dark fw-medium">ISO 27001 Certified</span>
            </div>
            <div className="d-flex align-items-center px-3 py-2 rounded-pill bg-light">
              <i className="bi bi-people-fill text-primary me-2 fs-5"></i>
              <span className="text-dark fw-medium">2M+ Satisfied Users</span>
            </div>
            <div className="d-flex align-items-center px-3 py-2 rounded-pill bg-light">
              <i className="bi bi-headset text-primary me-2 fs-5"></i>
              <span className="text-dark fw-medium">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <div className="mt-4 text-center small text-dark py-2 px-4 rounded-pill bg-white bg-opacity-75 shadow-sm">
        <p className="mb-0">
          © 2025 E-Banking. All rights reserved. 
          <Link to="/terms" className="text-primary ms-2 text-decoration-none fw-medium">Terms</Link> · 
          <Link to="/privacy" className="text-primary mx-2 text-decoration-none fw-medium">Privacy</Link> ·
          <Link to="/help" className="text-primary text-decoration-none fw-medium">Help Center</Link>
        </p>
      </div>
    </div>
  );
}

export default Home;