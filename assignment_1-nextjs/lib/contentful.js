// lib/contentful.js
import { createClient } from 'contentful';
import { createClient as createManagementClient } from 'contentful-management';

// Trim environment variables to handle any whitespace issues
const spaceId = process.env.CONTENTFUL_SPACE_ID?.trim();
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN?.trim();
const mgmtToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN?.trim();

console.log('Space ID:', spaceId);
console.log('Management Token exists:', !!mgmtToken);
console.log('Management Token length:', mgmtToken ? mgmtToken.length : 0);

export const client = createClient({
    space: spaceId,
    accessToken: accessToken,
});

export const managementClient = createManagementClient({
    accessToken: mgmtToken,
});

export default client;