// ===============================
// VPN DASHBOARD — FRONTEND
// All data on server via Netlify Functions
// ===============================

const API_URL = "/api";

// ===============================
// VPN SERVER CONFIGS
// ===============================
const VPN_NODES = {
    lv: {
        flag: "🇱🇻", name: "Latvia", city: "Riga", protocol: "VLESS · Reality",
        link: "vless://4827e007-41c1-4ad3-bff6-3c299a0c50ed@31.59.104.25:443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&fp=chrome&sni=yandex.net&pbk=8gOb0sLYltMCECXL5JDIe7b4L9Fx_XHRFOPhDe3rJTs&sid=9f05743882f8847c#🇱🇻 Latvia"
    },
    nl: {
        flag: "🇳🇱", name: "Netherlands", city: "Amsterdam", protocol: "VLESS · Reality",
        link: "vless://01d1242d-236e-4856-98e5-a192b16f8d99@89.105.213.18:443?type=tcp&encryption=none&security=reality&pbk=4kuMV4yNnDwswe60SuyiAqqmdH8goIBPOdASSGkt9TE&fp=chrome&sni=google.com&sid=e8cb43a2&spx=/&flow=xtls-rprx-vision#🇳🇱 Netherlands"
    },
    fi: {
        flag: "🇫🇮", name: "Finland", city: "Helsinki", protocol: "VLESS · Reality",
        link: "vless://4827e007-41c1-4ad3-bff6-3c299a0c50ed@31.57.105.199:443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&fp=chrome&sni=yandex.net&pbk=8gOb0sLYltMCECXL5JDIe7b4L9Fx_XHRFOPhDe3rJTs&sid=9f05743882f8847c#🇫🇮 Finland"
    },
    fr: {
        flag: "🇫🇷", name: "France", city: "Paris", protocol: "VLESS · TLS",
        link: "vless://0e90f352-e9bc-4834-8ff6-49ba887eded4@fr.1323.world:443?encryption=none&type=tcp&security=tls&fp=chrome&sni=b12a6eea4807ca4e.1323.world&alpn=h2#🇫🇷 France"
    },
    us: {
        flag: "🇺🇸", name: "USA", city: "New York", protocol: "VLESS · Reality",
        link: "vless://4827e007-41c1-4ad3-bff6-3c299a0c50ed@109.248.160.51:443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&fp=chrome&sni=yandex.net&pbk=8gOb0sLYltMCECXL5JDIe7b4L9Fx_XHRFOPhDe3rJTs&sid=9f05743882f8847c#🇺🇸 USA"
    },
    de: {
        flag: "🇩🇪", name: "Germany", city: "Frankfurt", protocol: "VLESS · Reality",
        link: "vless://d4be5131-ebd7-418e-86b5-3e08b5d0a079@150.241.90.60:443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&fp=chrome&sni=www.nvidia.com&pbk=exr741kp0SZy7X0aElZAA_L9KwW-4F7X4iBo_ank9Hk&sid=930c7ae76d1a8902&spx=/#🇩🇪 Germany"
    }
};

const SUBSCRIPTION_URL = "https://3d3291aa9f0276d5.googlegoodbye.su/sub/d2h5bm90bWUxNDg4LDE3NzEwODIxMTUPWSP7dghOd";

