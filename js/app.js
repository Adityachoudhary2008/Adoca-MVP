/**
 * ADOCA MOBILE APP CORE (v11.0)
 * Philosophy: Native App Experience, Minimalist, Fast.
 * Logic: Preserves all v10.0 business logic.
 */

const app = {
    container: document.getElementById('app-container'),
    state: {
        type: null,
        category: null,
        sub: null,
        searchTerm: '',
        lastLocation: null,
        lang: localStorage.getItem('adoca_lang') || 'en',
        theme: localStorage.getItem('adoca_theme') || 'light'
    },

    init() {
        console.log("Adoca Mobile Engine Active | v11.0");
        this.applyTheme();
        this.handleRouting();
        window.addEventListener('popstate', () => this.handleRouting());
        this.setupServiceWorker();
        this.injectGlobalStyles();

        if (typeof lucide !== 'undefined') lucide.createIcons();
    },

    injectGlobalStyles() {
        // Apply tap feedback to all clickable elements
        document.body.addEventListener('touchstart', (e) => {
            const target = e.target.closest('.q-app-card, .q-btn-app, .q-nav-item');
            if (target) target.style.opacity = '0.7';
        });
        document.body.addEventListener('touchend', (e) => {
            const target = e.target.closest('.q-app-card, .q-btn-app, .q-nav-item');
            if (target) target.style.opacity = '1';
        });
    },

    // --- Navigation System ---

    handleRouting() {
        const params = new URLSearchParams(window.location.search);
        this.state.type = params.get('type')?.toLowerCase() || null;
        this.state.category = params.get('category')?.toLowerCase() || null;
        this.state.sub = params.get('sub') || null;
        const page = params.get('page')?.toLowerCase();

        this.container.scrollTo(0, 0);

        if (page) this.renderPage(page);
        else if (this.state.type && this.state.category && this.state.sub) this.renderDetails(this.state.category, this.state.sub);
        else if (this.state.type && this.state.category) this.renderSubCategories();
        else if (this.state.type) this.renderCategories();
        else this.renderHome();

        this.updateBottomNav();
    },

    navigate(type, category = null, sub = null, page = null, id = null) {
        const params = new URLSearchParams();
        if (page) params.set('page', page);
        if (type) params.set('type', type);
        if (category) params.set('category', category);
        if (sub) params.set('sub', sub);
        if (id) params.set('id', id);

        const url = params.toString() ? `?${params.toString()}` : window.location.pathname;
        history.pushState(null, '', url);
        this.handleRouting();
    },

    updateBottomNav() {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page');
        const type = params.get('type');

        document.querySelectorAll('.q-nav-item').forEach(el => el.classList.remove('active'));

        let targetId = 'nav-home';
        if (page === 'chat' || page === 'thread') targetId = 'nav-chat';
        else if (page === 'profile' || page === 'activity' || page === 'partner' || page === 'business' || page === 'contact') targetId = 'nav-profile';
        else if (type === 'service' || type === 'product' || page === 'requests') targetId = 'nav-requests';

        const el = document.getElementById(targetId);
        if (el) el.classList.add('active');
    },

    // --- Localization ---

    t(key) {
        return CONFIG.TRANSLATIONS[this.state.lang][key] || key;
    },

    setLanguage(lang) {
        this.state.lang = lang;
        localStorage.setItem('adoca_lang', lang);
        this.handleRouting();
        this.showToast(lang === 'hi' ? "भाषा बदल दी गई है" : "Language Updated");
    },

    // --- App Renderers ---

    renderHome() {
        const hour = new Date().getHours();
        const greeting = hour < 12 ? 'Good Morning! ☀️' : hour < 17 ? 'Hello, Neighbor! 👋' : 'Good Evening! 🌙';
        this.container.innerHTML = `
            <div class="anim-up">
                <!-- App Identity & Search -->
                <div style="padding: 12px 0 24px;">
                    <h1 style="font-size: 28px; font-weight: 900; color: var(--q-primary); letter-spacing:-0.5px; margin-bottom:4px;">${greeting}</h1>
                    <p style="color:var(--q-text-light); font-size:14px; font-weight:500;">What can we help you find today?</p>
                </div>

                <!-- Search Bar -->
                <div class="q-app-card" style="padding: 12px; margin-bottom: 24px; display:flex; align-items:center; gap:12px;" onclick="app.openSearch()">
                    <i data-lucide="search" style="width:20px; color:var(--q-text-light);"></i>
                    <span style="color:var(--q-text-light); font-weight:500; font-size:15px;">Search electrician, cement...</span>
                </div>

                <!-- Quick Needs Grid (3D Feel) -->
                <div style="margin-bottom: 32px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                        <h3 style="font-size:18px; font-weight:800; color:var(--q-primary);">Quick Needs</h3>
                        <span style="font-size:13px; font-weight:700; color:var(--q-secondary);" onclick="app.navigate('service')">VIEW ALL</span>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
                        ${this.renderQuickNeed('zap', 'Electrician', 'electrician')}
                        ${this.renderQuickNeed('droplets', 'Plumber', 'plumber')}
                        ${this.renderQuickNeed('brick-wall', 'Cement', 'construction', 'product')}
                        ${this.renderQuickNeed('hammer', 'Carpenter', 'carpenter')}
                        ${this.renderQuickNeed('sparkles', 'Cleaning', 'cleaning')}
                        ${this.renderQuickNeed('car', 'Vehicle', 'automotive')}
                    </div>
                </div>

                <!-- Dual CTA Banner — Visible for both Customers & Business Owners -->
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:24px;">
                    <!-- For Customers -->
                    <div class="tap-target" style="background:linear-gradient(135deg,#1E1B9E,#3b3dbb); border-radius:16px; padding:16px 14px; color:white; position:relative; overflow:hidden;" onclick="app.navigate(null,null,null,'requests')">
                        <div style="position:relative;z-index:2;">
                            <div style="width:32px;height:32px;background:rgba(255,255,255,0.15);border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:10px;">
                                <i data-lucide="search" style="width:16px;color:white;"></i>
                            </div>
                            <p style="font-size:13px;font-weight:800;line-height:1.3;margin-bottom:6px;">Find Expert &amp; Buy Bulk</p>
                            <span style="font-size:11px;opacity:0.75;font-weight:500;">50+ services near you</span>
                        </div>
                        <i data-lucide="arrow-right" style="position:absolute;right:10px;bottom:12px;width:18px;opacity:0.3;color:white;"></i>
                    </div>
                    <!-- For Business Owners — HIGH VISIBILITY -->
                    <div class="tap-target" style="background:linear-gradient(135deg,#f59e0b,#d97706); border-radius:16px; padding:16px 14px; color:white; position:relative; overflow:hidden;" onclick="app.navigate(null,null,null,'business')">
                        <div style="position:relative;z-index:2;">
                            <div style="width:32px;height:32px;background:rgba(255,255,255,0.2);border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:10px;">
                                <i data-lucide="store" style="width:16px;color:white;"></i>
                            </div>
                            <p style="font-size:13px;font-weight:800;line-height:1.3;margin-bottom:6px;">Register Your Business</p>
                            <span style="font-size:11px;opacity:0.85;font-weight:600;">FREE &bull; Zero Commission</span>
                        </div>
                        <i data-lucide="arrow-right" style="position:absolute;right:10px;bottom:12px;width:18px;opacity:0.3;color:white;"></i>
                    </div>
                </div>

                <!-- Live Feed (Simulator) -->
                <div class="q-app-card" style="margin-bottom:24px;">
                    <h3 class="q-card-title">Live Activity</h3>
                    <div id="live-feed-container" style="display:flex; flex-direction:column; gap:12px;">
                        ${this.renderLiveItem('New request for Plumber', '2 mins ago')}
                        ${this.renderLiveItem('Verified Expert joined Adoca', '15 mins ago')}
                    </div>
                </div>
            </div>

            <!-- Search Overlay (Hidden by Default) -->
            <div id="search-overlay" class="anim-fade" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:var(--q-bg); z-index:2000; padding:20px;">
                <div style="display:flex; align-items:center; gap:16px; margin-bottom:24px;">
                    <i data-lucide="arrow-left" style="cursor:pointer;" onclick="app.closeSearch()"></i>
                    <input type="text" id="overlay-search-input" autofocus placeholder="Search everything..." 
                           oninput="app.handleOverlaySearch(this.value)"
                           style="flex:1; border:none; background:transparent; font-size:18px; font-weight:600; outline:none;">
                </div>
                <div id="search-results-overlay" style="display:flex; flex-direction:column; gap:16px; overflow-y:auto; max-height:calc(100% - 80px);">
                    <p id="search-placeholder-text" style="color:var(--q-text-light); text-align:center; padding-top:40px;">Try searching for "Cement", "Electrician" or "AC Repair"</p>
                </div>
            </div>
        `;
        lucide.createIcons();
        this.startActivityMonitor();
    },

    handleOverlaySearch(val) {
        const container = document.getElementById('search-results-overlay');
        const placeholder = document.getElementById('search-placeholder-text');

        if (!val) {
            container.innerHTML = `<p id="search-placeholder-text" style="color:var(--q-text-light); text-align:center; padding-top:40px;">Try searching for "Cement", "Electrician" or "AC Repair"</p>`;
            return;
        }

        const all = [...CONFIG.SERVICE_CATEGORIES, ...CONFIG.PRODUCT_CATEGORIES];
        const filtered = all.filter(item =>
            item.label.toLowerCase().includes(val.toLowerCase()) ||
            (item.label_hi && item.label_hi.includes(val)) ||
            item.subs.some(s => s.toLowerCase().includes(val.toLowerCase()))
        ).slice(0, 10);

        if (filtered.length === 0) {
            container.innerHTML = `<p style="text-align:center; color:var(--q-text-light); padding:40px;">No matches found for "${val}"</p>`;
        } else {
            container.innerHTML = filtered.map(item => `
                <div class="q-app-card" style="margin-bottom:0; display:flex; align-items:center; gap:16px;" onclick="app.navigate('${CONFIG.SERVICE_CATEGORIES.includes(item) ? 'service' : 'product'}', '${item.id}'); app.closeSearch();">
                    <div style="width:40px; height:40px; background:var(--q-surface-soft); border-radius:10px; display:flex; align-items:center; justify-content:center; color:var(--q-primary);">
                        <i data-lucide="${item.icon}"></i>
                    </div>
                    <div>
                        <h4 style="font-size:15px; font-weight:700; margin:0;">${item.label}</h4>
                        <span style="font-size:12px; color:var(--q-text-light);">${item.subs.slice(0, 3).join(', ')}...</span>
                    </div>
                </div>
            `).join('');
            lucide.createIcons();
        }
    },

    renderQuickNeed(icon, label, id, type = 'service') {
        const safeLabel = utils.sanitize(label);
        return `
            <div class="tap-target" style="display:flex; flex-direction:column; align-items:center; gap:8px;" onclick="app.navigate('${type}', '${id}')" title="${safeLabel}">
                <div class="q-icon-box">
                    <i data-lucide="${icon}"></i>
                </div>
                <span class="q-icon-label">${safeLabel}</span>
            </div>
        `;
    },

    renderLiveItem(text, time) {
        const safeText = utils.sanitize(text);
        const safeTime = utils.sanitize(time);
        return `
            <div class="q-live-item">
                <div class="q-dot"></div>
                <div style="flex:1;">
                    <p class="q-live-text">${safeText}</p>
                    <span class="q-live-time">${safeTime}</span>
                </div>
            </div>
        `;
    },

    openSearch() {
        const overlay = document.getElementById('search-overlay');
        overlay.style.display = 'block';
        document.getElementById('overlay-search-input').focus();
    },

    closeSearch() {
        document.getElementById('search-overlay').style.display = 'none';
    },

    startActivityMonitor() {
        if (this.activityInterval) clearInterval(this.activityInterval);

        // Initial fetch
        this.fetchLiveActivity();

        // Poll every 30 seconds for industrial-grade freshness
        this.activityInterval = setInterval(() => this.fetchLiveActivity(), 30000);
    },

    async fetchLiveActivity() {
        const container = document.getElementById('live-feed-container');
        if (!container) return;

        try {
            // In a scaling app, we fetch the latest requests from the backend
            // For now, we use a specialized GET action on our script URL
            const url = `${submitHandler.GOOGLE_SCRIPT_URL}?action=getLatest`;
            const response = await fetch(url);

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.items.length > 0) {
                    this.renderLiveFeed(data.items);
                    return;
                }
            }
        } catch (err) {
            console.warn("Real-time activity fetch failed, using fallback simulator.");
        }

        // FALLBACK: Intelligent Simulator (if backend is offline or limited)
        const simulations = [
            { text: "New Request for Plumber in Civil Lines", time: "Just now" },
            { text: "Verified Expert bidded on AC Repair", time: "2 mins ago" },
            { text: "Bulk Cement order confirmed by Seller", time: "5 mins ago" }
        ];
        this.renderLiveFeed(simulations);
    },

    renderLiveFeed(items) {
        const container = document.getElementById('live-feed-container');
        if (!container) return;

        container.innerHTML = items.map(item => this.renderLiveItem(item.text, item.time)).join('');
        lucide.createIcons();
    },

    renderHtmlToElement(html) {
        const div = document.createElement('div');
        div.innerHTML = html.trim();
        return div.firstChild;
    },

    renderCategories() {
        const categories = this.state.type === 'service' ? CONFIG.SERVICE_CATEGORIES : CONFIG.PRODUCT_CATEGORIES;
        const title = this.state.type === 'service' ? "Verified Experts" : "Bulk Supply";

        this.container.innerHTML = `
            <div class="anim-up">
                <div style="padding: 8px 0 24px;">
                    <h2 style="font-size: 24px; font-weight: 800; color: var(--q-primary);">${title}</h2>
                    <p style="color: var(--q-text-light); font-size: 14px; font-weight: 500;">Select a category to continue.</p>
                </div>

                <div style="display: grid; grid-template-columns: 1fr; gap: 12px;">
                    ${categories.map(cat => `
                        <div class="q-app-card" style="display:flex; align-items:center; gap:16px; margin-bottom:0; cursor:pointer;" onclick="app.navigate('${this.state.type}', '${cat.id}')">
                            <div style="width:44px; height:44px; background:var(--q-bg); border-radius:12px; display:flex; align-items:center; justify-content:center; color:var(--q-primary);">
                                <i data-lucide="${cat.icon}"></i>
                            </div>
                            <div style="flex:1;">
                                <h4 style="font-size:16px; font-weight:700;">${cat.label}</h4>
                            </div>
                            <i data-lucide="chevron-right" style="width:18px; color:var(--q-text-light);"></i>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        lucide.createIcons();
    },

    renderSubCategories() {
        const pool = this.state.type === 'service' ? CONFIG.SERVICE_CATEGORIES : CONFIG.PRODUCT_CATEGORIES;
        const category = pool.find(c => c.id === this.state.category);
        if (!category) return this.renderCategories();

        this.container.innerHTML = `
            <div class="anim-up">
                <div style="padding: 8px 0 24px;">
                    <div style="display:flex; align-items:center; gap:8px; color:var(--q-primary); font-weight:700; font-size:13px; margin-bottom:8px;" onclick="app.navigate('${this.state.type}')">
                        <i data-lucide="arrow-left" style="width:14px;"></i> BACK
                    </div>
                    <h2 style="font-size: 24px; font-weight: 800; color: var(--q-primary);">${category.label}</h2>
                </div>

                <div style="display: grid; grid-template-columns: 1fr; gap: 12px;">
                    ${category.subs.map(sub => `
                        <div class="q-app-card" style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0; cursor:pointer;" onclick="app.navigate('${this.state.type}', '${category.id}', '${sub}')">
                            <h4 style="font-size:15px; font-weight:700; color:var(--q-text-bold);">${sub}</h4>
                            <div style="width:32px; height:32px; background:var(--q-accent); border-radius:50%; display:flex; align-items:center; justify-content:center; color:var(--q-text-bold);">
                                <i data-lucide="plus" style="width:16px;"></i>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        lucide.createIcons();
    },

    renderDetails(catId, sub) {
        // Preserving logic but updating UI to mobile-native Form directly for efficiency
        this.renderForm(catId, sub);
    },

    renderForm(catId, subName) {
        const pool = this.state.type === 'service' ? CONFIG.SERVICE_CATEGORIES : CONFIG.PRODUCT_CATEGORIES;
        const category = pool.find(c => c.id === this.state.category);
        const sub = subName || this.state.sub;

        // Guard: if category is null, fall back gracefully
        if (!category) {
            this.showToast('Category not found. Please try again.', 'error');
            return this.renderCategories();
        }
        if (!sub) return this.renderSubCategories();

        const fields = [...CONFIG.FORM_FIELDS.common, ...(this.state.type === 'service' ? CONFIG.FORM_FIELDS.service : CONFIG.FORM_FIELDS.product)];

        this.container.innerHTML = `
            <div class="anim-up">
                <div style="padding: 8px 0 24px;">
                    <div style="display:flex; align-items:center; gap:8px; color:var(--q-primary); font-weight:700; font-size:13px; margin-bottom:8px;" onclick="app.navigate('${this.state.type}', '${category.id}')">
                        <i data-lucide="arrow-left" style="width:14px;"></i> BACK
                    </div>
                    <h2 style="font-size: 24px; font-weight: 800; color: var(--q-primary);">Request ${sub}</h2>
                </div>

                <div class="q-app-card">
                    <form id="q-request-form">
                        <input type="hidden" name="category" value="${category?.label} - ${sub}">
                        <input type="hidden" name="type" value="${this.state.type}">
                        
                        ${fields.map(f => `
                            <div class="q-input-group">
                                <label>${f.label}</label>
                                <div style="position:relative; display:flex; align-items:center;">
                                    ${f.type === 'textarea' ?
                `<textarea class="q-app-input" style="height:100px; padding:12px; resize:none;" name="${f.name}" placeholder="${f.placeholder}" required></textarea>` :
                f.type === 'select' ?
                    `<select class="q-app-input" name="${f.name}" required>
                                            <option value="" disabled selected>${this.state.lang === 'hi' ? 'विकल्प चुनें...' : 'Select Option...'}</option>
                                            ${f.options.map(o => `<option value="${utils.sanitize(o)}">${utils.sanitize(o)}</option>`).join('')}
                                        </select>` :
                    `<input type="${f.type}" id="field-${f.name}" class="q-app-input" name="${f.name}" placeholder="${f.placeholder}" required>`
            }
                                    ${f.name === 'location' ?
                `<button type="button" class="tap-target" onclick="app.autoDetectLocation()" style="position:absolute; right:12px; background:none; border:none; color:var(--q-primary); font-size:12px; font-weight:800; display:flex; align-items:center; gap:4px;">
                                            <i data-lucide="map-pin" style="width:14px;"></i> AUTO
                                        </button>` : ''
            }
                                </div>
                            </div>
                        `).join('')}
                        
                        <button type="submit" class="q-btn-app" id="q-submit-btn" style="margin-top:12px;">SUBMIT REQUEST</button>
                    </form>
                </div>
            </div>
        `;
        lucide.createIcons();
        document.getElementById('q-request-form').addEventListener('submit', (e) => this.handleSubmit(e));
    },

    async handleSubmit(e) {
        e.preventDefault();
        const btn = document.getElementById('q-submit-btn');
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        btn.disabled = true;
        btn.innerHTML = '<i data-lucide="loader" class="anim-spin"></i> Processing...';
        lucide.createIcons();

        try {
            const res = await submitHandler.send(data);
            if (res.success) {
                // Save to local history
                const history = JSON.parse(localStorage.getItem('adoca_history') || '[]');
                const reqId = res.id || utils.generateId();
                const entry = { ...data, id: reqId, timestamp: Date.now() };
                history.push(entry);
                localStorage.setItem('adoca_history', JSON.stringify(history));

                // Phase 7: Auto-create a system chat thread for the request
                this.chatEngine.createThread(reqId, data);
                this.analytics.track('request_submitted', { category: data.category, type: data.type });

                this.showToast("Request verified successfully!");
                this.renderSuccess();
            } else throw new Error(res.error);
        } catch (err) {
            this.showToast(err.message, "error");
            btn.disabled = false;
            btn.innerHTML = "SUBMIT REQUEST";
        }
    },

    renderSuccess() {
        this.container.innerHTML = `
            <div class="anim-up" style="display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding: 48px 24px;">
                <div class="success-circle" style="width: 100px; height: 100px; background: #3EC7C3; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; box-shadow: 0 10px 30px rgba(62, 199, 195, 0.4);">
                    <i data-lucide="check" style="color: white; width: 50px; height: 50px;"></i>
                </div>
                <h2 style="font-size: 32px; font-weight: 900; color: var(--q-primary); margin-bottom: 12px; letter-spacing:-1px;">Verified!</h2>
                <p style="color: var(--q-text-light); font-size: 16px; font-weight: 500; margin-bottom: 40px; line-height:1.5;">Your request is live. Local experts and sellers will contact you within minutes.</p>
                <button class="q-btn-app" style="box-shadow: 0 8px 20px rgba(255, 193, 7, 0.3);" onclick="app.navigate(null)">BACK TO HOME</button>
            </div>
        `;
        lucide.createIcons();
    },

    renderPage(id) {
        if (id === 'profile') return this.renderProfile();
        if (id === 'chat') return this.renderChat();
        if (id === 'partner') return this.renderPartnerOnboarding();
        if (id === 'business') return this.renderBusinessRegister();
        if (id === 'requests') return this.renderRequestsHub();
        if (id === 'thread') {
            const params = new URLSearchParams(window.location.search);
            return this.renderChatThread(params.get('id'));
        }
        if (id === 'activity') return this.renderFullHistory();
        if (id === 'contact') return this.renderContactPage();

        this.container.innerHTML = `<div class="anim-up"><div class="q-app-card"><p style="color:var(--q-text-main); font-weight:500;">Coming soon.</p></div></div>`;
        lucide.createIcons();
    },

    renderRequestsHub() {
        const history = JSON.parse(localStorage.getItem('adoca_history') || '[]');
        const hasBiz = !!localStorage.getItem('adoca_business');
        this.container.innerHTML = `
            <div class="anim-up">
                <div style="padding:8px 0 24px;">
                    <h2 style="font-size:24px;font-weight:900;color:var(--q-primary);">Post a Request</h2>
                    <p style="color:var(--q-text-light);font-size:14px;font-weight:500;">What do you need today?</p>
                </div>

                <div class="q-app-card tap-target" style="display:flex;align-items:center;gap:16px;" onclick="app.navigate('service')">
                    <div style="width:52px;height:52px;background:rgba(30,27,158,0.08);border-radius:14px;display:flex;align-items:center;justify-content:center;">
                        <i data-lucide="wrench" style="color:var(--q-primary);width:26px;height:26px;"></i>
                    </div>
                    <div style="flex:1;">
                        <h3 style="font-size:17px;font-weight:800;color:var(--q-text-bold);margin-bottom:3px;">Hire a Service Expert</h3>
                        <p style="font-size:13px;color:var(--q-text-light);font-weight:500;">Electrician, Plumber, Painter &amp; 50+ more</p>
                    </div>
                    <i data-lucide="chevron-right" style="color:var(--q-text-light);width:18px;"></i>
                </div>

                <div class="q-app-card tap-target" style="display:flex;align-items:center;gap:16px;" onclick="app.navigate('product')">
                    <div style="width:52px;height:52px;background:rgba(62,199,195,0.1);border-radius:14px;display:flex;align-items:center;justify-content:center;">
                        <i data-lucide="package" style="color:var(--q-secondary);width:26px;height:26px;"></i>
                    </div>
                    <div style="flex:1;">
                        <h3 style="font-size:17px;font-weight:800;color:var(--q-text-bold);margin-bottom:3px;">Buy in Bulk / Wholesale</h3>
                        <p style="font-size:13px;color:var(--q-text-light);font-weight:500;">Cement, Steel, Groceries &amp; more</p>
                    </div>
                    <i data-lucide="chevron-right" style="color:var(--q-text-light);width:18px;"></i>
                </div>

                <div class="q-app-card" style="background:linear-gradient(135deg,#1E1B9E,#3b3dbb);border:none;" onclick="app.navigate(null,null,null,'business')">
                    <div style="display:flex;align-items:center;gap:14px;">
                        <div style="width:48px;height:48px;background:rgba(255,255,255,0.15);border-radius:12px;display:flex;align-items:center;justify-content:center;">
                            <i data-lucide="store" style="color:white;width:24px;"></i>
                        </div>
                        <div style="flex:1;">
                            <h4 style="color:white;font-size:15px;font-weight:800;margin-bottom:3px;">${hasBiz ? 'View Your Business' : 'Register Your Business'}</h4>
                            <p style="color:rgba(255,255,255,0.7);font-size:12px;font-weight:500;">${hasBiz ? 'Manage your Adoca business listing.' : 'Get listed and receive customer leads. Free forever.'}</p>
                        </div>
                        <i data-lucide="arrow-right" style="color:white;width:18px;"></i>
                    </div>
                </div>

                <div>
                    <h3 style="font-size:16px;font-weight:800;color:var(--q-text-bold);margin-bottom:14px;">Your Recent Requests</h3>
                    ${history.length === 0
                ? '<p style="color:var(--q-text-light);font-size:14px;text-align:center;padding:20px 0;">No requests yet. Post your first request above!</p>'
                : [...history].reverse().slice(0, 5).map(r => '<div class="q-app-card" style="margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;"><div><span style="font-weight:700;font-size:14px;">' + utils.sanitize(r.category || '\u2014') + '</span><span style="display:block;font-size:12px;color:var(--q-text-light);">' + utils.sanitize(r.location || '\u2014') + '</span></div><span style="font-size:11px;color:var(--q-text-light);">' + new Date(r.timestamp).toLocaleDateString() + '</span></div>').join('')
            }
                </div>
            </div>
        `;
        lucide.createIcons();
    },

    renderProfile() {
        const history = JSON.parse(localStorage.getItem('adoca_history') || '[]');
        const isPartner = localStorage.getItem('adoca_partner') ? true : false;
        const isDark = this.state.theme === 'dark';
        const toggleKnob = isDark ? 'right:3px; background:var(--q-primary);' : 'left:3px; background:var(--q-text-light);';
        this.container.innerHTML = `
            <div class="anim-up">
                <div style="padding: 8px 0 24px; text-align:center;">
                    <div style="width:80px; height:80px; background:var(--q-primary); border-radius:50%; margin:0 auto 16px; display:flex; align-items:center; justify-content:center; color:white;">
                        <i data-lucide="user" style="width:40px; height:40px;"></i>
                    </div>
                    <h2 style="font-size: 22px; font-weight: 800; color: var(--q-primary);">My Adoca Profile</h2>
                    ${isPartner ? '<span style="background:var(--q-secondary); color:white; font-size:11px; font-weight:700; padding:3px 10px; border-radius:100px;">✓ VERIFIED PARTNER</span>' : ''}
                </div>

                <div class="q-app-card">
                    <h3 class="q-card-title">Personalization</h3>
                    <div class="tap-target" style="display:flex; justify-content:space-between; align-items:center; padding:14px 0; border-bottom:1px solid rgba(0,0,0,0.05);" onclick="app.toggleLanguage()">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <i data-lucide="languages" style="width:18px; color:var(--q-primary);"></i>
                            <span style="font-weight:600;">App Language</span>
                        </div>
                        <span style="font-weight:800; color:var(--q-primary);">${this.state.lang.toUpperCase()}</span>
                    </div>
                    <div class="tap-target" style="display:flex; justify-content:space-between; align-items:center; padding:14px 0;" onclick="app.toggleTheme()">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <i data-lucide="${isDark ? 'sun' : 'moon'}" style="width:18px; color:var(--q-primary);"></i>
                            <span style="font-weight:600;">Dark Mode</span>
                        </div>
                        <div style="width:40px; height:22px; background:${isDark ? 'var(--q-primary)' : '#e5e7eb'}; border-radius:100px; position:relative; transition:background 0.3s;">
                             <div style="width:16px; height:16px; border-radius:50%; position:absolute; top:3px; ${toggleKnob} transition:all 0.3s;"></div>
                        </div>
                    </div>
                </div>

                ${!isPartner ? `
                <div class="q-app-card" style="background:linear-gradient(135deg,#1E1B9E,#3b3dbb); border:none;" onclick="app.navigate(null,null,null,'partner')">
                    <div style="display:flex; align-items:center; gap:14px;">
                        <div style="width:44px;height:44px;background:rgba(255,255,255,0.15);border-radius:12px;display:flex;align-items:center;justify-content:center;">
                            <i data-lucide="briefcase" style="color:white;"></i>
                        </div>
                        <div style="flex:1;">
                            <h4 style="color:white;font-size:15px;font-weight:800;margin-bottom:2px;">Join as Expert or Seller</h4>
                            <p style="color:rgba(255,255,255,0.7);font-size:12px;font-weight:500;">Get leads from local customers. Free to join.</p>
                        </div>
                        <i data-lucide="arrow-right" style="color:white;width:18px;"></i>
                    </div>
                </div>` : `
                <div class="q-app-card" style="border:2px solid var(--q-secondary);">
                    <div style="display:flex;align-items:center;gap:12px;">
                        <i data-lucide="shield-check" style="color:var(--q-secondary);width:28px;height:28px;"></i>
                        <div>
                            <h4 style="font-weight:800;font-size:14px;color:var(--q-primary);">Active Partner Dashboard</h4>
                            <p style="font-size:12px;color:var(--q-text-light);">You are receiving leads in your listed categories.</p>
                        </div>
                    </div>
                </div>`}

                <div class="q-app-card">
                    <h3 class="q-card-title">Recent Activity</h3>
                    ${history.length === 0 ?
                `<p style="font-size:14px; color:var(--q-text-light); text-align:center; padding:20px 0;">No recent requests yet</p>` :
                [...history].reverse().slice(0, 3).map(h => `
                            <div class="tap-target" style="padding:12px 0; border-bottom:1px solid rgba(0,0,0,0.05); display:flex; justify-content:space-between; align-items:center;" onclick="app.navigate(null,null,null,'thread','${h.id || ''}')">
                                <div>
                                    <span style="font-weight:700; font-size:14px; display:block;">${utils.sanitize(h.category || '—')}</span>
                                    <span style="font-size:12px;color:var(--q-secondary);font-weight:600;">View conversation →</span>
                                </div>
                                <span style="font-size:11px; color:var(--q-text-light);">${new Date(h.timestamp).toLocaleDateString()}</span>
                            </div>
                        `).join('')
            }
                    <button class="q-btn-app" style="background:transparent; color:var(--q-primary); height:auto; padding:14px 0; font-size:13px; margin-top:4px;" onclick="app.navigate(null, null, null, 'activity')">VIEW ALL HISTORY</button>
                </div>
            </div>
        `;
        lucide.createIcons();
    },

    renderChat() {
        const threads = this.chatEngine.getThreads();
        if (threads.length === 0) {
            this.container.innerHTML = `
                <div class="anim-up" style="display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; padding: 40px; min-height: 60vh;">
                    <div style="width:100px; height:100px; background:rgba(30,27,158,0.06); border-radius:50%; display:flex; align-items:center; justify-content:center; color:var(--q-primary); margin-bottom:24px;">
                        <i data-lucide="message-circle" style="width:48px; height:48px; opacity:0.3;"></i>
                    </div>
                    <h3 style="font-size:22px; font-weight:900; color:var(--q-primary); margin-bottom:12px;">No Chats Yet</h3>
                    <p style="color:var(--q-text-light); font-size:14px; font-weight:500; line-height:1.7; max-width:260px;">After you post a request, a private conversation thread will appear here.</p>
                    <button class="q-btn-app" style="margin-top:28px; max-width:220px;" onclick="app.navigate('service')">POST A REQUEST</button>
                </div>
            `;
        } else {
            this.container.innerHTML = `
                <div class="anim-up">
                    <div style="padding:8px 0 20px;">
                        <h2 style="font-size:24px; font-weight:800; color:var(--q-primary);">Messages</h2>
                        <p style="color:var(--q-text-light); font-size:13px; font-weight:500;">Your request conversations</p>
                    </div>
                    ${threads.map(t => `
                        <div class="q-app-card tap-target" style="display:flex;align-items:center;gap:14px;margin-bottom:12px;" onclick="app.navigate(null,null,null,'thread','${t.id}')">
                            <div style="width:48px;height:48px;background:linear-gradient(135deg,var(--q-primary),#3b3dbb);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                <i data-lucide="briefcase" style="color:white;width:22px;"></i>
                            </div>
                            <div style="flex:1;min-width:0;">
                                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">
                                    <span style="font-weight:700;font-size:14px;color:var(--q-text-bold);">${utils.sanitize(t.category)}</span>
                                    <span style="font-size:11px;color:var(--q-text-light);">${new Date(t.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p style="font-size:13px;color:var(--q-text-light);font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${utils.sanitize(t.lastMessage)}</p>
                            </div>
                            ${t.unread > 0 ? `<div style="min-width:20px;height:20px;background:var(--q-secondary);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:white;">${t.unread}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            `;
        }
        lucide.createIcons();
    },

    renderChatThread(threadId) {
        const thread = this.chatEngine.getThread(threadId);
        if (!thread) return this.renderChat();
        this.chatEngine.markRead(threadId);
        const messages = thread.messages || [];
        this.container.innerHTML = `
            <div class="anim-up">
                <div style="display:flex;align-items:center;gap:12px;padding:4px 0 20px;">
                    <div class="tap-target" onclick="app.navigate(null,null,null,'chat')" style="width:36px;height:36px;display:flex;align-items:center;justify-content:center;">
                        <i data-lucide="arrow-left" style="color:var(--q-primary);"></i>
                    </div>
                    <div>
                        <h3 style="font-size:16px;font-weight:800;color:var(--q-primary);">${utils.sanitize(thread.category)}</h3>
                        <span style="font-size:12px;color:var(--q-secondary);font-weight:600;">● Active</span>
                    </div>
                </div>
                <div id="chat-messages" style="display:flex;flex-direction:column;gap:10px;padding-bottom:80px;">
                    ${messages.map(m => `
                        <div style="display:flex;flex-direction:${m.sender === 'user' ? 'row-reverse' : 'row'};gap:8px;align-items:flex-end;">
                            <div style="max-width:78%;background:${m.sender === 'user' ? 'var(--q-primary)' : 'white'};color:${m.sender === 'user' ? 'white' : 'var(--q-text-main)'};padding:10px 14px;border-radius:${m.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px'};font-size:14px;font-weight:500;box-shadow:0 2px 8px rgba(0,0,0,0.08);">${utils.sanitize(m.text)}</div>
                        </div>
                        <div style="text-align:${m.sender === 'user' ? 'right' : 'left'};font-size:11px;color:var(--q-text-light);padding:0 4px;">${new Date(m.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    `).join('')}
                </div>
                <div style="position:fixed;bottom:calc(var(--q-nav-h) + 8px);left:50%;transform:translateX(-50%);width:min(390px,100%);background:white;border-top:1px solid rgba(0,0,0,0.05);padding:10px 16px;box-sizing:border-box;display:flex;gap:10px;align-items:center;">
                    <input id="chat-input" type="text" class="q-app-input" placeholder="Type a message..." style="flex:1;height:44px;" onkeydown="if(event.key==='Enter')app.chatEngine.sendMessage('${threadId}',this)">
                    <button class="q-btn-app" style="width:44px;height:44px;border-radius:50%;flex-shrink:0;" onclick="app.chatEngine.sendMessage('${threadId}',document.getElementById('chat-input'))">
                        <i data-lucide="send" style="width:18px;"></i>
                    </button>
                </div>
            </div>
        `;
        lucide.createIcons();
        const msgArea = document.getElementById('chat-messages');
        if (msgArea) msgArea.scrollTo(0, msgArea.scrollHeight);
    },

    renderPartnerOnboarding() {
        const cats = [...CONFIG.SERVICE_CATEGORIES, ...CONFIG.PRODUCT_CATEGORIES].map(c => c.label);
        this.container.innerHTML = `
            <div class="anim-up">
                <div style="padding:8px 0 24px;">
                    <div class="tap-target" style="display:flex;align-items:center;gap:8px;color:var(--q-primary);font-weight:700;font-size:13px;margin-bottom:10px;" onclick="app.navigate(null,null,null,'profile')">
                        <i data-lucide="arrow-left" style="width:14px;"></i> BACK
                    </div>
                    <h2 style="font-size:24px;font-weight:900;color:var(--q-primary);">Join as Partner</h2>
                    <p style="color:var(--q-text-light);font-size:14px;font-weight:500;margin-top:4px;">Register to receive leads from verified local customers.</p>
                </div>
                <div class="q-app-card">
                    <form id="partner-form">
                        <div class="q-input-group">
                            <label>Full Name / पूरा नाम</label>
                            <input type="text" name="name" class="q-app-input" placeholder="Your full name" required>
                        </div>
                        <div class="q-input-group">
                            <label>Mobile Number</label>
                            <input type="tel" name="phone" class="q-app-input" placeholder="10-digit mobile" required>
                        </div>
                        <div class="q-input-group">
                            <label>Your Locality / इलाका</label>
                            <input type="text" name="location" id="partner-location" class="q-app-input" placeholder="e.g., Civil Lines, Samastipur" required>
                        </div>
                        <div class="q-input-group">
                            <label>Service / Product Type</label>
                            <select name="partnerType" class="q-app-input">
                                <option value="service">Service Expert (Plumber, Electrician etc.)</option>
                                <option value="product">Product Seller / Distributor</option>
                            </select>
                        </div>
                        <div class="q-input-group">
                            <label>Primary Category</label>
                            <select name="category" class="q-app-input" required>
                                <option value="" disabled selected>Select your main category</option>
                                ${cats.map(c => `<option value="${utils.sanitize(c)}">${utils.sanitize(c)}</option>`).join('')}
                            </select>
                        </div>
                        <div class="q-input-group">
                            <label>Experience / Details</label>
                            <textarea name="bio" class="q-app-input" style="height:90px;padding:12px;resize:none;" placeholder="E.g., 8 years experience as an electrician, available 24/7"></textarea>
                        </div>
                        <button type="submit" class="q-btn-app" id="partner-submit-btn">REGISTER AS PARTNER</button>
                    </form>
                </div>
                <p style="font-size:12px;color:var(--q-text-light);text-align:center;padding:0 20px 24px;">By registering, you agree to Adoca's partner terms. We will review your profile within 24 hours.</p>
            </div>
        `;
        lucide.createIcons();
        document.getElementById('partner-form').addEventListener('submit', (e) => this.handlePartnerSubmit(e));
    },

    async handlePartnerSubmit(e) {
        e.preventDefault();
        const btn = document.getElementById('partner-submit-btn');
        const data = Object.fromEntries(new FormData(e.target).entries());
        if (!utils.isValidPhone(data.phone)) {
            this.showToast('Please enter a valid phone number.', 'error');
            return;
        }
        btn.disabled = true;
        btn.innerHTML = '<i data-lucide="loader" class="anim-spin"></i> Registering...';
        lucide.createIcons();
        try {
            const payload = { ...data, partnerReg: true, id: utils.generateId(), registeredAt: new Date().toISOString() };
            await submitHandler.send(payload);
            localStorage.setItem('adoca_partner', JSON.stringify(payload));
            this.analytics.track('partner_registered', { category: data.category });
            this.showToast('Welcome! Your profile is under review.');
            this.navigate(null, null, null, 'profile');
        } catch (err) {
            this.showToast('Registration failed. Try again.', 'error');
            btn.disabled = false;
            btn.innerHTML = 'REGISTER AS PARTNER';
        }
    },

    renderFullHistory() {
        const history = JSON.parse(localStorage.getItem('adoca_history') || '[]');
        this.container.innerHTML = `
            <div class="anim-up">
                <div style="padding:8px 0 20px;">
                    <div class="tap-target" style="display:flex;align-items:center;gap:8px;color:var(--q-primary);font-weight:700;font-size:13px;margin-bottom:10px;" onclick="app.navigate(null,null,null,'profile')">
                        <i data-lucide="arrow-left" style="width:14px;"></i> BACK
                    </div>
                    <h2 style="font-size:24px;font-weight:800;color:var(--q-primary);">All Requests</h2>
                </div>
                ${history.length === 0
                ? '<div class="q-app-card"><p style="text-align:center;color:var(--q-text-light);padding:20px 0;">No request history yet.</p></div>'
                : [...history].reverse().map(h => `
                        <div class="q-app-card" style="margin-bottom:12px;">
                            <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                                <div>
                                    <h4 style="font-size:15px;font-weight:800;color:var(--q-text-bold);margin-bottom:4px;">${utils.sanitize(h.category || '—')}</h4>
                                    <span style="font-size:12px;color:var(--q-text-light);">📍 ${utils.sanitize(h.location || '—')}</span>
                                </div>
                                <span style="font-size:11px;color:var(--q-text-light);text-align:right;">${new Date(h.timestamp).toLocaleString()}</span>
                            </div>
                        </div>
                    `).join('')
            }
            </div>
        `;
        lucide.createIcons();
    },

    renderContactPage() {
        const phone = CONFIG.BRAND.PHONE;
        const wa = CONFIG.BRAND.WHATSAPP;
        const email = CONFIG.BRAND.EMAIL;
        this.container.innerHTML = `
            <div class="anim-up">
                <div style="padding:8px 0 24px;">
                    <h2 style="font-size:24px;font-weight:800;color:var(--q-primary);">Adoca Support</h2>
                    <p style="color:var(--q-text-light);font-size:14px;">We are here to help you, anytime.</p>
                </div>
                <div class="q-app-card" style="display:flex;align-items:center;gap:14px;" onclick="window.open('tel:${phone}')">
                    <div style="width:44px;height:44px;background:rgba(30,27,158,0.08);border-radius:12px;display:flex;align-items:center;justify-content:center;">
                        <i data-lucide="phone" style="color:var(--q-primary);"></i>
                    </div>
                    <div><h4 style="font-weight:800;color:var(--q-text-bold);">Call Support</h4><p style="font-size:13px;color:var(--q-text-light);">${phone} &bull; Mon-Sat, 10am – 7pm</p></div>
                </div>
                <div class="q-app-card" style="display:flex;align-items:center;gap:14px;" onclick="window.open('https://wa.me/${wa}','_blank')">
                    <div style="width:44px;height:44px;background:rgba(62,199,195,0.1);border-radius:12px;display:flex;align-items:center;justify-content:center;">
                        <i data-lucide="message-circle" style="color:var(--q-secondary);"></i>
                    </div>
                    <div><h4 style="font-weight:800;color:var(--q-text-bold);">WhatsApp Us</h4><p style="font-size:13px;color:var(--q-text-light);">Fastest response guaranteed</p></div>
                </div>
                <div class="q-app-card" style="display:flex;align-items:center;gap:14px;" onclick="window.open('mailto:${email}')">
                    <div style="width:44px;height:44px;background:rgba(255,193,7,0.15);border-radius:12px;display:flex;align-items:center;justify-content:center;">
                        <i data-lucide="mail" style="color:#d97706;"></i>
                    </div>
                    <div><h4 style="font-weight:800;color:var(--q-text-bold);">Email Us</h4><p style="font-size:13px;color:var(--q-text-light);">${email}</p></div>
                </div>
            </div>
        `;
        lucide.createIcons();
    },

    renderBusinessRegister() {
        const cats = [...CONFIG.SERVICE_CATEGORIES, ...CONFIG.PRODUCT_CATEGORIES].map(c => c.label);
        const existing = JSON.parse(localStorage.getItem('adoca_business') || 'null');

        if (existing) {
            this.container.innerHTML = `
                <div class="anim-up">
                    <div style="padding:8px 0 24px;">
                        <div class="tap-target" style="display:flex;align-items:center;gap:8px;color:var(--q-primary);font-weight:700;font-size:13px;margin-bottom:10px;" onclick="history.back()">
                            <i data-lucide="arrow-left" style="width:14px;"></i> BACK
                        </div>
                        <h2 style="font-size:24px;font-weight:900;color:var(--q-primary);">Your Business</h2>
                    </div>
                    <div class="q-app-card" style="border:2px solid var(--q-secondary);">
                        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
                            <div style="width:50px;height:50px;background:linear-gradient(135deg,var(--q-primary),#3b3dbb);border-radius:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                <i data-lucide="store" style="color:white;width:24px;height:24px;"></i>
                            </div>
                            <div>
                                <h3 style="font-size:17px;font-weight:800;color:var(--q-text-bold);">${utils.sanitize(existing.businessName)}</h3>
                                <span style="font-size:12px;color:var(--q-secondary);font-weight:700;">✓ REGISTERED ON ADOCA</span>
                            </div>
                        </div>
                        <div style="display:flex;flex-direction:column;gap:10px;">
                            <div style="display:flex;gap:8px;align-items:center;">
                                <i data-lucide="map-pin" style="width:14px;color:var(--q-text-light);flex-shrink:0;"></i>
                                <span style="font-size:13px;color:var(--q-text-main);">${utils.sanitize(existing.location)}</span>
                            </div>
                            <div style="display:flex;gap:8px;align-items:center;">
                                <i data-lucide="tag" style="width:14px;color:var(--q-text-light);flex-shrink:0;"></i>
                                <span style="font-size:13px;color:var(--q-text-main);">${utils.sanitize(existing.category)}</span>
                            </div>
                            <div style="display:flex;gap:8px;align-items:center;">
                                <i data-lucide="phone" style="width:14px;color:var(--q-text-light);flex-shrink:0;"></i>
                                <span style="font-size:13px;color:var(--q-text-main);">${utils.sanitize(existing.phone)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="q-app-card" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;text-align:center;">
                        <div style="padding:12px 0;">
                            <div style="font-size:28px;font-weight:900;color:var(--q-primary);">0</div>
                            <div style="font-size:12px;color:var(--q-text-light);font-weight:600;margin-top:4px;">Leads Received</div>
                        </div>
                        <div style="padding:12px 0;border-left:1px solid var(--q-border);">
                            <div style="font-size:16px;font-weight:900;color:var(--q-secondary);">Active</div>
                            <div style="font-size:12px;color:var(--q-text-light);font-weight:600;margin-top:4px;">Status</div>
                        </div>
                    </div>
                    <button class="q-btn-app" style="background:transparent;color:#ef4444;border:1.5px solid #ef4444;margin-top:8px;" onclick="app.deleteBusinessReg()">REMOVE REGISTRATION</button>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        this.container.innerHTML = `
            <div class="anim-up">
                <div style="padding:8px 0 24px;">
                    <div class="tap-target" style="display:flex;align-items:center;gap:8px;color:var(--q-primary);font-weight:700;font-size:13px;margin-bottom:10px;" onclick="history.back()">
                        <i data-lucide="arrow-left" style="width:14px;"></i> BACK
                    </div>
                    <h2 style="font-size:24px;font-weight:900;color:var(--q-primary);">Register Business</h2>
                    <p style="color:var(--q-text-light);font-size:14px;font-weight:500;margin-top:4px;">Get listed on Adoca — completely free. Reach local customers instantly.</p>
                </div>

                <div class="q-app-card" style="background:var(--q-surface-soft);border:none;margin-bottom:20px;">
                    <div style="display:flex;gap:16px;justify-content:space-around;">
                        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;flex:1;">
                            <div style="width:36px;height:36px;background:var(--q-primary);border-radius:50%;display:flex;align-items:center;justify-content:center;"><i data-lucide="zap" style="color:white;width:16px;height:16px;"></i></div>
                            <span style="font-size:11px;font-weight:700;text-align:center;color:var(--q-text-main);">Instant Leads</span>
                        </div>
                        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;flex:1;">
                            <div style="width:36px;height:36px;background:var(--q-secondary);border-radius:50%;display:flex;align-items:center;justify-content:center;"><i data-lucide="percent" style="color:white;width:16px;height:16px;"></i></div>
                            <span style="font-size:11px;font-weight:700;text-align:center;color:var(--q-text-main);">Zero Commission</span>
                        </div>
                        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;flex:1;">
                            <div style="width:36px;height:36px;background:#f59e0b;border-radius:50%;display:flex;align-items:center;justify-content:center;"><i data-lucide="shield-check" style="color:white;width:16px;height:16px;"></i></div>
                            <span style="font-size:11px;font-weight:700;text-align:center;color:var(--q-text-main);">Verified Badge</span>
                        </div>
                    </div>
                </div>

                <div class="q-app-card">
                    <form id="business-form">
                        <div class="q-input-group">
                            <label>Business / Shop Name *</label>
                            <input type="text" name="businessName" class="q-app-input" placeholder="e.g., Ramesh Electrical Works" required>
                        </div>
                        <div class="q-input-group">
                            <label>Owner Full Name *</label>
                            <input type="text" name="ownerName" class="q-app-input" placeholder="Your full name" required>
                        </div>
                        <div class="q-input-group">
                            <label>Mobile Number *</label>
                            <input type="tel" name="phone" class="q-app-input" placeholder="10-digit WhatsApp number" required>
                        </div>
                        <div class="q-input-group">
                            <label>Business Address / Locality *</label>
                            <input type="text" name="location" class="q-app-input" placeholder="e.g., Station Road, Samastipur" required>
                        </div>
                        <div class="q-input-group">
                            <label>Business Type *</label>
                            <select name="bizType" class="q-app-input">
                                <option value="service">Service Provider (Plumber, Electrician etc.)</option>
                                <option value="product">Product Seller / Distributor / Shop</option>
                                <option value="both">Both Service &amp; Products</option>
                            </select>
                        </div>
                        <div class="q-input-group">
                            <label>Primary Category *</label>
                            <select name="category" class="q-app-input" required>
                                <option value="" disabled selected>Select your main category</option>
                                ${cats.map(c => `<option value="${utils.sanitize(c)}">${utils.sanitize(c)}</option>`).join('')}
                            </select>
                        </div>
                        <div class="q-input-group">
                            <label>Years in Business</label>
                            <select name="experience" class="q-app-input">
                                <option value="new">Just starting</option>
                                <option value="1-3">1–3 years</option>
                                <option value="3-5">3–5 years</option>
                                <option value="5-10">5–10 years</option>
                                <option value="10+">10+ years</option>
                            </select>
                        </div>
                        <div class="q-input-group">
                            <label>About Your Business</label>
                            <textarea name="description" class="q-app-input" style="height:90px;padding:12px;resize:none;" placeholder="Describe your services, specialties, and working hours..."></textarea>
                        </div>
                        <button type="submit" class="q-btn-app" id="biz-submit-btn">REGISTER MY BUSINESS FREE</button>
                    </form>
                </div>
                <p style="font-size:12px;color:var(--q-text-light);text-align:center;padding:0 20px 24px;">Your business will appear on Adoca within 24 hours after review.</p>
            </div>
        `;
        lucide.createIcons();
        document.getElementById('business-form').addEventListener('submit', e => this.handleBusinessSubmit(e));
    },

    async handleBusinessSubmit(e) {
        e.preventDefault();
        const btn = document.getElementById('biz-submit-btn');
        const data = Object.fromEntries(new FormData(e.target).entries());

        if (!utils.isValidPhone(data.phone)) {
            this.showToast('Please enter a valid phone number.', 'error');
            return;
        }
        if (!data.category) {
            this.showToast('Please select a category.', 'error');
            return;
        }

        btn.disabled = true;
        btn.innerHTML = '<i data-lucide="loader" class="anim-spin"></i> Registering...';
        lucide.createIcons();

        try {
            const payload = { ...data, businessReg: true, id: utils.generateId(), registeredAt: new Date().toISOString() };
            await submitHandler.send(payload);
            localStorage.setItem('adoca_business', JSON.stringify(payload));
            this.analytics.track('business_registered', { category: data.category });
            this.showToast('Business registered successfully!');
            this.navigate(null, null, null, 'business');
        } catch (err) {
            this.showToast('Registration failed. Please try again.', 'error');
            btn.disabled = false;
            btn.innerHTML = 'REGISTER MY BUSINESS FREE';
        }
    },

    deleteBusinessReg() {
        if (confirm('Remove your business registration from Adoca?')) {
            localStorage.removeItem('adoca_business');
            this.showToast('Business registration removed.');
            this.navigate(null, null, null, 'requests');
        }
    },

    // --- Helpers ---

    handleSearch(input) {
        if (input && input.length > 1) {
            this.openSearch();
            const overlayInput = document.getElementById('overlay-search-input');
            if (overlayInput) {
                overlayInput.value = input;
                this.handleOverlaySearch(input);
            }
        }
    },

    async autoDetectLocation() {
        const btn = document.querySelector('[onclick="app.autoDetectLocation()"]');
        const defaultText = btn.innerHTML;
        btn.innerHTML = '<i data-lucide="loader" class="anim-spin" style="width:14px;"></i>';
        lucide.createIcons();

        try {
            const loc = await utils.getCurrentLocation();
            if (loc) {
                this.state.lastLocation = loc;
                const field = document.getElementById('field-location');
                if (field) {
                    field.value = loc.locality;
                    this.showToast("Location detected: " + loc.locality);
                }
            } else {
                this.showToast("Geolocation failed. Please type manually.", "error");
            }
        } catch (err) {
            this.showToast("Location error: " + err.message, "error");
        } finally {
            btn.innerHTML = defaultText;
            lucide.createIcons();
        }
    },

    async shareApp() {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Adoca - Local Experts & Bulk Supply',
                    text: 'Connect directly with verified local experts and industrial sellers. Zero commission!',
                    url: window.location.origin
                });
            } catch (err) {
                console.warn("Share failed:", err);
            }
        } else {
            const url = window.location.origin;
            navigator.clipboard.writeText(url);
            this.showToast("Link copied to clipboard!");
        }
    },

    toggleLanguage() {
        const newLang = this.state.lang === 'en' ? 'hi' : 'en';
        this.setLanguage(newLang);
    },

    toggleTheme() {
        this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('adoca_theme', this.state.theme);
        this.applyTheme();
        this.renderPage('profile'); // Refresh profile to show toggle change
        this.showToast(this.state.theme === 'dark' ? "Dark Mode Active" : "Light Mode Active");
    },

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.state.theme);
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.setAttribute('content', this.state.theme === 'dark' ? '#0f172a' : '#1E1B9E');
        }
    },

    showToast(message, type = 'success') {
        const container = document.getElementById('q-toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = 'q-toast';
        toast.innerText = message;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 400);
        }, 2500);
    },

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW:', err));
            });
        }
    },

    // ── Phase 7: Chat Engine (Local-First) ────────────────────────────────────
    chatEngine: {
        STORE_KEY: 'adoca_chat_threads',

        _load() {
            return JSON.parse(localStorage.getItem(this.STORE_KEY) || '[]');
        },

        _save(threads) {
            localStorage.setItem(this.STORE_KEY, JSON.stringify(threads));
        },

        getThreads() {
            return this._load().sort((a, b) => b.updatedAt - a.updatedAt);
        },

        getThread(id) {
            return this._load().find(t => t.id === id) || null;
        },

        createThread(id, requestData) {
            const threads = this._load();
            if (threads.find(t => t.id === id)) return; // Already exists
            const systemMsg = {
                sender: 'system',
                text: `✅ Request posted for "${requestData.category}". Local experts will contact you at ${requestData.phone} shortly.`,
                ts: Date.now()
            };
            const thread = {
                id,
                category: requestData.category || 'Service Request',
                createdAt: Date.now(),
                updatedAt: Date.now(),
                unread: 1,
                lastMessage: systemMsg.text,
                messages: [systemMsg]
            };
            threads.push(thread);
            this._save(threads);
        },

        sendMessage(threadId, inputEl) {
            const text = inputEl ? inputEl.value.trim() : '';
            if (!text) return;
            const threads = this._load();
            const thread = threads.find(t => t.id === threadId);
            if (!thread) return;
            const msg = { sender: 'user', text, ts: Date.now() };
            thread.messages.push(msg);
            thread.lastMessage = text;
            thread.updatedAt = Date.now();
            this._save(threads);
            if (inputEl) inputEl.value = '';
            // Re-render thread
            app.renderChatThread(threadId);
        },

        markRead(threadId) {
            const threads = this._load();
            const thread = threads.find(t => t.id === threadId);
            if (thread) {
                thread.unread = 0;
                this._save(threads);
            }
        }
    },

    // ── Phase 7: Analytics (Lightweight Event Logger) ─────────────────────────
    analytics: {
        STORE_KEY: 'adoca_events',

        track(event, data = {}) {
            try {
                const events = JSON.parse(localStorage.getItem(this.STORE_KEY) || '[]');
                events.push({ event, data, ts: Date.now() });
                // Keep only last 200 events to prevent storage bloat
                if (events.length > 200) events.splice(0, events.length - 200);
                localStorage.setItem(this.STORE_KEY, JSON.stringify(events));
            } catch (e) {
                // Fail silently — analytics must never break the app
            }
        },

        getReport() {
            const events = JSON.parse(localStorage.getItem(this.STORE_KEY) || '[]');
            const summary = {};
            events.forEach(e => {
                summary[e.event] = (summary[e.event] || 0) + 1;
            });
            return summary;
        }
    }
};

// Runtime Start
document.addEventListener('DOMContentLoaded', () => app.init());
