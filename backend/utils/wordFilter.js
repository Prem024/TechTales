// List of sensitive/profanity words that must match exactly as individual words
// (e.g., to prevent blocking "class", "glass", "unisex", "kill a process")
const STRICT_WORDS = [
    "ass",
    "sex",
    "kill",
    "whore",
    "slut",
    "rape",
    "anal",
    "hoe",
    "piss",
    "crap",
    "fag",
    "dyke",
    "kike",
    "coon",
    "gook",
    "retard",
    "nazi",
    "hitler"
];

// List of words that should be blocked if they appear anywhere as a substring
// (e.g., "fucking", "bullshit", "motherfucker", "pornography")
const SUBSTRING_WORDS = [
    "fuck",
    "shit",
    "bitch",
    "cunt",
    "dick",
    "pussy",
    "porn",
    "nude",
    "naked",
    "bastard",
    "nigger",
    "faggot",
    "suicide",
    "dumbass",
    "jackass",
    "wanker",
    "twat",
    "scumbag",
    "milf",
    "hentai",
    "blowjob",
    "handjob",
    "orgasm",
    "semen",
    "sperm",
    "vagina",
    "clitoris",
    "pedophile",
    "bestiality",
    "incest"
];

// Character mapping to detect common filter bypass techniques (leetspeak/punctuation)
const charMap = {
    'a': '[aA@4]',
    'b': '[bB8]',
    'c': '[cC]',
    'e': '[eE3]',
    'g': '[gG69]',
    'i': '[iI1!|l]',
    'l': '[lL1|i]',
    'o': '[oO0]',
    's': '[sS5$]',
    't': '[tT7+]',
    'u': '[uUvV\\*\\._-]',
    'x': '[xX]',
    'z': '[zZ2]'
};

/**
 * Generates a regular expression for a target word that detects variations
 * containing spaces, special characters, and leetspeak substitutions.
 */
const generateRegex = (word, strict = false) => {
    const letters = word.toLowerCase().split('');
    const regexParts = letters.map((char) => {
        return charMap[char] || `[${char}${char.toUpperCase()}]`;
    });
    
    // Allow optional spaces and special characters between letters
    const joinedPattern = regexParts.join('(?:\\s*|[^a-zA-Z0-9]*)*');
    
    if (strict) {
        // Must be bounded by word boundaries
        return new RegExp(`\\b${joinedPattern}\\b`, 'i');
    } else {
        // Can be a substring anywhere
        return new RegExp(joinedPattern, 'i');
    }
};

// Hardcoded custom regexes for special cases (e.g., "fucc" or repeated characters)
const customPatterns = [
    /\bf[uUvV\*\._\-1iI\s]+c{2,}\b/i, // detects 'fucc'
];

/**
 * Checks a given text for blocked words or variations.
 * @param {string} text - The content to inspect
 * @returns {object} - { hasBlockedWords: boolean, foundWords: string[] }
 */
export const checkContentForBlockedWords = (text) => {
    if (!text) return { hasBlockedWords: false, foundWords: [] };

    // Support adding custom blocked words dynamically from environment variables
    const envBlockedWords = process.env.BLOCKED_WORDS 
        ? process.env.BLOCKED_WORDS.split(',').map(w => w.trim().toLowerCase())
        : [];

    const allStrictWords = [...new Set([...STRICT_WORDS])];
    const allSubstringWords = [...new Set([...SUBSTRING_WORDS, ...envBlockedWords])];

    const foundWords = [];

    // 1. Check custom bypass patterns
    for (const pattern of customPatterns) {
        if (pattern.test(text)) {
            foundWords.push("profanity bypass (e.g., fucc)");
        }
    }

    // 2. Check strict words (word boundaries required)
    for (const word of allStrictWords) {
        const regex = generateRegex(word, true);
        if (regex.test(text)) {
            foundWords.push(word);
        }
    }

    // 3. Check substring words (can match inside other words)
    for (const word of allSubstringWords) {
        const regex = generateRegex(word, false);
        if (regex.test(text)) {
            foundWords.push(word);
        }
    }

    return {
        hasBlockedWords: foundWords.length > 0,
        foundWords: [...new Set(foundWords)]
    };
};
