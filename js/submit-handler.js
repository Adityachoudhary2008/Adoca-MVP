/**
 * Adoca Services - Data Submission Handler (Industrial Grade)
 */

const submitHandler = {
    GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwJzFo4d-at3DPmXR8UorY_pd8u7RI3ydhrqdxDb2N20f4khVEP3euFK4FdZYVU_TZl/exec',
    TARGET_EMAIL: 'adoca.tools@gmail.com',
    RETRY_LIMIT: 3,
    OFFLINE_QUEUE_KEY: 'adoca_offline_queue',

    async send(data) {
        console.info("ADOCA TITAN: Processing submission...");

        const payload = {
            ...data,
            id: utils.generateId(),
            targetEmail: this.TARGET_EMAIL,
            submittedAt: new Date().toISOString(),
            status: 'pending'
        };

        // 1. Validation Layer
        if (!utils.isValidPhone(payload.phone)) {
            return { success: false, error: "Please enter a valid phone number (+91 or 10 digits)." };
        }

        // 2. Network Check & Queueing
        if (!navigator.onLine) {
            this.addToQueue(payload);
            return { success: true, offline: true, message: "Offline. Request queued." };
        }

        return await this.executeWithRetry(payload);
    },

    async executeWithRetry(payload, attempt = 1) {
        try {
            const res = await fetch(this.GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify(payload)
            });

            // If we're here, no-cors opacity handles it as success (browser limitation)
            return { success: true, id: payload.id };
        } catch (err) {
            if (attempt < this.RETRY_LIMIT) {
                console.warn(`Retry attempt ${attempt} for ${payload.id}`);
                await new Promise(r => setTimeout(r, 2000 * attempt));
                return this.executeWithRetry(payload, attempt + 1);
            }
            this.addToQueue(payload);
            return { success: false, error: "Connection failed. Request queued for later." };
        }
    },

    addToQueue(payload) {
        const queue = JSON.parse(localStorage.getItem(this.OFFLINE_QUEUE_KEY) || '[]');
        queue.push(payload);
        localStorage.setItem(this.OFFLINE_QUEUE_KEY, JSON.stringify(queue));
        window.addEventListener('online', () => this.processQueue(), { once: true });
    },

    async processQueue() {
        const queue = JSON.parse(localStorage.getItem(this.OFFLINE_QUEUE_KEY) || '[]');
        if (queue.length === 0) return;

        console.info(`Processing ${queue.length} queued requests...`);
        const remaining = [];

        for (const item of queue) {
            const res = await this.executeWithRetry(item);
            if (!res.success) remaining.push(item);
        }

        localStorage.setItem(this.OFFLINE_QUEUE_KEY, JSON.stringify(remaining));
        if (remaining.length === 0) {
            console.log("Offline queue cleared successfully.");
        }
    }
};

// Initial queue check
window.addEventListener('online', () => submitHandler.processQueue());
if (navigator.onLine) submitHandler.processQueue();
