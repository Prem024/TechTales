import { checkUrlsWithSafeBrowsing } from "./utils/linkFilter.js";

// Mock the global fetch function
const originalFetch = global.fetch;

const mockFetchResponse = (responseBody, status = 200) => {
    global.fetch = async (url, options) => {
        return {
            ok: status >= 200 && status < 300,
            status,
            json: async () => responseBody
        };
    };
};

const runMockTests = async () => {
    console.log("--- Starting Safe Browsing Mock Tests ---");

    // Set a dummy API key in env to pass the check
    process.env.SAFE_BROWSING_API_KEY = "mock-api-key";

    // Test 1: Clean URLs (Google Safe Browsing returns {} or empty matches when no threats are found)
    console.log("\nTest 1: Testing clean URL...");
    mockFetchResponse({});
    const cleanCheck = await checkUrlsWithSafeBrowsing(["https://google.com"]);
    console.log("Expected: { hasMaliciousLinks: false, foundLinks: [] }");
    console.log("Actual:  ", cleanCheck);

    // Test 2: Malicious URL detected (Safe Browsing returns threat matches)
    console.log("\nTest 2: Testing malicious URL...");
    const maliciousUrl = "http://testsafebrowsing.appspot.com/apiv4/ANY_PLATFORM/MALWARE/URL/";
    mockFetchResponse({
        matches: [
            {
                threatType: "MALWARE",
                platformType: "ANY_PLATFORM",
                threat: { url: maliciousUrl },
                threatEntryType: "URL"
            }
        ]
    });
    const malwareCheck = await checkUrlsWithSafeBrowsing([maliciousUrl]);
    console.log(`Expected: { hasMaliciousLinks: true, foundLinks: [ '${maliciousUrl}' ] }`);
    console.log("Actual:  ", malwareCheck);

    // Restore fetch
    global.fetch = originalFetch;
    console.log("\n--- Safe Browsing Mock Tests Complete ---");
};

runMockTests().catch(err => {
    console.error("Mock test failed:", err);
});
