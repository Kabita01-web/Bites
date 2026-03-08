import React from 'react';
import NavbarLight from './components/NavbarLight';
import Hero from './components/Hero';
import PopularMenu from './components/PopularMenu';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import './index.css';

function App() {
  return (
    <div className="app">
      <NavbarLight />
      <main>
        <Hero />
        <PopularMenu />
        <AboutSection />

        {/* Special Offer Section Interlude */}
        <section style={{
          background: 'var(--accent-color)',
          textAlign: 'center',
          color: 'white',
          padding: '6rem 0'
        }}>
          <div className="container fade-up">
            <h2 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '1rem' }}>Chef's Special Recommendation</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '2.5rem', opacity: 0.9 }}>Get 20% off on our Signature Seafood Platter every Weekend!</p>
            <button className="btn-primary" style={{ background: 'white', color: 'var(--accent-color)', border: 'none' }}>
              Claim Offer
            </button>
          </div>
        </section>

        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
