/**
 * ADOCA QUANTUM CORE (v9.0 - Industry Titan)
 * High-Scale Industrial Evolution
 */

const app = {
    container: document.getElementById('app-container'),
    state: {
        type: null,
        category: null,
        sub: null,
        searchTerm: '',
        isMenuOpen: false,
        lang: localStorage.getItem('adoca_lang') || 'en'
    },

    init() {
        console.log(`Adoca Quantum v9.0 | Industry Titan [${this.state.lang.toUpperCase()}]`);
        this.handleRouting();
        window.addEventListener('popstate', () => this.handleRouting());
        this.setupServiceWorker();
        this.setupGlobalHandlers();
    },

    // --- BILINGUAL ENGINE ---

    t(key) {
        return CONFIG.TRANSLATIONS[this.state.lang][key] || key;
    },

    setLanguage(lang) {
        this.state.lang = lang;
        localStorage.setItem('adoca_lang', lang);
        this.handleRouting();
        this.showToast(lang === 'hi' ? "भाषा बदल दी गई है" : "Language Updated");
    },

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW:', err));
            });
        }
    },

    setupGlobalHandlers() {
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('q-search-results');
            const searchBar = document.querySelector('.q-search-bar');
            if (dropdown && searchBar && !searchBar.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    },

    handleRouting() {
        const params = new URLSearchParams(window.location.search);
        let type = params.get('type')?.toLowerCase();
        let categoryId = params.get('category')?.toLowerCase();
        let sub = params.get('sub');
        let page = params.get('page')?.toLowerCase();

        this.state.type = type || null;
        this.state.category = categoryId || null;
        this.state.sub = sub || null;

        if (page) { this.renderPage(page); }
        else if (type && categoryId && sub) { this.renderForm(); }
        else if (type && categoryId) { this.renderSubCategories(); }
        else if (type) { this.renderCategories(); }
        else { this.renderHome(); }

        this.updateBottomNav();
        this.renderLangToggle();
    },

    navigate(type, categoryId = null, sub = null, page = null) {
        const url = new URL(window.location.origin + window.location.pathname);
        if (page) { url.searchParams.set('page', page); }
        else {
            if (type) url.searchParams.set('type', type);
            if (categoryId) url.searchParams.set('category', categoryId);
            if (sub) url.searchParams.set('sub', sub);
        }
        window.history.pushState({}, '', url);
        this.handleRouting();
    },

    renderLangToggle() {
        const header = document.querySelector('.q-header');
        if (!header) return;

        let toggle = document.querySelector('.lang-toggle');
        if (!toggle) {
            toggle = document.createElement('div');
            toggle.className = 'lang-toggle';
            header.appendChild(toggle);
        }

        toggle.innerHTML = `
            <span class="lang-btn ${this.state.lang === 'en' ? 'active' : ''}" onclick="app.setLanguage('en')">EN</span>
            <div style="width:1px; background: rgba(0,0,0,0.1); height: 12px;"></div>
            <span class="lang-btn ${this.state.lang === 'hi' ? 'active' : ''}" onclick="app.setLanguage('hi')">हिन्दी</span>
        `;
    },

    // --- QUANTUM FEEDBACK ---

    showToast(message, type = 'success') {
        const container = document.getElementById('q-toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = 'q-toast';
        toast.innerHTML = `<i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}"></i> <span>${message}</span>`;
        container.appendChild(toast);
        lucide.createIcons();
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    },

    // --- ELITE SEARCH & CHIPS (v9.0) ---

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },

    handleSearchInput(input) {
        const term = input.value.trim().toLowerCase();
        const dropdown = document.getElementById('q-search-results');
        if (!term) { dropdown.classList.remove('active'); return; }

        const safeTerm = this.escapeRegex(term);
        const matches = [];
        const pool = [
            ...CONFIG.SERVICE_CATEGORIES.map(c => ({ ...c, type: 'service' })),
            ...CONFIG.PRODUCT_CATEGORIES.map(c => ({ ...c, type: 'product' }))
        ];

        pool.forEach(cat => {
            const labelEn = cat.label.toLowerCase();
            const labelHi = (cat.label_hi || '').toLowerCase();

            if (labelEn.includes(term) || labelHi.includes(term)) {
                matches.push({ cat, sub: null });
            }

            cat.subs.forEach((s, idx) => {
                const subEn = s.toLowerCase();
                const subHi = (cat.subs_hi ? cat.subs_hi[idx] : '').toLowerCase();
                if (subEn.includes(term) || subHi.includes(term)) {
                    matches.push({ cat, sub: s, sub_hi: cat.subs_hi ? cat.subs_hi[idx] : null });
                }
            });
        });

        const unique = Array.from(new Set(matches.map(m => m.sub ? `${m.cat.id}-${m.sub}` : m.cat.id)))
            .map(id => matches.find(m => (m.sub ? `${m.cat.id}-${m.sub}` : m.cat.id) === id))
            .slice(0, 8);

        if (unique.length > 0) {
            dropdown.innerHTML = unique.map(m => {
                const text = this.state.lang === 'hi' ? (m.sub_hi || m.sub || m.cat.label_hi || m.cat.label) : (m.sub || m.cat.label);
                const highlighted = text.replace(new RegExp(safeTerm, 'gi'), match => `<span class="highlight">${match}</span>`);
                return `
                    <div class="q-search-item" onclick="app.navigate('${m.cat.type}', '${m.cat.id}', ${m.sub ? `'${m.sub}'` : 'null'})">
                        <i data-lucide="${m.sub ? 'search' : m.cat.icon}" style="width:20px;"></i>
                        <div style="display:flex; flex-direction:column;">
                            <span style="font-weight: 700; color: var(--q-text-bold);">${highlighted}</span>
                            <span style="font-size: 0.75rem; color: var(--q-text-light); text-transform: uppercase;">${this.state.lang === 'hi' ? (m.cat.label_hi || m.cat.label) : m.cat.label}</span>
                        </div>
                    </div>
                `;
            }).join('');
            dropdown.classList.add('active');
            lucide.createIcons();
        } else {
            dropdown.innerHTML = `<div style="padding: 32px; text-align: center; color: var(--q-text-light);">${this.state.lang === 'hi' ? 'कोई रिज़ल्ट नहीं मिला' : 'No matches found'}</div>`;
            dropdown.classList.add('active');
        }
    },

    renderSearchChips() {
        const terms = this.state.lang === 'hi' ?
            ['बिजलीवाला', 'नल मिस्त्री', 'सीमेंट', 'बिल्डिंग', 'पेन्टर'] :
            ['Electrician', 'Plumber', 'Cement', 'Construction', 'Painter'];

        return `
            <div class="q-chip-bar">
                ${terms.map(t => `<div class="q-chip" onclick="document.getElementById('q-search-input').value='${t}'; app.handleSearchInput(document.getElementById('q-search-input'))">${t}</div>`).join('')}
            </div>
        `;
    },

    // --- QUANTUM UI RENDERERS ---

    renderHome() {
        this.container.innerHTML = `
            <div class="q-screen">
                <section class="q-hero">
                    <h2>${this.t('tagline')}</h2>
                    <p>${this.t('sub_tagline')}</p>
                </section>

                <div class="q-search-dock">
                    <div class="q-search-bar">
                        <input type="text" id="q-search-input" placeholder="${this.t('search_placeholder')}" 
                               class="q-search-input" oninput="app.handleSearchInput(this)" autocomplete="off">
                        <div class="q-search-icon" onclick="document.getElementById('q-search-input').focus()">
                            <i data-lucide="search"></i>
                        </div>
                        <div id="q-search-results" class="q-search-results"></div>
                    </div>
                    ${this.renderSearchChips()}
                </div>

                <div class="q-section-title">
                    <i data-lucide="zap" style="color:var(--q-secondary);"></i> ${this.t('trending')}
                </div>
                <div class="q-grid">
                    ${this.getPopularHTML()}
                </div>

                ${this.renderTrustNexus()}

                <div class="q-section-title">
                    <i data-lucide="shield-check" style="color:var(--q-primary);"></i> ${this.t('trust_shield')}
                </div>
                <div style="padding: 0 24px;">
                    <div class="q-card" style="text-align: left; background: var(--q-primary); color: white; display:flex; align-items:center; gap:20px; padding: 32px; border:none;">
                        <i data-lucide="award" style="width:48px; height:48px; color:var(--q-accent);"></i>
                        <div>
                            <h3 style="color:white; font-size: 1.25rem;">${this.state.lang === 'hi' ? 'अडोका सर्टिफाइड' : 'Adoca Certified'}</h3>
                            <p style="color: rgba(255,255,255,0.7);">${this.t('trust_desc')}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        lucide.createIcons();
    },

    renderTrustNexus() {
        return `
            <div class="q-trust-nexus">
                <span style="color: var(--q-secondary); font-weight: 800; letter-spacing: 0.2em; font-size: 0.75rem; text-transform: uppercase;">${this.t('safety_nexus')}</span>
                <h2 style="font-size: 2.5rem; font-weight: 900; margin-top: 12px; letter-spacing: -0.05em;">${this.t('how_it_works')}</h2>
                <div class="q-technical-line"></div>
                
                <div class="q-step-grid">
                    <div class="q-step-card">
                        <div class="q-step-icon"><i data-lucide="file-edit"></i></div>
                        <h4>${this.t('process_step_1')}</h4>
                        <p>${this.state.lang === 'hi' ? 'अपनी जरूरत बताएं और रिक्वेस्ट दर्ज करें' : 'Describe your need and lodge a quantum request.'}</p>
                    </div>
                    <div class="q-step-card">
                        <div class="q-step-icon"><i data-lucide="user-check"></i></div>
                        <h4>${this.t('process_step_2')}</h4>
                        <p>${this.state.lang === 'hi' ? 'सर्टिफाइड एक्सपर्ट आपसे संपर्क करेगा' : 'A verified professional is assigned to your case.'}</p>
                    </div>
                    <div class="q-step-card">
                        <div class="q-step-icon"><i data-lucide="shield-check"></i></div>
                        <h4>${this.t('process_step_3')}</h4>
                        <p>${this.state.lang === 'hi' ? 'क्वालिटी की जांच के बाद काम पूरा' : 'Service delivered with 100% quality assurance.'}</p>
                    </div>
                </div>
            </div>
        `;
    },

    getPopularHTML() {
        const items = [...CONFIG.SERVICE_CATEGORIES.slice(0, 4), ...CONFIG.PRODUCT_CATEGORIES.slice(0, 4)];
        return items.map((cat, i) => `
            <div class="q-card" onclick="app.navigate('${CONFIG.SERVICE_CATEGORIES.includes(cat) ? 'service' : 'product'}', '${cat.id}')">
                <div style="display:flex; justify-content:center;">
                    <span class="q-badge ${i % 2 === 0 ? 'verified' : 'elite'}">
                        <i data-lucide="${i % 2 === 0 ? 'check-circle' : 'award'}" style="width:12px;"></i>
                        ${i % 2 === 0 ? this.t('verified_pro') : this.t('elite_partner')}
                    </span>
                </div>
                <div class="q-card-icon"><i data-lucide="${cat.icon}"></i></div>
                <h3>${cat.label}</h3>
            </div>
        `).join('');
    },

    renderCategories() {
        const categories = this.state.type === 'service' ? CONFIG.SERVICE_CATEGORIES : CONFIG.PRODUCT_CATEGORIES;
        const title = this.state.type === 'service' ? this.t('experts_title') : this.t('supply_title');

        this.container.innerHTML = `
            <div class="q-screen">
                <div style="padding: 48px 24px 24px; text-align: center;">
                    <span style="font-weight: 800; color: var(--q-primary); letter-spacing: 2px; font-size: 0.8rem; text-transform: uppercase;">${this.t('brand_name')}</span>
                    <h2 style="font-size: 3rem; font-weight: 900; letter-spacing: -0.06em; margin-top: 8px;">${title}</h2>
                </div>
                <div class="q-grid">
                    ${categories.map((cat, i) => `
                        <div class="q-card" onclick="app.navigate('${this.state.type}', '${cat.id}')">
                             <div style="display:flex; justify-content:center;">
                                <span class="q-badge ${i % 3 === 0 ? 'elite' : 'verified'}">
                                    <i data-lucide="${i % 3 === 0 ? 'award' : 'check-circle'}" style="width:10px;"></i>
                                    ${i % 3 === 0 ? this.t('elite_partner') : this.t('verified_pro')}
                                </span>
                            </div>
                            <div class="q-card-icon"><i data-lucide="${cat.icon}"></i></div>
                            <h3>${cat.label}</h3>
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
            <div class="q-screen">
                <div style="padding: 48px 24px 32px;">
                    <button onclick="app.navigate('${this.state.type}')" style="border:none; background: var(--q-bg-soft); padding: 12px 24px; border-radius: 100px; font-weight: 700; color: var(--q-primary); display: flex; align-items: center; gap: 8px;">
                        <i data-lucide="chevron-left" style="width:18px;"></i> ${this.t('back')}
                    </button>
                    <h2 style="font-size: 2.5rem; font-weight: 900; color: var(--q-text-bold); margin-top: 24px; letter-spacing:-0.05em;">${category.label}</h2>
                    <p style="color: var(--q-text-light); font-weight: 600;">${this.state.lang === 'hi' ? 'सही काम चुनें' : 'Refine your selection.'}</p>
                </div>
                <div class="q-grid">
                    ${category.subs.map(sub => `
                        <div class="q-card" style="display:flex; justify-content: space-between; align-items: center; padding: 24px; text-align: left;" onclick="app.navigate('${this.state.type}', '${category.id}', '${sub}')">
                            <h3 style="font-size: 1.1rem;">${sub}</h3>
                            <i data-lucide="plus" style="color: var(--q-secondary);"></i>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        lucide.createIcons();
    },

    renderForm() {
        const pool = this.state.type === 'service' ? CONFIG.SERVICE_CATEGORIES : CONFIG.PRODUCT_CATEGORIES;
        const category = pool.find(c => c.id === this.state.category);
        const fields = [...CONFIG.FORM_FIELDS.common, ...(this.state.type === 'service' ? CONFIG.FORM_FIELDS.service : CONFIG.FORM_FIELDS.product)];

        this.container.innerHTML = `
            <div class="q-screen">
                <div class="q-form-island">
                    <div class="q-form-header">
                        <span style="font-weight: 800; color: var(--q-primary); font-size: 0.75rem; letter-spacing: 0.1em;">${this.t('confirm')}</span>
                        <h2>${this.state.sub}</h2>
                    </div>
                    <form id="q-request-form">
                        <input type="hidden" name="category" value="${category?.label} - ${this.state.sub}">
                        <input type="hidden" name="type" value="${this.state.type}">
                        ${fields.map(f => `
                            <div class="q-form-group">
                                <label class="q-form-label">${f.label}</label>
                                ${f.type === 'textarea' ? `<textarea class="q-input" style="min-height: 140px;" name="${f.name}" placeholder="${f.placeholder}" required></textarea>` :
                f.type === 'select' ? `<select class="q-input" name="${f.name}" required><option value="" disabled selected>${this.state.lang === 'hi' ? 'विकल्प चुनें...' : 'Select Option...'}</option>${f.options.map(o => `<option value="${o}">${o}</option>`).join('')}</select>` :
                    `<input type="${f.type}" class="q-input" name="${f.name}" placeholder="${f.placeholder}" required oninput="app.validate(this)">`}
                            </div>
                        `).join('')}
                        <button type="submit" class="q-btn" id="q-submit-btn">${this.t('submit')}</button>
                    </form>
                </div>
            </div>
        `;
        lucide.createIcons();
        document.getElementById('q-request-form').addEventListener('submit', (e) => this.handleSubmit(e));
    },

    validate(input) {
        let valid = input.type === 'tel' ? /^[6-9]\d{9}$/.test(input.value.trim()) : input.value.trim().length >= 3;
        input.style.border = valid ? '2px solid #22C55E' : 'none';
    },

    async handleSubmit(e) {
        e.preventDefault();
        const btn = document.getElementById('q-submit-btn');
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        btn.disabled = true;
        btn.innerHTML = this.t('processing');

        try {
            const res = await submitHandler.send(data);
            if (res.success) {
                this.showToast(this.t('verified'));
                this.renderSuccess(data);
            } else throw new Error(res.error);
        } catch (err) {
            this.showToast(err.message, "error");
            btn.disabled = false;
            btn.innerHTML = this.t('submit');
        }
    },

    renderSuccess(data) {
        this.container.innerHTML = `
            <div class="q-screen" style="display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding: 24px;">
                <div style="width: 140px; height: 140px; background: var(--q-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 40px; box-shadow: var(--q-shadow-deep);">
                    <i data-lucide="check" style="color: var(--q-accent); width: 80px; height: 80px;"></i>
                </div>
                <h2 style="font-size: 3.5rem; font-weight: 900; color: var(--q-text-bold); letter-spacing:-0.05em; margin-bottom: 16px;">${this.t('verified')}</h2>
                <p style="color: var(--q-text-light); font-size: 1.25rem; max-width: 400px; margin-bottom: 48px;">${this.t('success_msg')}</p>
                <button class="q-btn" onclick="location.href='/'" style="max-width:300px;">${this.t('hub')}</button>
            </div>
        `;
        lucide.createIcons();
    },

    renderPage(id) {
        if (id === 'contact') return this.renderContact();

        const contents = {
            about: { title: this.state.lang === 'hi' ? "हमारी विज़न" : "Adoca Vision", content: CONFIG.BRAND.STORY },
        };
        const p = contents[id] || { title: "Nexus Docs", content: "Certified documentation." };

        this.container.innerHTML = `
            <div class="q-screen" style="padding: 48px 24px;">
                <button onclick="app.navigate(null)" style="border:none; background: var(--q-bg-soft); padding: 12px 24px; border-radius: 100px; font-weight: 700; color: var(--q-primary); margin-bottom: 40px;">
                    <i data-lucide="arrow-left"></i> ${this.t('hub')}
                </button>
                <h2 style="font-size: 3.5rem; font-weight: 900; color: var(--q-text-bold); letter-spacing:-0.07em; margin-bottom: 32px;">${p.title}</h2>
                <div class="q-form-island" style="margin:0; line-height: 2.2; font-size:1.15rem;">${p.content}</div>
            </div>
        `;
        lucide.createIcons();
    },

    renderContact() {
        this.container.innerHTML = `
            <div class="q-screen" style="padding: 48px 24px;">
                <div style="text-align: center; margin-bottom: 48px;">
                    <span style="font-weight: 800; color: var(--q-primary); font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase;">24/7 Support</span>
                    <h2 style="font-size: 3rem; font-weight: 900; color: var(--q-text-bold); letter-spacing:-0.06em; margin-top: 8px;">${this.t('contact_title')}</h2>
                    <p style="color: var(--q-text-light); margin-top: 12px;">${this.t('contact_desc')}</p>
                </div>
                
                <div style="max-width: 600px; margin: 0 auto;">
                    <a href="tel:${CONFIG.BRAND.PHONE}" class="q-contact-card">
                        <i data-lucide="phone"></i>
                        <div>
                            <span style="display:block; font-weight: 800; font-size: 1.25rem;">Call Supervisor</span>
                            <span style="color: var(--q-primary); font-weight: 700;">${CONFIG.BRAND.PHONE}</span>
                        </div>
                    </a>
                    
                    <a href="https://wa.me/${CONFIG.BRAND.PHONE.replace(/\D/g, '')}" class="q-contact-card">
                        <i data-lucide="message-circle" style="background:#25D366; color:white;"></i>
                        <div>
                            <span style="display:block; font-weight: 800; font-size: 1.25rem;">WhatsApp Status</span>
                            <span style="color: #25D366; font-weight: 700;">Chat with Nexus Team</span>
                        </div>
                    </a>
                    
                    <a href="mailto:${CONFIG.BRAND.EMAIL}" class="q-contact-card">
                        <i data-lucide="mail"></i>
                        <div>
                            <span style="display:block; font-weight: 800; font-size: 1.25rem;">Official Query</span>
                            <span style="color: var(--q-text-light); font-weight: 600;">${CONFIG.BRAND.EMAIL}</span>
                        </div>
                    </a>
                </div>
            </div>
        `;
        lucide.createIcons();
    },

    updateBottomNav() {
        const navItems = document.querySelectorAll('.q-nav-item');
        const labels = {
            'nav-home': this.t('nav_home'),
            'nav-services': this.t('nav_experts'),
            'nav-products': this.t('nav_supply')
        };

        navItems.forEach(item => {
            item.classList.remove('active');
            const span = item.querySelector('span');
            if (span && labels[item.id]) span.innerText = labels[item.id];
        });

        if (!this.state.type && !this.state.sub) { document.getElementById('nav-home')?.classList.add('active'); }
        else if (this.state.type === 'service') { document.getElementById('nav-services')?.classList.add('active'); }
        else if (this.state.type === 'product') { document.getElementById('nav-products')?.classList.add('active'); }

        // Update support label if exists
        const lastItem = navItems[3];
        if (lastItem) lastItem.querySelector('span').innerText = this.t('nav_support');
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());