// ===============================
// LOCALIZATION
// ===============================
const i18n = {
    ru: {
        authTitle: "Вход в систему", authDesc: "Введите ваш ключ доступа",
        authPlaceholder: "Ваш ключ доступа", authBtn: "Продолжить",
        authError: "Ключ недействителен или исчерпан.",
        headerTag: "Защищенное соединение", headerTitle: "Серверы VPN",
        headerDesc: "Выберите сервер для подключения. Все узлы используют Reality/VLESS шифрование.",
        nodeConnect: "Подключить", nodeCopy: "Копировать",
        nodeConnecting: "✅ Открываем...", nodeCopied: "✅ Готово!",
        subTitle: "📡 Общая подписка",
        subDesc: "Подписка автоматически обновляет список серверов в вашем VPN-приложении.",
        subCopyBtn: "📋 Скопировать ссылку", subOpenBtn: "🌐 В браузере",
        subAlert: "Ссылка скопирована!",
        supportLink: "Поддержка", communityLink: "Сообщество",
        logoutBtn: "Выйти",
        footer: "© 2026 VPN Service. Разработка: HackTorvalds.",
        userBadge: "Пользователь"
    },
    en: {
        authTitle: "System Login", authDesc: "Enter your access key",
        authPlaceholder: "Your access key", authBtn: "Continue",
        authError: "Key is invalid or exhausted.",
        headerTag: "Secure Connection", headerTitle: "VPN Servers",
        headerDesc: "Choose a server to connect. All nodes use Reality/VLESS encryption.",
        nodeConnect: "Connect", nodeCopy: "Copy",
        nodeConnecting: "✅ Opening...", nodeCopied: "✅ Copied!",
        subTitle: "📡 General Subscription",
        subDesc: "Subscription auto-updates server list in your VPN app.",
        subCopyBtn: "📋 Copy Link", subOpenBtn: "🌐 In Browser",
        subAlert: "Link copied!",
        supportLink: "Support", communityLink: "Community",
        logoutBtn: "Sign Out",
        footer: "© 2026 VPN Service. Secured by HackTorvalds.",
        userBadge: "User"
    }
};

let currentLang = 'ru';

function setLang(lang) {
    currentLang = lang;
    const t = i18n[lang];
    const set = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
    set('auth-title', t.authTitle); set('auth-desc', t.authDesc);
    set('auth-btn', t.authBtn); set('errorMsg', t.authError);
    set('header-tag', t.headerTag); set('header-title', t.headerTitle);
    set('header-desc', t.headerDesc);
    set('sub-title', t.subTitle); set('sub-desc', t.subDesc);
    set('btn-copy-sub', t.subCopyBtn); set('btn-open-sub', t.subOpenBtn);
    set('link-support', t.supportLink); set('link-community', t.communityLink);
    set('btn-logout', t.logoutBtn); set('footer-copy', t.footer);
    const p = document.getElementById('passwordInput');
    if (p) p.placeholder = t.authPlaceholder;
    document.querySelectorAll('.node-item').forEach(item => {
        const pb = item.querySelector('.btn-primary');
        const sb = item.querySelector('.btn-secondary');
        if (pb && !pb.dataset.busy) pb.textContent = t.nodeConnect;
        if (sb && !sb.dataset.busy) sb.textContent = t.nodeCopy;
    });
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    const ab = document.getElementById(`btn-${lang}`);
    if (ab) ab.classList.add('active');
    localStorage.setItem('vpn_lang', lang);
    updateUserBadge();
}

// ===============================
// API CALL
// ===============================
async function api(body) {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'API error');
    return data;
}

// ===============================
// DEVICE INFO
// ===============================
function getDeviceInfo() {
    const ua = navigator.userAgent;
    let device = 'Unknown', os = 'Unknown', browser = 'Unknown';
    if (/iPhone/.test(ua)) { os = 'iOS'; device = 'iPhone'; }
    else if (/iPad/.test(ua)) { os = 'iPadOS'; device = 'iPad'; }
    else if (/Android/.test(ua)) { os = 'Android'; const m = ua.match(/Android.*;\s*([^)]+)\)/); device = m ? m[1].trim().split(' Build')[0] : 'Android'; }
    else if (/Mac OS X/.test(ua)) { os = 'macOS'; device = 'Mac'; }
    else if (/Windows/.test(ua)) { os = 'Windows'; device = 'PC'; }
    else if (/Linux/.test(ua)) { os = 'Linux'; device = 'PC'; }
    if (/CriOS|Chrome/.test(ua) && !/Edg/.test(ua)) browser = 'Chrome';
    else if (/Safari/.test(ua) && !/Chrome/.test(ua)) browser = 'Safari';
    else if (/Firefox/.test(ua)) browser = 'Firefox';
    else if (/Edg/.test(ua)) browser = 'Edge';
    else if (/Opera|OPR/.test(ua)) browser = 'Opera';
    return { device, os, browser };
}

// ===============================
// SCREENS
// ===============================
function hideAll() {
    document.getElementById('splashScreen').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('userContent').style.display = 'none';
    document.getElementById('adminContent').style.display = 'none';
}

