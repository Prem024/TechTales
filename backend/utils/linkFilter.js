import dotenv from 'dotenv';
dotenv.config();

/**
 * Extracts unique URLs starting with http://, https://, or www. from a block of text.
 * Converts www. urls to http://www. format for API lookup.
 * @param {string} text 
 * @returns {string[]} List of normalized URLs
 */
export const extractUrls = (text) => {
    if (!text) return [];
    // Matches urls starting with http://, https://, www., or standard domain URLs
    const URL_REGEX = /(?:https?:\/\/|www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/gi;
    const matches = text.match(URL_REGEX) || [];
    
    return [...new Set(matches.map(url => {
        if (!url.toLowerCase().startsWith('http://') && !url.toLowerCase().startsWith('https://')) {
            return `http://${url}`;
        }
        return url;
    }))];
};

/**
 * Checks a list of URLs against Google Safe Browsing Lookup API (v4).
 * If any of the URLs are flagged, returns them.
 * Fail-open design: if API key is missing or request fails, allows the request to proceed.
 * 
 * @param {string[]} urls - The list of URLs to verify
 * @returns {Promise<{hasMaliciousLinks: boolean, foundLinks: string[]}>}
 */
export const checkUrlsWithSafeBrowsing = async (urls) => {
    if (!urls || urls.length === 0) {
        return { hasMaliciousLinks: false, foundLinks: [] };
    }

    const apiKey = process.env.SAFE_BROWSING_API_KEY;
    if (!apiKey) {
        console.warn("WARNING: SAFE_BROWSING_API_KEY is not defined in environment variables. Safe Browsing checks will be skipped.");
        return { hasMaliciousLinks: false, foundLinks: [] };
    }

    const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;

    const payload = {
        client: {
            clientId: "blog-website-backend",
            clientVersion: "1.0.0"
        },
        threatInfo: {
            threatTypes: [
                "MALWARE", 
                "SOCIAL_ENGINEERING", 
                "UNWANTED_SOFTWARE", 
                "POTENTIALLY_HARMFUL_APPLICATION"
            ],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: urls.map(url => ({ url }))
        }
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error(`Google Safe Browsing API returned HTTP status ${response.status}`);
            return { hasMaliciousLinks: false, foundLinks: [] };
        }

        const data = await response.json();
        
        if (data.matches && data.matches.length > 0) {
            const foundLinks = data.matches.map(match => match.threat.url);
            return {
                hasMaliciousLinks: true,
                foundLinks: [...new Set(foundLinks)]
            };
        }
        
        return { hasMaliciousLinks: false, foundLinks: [] };
    } catch (error) {
        console.error("Failed to connect to Google Safe Browsing API:", error);
        return { hasMaliciousLinks: false, foundLinks: [] };
    }
};
