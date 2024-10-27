// FULL DISCLOSURE - spotify gives this code to you to use for the authorization code and a starting point for the get recs API,
// I would have zero idea where to start with all this otherwise
// I just needed to make it work with what I have. - MM

const output1 = document.getElementById('output-1');
const output2 = document.getElementById('output-2');

document.getElementById('api-1-btn').addEventListener('click', async () => {
    const generateRandomString = (length) => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const values = crypto.getRandomValues(new Uint8Array(length));
        return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    }

    const codeVerifier = generateRandomString(64); // Get a random string 64 chars long

    const sha256 = async (plain) => { // use SHA-256 algorithm to hash the plain text
        const encoder = new TextEncoder();
        const data = encoder.encode(plain);
        return window.crypto.subtle.digest('SHA-256', data);
    }

    const base64encode = (input) => { // base64 representation of the digest
        return btoa(String.fromCharCode(...new Uint8Array(input)))
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
    }

    const hashed = await sha256(codeVerifier); // do the encryption
    const codeChallenge = base64encode(hashed); // do the base 64 representation

    // NEXT WE NEED TO MAKE A REQ TO THE AUTHENTICATION API
    const clientId = '2ff984dff02b46f3a6df70a37f249bc4';
    const redirectUri = 'http://127.0.0.1:5500/part3.html';

    const scope = 'user-read-private user-read-email';
    const authUrl = new URL("https://accounts.spotify.com/authorize");

    window.localStorage.setItem('code_verifier', codeVerifier); // store the encrypted code value in local storage

    const params = {
        response_type: 'code',
        client_id: clientId,
        scope,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: redirectUri,
    }

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
});

// Function to exchange authorization code for access token
const getToken = async (code) => {
    const clientId = '2ff984dff02b46f3a6df70a37f249bc4';
    const redirectUri = 'http://127.0.0.1:5500/part3.html';
    const codeVerifier = localStorage.getItem('code_verifier');

    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: clientId,
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier,
        }),
    }

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', payload);
        const data = await response.json();

        output1.textContent = JSON.stringify(data, null, 2);

        if (data.access_token) {
            console.log("ACCESS TOKEN: " + data.access_token);
            localStorage.setItem('access_token', data.access_token);
        } else {
            output1.textContent = 'Error obtaining access token';
        }
    } catch (error) {
        console.error('Error:', error);
        output1.textContent = 'Error exchanging code for token';
    }
}

// EVENT LISTENER FOR SECOND API CALL TO GET TOKEN
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
        await getToken(code);
    }
});

document.getElementById('api-2-btn').addEventListener('click', async () => {
    const accessToken = localStorage.getItem('access_token'); // get the token from local storage

    // Define your recommendations parameters
    const seedGenres = 'pop,rock'; // Specify your seed genres
    // can also add other parameters like tracks and other stuff per docs
    const limit = 1; // Number of recommendations wanted, 1 for now

    const response = await fetch(`https://api.spotify.com/v1/recommendations?seed_genres=${seedGenres}&limit=${limit}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    const data = await response.json();
    output2.textContent = JSON.stringify(data, null, 2);


});