function showLoginScreen() {
    hideAll();
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('passwordInput').value = '';
    document.getElementById('errorMsg').style.display = 'none';
}

function showUserDashboard(userData) {
    hideAll();
    sessionStorage.setItem('vpn_session', JSON.stringify(userData));
    document.getElementById('userContent').style.display = 'block';
    renderUserNodes(userData);
    updateUserBadge();
    initQRCodes(userData.allowedNodes);
}

function showAdminPanel() {
    hideAll();
    document.getElementById('adminContent').style.display = 'block';
    loadAdminData();
}

// ===============================
// LOGIN
// ===============================
async function handleLogin() {
    const input = document.getElementById('passwordInput');
    const error = document.getElementById('errorMsg');
    const btn = document.getElementById('auth-btn');
    const val = input.value.trim();
    if (!val) return;

    const orig = btn.textContent;
    btn.textContent = '⏳';
    btn.disabled = true;

    try {
        const result = await api({
            action: 'login',
            password: val,
            deviceInfo: getDeviceInfo()
        });
        if (result.type === 'admin') {
            sessionStorage.setItem('vpn_admin_pass', val);
            if (result.html && document.getElementById('adminContent').innerHTML.trim() === '') {
                document.getElementById('adminContent').innerHTML = result.html;
                if (typeof renderVPNCheckboxes === 'function') renderVPNCheckboxes();
            }
            showAdminPanel();
        } else {
            showUserDashboard(result);
        }
    } catch (err) {
        showError(input, error);
    } finally {
        btn.textContent = orig;
        btn.disabled = false;
    }
}

function showError(input, errorEl) {
    if (errorEl) errorEl.style.display = 'block';
    input.value = '';
    input.style.borderColor = '#ff4444';
    input.classList.add('shake');
    setTimeout(() => { input.style.borderColor = ''; if (errorEl) errorEl.style.display = 'none'; input.classList.remove('shake'); }, 2500);
}

function userLogout() { sessionStorage.removeItem('vpn_session'); showLoginScreen(); }
function adminLogout() { sessionStorage.removeItem('vpn_admin_pass'); showLoginScreen(); }

// ===============================
// USER BADGE
// ===============================
function updateUserBadge() {
    const badge = document.getElementById('user-badge');
    if (!badge) return;
    try {
        const s = JSON.parse(sessionStorage.getItem('vpn_session'));
        if (!s) return;
        const t = i18n[currentLang];
        badge.innerHTML = `<span class="badge-icon">👤</span><span class="badge-name">${escapeHtml(s.username || t.userBadge)}</span><span class="badge-separator">·</span><span class="badge-uses">${s.maxUses - s.usedCount}/${s.maxUses}</span>`;
    } catch { }
}

// ===============================
// USER VPN NODES
// ===============================
function renderUserNodes(userData) {
    const grid = document.getElementById('vpn-nodes-grid');
    grid.innerHTML = '';
    const allowed = userData.allowedNodes || [];
    const t = i18n[currentLang];
    allowed.forEach(nk => {
        const n = VPN_NODES[nk];
        if (!n) return;
        const c = document.createElement('div');
        c.className = 'node-item glass-effect iri-border';
        let pr = [20, 60];
        if (nk === 'fi') pr = [20, 35];
        else if (nk === 'lv') pr = [25, 45];
        else if (nk === 'de') pr = [45, 60];
        else if (nk === 'nl') pr = [50, 70];
        else if (nk === 'fr') pr = [60, 80];
        else if (nk === 'us') pr = [130, 160];
        const pingVal = Math.floor(Math.random() * (pr[1] - pr[0]) + pr[0]);
        const pingHtml = userData.showPing ? `<div class="ping-indicator"><div class="ping-dot"></div><span>${pingVal} ms</span></div>` : '';
        c.innerHTML = `<div class="node-top"><span class="node-flag">${n.flag}</span><div class="node-info"><h3>${n.name}</h3><span class="node-type">${n.protocol} · ${n.city}</span>${pingHtml}</div></div><div class="node-visual"><canvas id="qr-${nk}"></canvas></div><div class="node-actions"><button class="btn-primary" onclick="autoAdd('${nk}',event)">${t.nodeConnect}</button><button class="btn-secondary" onclick="copyLink('${nk}',event)">${t.nodeCopy}</button></div>`;
        grid.appendChild(c);
    });
    document.getElementById('subscription-section').style.display = allowed.includes('subscription') ? 'block' : 'none';
}

