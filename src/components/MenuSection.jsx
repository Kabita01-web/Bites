import React from 'react';

const MenuItem = ({ name, description, price, image }) => (
    <div className="glass hover-scale" style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        height: '100%'
    }}>
        <div style={{
            width: '100%',
            height: '200px',
            borderRadius: '8px',
            overflow: 'hidden'
        }}>
            <img src={image} alt={name} style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
            }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{name}</h3>
            <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>{price}</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{description}</p>
    </div>
);

const MenuSection = ({ title, items }) => {
    return (
        <section id={title.toLowerCase().replace(' ', '-')} style={{ padding: '5rem 0' }}>
            <div className="container">
                <h2 style={{
                    fontSize: '3rem',
                    textAlign: 'center',
                    marginBottom: '3rem',
                    borderBottom: '2px solid var(--accent-color)',
                    display: 'inline-block',
                    position: 'relative',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    paddingBottom: '0.5rem'
                }}>
                    {title}
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2.5rem'
                }}>
                    {items.map((item, index) => (
                        <MenuItem key={index} {...item} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MenuSection;
