// igb-countdown.js
(function () {
  // ==============================
  // 🔧 CONFIGURACIÓN EDITABLE
  // ==============================
  var userConfig = window.IGBCountdownConfig || {};

  // Fecha/hora del evento definida en HORA DE LIMA (UTC-5)
  var launchDateLima = userConfig.launchDateLima || "2026-03-11T00:00:00"; // AAAA-MM-DDTHH:MM:SS
  var LIMA_UTC_OFFSET = -5; // América/Lima = UTC-5

  var logoUrl = userConfig.logoUrl || "apple-touch-icon.png"; // pon aquí tu logo
  var downloadUrl = userConfig.downloadUrl || "#";          // link para DESCARGAR CLIENTE

  var enableSound = (typeof userConfig.enableSound === "boolean") ? userConfig.enableSound : true;
  var soundUrl = userConfig.soundUrl || "launch-sound.mp3"; // pon tu archivo de sonido

  var titleText = userConfig.titleText || "🔥 𝐢𝐆𝐮𝐧𝐁𝐨𝐮𝐧𝐝 — 𝐥𝐚𝐧𝐳𝐚𝐦𝐢𝐞𝐧𝐭𝐨 𝐎𝐟𝐢𝐜𝐢𝐚𝐥 🔥";
  var subtitleText =
    userConfig.subtitleText ||
    "𝐋𝐚 𝐜𝐮𝐞𝐧𝐭𝐚 𝐫𝐞𝐠𝐫𝐞𝐬𝐢𝐯𝐚 𝐡𝐚 𝐜𝐨𝐦𝐞𝐧𝐳𝐚𝐝𝐨. ¡𝐏𝐫𝐞𝐩𝐚́𝐫𝐚𝐭𝐞 𝐩𝐚𝐫𝐚 𝐞𝐥 𝐥𝐚𝐧𝐳𝐚𝐦𝐢𝐞𝐧𝐭𝐨 𝐨𝐟𝐢𝐜𝐢𝐚𝐥 𝐝𝐞 𝐢𝐆𝐮𝐧𝐁𝐨𝐮𝐧𝐝 𝐎𝐧𝐥𝐢𝐧𝐞! 🚀";

  // ==============================
  // 🌍 I18N (ES / EN automático)
  // ==============================
  var lang = (navigator.language || "es").toLowerCase();
  var isSpanish = lang.indexOf("es") === 0;

  var t = isSpanish
    ? {
        days: "DÍAS",
        hours: "HORAS",
        minutes: "MINUTOS",
        seconds: "SEGUNDOS",
        launchLocal: "Tu hora local de lanzamiento:",
        zone: "Zona",
        preparing: "Preparando servidores…",
        live: "✅ En vivo",
        active: "🟢 Cuenta regresiva activa",
        invalid: "⚠️ Fecha inválida. Revisa launchDateLima.",
        onlineBanner: "✅ ¡YA ESTÁ ONLINE! ¡Bienvenido a iGunBound!",
        download: "Click Aquí",
        theme: "Tema",
        dark: "Oscuro",
        light: "Gamer"
      }
    : {
        days: "DAYS",
        hours: "HOURS",
        minutes: "MINUTES",
        seconds: "SECONDS",
        launchLocal: "Your local launch time:",
        zone: "Zone",
        preparing: "Preparing servers…",
        live: "✅ Live",
        active: "🟢 Countdown active",
        invalid: "⚠️ Invalid date. Check launchDateLima.",
        onlineBanner: "✅ IT'S ONLINE! Welcome to iGunBound!",
        download: "Click Here",
        theme: "Theme",
        dark: "Dark",
        light: "Gamer"
      };

  // ==============================
  // ⏱️ Conversión de Lima → UTC
  // ==============================
  function localWithOffsetToUTC(dateTimeStr, offsetHours) {
    var parts = dateTimeStr.split("T");
    var datePart = parts[0];
    var timePart = parts[1] || "00:00:00";

    var dateSplit = datePart.split("-");
    var y = parseInt(dateSplit[0], 10);
    var M = parseInt(dateSplit[1], 10);
    var d = parseInt(dateSplit[2], 10);

    var timeSplit = timePart.split(":");
    var h = parseInt(timeSplit[0], 10);
    var m = parseInt(timeSplit[1], 10);
    var s = parseInt(timeSplit[2], 10);

    // local(Lima) -> UTC
    var utcMillis = Date.UTC(y, M - 1, d, h - offsetHours, m, s);
    return new Date(utcMillis);
  }

  var targetUTC = localWithOffsetToUTC(launchDateLima, LIMA_UTC_OFFSET);

  function fmtLocalDate(d) {
    var lng = navigator.language || (isSpanish ? "es-ES" : "en-US");
    return d.toLocaleString(lng, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function pad2(n) {
    return (n < 10 ? "0" : "") + n;
  }

  // ==============================
  // 🎨 CSS INYECTADO
  // ==============================
  var css = ""
  + ":root{"
  + "  --bg1:#070A12;"
  + "  --bg2:#0B1024;"
  + "  --card: rgba(255,255,255,.08);"
  + "  --card2: rgba(255,255,255,.06);"
  + "  --stroke: rgba(255,255,255,.14);"
  + "  --text:#EAF0FF;"
  + "  --muted: rgba(234,240,255,.72);"
  + "  --good:#76FFB3;"
  + "  --gold1:#FFF3B0;"
  + "  --gold2:#FFD25A;"
  + "  --gold3:#FFB321;"
  + "  --neonGreen:#7CFF9C;"
  + "}"
  + "body.igb-body{"
  + "  margin:0;"
  + "  min-height:100vh;"
  + "  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;"
  + "  color:var(--text);"
  + "  background:"
  + "    radial-gradient(1200px 700px at 15% 15%, rgba(120,180,255,.20), transparent 60%),"
  + "    radial-gradient(900px 650px at 85% 25%, rgba(176,95,255,.18), transparent 60%),"
  + "    radial-gradient(900px 650px at 50% 90%, rgba(60,255,200,.10), transparent 55%),"
  + "    linear-gradient(180deg, var(--bg1), var(--bg2));"
  + "  overflow:hidden;"
  + "}"
  + "body.igb-body.igb-light{"
  + "  --bg1:#050816;"
  + "  --bg2:#050816;"
  + "  --card: rgba(6,10,25,.95);"
  + "  --card2: rgba(8,14,35,.98);"
  + "  --stroke: rgba(0,255,204,.45);"
  + "  --text:#EAF8FF;"
  + "  --muted: rgba(180,210,255,.8);"
  + "  background:"
  + "    radial-gradient(1200px 700px at 10% 0%, rgba(0,255,204,.18), transparent 60%),"
  + "    radial-gradient(900px 650px at 90% 10%, rgba(0,128,255,.25), transparent 65%),"
  + "    radial-gradient(900px 650px at 50% 100%, rgba(255,0,128,.18), transparent 60%),"
  + "    linear-gradient(180deg, #050816, #050816);"
  + "}"
  + "*{box-sizing:border-box;}"
  + ".igb-wrap{"
  + "  min-height:100vh;"
  + "  display:grid;"
  + "  place-items:center;"
  + "  padding:28px 16px;"
  + "  position:relative;"
  + "  z-index:1;"
  + "}"
  + ".igb-aurora{"
  + "  position:fixed; inset:-30%;"
  + "  background:"
  + "    radial-gradient(40% 30% at 20% 30%, rgba(120,180,255,.32), transparent 60%),"
  + "    radial-gradient(35% 28% at 80% 35%, rgba(176,95,255,.28), transparent 60%),"
  + "    radial-gradient(35% 30% at 45% 75%, rgba(60,255,200,.18), transparent 60%);"
  + "  filter: blur(40px);"
  + "  animation: igb-float 14s ease-in-out infinite alternate;"
  + "  pointer-events:none;"
  + "  opacity:.9;"
  + "}"
  + "@keyframes igb-float{"
  + "  from{ transform: translate3d(-2%, -1%, 0) scale(1.05) rotate(-2deg); }"
  + "  to  { transform: translate3d( 2%,  1%, 0) scale(1.10) rotate( 2deg); }"
  + "}"
  + ".igb-card{"
  + "  width:min(880px, 95vw);"
  + "  border-radius:26px;"
  + "  background: linear-gradient(180deg, var(--card), var(--card2));"
  + "  border:1px solid var(--stroke);"
  + "  box-shadow:"
  + "    0 30px 80px rgba(0,0,0,.55),"
  + "    0 0 0 1px rgba(255,255,255,.05) inset;"
  + "  overflow:hidden;"
  + "  position:relative;"
  + "  animation: igb-boot 1.2s ease-out forwards;"
  + "  opacity:0;"
  + "}"
  + "@keyframes igb-boot{"
  + "  0%{ opacity:0; transform:translateY(20px) scale(.98); filter:blur(10px);}"
  + "  100%{ opacity:1; transform:translateY(0) scale(1); filter:blur(0);}"
  + "}"
  + ".igb-card::before, .igb-card::after{"
  + "  content:\"\";"
  + "  position:absolute;"
  + "  width:420px; height:420px;"
  + "  border-radius:999px;"
  + "  filter: blur(40px);"
  + "  opacity:.55;"
  + "  pointer-events:none;"
  + "}"
  + ".igb-card::before{"
  + "  left:-160px; top:-220px;"
  + "  background: radial-gradient(circle at 30% 30%, rgba(120,180,255,.65), transparent 65%);"
  + "}"
  + ".igb-card::after{"
  + "  right:-200px; bottom:-240px;"
  + "  background: radial-gradient(circle at 30% 30%, rgba(176,95,255,.55), transparent 65%);"
  + "}"
  + ".igb-inner{"
  + "  padding:20px 26px 18px;"
  + "  backdrop-filter: blur(10px);"
  + "}"
  + ".igb-top{"
  + "  display:flex;"
  + "  align-items:center;"
  + "  justify-content:space-between;"
  + "  gap:16px;"
  + "  flex-wrap:wrap;"
  + "  margin-bottom:8px;"
  + "}"
  + ".igb-left{"
  + "  display:flex;"
  + "  align-items:center;"
  + "  gap:14px;"
  + "  flex-wrap:wrap;"
  + "}"
  + ".igb-logo{"
  + "  width:60px; height:60px;"
  + "  border-radius:18px;"
  + "  overflow:hidden;"
  + "  position:relative;"
  + "  box-shadow:0 0 24px rgba(255,255,255,.25);"
  + "  animation: igb-logo 3.2s ease-in-out infinite;"
  + "}"
  + ".igb-logo img{"
  + "  width:100%; height:100%; object-fit:cover;"
  + "}"
  + "@keyframes igb-logo{"
  + "  0%,100%{ transform:scale(1) rotate(0deg); }"
  + "  50%{ transform:scale(1.06) rotate(-2deg); }"
  + "}"
  + ".igb-badge{"
  + "  display:inline-flex;"
  + "  align-items:center;"
  + "  gap:10px;"
  + "  padding:8px 12px;"
  + "  border-radius:999px;"
  + "  background: rgba(255,255,255,.07);"
  + "  border:1px solid rgba(255,255,255,.12);"
  + "  box-shadow: 0 0 0 1px rgba(255,255,255,.04) inset;"
  + "  font-size:12px;"
  + "  letter-spacing:.08em;"
  + "  text-transform:uppercase;"
  + "  color:var(--muted);"
  + "}"
  + ".igb-dot{"
  + "  width:10px; height:10px;"
  + "  border-radius:50%;"
  + "  background: radial-gradient(circle, rgba(255,230,140,1), rgba(255,196,0,0.8));"
  + "  box-shadow: 0 0 18px rgba(255,196,0,0.8);"
  + "  animation: igb-pulse 1.6s ease-in-out infinite;"
  + "}"
  + "@keyframes igb-pulse{"
  + "  0%,100%{ transform:scale(1); opacity:.9; }"
  + "  50%{ transform:scale(1.25); opacity:1; }"
  + "}"
  + ".igb-theme-toggle{"
  + "  display:flex; align-items:center; gap:8px;"
  + "  padding:6px 10px; border-radius:999px;"
  + "  background:rgba(0,0,0,.18); border:1px solid rgba(255,255,255,.16);"
  + "  font-size:11px; cursor:pointer; text-transform:uppercase;"
  + "}"
  + ".igb-theme-toggle span{ opacity:.8; }"
  + ".igb-theme-knob{"
  + "  width:18px; height:18px; border-radius:999px;"
  + "  background: radial-gradient(circle at 30% 30%, #fff, #ddd);"
  + "  box-shadow:0 0 10px rgba(255,255,255,.7);"
  + "}"
  + ".igb-title{"
  + "  margin:6px 0 4px;"
  + "  font-size:clamp(22px, 3.1vw, 36px);"
  + "  line-height:1.05; letter-spacing:-.02em;"
  + "  text-shadow: 0 0 24px rgba(120,180,255,.20);"
  + "}"
  + ".igb-sub{"
  + "  margin:0 0 16px;"
  + "  color:var(--muted);"
  + "  font-size:clamp(14px, 1.5vw, 16px);"
  + "  line-height:1.55;"
  + "}"
  + ".igb-grid{"
  + "  display:grid;"
  + "  grid-template-columns: repeat(4, 1fr);"
  + "  gap:14px;"
  + "  margin:18px 0 10px;"
  + "}"
  + ".igb-tile{"
  + "  border-radius:20px;"
  + "  border:1px solid rgba(255,255,255,.14);"
  + "  background: rgba(255,255,255,.06);"
  + "  box-shadow:"
  + "    0 12px 35px rgba(0,0,0,.35),"
  + "    0 0 0 1px rgba(255,255,255,.05) inset;"
  + "  padding:18px 14px;"
  + "  position:relative;"
  + "  overflow:hidden;"
  + "}"
  + ".igb-tile::before{"
  + "  content:\"\";"
  + "  position:absolute; inset:-40%;"
  + "  background: radial-gradient(circle at 30% 35%, rgba(255,210,90,.22), transparent 55%);"
  + "  transform: rotate(18deg);"
  + "  pointer-events:none;"
  + "}"
  + ".igb-num{"
  + "  font-variant-numeric: tabular-nums;"
  + "  font-size: clamp(30px, 4.2vw, 52px);"
  + "  font-weight: 900;"
  + "  line-height: 1;"
  + "  letter-spacing: .02em;"
  + "  background: linear-gradient(180deg, var(--gold1), var(--gold2), var(--gold3));"
  + "  -webkit-background-clip: text;"
  + "  background-clip: text;"
  + "  color: transparent;"
  + "  text-shadow:"
  + "    0 0 10px rgba(255,223,120,.7),"
  + "    0 0 28px rgba(255,190,90,.6),"
  + "    0 0 42px rgba(255,160,40,.55);"
  + "  transition: transform .15s ease;"
  + "  animation: igb-neonFlash 1.4s ease-in-out infinite;"
  + "}"
  + "@keyframes igb-neonFlash{"
  + "  0%,100%{"
  + "    text-shadow:"
  + "      0 0 10px rgba(255,223,120,.7),"
  + "      0 0 28px rgba(255,190,90,.6),"
  + "      0 0 42px rgba(255,160,40,.55);"
  + "    opacity:1;"
  + "  }"
  + "  50%{"
  + "    text-shadow:"
  + "      0 0 4px rgba(255,223,120,.5),"
  + "      0 0 16px rgba(255,190,90,.5),"
  + "      0 0 26px rgba(255,160,40,.45);"
  + "    opacity:.9;"
  + "  }"
  + "}"
  + ".igb-lbl{"
  + "  margin-top:10px;"
  + "  font-size:12px;"
  + "  letter-spacing:.18em;"
  + "  text-transform:uppercase;"
  + "  color:var(--neonGreen);"
  + "  text-shadow:"
  + "    0 0 6px rgba(90,255,150,.6),"
  + "    0 0 14px rgba(60,220,120,.4);"
  + "}"
  + ".igb-tick{"
  + "  transform: translateY(-1px) scale(1.01);"
  + "}"
  + ".igb-metaRow{"
  + "  display:flex;"
  + "  justify-content:space-between;"
  + "  gap:12px;"
  + "  flex-wrap:wrap;"
  + "  margin-top:14px;"
  + "  color:rgba(234,240,255,.68);"
  + "  font-size:13px;"
  + "}"
  + ".igb-pill{"
  + "  padding:10px 12px;"
  + "  border-radius:999px;"
  + "  border:1px solid rgba(255,255,255,.12);"
  + "  background: rgba(255,255,255,.05);"
  + "  white-space:nowrap;"
  + "  overflow:hidden;"
  + "  text-overflow:ellipsis;"
  + "}"
  + ".igb-done{"
  + "  margin-top:16px;"
  + "  display:none;"
  + "  padding:14px 16px;"
  + "  border-radius:18px;"
  + "  border:1px solid rgba(118,255,179,.25);"
  + "  background: rgba(118,255,179,.08);"
  + "  color:var(--good);"
  + "  font-weight:800;"
  + "  text-align:center;"
  + "  box-shadow: 0 18px 45px rgba(0,0,0,.35);"
  + "}"
  + ".igb-footer{"
  + "  display:flex;"
  + "  justify-content:space-between;"
  + "  align-items:center;"
  + "  gap:10px;"
  + "  padding:12px 18px 16px;"
  + "  border-top:1px solid rgba(255,255,255,.10);"
  + "  background: rgba(0,0,0,.12);"
  + "  color:rgba(234,240,255,.80);"
  + "  font-size:12px;"
  + "  letter-spacing:.08em;"
  + "  text-transform:uppercase;"
  + "}"
  + ".igb-footer-tags{"
  + "  display:flex; flex-wrap:wrap; gap:8px;"
  + "}"
  + ".igb-download-btn{"
  + "  padding:10px 18px;"
  + "  border-radius:999px;"
  + "  border:none;"
  + "  cursor:pointer;"
  + "  text-decoration:none;"
  + "  text-transform:uppercase;"
  + "  font-weight:700;"
  + "  font-size:12px;"
  + "  letter-spacing:.12em;"
  + "  background: radial-gradient(circle at 20% 0, #fff, #FFE77A, #FFC93C);"
  + "  color:#3A2500;"
  + "  box-shadow:"
  + "    0 0 14px rgba(255,231,122,.8),"
  + "    0 12px 30px rgba(0,0,0,.45);"
  + "  position:relative;"
  + "  overflow:hidden;"
  + "}"
  + ".igb-download-btn::after{"
  + "  content:\"\";"
  + "  position:absolute;"
  + "  inset:-120%;"
  + "  background: linear-gradient(120deg, transparent, rgba(255,255,255,.6), transparent);"
  + "  transform:translateX(-80%);"
  + "  opacity:0;"
  + "}"
  + ".igb-download-btn:hover::after{"
  + "  transform:translateX(40%);"
  + "  opacity:1;"
  + "  transition:transform .7s ease, opacity .7s ease;"
  + "}"
  + "@media (max-width:620px){"
  + "  .igb-grid{ grid-template-columns:repeat(2,1fr); }"
  + "  .igb-inner{ padding:18px; }"
  + "  .igb-footer{ flex-direction:column; align-items:flex-start; }"
  + "}";

  // ==============================
  // 🧱 CREAR ESTRUCTURA
  // ==============================
  function createStructure(root) {
    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    document.body.classList.add("igb-body");

    var aurora = document.createElement("div");
    aurora.className = "igb-aurora";
    document.body.appendChild(aurora);

    var wrap = document.createElement("div");
    wrap.className = "igb-wrap";

    var html = ""
      + "<div class='igb-card'>"
      + "  <div class='igb-inner'>"
      + "    <div class='igb-top'>"
      + "      <div class='igb-left'>"
      + "        <div class='igb-logo'><img src='" + logoUrl + "' alt='iGunBound Logo'></div>"
      + "        <div class='igb-badge'><span class='igb-dot'></span><span>iGunBound Launch</span></div>"
      + "      </div>"
      + "      <button type='button' class='igb-theme-toggle'>"
      + "        <div class='igb-theme-knob'></div>"
      + "        <span>" + t.theme + ": <strong id='igb-theme-label'>" + t.dark + "</strong></span>"
      + "      </button>"
      + "    </div>"
      + "    <h1 class='igb-title'>" + titleText + "</h1>"
      + "    <p class='igb-sub'>" + subtitleText + "</p>"
      + "    <div class='igb-grid' aria-label='Cuenta regresiva'>"
      + "      <div class='igb-tile'><div class='igb-num' id='igb-days'>--</div><div class='igb-lbl'>" + t.days + "</div></div>"
      + "      <div class='igb-tile'><div class='igb-num' id='igb-hours'>--</div><div class='igb-lbl'>" + t.hours + "</div></div>"
      + "      <div class='igb-tile'><div class='igb-num' id='igb-minutes'>--</div><div class='igb-lbl'>" + t.minutes + "</div></div>"
      + "      <div class='igb-tile'><div class='igb-num' id='igb-seconds'>--</div><div class='igb-lbl'>" + t.seconds + "</div></div>"
      + "    </div>"
      + "    <div class='igb-metaRow'>"
      + "      <div class='igb-pill' id='igb-targetText'>" + t.launchLocal + "</div>"
      + "      <div class='igb-pill' id='igb-tzText'>" + t.zone + ": --</div>"
      + "    </div>"
      + "    <div class='igb-done' id='igb-done'>" + t.onlineBanner + "</div>"
      + "  </div>"
      + "  <div class='igb-footer'>"
      + "    <div class='igb-footer-tags'>"
      + "      <span>𝐢𝐆𝐮𝐧𝐁𝐨𝐮𝐧𝐝 𝟐𝟎𝟐𝟔</span><span>•</span><span>𝐍𝐮𝐞𝐯𝐨𝐬 𝐍𝐢𝐯𝐞𝐥𝐞𝐬 𝐇𝐃</span><span>•</span><span>𝐆𝐮𝐢𝐥𝐝 𝐏𝐫𝐢𝐱 </span><span>•</span><span>𝐢𝐆𝐁 𝐂𝐡𝐚𝐦𝐩𝐢𝐨𝐧𝐬 𝐋𝐞𝐚𝐠𝐮𝐞</span>"
      + "    </div>"
      + "    <a href='" + downloadUrl + "' class='igb-download-btn' id='igb-download-btn'>" + t.download + "</a>"
      + "  </div>"
      + "</div>";

    wrap.innerHTML = html;
    root.appendChild(wrap);
  }

  // ==============================
  // ⏱️ LÓGICA DE LA CUENTA
  // ==============================
  function initCountdown() {
    var daysEl = document.getElementById("igb-days");
    var hoursEl = document.getElementById("igb-hours");
    var minutesEl = document.getElementById("igb-minutes");
    var secondsEl = document.getElementById("igb-seconds");
    var targetText = document.getElementById("igb-targetText");
    var tzText = document.getElementById("igb-tzText");
    var doneEl = document.getElementById("igb-done");
    var themeToggle = document.querySelector(".igb-theme-toggle");
    var themeLabel = document.getElementById("igb-theme-label");
    var statusBadge = document.querySelector(".igb-badge");

    var audio = null;
    var soundPlayed = false;

    // ==============================
    // 🎵 MÚSICA DE FONDO (BGM)
    // ==============================
    // Config (defínelo en window.IGBCountdownConfig):
    // enableBgm: true/false
    // bgmUrl: "Kokushibo's Wrath  ｜ Demon Slayer： Infinity Castle ｜ 鬼滅の刃 OST Cover.mp3"
    // bgmVolume: 0.0 - 1.0
    // bgmAutoplay: true/false (normalmente será bloqueado si no hay interacción)
    // bgmLoop: true/false
    // bgmStopOnLaunch: true/false (opcional)
    var enableBgm = (typeof userConfig.enableBgm === "boolean") ? userConfig.enableBgm : false;
    var bgmUrl = userConfig.bgmUrl || "";
    var bgmVolume = (typeof userConfig.bgmVolume === "number") ? userConfig.bgmVolume : 0.25;
    var bgmAutoplay = (typeof userConfig.bgmAutoplay === "boolean") ? userConfig.bgmAutoplay : false;
    var bgmLoop = (typeof userConfig.bgmLoop === "boolean") ? userConfig.bgmLoop : true;
    var bgmStopOnLaunch = (typeof userConfig.bgmStopOnLaunch === "boolean") ? userConfig.bgmStopOnLaunch : false;

    var bgm = null;
    var bgmBtn = null;

    function ensureBgmStyles() {
      if (document.getElementById("igb-bgm-style")) return;
      var st = document.createElement("style");
      st.id = "igb-bgm-style";
      st.textContent =
        "#igb-bgm-btn{position:fixed;right:14px;bottom:14px;z-index:9999;" +
        "padding:10px 14px;border-radius:999px;border:1px solid rgba(255,255,255,.25);" +
        "background:rgba(0,0,0,.35);color:#fff;backdrop-filter:blur(10px);" +
        "cursor:pointer;font-weight:700;letter-spacing:.06em;text-transform:uppercase;" +
        "font-size:12px} " +
        "#igb-bgm-btn:hover{transform:translateY(-1px)}";
      document.head.appendChild(st);
    }

    function createBgmButton() {
      ensureBgmStyles();
      bgmBtn = document.createElement("button");
      bgmBtn.type = "button";
      bgmBtn.id = "igb-bgm-btn";
      bgmBtn.textContent = "🔊 Música";
      document.body.appendChild(bgmBtn);

      bgmBtn.addEventListener("click", function () {
        if (!bgm) return;

        if (bgm.paused) {
          var p = bgm.play();
          if (p && p["catch"]) {
            p["catch"](function () {
              bgmBtn.textContent = "🔊 Música";
            });
          }
          bgmBtn.textContent = "🔇 Mutear";
        } else {
          bgm.pause();
          bgmBtn.textContent = "🔊 Música";
        }
      });
    }

    function initBgm() {
      if (!enableBgm || !bgmUrl) return;

      try {
        bgm = new Audio(bgmUrl);
        bgm.loop = bgmLoop;
        bgm.volume = Math.max(0, Math.min(1, bgmVolume));
        bgm.preload = "auto";
      } catch (e) {
        bgm = null;
        return;
      }

      createBgmButton();

      // Intento de autoplay (normalmente será bloqueado si no hubo interacción)
      if (bgmAutoplay) {
        var p = bgm.play();
        if (p && p.then) {
          p.then(function () {
            if (bgmBtn) bgmBtn.textContent = "🔇 Mutear";
          })["catch"](function () {
            if (bgmBtn) bgmBtn.textContent = "🔊 Música";
          });
        }
      }
    }

    initBgm();


    if (enableSound && soundUrl) {
      try {
        audio = new Audio(soundUrl);
      } catch (e) {
        audio = null;
      }
    }

    function tickAnim(el) {
      el.classList.remove("igb-tick");
      // forzar reflow
      void el.offsetWidth;
      el.classList.add("igb-tick");
      setTimeout(function () {
        el.classList.remove("igb-tick");
      }, 140);
    }

    function setTheme(mode) {
      if (mode === "light") {
        document.body.classList.add("igb-light");
        themeLabel.textContent = t.light;
      } else {
        document.body.classList.remove("igb-light");
        themeLabel.textContent = t.dark;
      }
    }

    // por defecto oscuro (se ve más gamer)
    setTheme("dark");

    if (themeToggle) {
      themeToggle.addEventListener("click", function () {
        var isLight = document.body.classList.contains("igb-light");
        setTheme(isLight ? "dark" : "light");
      });
    }

    function tick() {
      if (isNaN(targetUTC.getTime())) {
        if (statusBadge) statusBadge.textContent = t.invalid;
        targetText.textContent = t.invalid;
        return;
      }

      var now = new Date();
      var diff = targetUTC - now;

      targetText.textContent = t.launchLocal + " " + fmtLocalDate(targetUTC);
      tzText.textContent = t.zone + ": " +
        Intl.DateTimeFormat().resolvedOptions().timeZone;

      if (diff <= 0) {
        daysEl.textContent = "00";
        hoursEl.textContent = "00";
        minutesEl.textContent = "00";
        secondsEl.textContent = "00";
        if (statusBadge) statusBadge.textContent = t.live;
        doneEl.style.display = "block";

        // opcional: detener música de fondo al terminar
        if (bgmStopOnLaunch && bgm) {
          try {
            bgm.pause();
            bgm.currentTime = 0;
            if (bgmBtn) bgmBtn.textContent = "🔊 Música";
          } catch (e) {}
        }

        if (audio && !soundPlayed) {
          soundPlayed = true;
          audio.play()["catch"] && audio.play()["catch"](function(){});
        }

        clearInterval(timer);
        return;
      }

      if (statusBadge) statusBadge.textContent = t.active;

      var totalSeconds = Math.floor(diff / 1000);
      var days = Math.floor(totalSeconds / 86400);
      var hours = Math.floor((totalSeconds % 86400) / 3600);
      var minutes = Math.floor((totalSeconds % 3600) / 60);
      var seconds = totalSeconds % 60;

      var prevD = daysEl.textContent;
      var prevH = hoursEl.textContent;
      var prevM = minutesEl.textContent;
      var prevS = secondsEl.textContent;

      daysEl.textContent = String(days);
      hoursEl.textContent = pad2(hours);
      minutesEl.textContent = pad2(minutes);
      secondsEl.textContent = pad2(seconds);

      if (prevD !== daysEl.textContent) tickAnim(daysEl);
      if (prevH !== hoursEl.textContent) tickAnim(hoursEl);
      if (prevM !== minutesEl.textContent) tickAnim(minutesEl);
      if (prevS !== secondsEl.textContent) tickAnim(secondsEl);
    }

    tick();
    var timer = setInterval(tick, 1000);
  }

  // ==============================
  // 🚀 INICIALIZAR
  // ==============================
  document.addEventListener("DOMContentLoaded", function () {
    var root = document.getElementById("igb-countdown");
    if (!root) return;
    createStructure(root);
    initCountdown();
  });
})();



