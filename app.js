// ===============================
// PASSWORD PROTECTION
// ===============================
const CORRECT_PASSWORD = "2913";

function checkPassword() {
  const input = document.getElementById("passwordInput");
  const error = document.getElementById("errorMsg");

  if (input.value === CORRECT_PASSWORD) {
    sessionStorage.setItem("vpn_auth", "true");
    showMainContent();
  } else {
    if (error) error.style.display = "block";
    input.value = "";
    input.style.borderColor = "#ff4444";
    setTimeout(() => {
      input.style.borderColor = "";
      if (error) error.style.display = "none";
    }, 2000);
  }
}

function logout() {
  sessionStorage.removeItem("vpn_auth");
  document.getElementById("mainContent").style.display = "none";
  document.getElementById("loginScreen").style.display = "flex";
  document.getElementById("passwordInput").value = "";
}

function showMainContent() {
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("mainContent").style.display = "block";
  initQRCodes();
}

// ===============================
// LOCALIZATION (Professional Russian)
// ===============================
const i18n = {
  ru: {
    authTitle: "Вход в систему",
    authDesc: "Введите ключ доступа для управления вашим VPN",
    authPlaceholder: "Ваш пароль",
    authBtn: "Продолжить",
    authError: "Некорректный пароль. Попробуйте еще раз.",
    headerTag: "Защищенное соединение",
    headerTitle: "Локации серверов",
    headerDesc: "Выберите сервер для подключения. Все узлы используют Reality/VLESS шифрование.",
    nodeConnect: "Подключить",
    nodeCopy: "Копировать",
    nodeConnecting: "✅ Открываем...",
    nodeCopied: "✅ Готово!",
    subTitle: "Авто-обновление",
    subDesc: "Подпишитесь, чтобы список серверов в приложении обновлялся автоматически.",
    subCopyBtn: "📋 Скопировать ссылку",
    subOpenBtn: "🌐 В браузере",
    subAlert: "Ссылка скопирована в буфер!",
    supportLink: "Поддержка",
    communityLink: "Комьюнити",
    logoutBtn: "Выйти",
    footer: "© 2026 VPN Service. Разработка: whynotme1488."
  },
  en: {
    authTitle: "System Login",
    authDesc: "Enter access key to manage your VPN dashboard",
    authPlaceholder: "Your Password",
    authBtn: "Continue",
    authError: "Invalid password. Please try again.",
    headerTag: "Secure Connection",
    headerTitle: "Server Locations",
    headerDesc: "Choose a node to establish a high-performance tunnel. All nodes use Reality/VLESS.",
    nodeConnect: "Connect",
    nodeCopy: "Copy",
    nodeConnecting: "✅ Opening...",
    nodeCopied: "✅ Copied!",
    subTitle: "Auto-Update",
    subDesc: "Subscribe to keep your server list synchronized automatically.",
    subCopyBtn: "📋 Copy Link",
    subOpenBtn: "🌐 In Browser",
    subAlert: "Link copied to clipboard!",
    supportLink: "Support",
    communityLink: "Community",
    logoutBtn: "Sign Out",
    footer: "© 2026 VPN Service. Secured by whynotme1488."
  }
};

let currentLang = 'ru';

function setLang(lang) {
  currentLang = lang;
  const content = i18n[lang];

  const updateText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  updateText('auth-title', content.authTitle);
  updateText('auth-desc', content.authDesc);
  const passInput = document.getElementById('passwordInput');
  if (passInput) passInput.placeholder = content.authPlaceholder;
  updateText('auth-btn', content.authBtn);
  updateText('errorMsg', content.authError);

  updateText('header-tag', content.headerTag);
  updateText('header-title', content.headerTitle);
  updateText('header-desc', content.headerDesc);

  document.querySelectorAll('.node-item').forEach(item => {
    const primaryBtn = item.querySelector('.btn-primary');
    const secondaryBtn = item.querySelector('.btn-secondary');

    if (primaryBtn && !primaryBtn.dataset.busy) {
      primaryBtn.textContent = content.nodeConnect;
    }
    if (secondaryBtn && !secondaryBtn.dataset.busy) {
      secondaryBtn.textContent = content.nodeCopy;
    }
  });

  updateText('sub-title', content.subTitle);
  updateText('sub-desc', content.subDesc);
  updateText('btn-copy-sub', content.subCopyBtn);
  updateText('btn-open-sub', content.subOpenBtn);

  updateText('link-support', content.supportLink);
  updateText('link-community', content.communityLink);
  updateText('btn-logout', content.logoutBtn);
  updateText('footer-copy', content.footer);

  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`btn-${lang}`);
  if (activeBtn) activeBtn.classList.add('active');

  localStorage.setItem('vpn_lang', lang);
}

