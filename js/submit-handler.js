/**
 * Adoca Services - Data Submission Handler (Industrial Grade)
 */

const submitHandler = {
    // Replace with your actual production URLs
    GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycby_6QoxEppI1r_pgBKp9MXzosCok2TLjYIla7b0I9lznZ79IP_In_2joXO8vhABrUzRtg/exec',
    FORMSPREE_ENDPOINT: '',

    // Target email provided by user
    TARGET_EMAIL: 'adoca.tools@gmail.com',

    async send(data) {
        console.log("Processing submission for:", data.category);

        const payload = {
            ...data,
            targetEmail: this.TARGET_EMAIL,
            submittedAt: new Date().toISOString(),
            source: window.location.href,
            ua: navigator.userAgent
        };

        const result = { success: false, error: null };

        // --- GOOGLE SHEETS SUBMISSION ---
        // If GOOGLE_SCRIPT_URL is provided, we use it as the primary channel.
        if (this.GOOGLE_SCRIPT_URL) {
            try {
                // Using text/plain to avoid CORS preflight (Simple Request)
                const response = await fetch(this.GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'text/plain' },
                    body: JSON.stringify(payload)
                });
                // Note: no-cors mode always returns opaque response (status 0), 
                // but we assume success if no exception is thrown.
                result.success = true;
            } catch (err) {
                console.error("Google Sheets Submission Error:", err);
                result.error = "Failed to connect to our database. Please check your internet.";
                return result;
            }
        }

        // --- EMAIL SUBMISSION (Fallback or Parallel) ---
        if (this.FORMSPREE_ENDPOINT) {
            try {
                const response = await fetch(this.FORMSPREE_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (response.ok) {
                    result.success = true;
                } else {
                    const errorData = await response.json();
                    result.error = errorData.error || "Email service rejected the request.";
                }
            } catch (err) {
                console.error("Email Submission Error:", err);
                result.error = "Network error while sending email. Please try again.";
            }
        }

        // --- LOCAL DEVELOPMENT / DEMO MODE ---
        // If no endpoints are configured, simulate a successful professional API response
        if (!this.GOOGLE_SCRIPT_URL && !this.FORMSPREE_ENDPOINT) {
            console.warn("No production endpoints found. Running in DEMO MODE.");
            await new Promise(resolve => setTimeout(resolve, 2000));
            result.success = true;
        }

        return result;
    }
};