function toggleTheme() {
    const isLight = document.documentElement.classList.toggle('light-theme');
    localStorage.setItem('vpn_theme', isLight ? 'light' : 'dark');
    const metaTheme = document.getElementById('theme-color-meta');
    if (metaTheme) metaTheme.content = isLight ? '#f5f5f7' : '#000000';
    const btnTheme = document.getElementById('btn-theme');
    if (btnTheme) btnTheme.textContent = isLight ? '🌙' : '☀️';
}


let currentDeepLink = "";

function autoAdd(loc, e) {
    if (e) e.stopPropagation();
    const n = VPN_NODES[loc]; if (!n) return;

    navigator.clipboard.writeText(n.link).catch(() => { });

    currentDeepLink = n.link;

    const b = e?.currentTarget;
    if (b) {
        const t = i18n[currentLang];
        b.textContent = t.nodeConnecting; b.style.filter = "brightness(1.2)"; b.dataset.busy = "true";
        setTimeout(() => { b.textContent = t.nodeConnect; b.style.filter = ""; delete b.dataset.busy; }, 2000);
    }

    openTutorial();
}

function copyLink(loc, e) {
    if (e) e.stopPropagation();
    const n = VPN_NODES[loc]; if (!n) return;
    navigator.clipboard.writeText(n.link).then(() => {
        const b = e?.currentTarget; if (!b) return;
        const t = i18n[currentLang];
        b.textContent = t.nodeCopied; b.style.filter = "brightness(1.2)"; b.dataset.busy = "true";
        setTimeout(() => { b.textContent = t.nodeCopy; b.style.filter = ""; delete b.dataset.busy; }, 2000);
    });
}

function copySubscription() { navigator.clipboard.writeText(SUBSCRIPTION_URL).then(() => showToast(i18n[currentLang].subAlert)).catch(() => { }); }
function openSubscription() {
    navigator.clipboard.writeText(SUBSCRIPTION_URL).catch(() => { });
    currentDeepLink = SUBSCRIPTION_URL;
    openTutorial();
}

function openTutorial() {
    const m = document.getElementById('tutorialModal');
    if (m) m.style.display = 'flex';
}

function closeTutorial() {
    const m = document.getElementById('tutorialModal');
    if (m) m.style.display = 'none';
}

function openStreisandApp() {
    if (currentDeepLink) {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = currentDeepLink;
        document.body.appendChild(iframe);
        setTimeout(() => {
            if (document.body.contains(iframe)) document.body.removeChild(iframe);
        }, 1500);
    }
}