// ===============================
// SERVER LINKS
// ===============================
const LINKS = {
  de: "vless://6ee61dd1-7383-4ee5-b3ea-1f26fb5461b6@150.241.90.60:443?type=tcp&encryption=none&security=reality&sni=help.max.ru&fp=chrome&pbk=bXUO6EATxdkPAGU3xgzvDIH-_e-n41fiSHOp9WQTHlc&sid=2160fb91&spx=/&flow=xtls-rprx-vision#🇩🇪 Germany",
  us: "trojan://2IA326p1HLR85Kr_BP_qVg@216.105.168.58:443?security=none&type=ws&headerType=&path=%2F&host=telegram.org&prefix=%16%03%01%00%C2%A8%01%01#🇺🇸 United States",
  kz: "vless://e3802d05-646b-4d91-a97c-09ba8d5f9d11@37.151.92.38:14297?type=tcp&security=reality&pbk=hfsB_yoAK5udF1CEOMRoEAZNfWZkYX8W40cSHd2ozGo&fp=chrome&sni=google.com&sid=3bfb35ef&spx=/&flow=xtls-rprx-vision#🇰🇿 Kazakhstan",
  nl: "vless://01d1242d-236e-4856-98e5-a192b16f8d99@89.105.213.18:443?type=tcp&encryption=none&security=reality&pbk=4kuMV4yNnDwswe60SuyiAqqmdH8goIBPOdASSGkt9TE&fp=chrome&sni=google.com&sid=e8cb43a2&spx=/&flow=xtls-rprx-vision#🇳🇱 Netherlands",
  fr2: "vless://0e90f352-e9bc-4834-8ff6-49ba887eded4@fr.1323.world:443?encryption=none&type=tcp&security=tls&fp=chrome&sni=b12a6eea4807ca4e.1323.world&alpn=h2#🇫🇷 France",
  fi: "vless://4827e007-41c1-4ad3-bff6-3c299a0c50ed@31.57.105.199:443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&fp=chrome&sni=yandex.net&pbk=8gOb0sLYltMCECXL5JDIe7b4L9Fx_XHRFOPhDe3rJTs&sid=9f05743882f8847c#🇫🇮 Finland",
  hu: "vless://eb071647-72a6-46be-8e89-ff3d228d52f6@hu.jojack.ru:443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&fp=chrome&sni=hu.jojack.ru&pbk=FkmYFobwxLMLEktYXywmjthuEYCZggITsxwPNasTKUg&sid=3f200574d011010f#🇭🇺 Hungary",
  pl: "vless://da11d62c-1996-4d2c-b2e6-e89c7a1265e9@dostupbypass5.suio.me:443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&fp=chrome&sni=api-maps.yandex.ru&pbk=5bGFIWSo4vlrd9Tv1yFcpdpSjrjYYN20SOWHYfighHc&sid=44f0602c#🇵🇱 Poland",
  us2: "vless://94a03e9a-74d5-4036-95e9-563cc19355de@dostupbypass4.suio.me:443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&fp=chrome&sni=api-maps.yandex.ru&pbk=5bGFIWSo4vlrd9Tv1yFcpdpSjrjYYN20SOWHYfighHc&sid=a1b2c3d4#🇺🇸 United States (NY)",
  lv: "vless://4827e007-41c1-4ad3-bff6-3c299a0c50ed@31.59.104.25:443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&fp=chrome&sni=yandex.net&pbk=8gOb0sLYltMCECXL5JDIe7b4L9Fx_XHRFOPhDe3rJTs&sid=9f05743882f8847c#🇱🇻 Latvia",
};

const SUBSCRIPTION_URL = "https://3d3291aa9f0276d5.googlegoodbye.su/sub/d2h5bm90bWUxNDg4LDE3NzEwODIxMTUPWSP7dghOd";

// ===============================
// CORE FUNCTIONS
// ===============================
function autoAdd(loc, event) {
  if (event) event.stopPropagation();
  const link = LINKS[loc];
  const a = document.createElement('a');
  a.href = link;
  a.click();

  const btn = event?.currentTarget || event?.target;
  if (!btn) return;

  const originalText = i18n[currentLang].nodeConnect;
  btn.textContent = i18n[currentLang].nodeConnecting;
  btn.style.filter = "brightness(1.2)";
  btn.dataset.busy = "true";

  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.filter = "";
    delete btn.dataset.busy;
  }, 2000);
}

function copyLink(loc, event) {
  if (event) event.stopPropagation();
  const link = LINKS[loc];
  navigator.clipboard.writeText(link).then(() => {
    const btn = event?.currentTarget || event?.target;
    if (!btn) return;

    const originalText = i18n[currentLang].nodeCopy;
    btn.textContent = i18n[currentLang].nodeCopied;
    btn.style.filter = "brightness(1.2)";
    btn.dataset.busy = "true";

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.filter = "";
      delete btn.dataset.busy;
    }, 2000);
  });
}

function copySubscription() {
  navigator.clipboard.writeText(SUBSCRIPTION_URL).then(() => {
    alert(i18n[currentLang].subAlert);
  });
}

function openSubscription() {
  window.open(SUBSCRIPTION_URL, '_blank');
}

function initQRCodes() {
  Object.keys(LINKS).forEach(key => {
    const canvas = document.getElementById(`qr-${key}`);
    if (canvas) {
      const img = new Image();
      img.onload = () => {
        canvas.width = 180;
        canvas.height = 180;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, 180, 180);
        ctx.drawImage(img, 0, 0, 180, 180);
      };
      img.src = "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=" + encodeURIComponent(LINKS[key]);
    }
  });
}

// ===============================
// INITIALIZATION
// ===============================
async function detectLang() {
  const saved = localStorage.getItem('vpn_lang');
  if (saved) {
    setLang(saved);
  } else {
    // Default to RU first, then check IP
    setLang('ru');
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      if (!['RU', 'BY', 'KZ', 'UA'].includes(data.country_code)) {
        setLang('en');
      }
    } catch (e) { }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  detectLang();
  if (sessionStorage.getItem("vpn_auth") === "true") showMainContent();

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      checkPassword();
    });
  }
});
