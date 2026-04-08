import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                router.push('/dashboard');
            } else {
                const data = await res.json();
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="p-8 rounded-lg shadow-2xl w-full" style={{ maxWidth: '360px', backgroundColor: '#1e293b', border: '1px solid white', borderRadius: '8px', padding: '3rem 2rem' }}>
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2" style={{ color: 'white', fontSize: '2.25rem', fontWeight: 'bold' }}>Sign In</h1>
                    <p className="text-sm" style={{ color: '#9ca3af' }}>Enter your credentials to access your account</p>
                </div>

                {error && (
                    <div className="p-3 rounded mb-6 text-sm text-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="block mb-2 font-semibold text-sm" style={{ color: '#d1d5db', display: 'block' }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-4 rounded focus:outline-none transition-colors"
                            style={{ width: '100%', padding: '1rem', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '4px', color: '#111827' }}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block font-semibold text-sm" style={{ color: '#d1d5db', display: 'block' }}>
                                Password
                            </label>
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 rounded focus:outline-none transition-colors"
                            style={{ width: '100%', padding: '1rem', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '4px', color: '#111827' }}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full text-white p-4 rounded-lg font-bold shadow-md text-lg mt-4 uppercase tracking-wider"
                        style={{ width: '100%', backgroundColor: '#db2777', padding: '1rem', borderRadius: '8px', fontWeight: 'bold', marginTop: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none', cursor: 'pointer' }}
                    >
                        Sign In
                    </button>

                </form>

                <div className="mt-8 text-center" style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <p className="text-sm" style={{ color: '#9ca3af' }}>
                        Don't have an account? <span className="font-semibold cursor-pointer" style={{ color: '#ec4899', fontWeight: '600' }}>Sign up here</span>
                    </p>
                    <div className="mt-4" style={{ marginTop: '1rem' }}>
                        <Link href="/" style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none' }}>
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
