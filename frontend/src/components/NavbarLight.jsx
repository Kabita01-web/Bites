import React, { useState } from 'react';

const NavbarLight = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const navItems = ['Home', 'Menu', 'About Us', 'Contact Us'];

    return (
        <>
            <nav className="navbar-light" style={{
                background: '#ffffff',
                boxShadow: '0 2px 15px rgba(0,0,0,0.05)',
                padding: '1rem 0',
                position: 'sticky',
                top: 0,
                zIndex: 1100,
                fontFamily: "'Poppins', sans-serif"
            }}>
                <div className="container" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    {/* Left Side: Logo */}
                    <div style={{
                        fontSize: '1.8rem',
                        fontWeight: '700',
                        color: '#2c2c2c',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontFamily: "'Playfair Display', serif"
                    }}>
                        <span style={{ color: '#c19a6b' }}>●</span> BITES
                    </div>

                    {/* Center: Navigation Links (Desktop) */}
                    <div className="nav-center" style={{
                        display: 'flex',
                        gap: '2.5rem',
                        alignItems: 'center'
                    }}>
                        {navItems.map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase().replace(' ', '-')}`}
                                className="nav-link-light"
                                style={{
                                    color: '#333333',
                                    textDecoration: 'none',
                                    fontWeight: '500',
                                    fontSize: '0.95rem'
                                }}
                            >
                                {item}
                            </a>
                        ))}
                    </div>

                    {/* Right Side: Action Button & Toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button className="btn-primary desktop-only" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}>
                            Book a Table
                        </button>

                        {/* Mobile Menu Icon */}
                        <div
                            className="mobile-toggle"
                            onClick={toggleMobileMenu}
                            style={{ fontSize: '1.8rem', color: '#333', cursor: 'pointer' }}
                        >
                            {isMobileMenuOpen ? '✕' : '☰'}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation Overlay */}
            <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'active' : ''}`}>
                <div className="overlay-close" onClick={toggleMobileMenu}>✕</div>
                {navItems.map((item) => (
                    <a
                        key={item}
                        href={`#${item.toLowerCase().replace(' ', '-')}`}
                        onClick={toggleMobileMenu}
                        style={{ display: 'block' }}
                    >
                        {item}
                    </a>
                ))}
                <button className="btn-primary" style={{ marginTop: '2rem', width: '100%' }}>
                    Book a Table
                </button>
            </div>

            <style>{`
        @media (max-width: 768px) {
          .nav-center, .desktop-only {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-toggle {
            display: none !important;
          }
          .mobile-nav-overlay {
            display: none !important;
          }
        }
      `}</style>
        </>
    );
};

export default NavbarLight;
