// ===============================
// VPN DASHBOARD — NETLIFY FUNCTION V2
// Uses native Netlify Blobs for persistent storage
// ===============================
// ===============================
// STORAGE
// ===============================
import crypto from "crypto";
import { getStore } from "@netlify/blobs";

const ADMIN_HASH = "05b68f8f80d45137ec15579cdf91c560b0acaf4ad71a7d5a5352bcee36a3bb81";

const ADMIN_HTML = `
    <header class="app-header">
      <div class="header-content">
        <img src="bird-logo.png" alt="Aktron VPN" class="header-logo">
        <div class="tag admin-tag">🛡️ Панель администратора</div>
        <h1>Управление доступом</h1>
        <p class="admin-header-desc">Создавайте ключи и управляйте пользователями</p>
      </div>
    </header>
    <div class="admin-stats-row">
      <div class="stat-card glass-effect iri-border"><div class="stat-number" id="stat-total-keys">0</div><div class="stat-label">Всего ключей</div></div>
      <div class="stat-card glass-effect iri-border"><div class="stat-number" id="stat-active-keys">0</div><div class="stat-label">Активных</div></div>
      <div class="stat-card glass-effect iri-border"><div class="stat-number" id="stat-used-keys">0</div><div class="stat-label">Использовано раз</div></div>
    </div>
    <section class="admin-section glass-effect iri-border">
      <h2 class="admin-section-title">🔑 Создать ключ доступа</h2>
      <div class="create-key-form">
        <div class="form-row">
          <div class="form-group">
            <label>Тип ключа</label>
            <div class="key-type-toggle">
              <button class="toggle-btn active" id="btn-random-key" onclick="setKeyType('random')">🎲 Рандом</button>
              <button class="toggle-btn" id="btn-custom-key" onclick="setKeyType('custom')">✏️ Кастом</button>
            </div>
          </div>
          <div class="form-group" id="custom-key-group" style="display: none;">
            <label for="customKeyInput">Кастомный ключ</label>
            <input type="text" id="customKeyInput" placeholder="Введите ключ...">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="maxUsesInput">Макс. использований</label>
            <div class="number-input-wrap">
              <button class="num-btn" onclick="changeMaxUses(-1)">−</button>
              <input type="number" id="maxUsesInput" value="1" min="1" max="999">
              <button class="num-btn" onclick="changeMaxUses(1)">+</button>
            </div>
          </div>
          <div class="form-group">
            <label>Имя пользователя (опционально)</label>
            <input type="text" id="keyUsernameInput" placeholder="Например: Иван">
          </div>
        </div>
        <div class="form-group"><label>Разрешённые серверы</label><div class="vpn-checkboxes" id="vpn-checkboxes"></div></div>
        <div class="form-group">
          <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
            <input type="checkbox" id="showPingCheckbox" checked style="width:20px;height:20px;">
            <span>Показать статус и пинг (Premium)</span>
          </label>
        </div>
        <button class="btn-action btn-create-key" onclick="createKey()">✨ Создать ключ</button>
      </div>
      <div id="created-key-display" class="created-key-box" style="display: none;">
        <div class="created-key-label">Созданный ключ:</div>
        <div class="created-key-value" id="created-key-value"></div>
        <button class="btn-highlight" onclick="copyCreatedKey()">📋 Скопировать</button>
      </div>
    </section>
    <section class="admin-section glass-effect iri-border">
      <h2 class="admin-section-title">👥 Пользователи и ключи</h2>
      <div class="admin-search">
        <input type="text" id="adminSearchInput" placeholder="Поиск по ключу, имени..." onkeyup="filterAdminKeys()">
      </div>
      <div class="users-table-wrap" id="users-table-wrap"><p class="empty-state">Нет созданных ключей</p></div>
    </section>
    <footer class="app-footer">
      <div class="footer-links"><button class="logout-link" onclick="adminLogout()">🚪 Выйти из админки</button></div>
      <p>© 2026 VPN Service. Admin Panel.</p>
    </footer>
    <div id="editKeyModal" class="tutorial-modal" style="display: none; align-items:center; justify-content:center; z-index:9999;">
      <div class="tutorial-backdrop" onclick="closeEditModal()"></div>
      <div class="tutorial-content glass-effect" style="width:100%; max-width:400px; text-align:left;">
        <button class="tutorial-close" onclick="closeEditModal()">✕</button>
        <h3 class="tutorial-title">Редактировать ключ</h3>
        <div class="form-group" style="margin-bottom:15px;">
          <label>Имя пользователя</label>
          <input type="text" id="editKeyUsername" style="width:100%; padding:12px; border-radius:12px; border:1px solid rgba(255,255,255,0.2); background:rgba(0,0,0,0.3); color:#fff; font-size:16px; outline:none;" placeholder="Иван">
        </div>
        <div class="form-group" style="margin-bottom:15px;">
          <label>Макс. использований</label>
          <input type="number" id="editKeyMaxUses" min="1" max="999" style="width:100%; padding:12px; border-radius:12px; border:1px solid rgba(255,255,255,0.2); background:rgba(0,0,0,0.3); color:#fff; font-size:16px; outline:none;">
        </div>
        <div class="form-group">
          <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
            <input type="checkbox" id="editKeyShowPing" style="width:20px;height:20px;">
            <span>Показать статус и пинг</span>
          </label>
        </div>
        <div class="form-group" style="margin-top:15px;"><label>Разрешённые серверы</label><div class="vpn-checkboxes" id="edit-vpn-checkboxes" style="margin-top:10px;"></div></div>
        <input type="hidden" id="editKeyId">
        <button class="btn-action btn-create-key" style="margin-top:20px; width:100%;" onclick="saveEditKey()">💾 Сохранить</button>
      </div>
    </div>`;

