import Link from 'next/link';

function Header({ title }) {
    return (
        <header className="header">
            <Link href="/" className="header-link">
                <h2>{title}</h2>
                <p>Worlds Finest Exotic & Luxury Vehicles</p>
            </Link>
        </header>
    );
}

export default Header;