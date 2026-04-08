import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const NavBar = () => {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('Not logged in');
            })
            .then(data => setUser(data.user))
            .catch(() => setUser(null));
    }, [router.pathname]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        router.push('/');
    };

    const isActive = (path) => router.pathname === path;

    return (
        <>
            <style jsx>{`
                .navbar {
                    background: white;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    padding: 0;
                    border-bottom: 3px solid #e91e63;
                }
                
                .navbar-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 1rem 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 3rem;
                }
                
                .brand {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #e91e63;
                    text-decoration: none;
                    transition: transform 0.2s;
                }
                
                .brand:hover {
                    transform: scale(1.05);
                }
                
                .nav-links {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }
                
                .nav-button {
                    background: #e91e63;
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: 600;
                    border: 2px solid #e91e63;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 1rem;
                    display: inline-block;
                }
                
                .nav-button:hover {
                    background: #c2185b;
                    border-color: #c2185b;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(233, 30, 99, 0.4);
                }
                
                .nav-button.active {
                    background: #c2185b;
                    border-color: #c2185b;
                }
            `}</style>

            <nav className="navbar">
                <div className="navbar-container">
                    <Link href="/" className="brand">
                        🏎️ Elite Motors
                    </Link>

                    <div className="nav-links">
                        <Link
                            href="/"
                            className={`nav-button ${isActive('/') ? 'active' : ''}`}
                        >
                            Home
                        </Link>

                        <Link
                            href="/products"
                            className={`nav-button ${isActive('/products') ? 'active' : ''}`}
                        >
                            Products
                        </Link>

                        {user && (
                            <Link
                                href="/dashboard"
                                className={`nav-button ${isActive('/dashboard') ? 'active' : ''}`}
                            >
                                Dashboard
                            </Link>
                        )}

                        {user ? (
                            <button onClick={handleLogout} className="nav-button">
                                Logout ({user.name})
                            </button>
                        ) : (
                            <Link href="/login" className="nav-button">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
};

export default NavBar;