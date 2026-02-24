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
        lang: localStorage.getItem('adoca_lang') || 'en',
        theme: localStorage.getItem('adoca_theme') || 'light'
    },

    init() {
        console.log(`Adoca Titan v10.0 | Global Industrial Core [${this.state.lang.toUpperCase()}]`);
        this.applyTheme();
        this.handleRouting();
        window.addEventListener('popstate', () => this.handleRouting());
        this.setupServiceWorker();
        this.setupGlobalHandlers();

        // Initial icon sweep for index.html elements
        if (typeof lucide !== 'undefined') lucide.createIcons();
    },

    simulateLoading(callback) {
        this.container.innerHTML = `
            <div class="q-screen" style="padding: 48px 24px;">
                <div class="q-skeleton-title q-skeleton"></div>
                <div class="q-skeleton-text q-skeleton" style="width: 40%"></div>
                <div class="q-grid" style="margin-top: 48px; border:none;">
                    <div class="q-skeleton-card q-skeleton"></div>
                    <div class="q-skeleton-card q-skeleton"></div>
                    <div class="q-skeleton-card q-skeleton"></div>
                    <div class="q-skeleton-card q-skeleton"></div>
                </div>
            </div>
        `;
        setTimeout(() => callback(), 400);
    },

    renderBreadcrumbs() {
        if (!this.state.type) return '';
        let crumbs = `<span onclick="app.navigate(null)">Nexus</span> <i data-lucide="chevron-right"></i> `;
        if (this.state.type) crumbs += `<span onclick="app.navigate('${this.state.type}')">${this.state.type === 'service' ? 'Experts' : 'Supply'}</span> `;
        if (this.state.category) crumbs += `<i data-lucide="chevron-right"></i> <span onclick="app.navigate('${this.state.type}', '${this.state.category}')">${this.state.category.toUpperCase()}</span> `;
        return `<div class="q-breadcrumbs">${crumbs}</div>`;
    },

    toggleTheme() {
        this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('adoca_theme', this.state.theme);
        this.applyTheme();
    },

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.state.theme);
        const icon = document.querySelector('#q-theme-toggle i');
        if (icon) {
            icon.setAttribute('data-lucide', this.state.theme === 'light' ? 'moon' : 'sun');
            lucide.createIcons();
        }
    },

    toggleMobileMenu() {
        const menu = document.getElementById('q-mobile-menu');
        this.state.isMenuOpen = !this.state.isMenuOpen;
        if (this.state.isMenuOpen) {
            menu.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            menu.classList.remove('active');
            document.body.style.overflow = '';
        }
    },

    renderPage(name) {
        switch (name) {
            case 'contact': this.renderContact(); break;
            case 'business': this.renderBusinessListing(); break;
            default: this.renderHome();
        }
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
        else if (type && categoryId && sub) { this.renderDetails(categoryId, sub); }
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
        this.simulateLoading(() => this.handleRouting());
    },

    renderLangToggle() {
        const toggle = document.getElementById('lang-toggle-container');
        if (!toggle) return;

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

    handleHeroSearch(input) {
        const term = input.value.trim().toLowerCase();
        const dropdown = document.getElementById('q-hero-search-results');
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
            if (labelEn.includes(term) || labelHi.includes(term)) matches.push({ cat, sub: null });
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
            .slice(0, 5);

        if (unique.length > 0) {
            dropdown.innerHTML = unique.map(m => {
                const text = this.state.lang === 'hi' ? (m.sub_hi || m.sub || m.cat.label_hi || m.cat.label) : (m.sub || m.cat.label);
                return `<div class="q-search-item" onclick="app.navigate('${m.cat.type}', '${m.cat.id}', ${m.sub ? `'${m.sub}'` : 'null'})">
                    <i data-lucide="${m.sub ? 'search' : m.cat.icon}" style="width:16px;"></i>
                    <span>${text}</span>
                </div>`;
            }).join('');
            dropdown.classList.add('active');
            lucide.createIcons();
        } else {
            dropdown.classList.remove('active');
        }
    },

    renderLangToggle() {
        const mobileContainer = document.getElementById('mobile-lang-toggle');
        const headerAction = document.querySelector('.q-header-actions');

        const pillHtml = `
            <div class="q-lang-pill" onclick="app.setLanguage('${this.state.lang === 'en' ? 'hi' : 'en'}')">
                <i data-lucide="languages" style="width:16px;"></i>
                <span>${this.state.lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </div>
        `;

        // Update mobile menu if it exists
        if (mobileContainer) mobileContainer.innerHTML = pillHtml;

        // Header pill visibility is handled by CSS media queries
        if (headerAction) {
            let existingPill = headerAction.querySelector('.q-lang-pill');
            if (existingPill) {
                existingPill.outerHTML = pillHtml;
            } else {
                const div = document.createElement('div');
                div.innerHTML = pillHtml;
                headerAction.insertBefore(div.firstElementChild, headerAction.firstChild);
            }
        }
        lucide.createIcons();
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
                <!-- RECONSTRUCTED HERO SECTION (v10.0) -->
                <section class="q-hero-v2">
                    <div class="q-hero-group">
                        <div class="q-hero-info">
                            <h2>${this.t('brand_name')}</h2>
                            <p>${this.t('tagline')}</p>
                            
                            <div class="q-checklist-card">
                                <div class="q-check-item"><i data-lucide="check"></i> ${this.t('no_commission')}</div>
                                <div class="q-check-item"><i data-lucide="check"></i> ${this.t('smart_deals')}</div>
                                <div class="q-check-item"><i data-lucide="check"></i> ${this.t('easy_billing')}</div>
                            </div>
                        </div>

                        <div class="q-hero-action-dock">
                            <div class="q-hero-search">
                                <input type="text" id="q-search-input-home" placeholder="${this.t('search_placeholder')}" 
                                       oninput="app.handleHeroSearch(this)">
                                <button class="q-btn-primary" onclick="app.navigate('service')">${this.t('find_deals')}</button>
                                <div id="q-hero-search-results" class="q-search-results"></div>
                            </div>

                            <div class="q-hero-proof">
                                <div class="q-stars">
                                    <i data-lucide="star"></i><i data-lucide="star"></i><i data-lucide="star"></i><i data-lucide="star"></i><i data-lucide="star"></i>
                                </div>
                                <span>Rated 4.9/5 by 850+ local users</span>
                            </div>
                        </div>

                        <div class="q-app-badges">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store">
                        </div>
                    </div>

                    <div class="q-hero-visual-desktop">
                        <img src="assets/online-shopping-concept-landing-page/2741840.jpg" alt="Local Shopping Industrial" onerror="this.style.display='none'">
                        <div class="q-float-badge b1">Best Price!</div>
                        <div class="q-float-badge b2">Local Trust</div>
                    </div>
                </section>

                <!-- HOW IT WORKS SECTION -->
                <section class="q-section" id="how">
                    <div style="text-align: center; margin-bottom: 64px;">
                        <h2 style="font-size: 40px; font-weight: 800; color: var(--q-primary);">How Adoca Works</h2>
                    </div>
                    
                    <div class="q-grid-3">
                        <div class="q-step-card">
                            <div class="q-step-num">1</div>
                            <h3>Post your needs</h3>
                            <div class="q-step-mockup">
                                <div class="q-phone-frame">
                                    <div class="q-phone-header"></div>
                                    <div class="q-phone-content">
                                        <div style="padding: 10px; background: var(--q-bg-soft); border-radius: 8px; margin-bottom: 8px;">Electrician</div>
                                        <div style="padding: 10px; background: var(--q-bg-soft); border-radius: 8px;">Cement</div>
                                    </div>
                                </div>
                            </div>
                            <p>Local sellers receive from you instantly.</p>
                        </div>

                        <div class="q-step-card">
                            <div class="q-step-num">2</div>
                            <h3>Receive best offers</h3>
                            <div class="q-step-mockup">
                                <div class="q-phone-frame">
                                    <div class="q-phone-header"></div>
                                    <div class="q-phone-content">
                                        <div style="display:flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #eee;">
                                            <span>Shop A</span>
                                            <span style="color: var(--q-success); font-weight: 700;">₹7800</span>
                                        </div>
                                        <div style="display:flex; justify-content: space-between; padding: 10px;">
                                            <span>Shop B</span>
                                            <span style="color: var(--q-success); font-weight: 700;">₹7500</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p>Price within minutes from all local sellers.</p>
                        </div>

                        <div class="q-step-card">
                            <div class="q-step-num">3</div>
                            <h3>Grab the best deal</h3>
                            <div class="q-step-mockup">
                                <div class="q-phone-frame">
                                    <div class="q-phone-header"></div>
                                    <div class="q-phone-content" style="display:flex; align-items:center; justify-content:center; height: 100%;">
                                        <i data-lucide="check-circle" style="color: var(--q-success); width: 48px; height: 48px;"></i>
                                    </div>
                                </div>
                            </div>
                            <p>Visit the store to pick up your order.</p>
                        </div>
                    </div>
                </section>

                <!-- BUSINESS RECONSTRUCTION -->
                <section class="q-business-card" id="sellers">
                    <div class="q-business-info">
                        <h2>${this.t('empower_business')}</h2>
                        <p>${this.t('empower_business_desc')}</p>
                    </div>
                    <div class="q-grid-2">
                        <div class="q-feature-list">
                            <div class="q-feature-item">
                                <div class="q-feature-icon"><i data-lucide="layout"></i></div>
                                <div>
                                    <h4>Digital Profiles</h4>
                                    <p>Grow your online presence for free.</p>
                                </div>
                            </div>
                            <div class="q-feature-item">
                                <div class="q-feature-icon"><i data-lucide="file-text"></i></div>
                                <div>
                                    <h4>Smart Billing</h4>
                                    <p>Easy invoicing and customer management.</p>
                                </div>
                            </div>
                            <div class="q-feature-item">
                                <div class="q-feature-icon"><i data-lucide="message-square"></i></div>
                                <div>
                                    <h4>Direct Communication</h4>
                                    <p>Chat and negotiate with customers directly.</p>
                                </div>
                            </div>
                            <div class="q-feature-item">
                                <div class="q-feature-icon"><i data-lucide="trending-up"></i></div>
                                <div>
                                    <h4>Increase Sales</h4>
                                    <p>Get more customers without paying commissions.</p>
                                </div>
                            </div>
                        </div>

                        <div class="q-business-visual">
                            <img src="assets/laptop-ecommerce-technology-with-website-basket/56054.jpg" alt="Business Growth" style="width:100%; height:250px; object-fit:cover; border-radius: 20px;" onerror="this.style.display='none'">
                            <button class="q-btn-primary" style="margin-top: 40px; width: 100%; border-radius: 100px;">List Your Business Free</button>
                        </div>
                    </div>
                </section>

                <!-- FOOTER SECTION -->
                <footer class="q-footer">
                    <div class="q-footer-stats">
                        <div class="q-stat-item">
                            <h3>1.5K+</h3>
                            <p>Local Deals</p>
                        </div>
                        <div class="q-stat-item">
                            <h3>300+</h3>
                            <p>Verified Sellers</p>
                        </div>
                        <div class="q-stat-item">
                            <h3>850+</h3>
                            <p>Satisfied Users</p>
                        </div>
                    </div>

                    <div class="q-footer-main">
                        <div class="q-footer-brand">
                            <div class="q-brand">
                                <img src="assets/logo.png" class="q-logo-img">
                                <h1>adoca</h1>
                            </div>
                            <h4 style="margin-bottom: 12px; font-weight: 800;">Quick Links</h4>
                            <div class="q-footer-links">
                                <a href="#" onclick="app.navigate(null)">Home</a>
                                <a href="#how">How it works</a>
                                <a href="#features">About US</a>
                                <a href="#sellers">FAQ</a>
                            </div>
                        </div>

                        <div class="q-footer-contact">
                            <div class="q-contact-item">
                                <div style="width:40px; height:40px; background:white; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow: var(--q-shadow);">
                                    <i data-lucide="phone" style="width:18px; color: var(--q-primary);"></i>
                                </div>
                                <span style="font-weight: 700;">+91 7631441992</span>
                            </div>
                            <div class="q-contact-item">
                                <div style="width:40px; height:40px; background:white; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow: var(--q-shadow);">
                                    <i data-lucide="mail" style="width:18px; color: var(--q-primary);"></i>
                                </div>
                                <span style="font-weight: 700;">info@adoca.in</span>
                            </div>
                        </div>

                        <div class="q-footer-qr">
                            <div class="q-qr-mockup">
                                <i data-lucide="qr-code" style="width:64px; height:64px; opacity: 0.1;"></i>
                            </div>
                        </div>
                    </div>
                </footer>
        `;
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        } else {
            console.error('Lucide not loaded');
        }
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
        const trending = categories.filter(c => CONFIG.TRENDING_EXPERTS.includes(c.id));

        this.container.innerHTML = `
            <div class="q-page-inner">
                <div style="padding: 40px 24px;">
                    ${this.renderBreadcrumbs()}
                    <h2 style="font-size: 3.5rem; font-weight: 900; letter-spacing: -0.06em; margin-top: 24px; color: var(--q-primary);">${title}</h2>
                    <p style="color: var(--q-text-light); font-weight: 600; margin-top: 8px;">${this.t('trending_now')}</p>
                </div>

                <!-- Trending Row -->
                <div style="display: flex; gap: 16px; overflow-x: auto; padding: 0 24px 32px; scrollbar-width: none;">
                    ${trending.map(cat => `
                        <div class="q-card-adoca" style="min-width: 200px; padding: 24px; text-align: center;" onclick="app.navigate('${this.state.type}', '${cat.id}')">
                            <div class="q-expert-badge elite" style="margin-bottom: 12px;"><i data-lucide="award" style="width:12px;"></i> TRENDING</div>
                            <div class="q-card-icon" style="margin: 0 auto 12px; background: var(--q-bg-soft); color: var(--q-primary);"><i data-lucide="${cat.icon}"></i></div>
                            <h3 style="font-size: 1rem;">${cat.label}</h3>
                        </div>
                    `).join('')}
                </div>

                <div class="q-grid-3" style="padding: 0 24px 80px;">
                    ${categories.map((cat, i) => `
                        <div class="q-card-adoca" onclick="app.navigate('${this.state.type}', '${cat.id}')">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
                                <div class="q-card-icon" style="background: var(--q-bg-soft); color: var(--q-primary);"><i data-lucide="${cat.icon}"></i></div>
                                <div class="q-expert-badge ${i % 3 === 0 ? 'elite' : 'verified'}">
                                    <i data-lucide="${i % 3 === 0 ? 'award' : 'check-circle'}" style="width:12px;"></i>
                                    ${i % 3 === 0 ? 'Elite' : 'Verified'}
                                </div>
                            </div>
                            <h3>${cat.label}</h3>
                            <p style="font-size: 0.85rem; color: var(--q-text-light); margin-top: 8px;">Verified ${cat.label.toLowerCase()} hub.</p>
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
            <div class="q-page-inner">
                <div style="padding: 40px 24px;">
                    ${this.renderBreadcrumbs()}
                    <h2 style="font-size: 3rem; font-weight: 950; color: var(--q-primary); margin-top: 24px; letter-spacing:-0.05em;">${category.label}</h2>
                    <p style="color: var(--q-text-light); font-weight: 600; font-size: 1.1rem; margin-top: 8px;">${this.state.lang === 'hi' ? 'सही काम चुनें' : 'Refine your selection.'}</p>
                </div>
                <div class="q-grid-3" style="padding: 0 24px 80px;">
                    ${category.subs.map(sub => `
                        <div class="q-card-adoca" style="display:flex; justify-content: space-between; align-items: center;" onclick="app.navigate('${this.state.type}', '${category.id}', '${sub}')">
                            <h3>${sub}</h3>
                            <div style="width:32px; height:32px; background: var(--q-secondary); border-radius: 50%; display:flex; align-items:center; justify-content:center;">
                                <i data-lucide="arrow-right" style="width:16px; color: var(--q-primary);"></i>
                            </div>
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
            <div class="q-page-inner">
                <div style="padding: 40px 24px;">
                    ${this.renderBreadcrumbs()}
                    <h2 style="font-size: 2.5rem; font-weight: 900; color: var(--q-primary); margin-top: 24px; letter-spacing:-0.05em;">Confirm ${this.state.sub}</h2>
                </div>
                
                <div style="max-width: 600px; padding: 0 24px 100px;">
                    <div class="q-card-adoca">
                        <form id="q-request-form">
                            <input type="hidden" name="category" value="${category?.label} - ${this.state.sub}">
                            <input type="hidden" name="type" value="${this.state.type}">
                            ${fields.map(f => `
                                <div class="q-form-group" style="margin-bottom: 24px;">
                                    <label class="q-form-label" style="display:block; margin-bottom: 8px; font-weight: 700; color: var(--q-primary);">${f.label}</label>
                                    ${f.type === 'textarea' ? `<textarea class="q-input" style="width:100%; min-height: 120px; padding: 16px; border-radius: 12px; border: 1px solid #ddd; outline:none;" name="${f.name}" placeholder="${f.placeholder}" required></textarea>` :
                f.type === 'select' ? `<select class="q-input" style="width:100%; padding: 16px; border-radius: 12px; border: 1px solid #ddd;" name="${f.name}" required><option value="" disabled selected>${this.state.lang === 'hi' ? 'विकल्प चुनें...' : 'Select Option...'}</option>${f.options.map(o => `<option value="${o}">${o}</option>`).join('')}</select>` :
                    `<input type="${f.type}" class="q-input" style="width:100%; padding: 16px; border-radius: 12px; border: 1px solid #ddd;" name="${f.name}" placeholder="${f.placeholder}" required oninput="app.validate(this)">`}
                                </div>
                            `).join('')}
                            <button type="submit" class="q-btn-primary" style="width: 100%; margin-top: 24px;" id="q-submit-btn">${this.t('submit')}</button>
                        </form>
                    </div>
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
                // Save to local history
                const history = JSON.parse(localStorage.getItem('adoca_history') || '[]');
                history.push({ ...data, timestamp: Date.now() });
                localStorage.setItem('adoca_history', JSON.stringify(history));
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
            <div class="q-page-inner" style="display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; min-height: 80vh; padding: 24px;">
                <div style="width: 140px; height: 140px; background: var(--q-secondary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 40px; box-shadow: var(--q-shadow-deep);">
                    <i data-lucide="check" style="color: var(--q-primary); width: 80px; height: 80px;"></i>
                </div>
                <h2 style="font-size: 3.5rem; font-weight: 900; color: var(--q-primary); letter-spacing:-0.05em; margin-bottom: 16px;">${this.t('verified')}</h2>
                <p style="color: var(--q-text-light); font-size: 1.25rem; max-width: 400px; margin-bottom: 48px; font-weight: 600;">${this.t('success_msg')}</p>
                <button class="q-btn-primary" onclick="location.href='/'" style="width:100%; max-width:280px; border-radius: 100px;">${this.t('hub')}</button>
            </div>
        `;
        lucide.createIcons();
    },

    renderPage(id) {
        if (id === 'contact') return this.renderContact();
        if (id === 'activity') return this.renderActivity();

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

    renderActivity() {
        const history = JSON.parse(localStorage.getItem('adoca_history') || '[]');
        this.container.innerHTML = `
            <div class="q-page-inner" style="padding: 48px 24px;">
                <h2 style="font-size: 3.5rem; font-weight: 950; color: var(--q-primary); letter-spacing:-0.06em; margin-bottom: 12px;">${this.t('nav_activity')}</h2>
                <p style="color: var(--q-text-light); font-weight: 600; font-size: 1.1rem; margin-bottom: 40px;">${this.state.lang === 'hi' ? 'आपकी पिछली बुकिंग' : 'Your recent local activity.'}</p>
                
                <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap:24px;">
                    ${history.length === 0 ? `
                        <div style="grid-column: 1/-1; text-align:center; padding: 100px 40px; background: var(--q-bg-soft); border-radius: 32px;">
                            <i data-lucide="history" style="width:64px; height:64px; color: var(--q-text-light); opacity: 0.3; margin-bottom: 24px;"></i>
                            <p style="font-weight: 700; color: var(--q-text-light); font-size: 1.2rem;">${this.state.lang === 'hi' ? 'अभी कोई बुकिंग नहीं मिली' : 'No history found locally.'}</p>
                        </div>
                    ` : history.reverse().map(h => `
                        <div class="q-card-adoca" style="text-align: left;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px;">
                                <span class="q-badge verified"><i data-lucide="check-circle" style="width:12px;"></i> ${h.type.toUpperCase()}</span>
                                <span style="font-size: 0.8rem; font-weight: 700; color: var(--q-text-light);">${new Date(h.timestamp).toLocaleDateString()}</span>
                            </div>
                            <h3 style="font-size: 1.5rem; margin-bottom: 12px;">${h.category}</h3>
                            <div style="display:flex; align-items:center; gap:8px; color: var(--q-primary); font-weight: 700;">
                                <i data-lucide="map-pin" style="width:16px;"></i> ${h.location}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        lucide.createIcons();
    },

    renderDetails(catId, sub) {
        const pool = this.state.type === 'service' ? CONFIG.SERVICE_CATEGORIES : CONFIG.PRODUCT_CATEGORIES;
        const category = pool.find(c => c.id === catId);

        this.container.innerHTML = `
            <div class="q-page-inner" style="padding: 48px 24px;">
                ${this.renderBreadcrumbs()}
                
                <div style="margin-bottom: 48px; margin-top: 24px;">
                    <span style="font-weight: 800; color: var(--q-primary); text-transform: uppercase; letter-spacing: 2px; font-size: 0.8rem;">${category.label}</span>
                    <h2 style="font-size: 4rem; font-weight: 950; color: var(--q-primary); letter-spacing: -0.06em; margin-top: 8px;">${sub}</h2>
                </div>

                <div class="q-grid-2">
                    <!-- Professional Pricing Card -->
                    <div class="q-card-adoca" style="background: var(--q-bg-soft); border-color: var(--q-secondary);">
                        <h4 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 24px; color: var(--q-primary);">${this.state.lang === 'hi' ? 'विशेषताएं' : 'What\'s Included'}</h4>
                        <ul style="list-style: none; display:grid; gap:16px;">
                            <li style="display:flex; gap:12px; font-weight: 600;"><i data-lucide="check-circle" style="color:var(--q-success); width:20px;"></i> ${this.state.lang === 'hi' ? 'सर्टिफाइड एक्सपर्ट्स' : 'Certified Professionals'}</li>
                            <li style="display:flex; gap:12px; font-weight: 600;"><i data-lucide="check-circle" style="color:var(--q-success); width:20px;"></i> ${this.state.lang === 'hi' ? '४५ मिनट में सर्विस' : 'Service within 45 Minutes'}</li>
                            <li style="display:flex; gap:12px; font-weight: 600;"><i data-lucide="check-circle" style="color:var(--q-success); width:20px;"></i> ${this.state.lang === 'hi' ? 'पारदर्शी बिलिंग' : 'Transparent Billing'}</li>
                            <li style="display:flex; gap:12px; font-weight: 600;"><i data-lucide="check-circle" style="color:var(--q-success); width:20px;"></i> ${this.state.lang === 'hi' ? '३० दिन की वारंटी' : '30-Day Service Warranty'}</li>
                        </ul>
                    </div>

                    <!-- Reviews Carousel -->
                    <div style="margin-top: 16px;">
                        <h4 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 24px; color: var(--q-primary);">${this.state.lang === 'hi' ? 'यूजर रिव्यू' : 'Member Reviews'}</h4>
                        <div class="q-carousel">
                            ${(CONFIG.REVIEWS[this.state.category] || CONFIG.REVIEWS.default).map(r => `
                                <div class="q-carousel-item" style="background: white; border-radius: 20px; padding: 24px; min-width: 280px; box-shadow: var(--q-shadow);">
                                    <div style="display:flex; align-items:center; gap:8px; margin-bottom: 12px;">
                                        ${Array(5).fill(0).map((_, i) => `<i data-lucide="star" style="fill:${i < r.rating ? 'var(--q-secondary)' : 'transparent'}; color:var(--q-secondary); width:14px;"></i>`).join('')}
                                    </div>
                                    <p style="font-style: italic; color: var(--q-text-main); font-weight: 600; margin-bottom: 12px;">"${r.text}"</p>
                                    <span style="font-weight: 800; font-size: 0.8rem; color: var(--q-primary);">- ${r.name}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div style="margin-top: 64px;">
                    <button class="q-btn-primary" onclick="app.renderForm()" style="width:100%; max-width: 320px; border-radius: 100px; padding: 20px;">${this.t('confirm')}</button>
                </div>
            </div>
        `;
        lucide.createIcons();
    },

    renderContact() {
        this.container.innerHTML = `
            <div class="q-page-inner" style="padding: 48px 24px;">
                <div style="text-align: center; margin-bottom: 64px;">
                    <span style="font-weight: 800; color: var(--q-primary); font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase;">Quantum Support Nexus</span>
                    <h2 style="font-size: 3.5rem; font-weight: 950; color: var(--q-primary); letter-spacing:-0.06em; margin-top: 12px;">${this.t('contact_title')}</h2>
                    <p style="color: var(--q-text-light); margin-top: 16px; font-weight: 600; font-size: 1.1rem;">Industrial-grade support for the Adoca network.</p>
                </div>
                
                <div class="q-grid-2" style="gap: 48px; align-items: start;">
                    <!-- Contact Cards -->
                    <div style="display:grid; gap:20px;">
                        ${CONFIG.SUPPORT_CHANNELS.map(ch => `
                            <a href="${ch.action}" class="q-card-adoca" style="text-decoration:none; display:flex; align-items:center; gap:24px; padding: 24px;">
                                <div style="width:56px; height:56px; background: var(--q-bg-soft); border-radius: 16px; display:flex; align-items:center; justify-content:center; color: var(--q-primary);">
                                    <i data-lucide="${ch.icon}"></i>
                                </div>
                                <div style="flex: 1;">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span style="display:block; font-weight: 850; font-size: 1.2rem; color: var(--q-primary);">${ch.label}</span>
                                        <div class="q-status-pill"><div class="q-pulse-dot"></div> ${ch.status}</div>
                                    </div>
                                    <span style="color: var(--q-text-light); font-weight: 700; font-size: 0.9rem;">Wait time: ${ch.wait}</span>
                                </div>
                            </a>
                        `).join('')}
                    </div>

                    <!-- FAQ Section -->
                    <div class="q-card-adoca" style="background: var(--q-bg-soft); border: none;">
                        <h3 style="font-size: 1.5rem; font-weight: 900; color: var(--q-primary); margin-bottom: 24px;">${this.t('faq_title')}</h3>
                        <div class="q-faq-accordion">
                            ${CONFIG.FAQ.map((item, i) => `
                                <div class="q-faq-item ${i === 0 ? 'active' : ''}" onclick="this.classList.toggle('active')">
                                    <div class="q-faq-header">
                                        <span>${item.q}</span>
                                        <i data-lucide="chevron-down" style="width:16px;"></i>
                                    </div>
                                    <div class="q-faq-body">
                                        ${item.a}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        lucide.createIcons();
    },

    renderBusinessListing() {
        this.container.innerHTML = `
            <div class="q-page-inner" style="padding: 48px 24px;">
                <div style="text-align: center; max-width: 800px; margin: 0 auto 80px;">
                    <span style="font-weight: 800; color: var(--q-secondary); font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase;">Merchant Empowerment</span>
                    <h2 style="font-size: 4rem; font-weight: 950; color: var(--q-primary); letter-spacing:-0.06em; margin-top: 12px;">${this.t('business_title')}</h2>
                    <p style="color: var(--q-text-light); margin-top: 24px; font-weight: 600; font-size: 1.1rem; line-height: 1.6;">${this.t('business_desc')}</p>
                    
                    <button class="q-btn-primary" style="margin-top: 32px; border-radius: 100px; padding: 20px 48px;" onclick="document.getElementById('merchant-form').scrollIntoView({behavior:'smooth'})">
                        ${this.t('join_adoca')}
                    </button>
                </div>

                <div class="q-onboarding-grid">
                    ${CONFIG.BUSINESS_BENEFITS.map(b => `
                        <div class="q-benefit-card">
                            <div class="q-benefit-icon"><i data-lucide="${b.icon}"></i></div>
                            <h4>${b.title}</h4>
                            <p>${b.desc}</p>
                        </div>
                    `).join('')}
                </div>

                <div id="merchant-form" style="margin-top: 120px; max-width: 700px; margin-left: auto; margin-right: auto;">
                    <div class="q-card-adoca" style="padding: 48px;">
                        <h3 style="font-size: 2rem; font-weight: 950; color: var(--q-primary); margin-bottom: 32px;">Register Your Business</h3>
                        <form id="merchant-onboarding-form">
                             <div class="q-form-group" style="margin-bottom: 24px;">
                                <label class="q-form-label">Business Name</label>
                                <input type="text" class="q-input" style="width:100%; padding: 16px; border-radius: 12px; border: 1px solid #ddd;" placeholder="e.g. Chaudhary Electricals" required>
                            </div>
                            <div class="q-form-group" style="margin-bottom: 24px;">
                                <label class="q-form-label">Owner Name</label>
                                <input type="text" class="q-input" style="width:100%; padding: 16px; border-radius: 12px; border: 1px solid #ddd;" placeholder="Full Name" required>
                            </div>
                            <div class="q-form-group" style="margin-bottom: 24px;">
                                <label class="q-form-label">Phone Number</label>
                                <input type="tel" class="q-input" style="width:100%; padding: 16px; border-radius: 12px; border: 1px solid #ddd;" placeholder="10-digit number" required>
                            </div>
                            <div class="q-form-group" style="margin-bottom: 24px;">
                                <label class="q-form-label">Locality / City</label>
                                <input type="text" class="q-input" style="width:100%; padding: 16px; border-radius: 12px; border: 1px solid #ddd;" placeholder="e.g. Samastipur" required>
                            </div>
                            <button type="submit" class="q-btn-primary" style="width:100%; padding: 20px;">Submit Application</button>
                        </form>
                    </div>
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
            'nav-activity': this.t('nav_activity')
        };

        navItems.forEach(item => {
            item.classList.remove('active');
            const span = item.querySelector('span');
            if (span && labels[item.id]) span.innerText = labels[item.id];
        });

        const params = new URLSearchParams(window.location.search);
        const page = params.get('page');

        if (!this.state.type && !this.state.sub && !page) { document.getElementById('nav-home')?.classList.add('active'); }
        else if (this.state.type === 'service') { document.getElementById('nav-services')?.classList.add('active'); }
        else if (page === 'contact') { document.getElementById('nav-support')?.classList.add('active'); }
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());
