import { extractUrls, checkUrlsWithSafeBrowsing } from "./utils/linkFilter.js";

const runTests = async () => {
    console.log("--- Starting Safe Browsing Integration Tests ---");

    // Test 1: Extract URLs
    const testText = "Check this clean link: www.google.com and this malware: http://testsafebrowsing.appspot.com/apiv4/ANY_PLATFORM/MALWARE/URL/ and some trailing text.";
    const extracted = extractUrls(testText);
    console.log("\n1. Extracted URLs:", extracted);

    // Test 2: Verify safe browsing on clean link only
    console.log("\n2. Checking clean URL (https://google.com)...");
    const cleanCheck = await checkUrlsWithSafeBrowsing(["https://google.com"]);
    console.log("Result:", cleanCheck);

    // Test 3: Verify safe browsing on malware link
    const malwareLink = "http://testsafebrowsing.appspot.com/apiv4/ANY_PLATFORM/MALWARE/URL/";
    console.log(`\n3. Checking known malware URL (${malwareLink})...`);
    const malwareCheck = await checkUrlsWithSafeBrowsing([malwareLink]);
    console.log("Result:", malwareCheck);

    // Test 4: Verify combined list
    console.log("\n4. Checking combined list of clean and malware URLs...");
    const combinedCheck = await checkUrlsWithSafeBrowsing(extracted);
    console.log("Result:", combinedCheck);

    console.log("\n--- Safe Browsing Integration Tests Complete ---");
};

runTests().catch(err => {
    console.error("Test execution failed:", err);
});
