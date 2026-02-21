/**
 * Adoca Services - Data Submission Handler (Industrial Grade)
 */

const submitHandler = {
    // Replace with your actual production URLs
    GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwJzFo4d-at3DPmXR8UorY_pd8u7RI3ydhrqdxDb2N20f4khVEP3euFK4FdZYVU_TZl/exec',
    FORMSPREE_ENDPOINT: '',

    // Target email provided by user
    TARGET_EMAIL: 'adoca.tools@gmail.com',

    async send(data) {
        console.info("ADOCA TITAN: Processing submission for", data.category);

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
                // Matching the user's current script (JSON.parse version)
                await fetch(this.GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'text/plain' },
                    body: JSON.stringify(payload)
                });

                // no-cors always returns opaque response, so we certify success
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
