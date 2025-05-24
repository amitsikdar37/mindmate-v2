// OAuth logic for YouTube read-only access
const YOUTUBE_CLIENT_ID = '771587267837-20uum4ub5uquhnc5ccvj8ppr77t1g6pc.apps.googleusercontent.com'; 
const YOUTUBE_SCOPE = 'https://www.googleapis.com/auth/youtube.readonly';
const REDIRECT_URI = window.location.origin + window.location.pathname;

export function startYouTubeOAuth() {
    const authUrl =
        'https://accounts.google.com/o/oauth2/v2/auth' +
        '?client_id=' + encodeURIComponent(YOUTUBE_CLIENT_ID) +
        '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
        '&response_type=token' +
        '&scope=' + encodeURIComponent(YOUTUBE_SCOPE) +
        '&include_granted_scopes=true' +
        '&prompt=consent';
    window.location.href = authUrl;
}

export function extractAccessTokenFromUrl() {
    const hash = window.location.hash;
    if (hash && hash.includes('access_token=')) {
        const params = new URLSearchParams(hash.substring(1));
        return params.get('access_token');
    }
    return null;
}

export async function sendAccessTokenToBackend(token) {
    try {
        const res = await fetch('http://localhost:3000/api/youtube/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ access_token: token })
        });
        if (!res.ok) throw new Error('Failed to send token');
        return true;
    } catch (err) {
        console.error('Error sending token to backend:', err);
        return false;
    }
} 