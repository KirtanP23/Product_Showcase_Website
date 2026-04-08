import '../styles/globals.css';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

function MyApp({ Component, pageProps }) {
    return (
        <div className="app-container">
            <Header title="Elite Motors" />
            <NavBar />
            <main className="content">
                <Component {...pageProps} />
            </main>
            <Footer />
        </div>
    );
}

export default MyApp;