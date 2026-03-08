import React from 'react';

const Header = () => {
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 1000,
      padding: '1.5rem 0',
      transition: 'var(--transition)',
      background: 'rgba(13, 13, 13, 0.8)',
      backdropFilter: 'blur(10px)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          fontFamily: "'Playfair Display', serif",
          color: 'var(--accent-color)',
          letterSpacing: '2px'
        }}>
          BITES
        </div>
        <nav>
          <ul style={{
            display: 'flex',
            listStyle: 'none',
            gap: '2.5rem'
          }}>
            {['Menu', 'Reservations', 'Locations', 'About'].map((item) => (
              <li key={item}>
                <a href={`#${item.toLowerCase()}`} style={{
                  textDecoration: 'none',
                  color: 'var(--text-primary)',
                  fontWeight: '400',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  transition: 'var(--transition)'
                }} className="nav-link">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