function showToast(msg) {
    let t = document.querySelector('.toast-notification');
    if (!t) { t = document.createElement('div'); t.className = 'toast-notification'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}

function initQRCodes(nodes) {
    (nodes || Object.keys(VPN_NODES)).forEach(k => {
        const n = VPN_NODES[k]; if (!n) return;
        const c = document.getElementById(`qr-${k}`);
        if (c) {
            const img = new Image(); img.crossOrigin = 'anonymous';
            img.onload = () => { c.width = 180; c.height = 180; c.getContext("2d").drawImage(img, 0, 0, 180, 180); };
            img.src = "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=" + encodeURIComponent(n.link);
        }
    });
}

// ===============================
// ADMIN
// ===============================
function getAdminPass() { return sessionStorage.getItem('vpn_admin_pass') || ''; }

async function loadAdminData() {
    try {
        const r = await api({ action: 'getKeys', adminPassword: getAdminPass() });
        const ac = document.getElementById('adminContent');
        if (r.html && ac.innerHTML.trim() === '') {
            ac.innerHTML = r.html;
            if (typeof renderVPNCheckboxes === 'function') renderVPNCheckboxes();
        }
        renderAdminPanel(r.keys);
    } catch (err) { showToast('⚠️ Ошибка загрузки'); console.error(err); adminLogout(); }
}

let keyTypeMode = 'random';
function setKeyType(type) {
    keyTypeMode = type;
    document.getElementById('btn-random-key').classList.toggle('active', type === 'random');
    document.getElementById('btn-custom-key').classList.toggle('active', type === 'custom');
    document.getElementById('custom-key-group').style.display = type === 'custom' ? 'block' : 'none';
}

function changeMaxUses(d) {
    const i = document.getElementById('maxUsesInput');
    i.value = Math.max(1, Math.min(999, (parseInt(i.value) || 1) + d));
}

function genKey(len = 8) {
    const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let r = '';
    for (let i = 0; i < len; i++) r += c[Math.floor(Math.random() * c.length)];
    return r;
}

function renderVPNCheckboxes() {
    const ct = document.getElementById('vpn-checkboxes');
    if (!ct) return;
    ct.innerHTML = '';
    Object.entries(VPN_NODES).forEach(([k, n]) => {
        const l = document.createElement('label');
        l.className = 'vpn-checkbox-label';
        l.innerHTML = `<input type="checkbox" value="${k}" checked><span class="checkbox-custom"></span><span class="checkbox-flag">${n.flag}</span><span class="checkbox-text">${n.name}</span>`;
        ct.appendChild(l);
    });
    const sl = document.createElement('label');
    sl.className = 'vpn-checkbox-label';
    sl.innerHTML = `<input type="checkbox" value="subscription" checked><span class="checkbox-custom"></span><span class="checkbox-flag">📡</span><span class="checkbox-text">Общая подписка</span>`;
    ct.appendChild(sl);
}

async function createKey() {
    let kv;
    if (keyTypeMode === 'custom') {
        kv = document.getElementById('customKeyInput').value.trim();
        if (!kv) { showToast('⚠️ Введите ключ!'); return; }
    } else { kv = genKey(); }
    const mu = parseInt(document.getElementById('maxUsesInput').value) || 1;
    const un = document.getElementById('keyUsernameInput').value.trim();
    const cbs = document.querySelectorAll('#vpn-checkboxes input[type="checkbox"]');
    const an = []; cbs.forEach(cb => { if (cb.checked) an.push(cb.value); });
    if (!an.length) { showToast('⚠️ Выберите сервер!'); return; }
    const showPing = document.getElementById('showPingCheckbox')?.checked ?? true;
    try {
        await api({ action: 'createKey', adminPassword: getAdminPass(), key: kv, maxUses: mu, username: un, allowedNodes: an, showPing });
        document.getElementById('created-key-value').textContent = kv;
        document.getElementById('created-key-display').style.display = 'flex';
        document.getElementById('customKeyInput').value = '';
        document.getElementById('keyUsernameInput').value = '';
        document.getElementById('maxUsesInput').value = '1';
        showToast('✅ Ключ создан!');
        loadAdminData();
    } catch (err) { showToast('⚠️ ' + err.message); }
}

function copyCreatedKey() {
    navigator.clipboard.writeText(document.getElementById('created-key-value').textContent).then(() => showToast('📋 Скопировано!'));
}

async function deleteKey(kv) {
    if (!confirm(`Удалить ключ ${kv}?`)) return;
    try { await api({ action: 'deleteKey', adminPassword: getAdminPass(), key: kv }); showToast('🗑️ Удалён'); loadAdminData(); }
    catch { showToast('⚠️ Ошибка'); }
}

async function toggleKeyActive(kv) {
    try { await api({ action: 'toggleKey', adminPassword: getAdminPass(), key: kv }); loadAdminData(); }
    catch { showToast('⚠️ Ошибка'); }
}

async function toggleNodeAccess(kv, nk) {
    try { await api({ action: 'toggleNode', adminPassword: getAdminPass(), key: kv, nodeKey: nk }); loadAdminData(); }
    catch { showToast('⚠️ Ошибка'); }
}

// ===============================
// RENDER ADMIN
// ===============================
window.adminKeysData = [];
function renderAdminPanel(keys) {
    if (keys !== undefined) window.adminKeysData = keys;
    else keys = window.adminKeysData;

    if (!keys) keys = [];
    document.getElementById('stat-total-keys').textContent = keys.length;
    document.getElementById('stat-active-keys').textContent = keys.filter(k => k.active && k.usedCount < k.maxUses).length;
    document.getElementById('stat-used-keys').textContent = keys.reduce((s, k) => s + k.usedCount, 0);
    renderVPNCheckboxes();

    const term = (document.getElementById('adminSearchInput')?.value || '').toLowerCase();
    const filteredKeys = keys.filter(k => k.key.toLowerCase().includes(term) || (k.username && k.username.toLowerCase().includes(term)) || (k.sessions && k.sessions.some(s => s.ip.includes(term))));

    const w = document.getElementById('users-table-wrap');
    if (!filteredKeys.length) { w.innerHTML = '<p class="empty-state">Нет созданных ключей (или не найдено)</p>'; return; }
    let h = '<div class="keys-list">';
    filteredKeys.forEach(k => {
        const ex = k.usedCount >= k.maxUses;
        const ia = !k.active;
        const sc = ia ? 'status-disabled' : (ex ? 'status-exhausted' : 'status-active');
        const st = ia ? '⛔ Отключён' : (ex ? '🔴 Исчерпан' : '🟢 Активен');
        const ank = [...Object.keys(VPN_NODES), 'subscription'];
        let np = '';
        ank.forEach(nk => {
            const al = k.allowedNodes.includes(nk);
            const ni = nk === 'subscription' ? { flag: '📡', name: 'Подписка' } : VPN_NODES[nk];
            if (!ni) return;
            np += `<button class="node-pill ${al ? 'pill-active' : 'pill-disabled'}" onclick="toggleNodeAccess('${escapeHtml(k.key)}','${nk}')">${ni.flag} ${ni.name}</button>`;
        });
        const lu = k.lastUsed ? new Date(k.lastUsed).toLocaleString('ru-RU') : '—';
        const cr = new Date(k.createdAt).toLocaleString('ru-RU');
        let sh = '';
        if (k.sessions && k.sessions.length) {
            sh = `<div class="key-card-sessions"><span class="sessions-label">📱 История входов (${k.sessions.length}):</span><div class="sessions-list">${k.sessions.slice().reverse().map((s, i) => `<div class="session-row ${i === 0 ? 'session-latest' : ''}"><div class="session-main"><span class="session-num">#${s.useNumber}</span><span class="session-ip">🌐 ${escapeHtml(s.ip)}</span><span class="session-location">📍 ${escapeHtml(s.city)}, ${escapeHtml(s.country)}</span></div><div class="session-details"><span>📱 ${escapeHtml(s.device)} · ${escapeHtml(s.os)} · ${escapeHtml(s.browser)}</span><span>🕐 ${new Date(s.time).toLocaleString('ru-RU')}</span>${s.isp ? `<span>🏢 ${escapeHtml(s.isp)}</span>` : ''}</div></div>`).join('')}</div></div>`;
        }
        h += `<div class="key-card glass-effect ${sc}"><div class="key-card-header"><div class="key-card-left"><div class="key-value-display"><span class="key-icon">🔑</span><span class="key-text">${escapeHtml(k.key)}</span><button class="btn-mini" onclick="navigator.clipboard.writeText('${escapeHtml(k.key)}');showToast('📋 Скопировано!')">📋</button></div>${k.username ? `<div class="key-username">👤 ${escapeHtml(k.username)}</div>` : ''}</div><div class="key-card-right"><span class="key-status ${sc}">${st}</span></div></div><div class="key-card-meta"><span>📊 Использований: <strong>${k.usedCount}/${k.maxUses}</strong></span><span>📅 Создан: ${cr}</span><span>🕐 Посл. вход: ${lu}</span></div><div class="key-card-nodes"><span class="nodes-label">Доступ к серверам:</span><div class="nodes-pills">${np}</div></div>${sh}<div class="key-card-actions"><button class="btn-toggle ${k.active ? 'btn-warn' : 'btn-enable'}" onclick="toggleKeyActive('${escapeHtml(k.key)}')">${k.active ? '⛔ Отключить' : '✅ Включить'}</button><button class="btn-secondary" onclick="openEditModal('${escapeHtml(k.key)}')">✏️ Изменить</button><button class="btn-delete" onclick="deleteKey('${escapeHtml(k.key)}')">🗑️ Удалить</button></div></div>`;
    });
    h += '</div>';
    w.innerHTML = h;
}

function openEditModal(keyStr) {
    const k = window.adminKeysData.find(x => x.key === keyStr);
    if (!k) return;
    document.getElementById('editKeyId').value = k.key;
    document.getElementById('editKeyUsername').value = k.username || "";
    document.getElementById('editKeyMaxUses').value = k.maxUses || 1;
    document.getElementById('editKeyShowPing').checked = k.showPing !== false;

    const ct = document.getElementById('edit-vpn-checkboxes');
    if (ct) {
        ct.innerHTML = '';
        Object.entries(VPN_NODES).forEach(([nk, n]) => {
            const checked = k.allowedNodes.includes(nk) ? "checked" : "";
            const l = document.createElement('label');
            l.className = 'vpn-checkbox-label';
            l.innerHTML = `<input type="checkbox" value="${nk}" ${checked}><span class="checkbox-custom"></span><span class="checkbox-flag">${n.flag}</span><span class="checkbox-text">${n.name}</span>`;
            ct.appendChild(l);
        });
        const subChecked = k.allowedNodes.includes('subscription') ? "checked" : "";
        const sl = document.createElement('label');
        sl.className = 'vpn-checkbox-label';
        sl.innerHTML = `<input type="checkbox" value="subscription" ${subChecked}><span class="checkbox-custom"></span><span class="checkbox-flag">📡</span><span class="checkbox-text">Общая подписка</span>`;
        ct.appendChild(sl);
    }

    document.getElementById('editKeyModal').style.display = 'flex';
}
function closeEditModal() { document.getElementById('editKeyModal').style.display = 'none'; }
async function saveEditKey() {
    const key = document.getElementById('editKeyId').value;
    const username = document.getElementById('editKeyUsername').value.trim();
    const maxUses = parseInt(document.getElementById('editKeyMaxUses').value) || 1;
    const showPing = document.getElementById('editKeyShowPing').checked;

    const an = [];
    const cbs = document.querySelectorAll('#edit-vpn-checkboxes input[type="checkbox"]');
    if (cbs.length > 0) {
        cbs.forEach(cb => { if (cb.checked) an.push(cb.value); });
    }

    try {
        const payload = { action: 'editKey', adminPassword: getAdminPass(), key, username, maxUses, showPing };
        if (an.length > 0 || cbs.length > 0) payload.allowedNodes = an;

        await api(payload);
        showToast('✅ Сохранено');
        closeEditModal();
        loadAdminData();
    } catch (err) { showToast('⚠️ Ошибка'); }
}

function escapeHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

async function detectLang() {
    const s = localStorage.getItem('vpn_lang');
    if (s) { setLang(s); return; }
    setLang('ru');
    try { const r = await fetch('https://ipapi.co/json/'); const d = await r.json(); if (!['RU', 'BY', 'KZ', 'UA'].includes(d.country_code)) setLang('en'); } catch { }
}

function filterAdminKeys() { renderAdminPanel(); }

window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const splash = document.getElementById('splashScreen');
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => splash.style.display = 'none', 800);
        }
    }, 1500);

    document.addEventListener("mousemove", (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 40;
        const y = (e.clientY / window.innerHeight - 0.5) * 40;
        const blob = document.querySelector('.liquid-blob');
        if (blob) blob.style.transform = `translate(calc(-10% + ${x}px), calc(-10% + ${y}px))`;
    });

    if (localStorage.getItem('vpn_theme') === 'light') {
        document.documentElement.classList.add('light-theme');
        document.getElementById('theme-color-meta').content = '#f5f5f7';
        document.getElementById('btn-theme').textContent = '🌙';
    }

    detectLang();
    if (sessionStorage.getItem('vpn_admin_pass')) { showAdminPanel(); return; }
    const sd = sessionStorage.getItem('vpn_session');
    if (sd) { try { showUserDashboard(JSON.parse(sd)); return; } catch { } }
    document.getElementById('loginForm')?.addEventListener('submit', e => { e.preventDefault(); handleLogin(); });
});
