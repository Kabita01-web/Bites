import React from 'react';

const dishes = [
    {
        name: "Truffle Ribeye Steak",
        price: "$45",
        description: "45-day aged ribeye with black truffle butter and roasted garlic mash.",
        image: "https://images.unsplash.com/photo-1546241072-48010ad28c2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        name: "Wild Mushroom Risotto",
        price: "$28",
        description: "Creamy Arborio rice with porcini mushrooms, parmesan, and fresh herbs.",
        image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        name: "Pan Seared Scallops",
        price: "$32",
        description: "Diver scallops with pea purée, crispy pancetta, and lemon emulsion.",
        image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
];

const PopularMenu = () => {
    return (
        <section id="menu" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Our Popular Dishes</h2>
                    <div style={{ width: '60px', height: '3px', background: 'var(--accent-color)', margin: '0 auto' }}></div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '2.5rem'
                }}>
                    {dishes.map((dish, index) => (
                        <div key={index} className="fade-up" style={{
                            background: 'white',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-sm)',
                            transition: 'var(--transition)',
                            cursor: 'pointer'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                            }}
                        >
                            <div style={{ height: '240px', overflow: 'hidden' }}>
                                <img src={dish.image} alt={dish.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ padding: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>{dish.name}</h3>
                                    <span style={{ color: 'var(--accent-color)', fontWeight: '700', fontSize: '1.2rem' }}>{dish.price}</span>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{dish.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PopularMenu;
