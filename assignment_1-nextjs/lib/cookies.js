import { parse } from 'cookie';

export function parseCookies(req) {
    // For API routes
    if (req.cookies) return req.cookies;

    // For getServerSideProps or middleware
    const cookie = req.headers?.cookie;
    return parse(cookie || '');
}