function sha256(str) {
  return crypto.createHash("sha256").update(str).digest("hex");
}

async function loadKeys() {
  try {
    const store = getStore("vpn-data");
    const data = await store.get("keys", { type: "json" });
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("Storage load error:", e.message);
    return [];
  }
}

async function saveKeys(keys) {
  try {
    const store = getStore("vpn-data");
    await store.setJSON("keys", keys);
  } catch (e) {
    console.error("Storage save error:", e.message);
  }
}

async function getIPInfo(ip) {
  const info = { ip, city: "?", country: "?", countryCode: "?", isp: "?" };
  if (!ip || ip === "?" || ip === "::1" || ip.startsWith("127.")) return info;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`https://ipapi.co/${ip}/json/`, { signal: controller.signal });
    clearTimeout(timeout);
    const data = await res.json();
    if (data && data.ip) {
      info.ip = data.ip; info.city = data.city || "?"; info.country = data.country_name || "?";
      info.countryCode = data.country_code || "?"; info.isp = data.org || "?";
    }
  } catch { }
  return info;
}

function respond(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}

// ===============================
// MAIN HANDLER
// ===============================
export default async (req, context) => {
  if (req.method === "OPTIONS") return respond({}, 200);
  if (req.method !== "POST") return respond({ error: "Method not allowed" }, 405);

  let body;
  try { body = await req.json(); }
  catch { return respond({ error: "Invalid JSON" }, 400); }

  const action = body.action;
  if (!action) return respond({ error: "No action" }, 400);

  const clientIP = req.headers.get("x-nf-client-connection-ip") || req.headers.get("x-forwarded-for") || "?";

  // ============ ACTIONS ============
  if (action === "login") {
    const { password, deviceInfo } = body;
    if (!password) return respond({ error: "No password" }, 400);

    if (sha256(password) === ADMIN_HASH) {
      return respond({ type: "admin", html: ADMIN_HTML });
    }

    const keys = await loadKeys();
    const keyData = keys.find(k => k.key === password && k.active);
    if (!keyData) return respond({ error: "Invalid key" }, 401);
    if (keyData.usedCount >= keyData.maxUses) return respond({ error: "Key exhausted" }, 403);

    keyData.usedCount++;
    keyData.lastUsed = new Date().toISOString();

    const ipInfo = await getIPInfo(clientIP);

    if (!keyData.sessions) keyData.sessions = [];
    keyData.sessions.push({
      time: new Date().toISOString(),
      useNumber: keyData.usedCount,
      ip: ipInfo.ip, city: ipInfo.city, country: ipInfo.country,
      countryCode: ipInfo.countryCode, isp: ipInfo.isp,
      device: deviceInfo?.device || "?", os: deviceInfo?.os || "?", browser: deviceInfo?.browser || "?"
    });

    await saveKeys(keys);
    return respond({
      type: "user", key: keyData.key, username: keyData.username,
      allowedNodes: keyData.allowedNodes, usedCount: keyData.usedCount, maxUses: keyData.maxUses,
      showPing: keyData.showPing !== false
    });
  }

  if (action === "getKeys") {
    if (!body.adminPassword || sha256(body.adminPassword) !== ADMIN_HASH) return respond({ error: "Unauthorized" }, 401);
    const keys = await loadKeys();
    return respond({ keys, html: ADMIN_HTML });
  }

  if (action === "createKey") {
    if (!body.adminPassword || sha256(body.adminPassword) !== ADMIN_HASH) return respond({ error: "Unauthorized" }, 401);
    const keys = await loadKeys();
    if (keys.find(k => k.key === body.key)) return respond({ error: "Key already exists" }, 409);
    keys.push({
      key: body.key, maxUses: body.maxUses || 1, usedCount: 0,
      username: body.username || "", allowedNodes: body.allowedNodes || [],
      createdAt: new Date().toISOString(), lastUsed: null, active: true, sessions: [],
      showPing: body.showPing !== false
    });
    await saveKeys(keys);
    return respond({ success: true });
  }

  if (action === "deleteKey") {
    if (!body.adminPassword || sha256(body.adminPassword) !== ADMIN_HASH) return respond({ error: "Unauthorized" }, 401);
    let keys = await loadKeys();
    keys = keys.filter(k => k.key !== body.key);
    await saveKeys(keys);
    return respond({ success: true });
  }

  if (action === "editKey") {
    if (!body.adminPassword || sha256(body.adminPassword) !== ADMIN_HASH) return respond({ error: "Unauthorized" }, 401);
    const keys = await loadKeys();
    const keyData = keys.find(k => k.key === body.key);
    if (!keyData) return respond({ error: "Key not found" }, 404);

    if (body.username !== undefined) keyData.username = body.username;
    if (body.maxUses !== undefined) keyData.maxUses = parseInt(body.maxUses);
    if (body.showPing !== undefined) keyData.showPing = body.showPing;
    if (body.allowedNodes !== undefined) keyData.allowedNodes = body.allowedNodes;

    await saveKeys(keys);
    return respond({ success: true });
  }

  if (action === "toggleKey") {
    if (!body.adminPassword || sha256(body.adminPassword) !== ADMIN_HASH) return respond({ error: "Unauthorized" }, 401);
    const keys = await loadKeys();
    const keyData = keys.find(k => k.key === body.key);
    if (!keyData) return respond({ error: "Key not found" }, 404);
    keyData.active = !keyData.active;
    await saveKeys(keys);
    return respond({ success: true, active: keyData.active });
  }

  if (action === "toggleNode") {
    if (!body.adminPassword || sha256(body.adminPassword) !== ADMIN_HASH) return respond({ error: "Unauthorized" }, 401);
    const keys = await loadKeys();
    const keyData = keys.find(k => k.key === body.key);
    if (!keyData) return respond({ error: "Key not found" }, 404);
    const idx = keyData.allowedNodes.indexOf(body.nodeKey);
    if (idx > -1) keyData.allowedNodes.splice(idx, 1);
    else keyData.allowedNodes.push(body.nodeKey);
    await saveKeys(keys);
    return respond({ success: true, allowedNodes: keyData.allowedNodes });
  }

  return respond({ error: "Unknown action" }, 400);
};

export const config = {
  path: "/api"
};
