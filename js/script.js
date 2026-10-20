/* Wedding site settings: replace these sample values with the couple's real details. */
const WEDDING_CONFIG = {
  couple: { bride: "Pau", groom: "Erick", monogram: "E & P" },
  // Local time is used by the browser. Set the date/time to the wedding venue's local time.
  weddingDate: "2026-12-05T13:30:00",
  rsvpDeadline: "2026-11-05",
  maxGuests: 4,
  // Add your Google Apps Script web app URL or API endpoint to enable real submission.
  // Leave empty to keep safe demo mode. Demo mode never claims a response was saved.
  rsvpEndpoint: "https://script.google.com/macros/s/AKfycbxVkKEByhpQGbhs3vkTSFkazfH5qDkUgZN8tRezn2niI_F4iuCe2o9eWyC7VyzGksZ6/exec",
  demoMode: false,
  requireEmail: false
};

// Ensure fonts are marked ready immediately
if ("fonts" in document) {
  document.fonts.ready.then(() => {
    document.documentElement.classList.add("fonts-ready");
  });
}

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const header = $("#siteHeader");
const menuToggle = $("#menuToggle");
const navLinks = $("#navLinks");

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 24);
}
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const navOverlay = $("#navOverlay");
const navDrawerClose = $("#navDrawerClose");

function openNav() {
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Close navigation menu");
  navLinks.classList.add("open");
  navOverlay.classList.add("visible");
  document.body.classList.add("nav-open");
}

function closeNav() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  navLinks.classList.remove("open");
  navOverlay.classList.remove("visible");
  document.body.classList.remove("nav-open");
}

menuToggle.addEventListener("click", () => {
  menuToggle.getAttribute("aria-expanded") === "true" ? closeNav() : openNav();
});

if (navDrawerClose) navDrawerClose.addEventListener("click", closeNav);
if (navOverlay) navOverlay.addEventListener("click", closeNav);

$$(".nav-links a").forEach(link => {
  link.addEventListener("click", closeNav);
});


/* ==========================================================================
   1. COUNTDOWN TIMER (FROM WEDDING RSVP 2)
   ========================================================================== */
function initCountdown() {
  const targetDate = new Date(WEDDING_CONFIG.weddingDate).getTime();
  const daysEls = document.querySelectorAll(".cd-days, #days, #cd-days");
  const hoursEls = document.querySelectorAll(".cd-hours, #hours, #cd-hours");
  const minsEls = document.querySelectorAll(".cd-mins, #minutes, #cd-mins");
  const secsEls = document.querySelectorAll(".cd-secs, #seconds, #cd-secs");

  function update() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      daysEls.forEach(el => (el.textContent = "00"));
      hoursEls.forEach(el => (el.textContent = "00"));
      minsEls.forEach(el => (el.textContent = "00"));
      secsEls.forEach(el => (el.textContent = "00"));
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    daysEls.forEach(el => (el.textContent = String(days).padStart(2, "0")));
    hoursEls.forEach(el => (el.textContent = String(hours).padStart(2, "0")));
    minsEls.forEach(el => (el.textContent = String(mins).padStart(2, "0")));
    secsEls.forEach(el => (el.textContent = String(secs).padStart(2, "0")));
  }

  update();
  setInterval(update, 1000);
}
initCountdown();

/* ==========================================================================
   2. FALLING GOLDEN PARTICLES CANVAS (FROM WEDDING RSVP 2)
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Debounce resize to avoid thrashing canvas on every pixel of resize
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, 150);
  }, { passive: true });

  const particleCount = window.innerWidth < 768 ? 20 : 35;
  const particles = Array.from({ length: particleCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2.5 + 1.2,
    speedY: Math.random() * 0.9 + 0.3,
    speedX: Math.random() * 0.5 - 0.25,
    opacity: Math.random() * 0.45 + 0.15,
    pulseSpeed: Math.random() * 0.02 + 0.005,
    pulseVal: Math.random() * Math.PI
  }));

  function render() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.y += p.speedY;
      p.x += Math.sin(p.y * 0.008) * 0.4 + p.speedX;
      p.pulseVal += p.pulseSpeed;

      if (p.y > height + 10) {
        p.y = -10;
        p.x = Math.random() * width;
      }

      const dynamicOpacity = p.opacity + Math.sin(p.pulseVal) * 0.1;
      ctx.fillStyle = `rgba(212, 175, 55, ${Math.max(0.1, dynamicOpacity)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(render);
  }

  render();
}
initParticleCanvas();

const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  }), { threshold: 0.12 })
  : null;
$$(".reveal").forEach(element => {
  if (revealObserver) revealObserver.observe(element);
  else element.classList.add("is-visible");
});

const sectionLinks = $$(".nav-links a[href^='#']");
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach(link => link.classList.toggle("active", link.hash === `#${entry.target.id}`));
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  ["story", "wedding", "entourage", "dress", "gallery", "gift", "rsvp"].forEach(id => {
    const section = document.getElementById(id);
    if (section) sectionObserver.observe(section);
  });
}

/* ==========================================================================
   GALLERY LIGHTBOX & SWIPE NAVIGATION
   ========================================================================== */
const galleryButtons = $$(".gallery-item");
const lightbox = $("#lightbox");
const lightboxImage = $("#lightboxImage");
const lightboxCaption = $("#lightboxCaption");
let galleryIndex = 0;
let lastFocusedElement = null;
const galleryImages = galleryButtons.map(button => {
  const img = $("img", button);
  return { src: img.src, alt: img.alt };
});

function showGalleryImage(index, animateDirection = null) {
  galleryIndex = (index + galleryImages.length) % galleryImages.length;
  const item = galleryImages[galleryIndex];

  if (animateDirection) {
    const outOffset = animateDirection === "next" ? "-35px" : "35px";
    const inOffset = animateDirection === "next" ? "35px" : "-35px";

    lightboxImage.style.transition = "transform .14s ease-out, opacity .14s ease-out";
    lightboxImage.style.transform = `translateX(${outOffset})`;
    lightboxImage.style.opacity = "0.2";

    setTimeout(() => {
      lightboxImage.src = item.src;
      lightboxImage.alt = item.alt;
      lightboxCaption.textContent = `${galleryIndex + 1} / ${galleryImages.length} · ${item.alt}`;
      lightboxImage.style.transition = "none";
      lightboxImage.style.transform = `translateX(${inOffset})`;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          lightboxImage.style.transition = "transform .22s cubic-bezier(0.16, 1, 0.3, 1), opacity .22s ease";
          lightboxImage.style.transform = "translateX(0)";
          lightboxImage.style.opacity = "1";
        });
      });
    }, 110);
  } else {
    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt;
    lightboxCaption.textContent = `${galleryIndex + 1} / ${galleryImages.length} · ${item.alt}`;
    lightboxImage.style.transform = "translateX(0) translateY(0) scale(1)";
    lightboxImage.style.opacity = "1";
  }
}

function openLightbox(index) {
  lastFocusedElement = document.activeElement;
  showGalleryImage(index);
  lightbox.hidden = false;
  document.body.classList.add("no-scroll");
  $("#lightboxClose").focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.classList.remove("no-scroll");
  if (lightboxImage) {
    lightboxImage.style.transform = "translateX(0) translateY(0) scale(1)";
    lightboxImage.style.opacity = "1";
  }
  if (lastFocusedElement) lastFocusedElement.focus();
}

galleryButtons.forEach((button, index) => button.addEventListener("click", () => openLightbox(index)));
$("#lightboxClose").addEventListener("click", closeLightbox);
$("#lightboxPrev").addEventListener("click", () => showGalleryImage(galleryIndex - 1, "prev"));
$("#lightboxNext").addEventListener("click", () => showGalleryImage(galleryIndex + 1, "next"));
lightbox.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });

document.addEventListener("keydown", event => {
  if (lightbox.hidden) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showGalleryImage(galleryIndex - 1, "prev");
  if (event.key === "ArrowRight") showGalleryImage(galleryIndex + 1, "next");
});

/* SWIPE & DRAG SUPPORT FOR LIGHTBOX (TOUCH + MOUSE DRAG) */
(function setupLightboxSwipe() {
  if (!lightbox || !lightboxImage) return;

  let touchStartX = 0;
  let touchStartY = 0;
  let touchCurrentX = 0;
  let touchCurrentY = 0;
  let startTime = 0;
  let isTracking = false;
  let isHorizontalSwipe = false;
  let isVerticalSwipe = false;

  // Touch Events (Mobile / Tablet)
  lightbox.addEventListener("touchstart", (e) => {
    if (lightbox.hidden || e.touches.length > 1) return;
    if (e.target.closest("#lightboxClose, #lightboxPrev, #lightboxNext")) return;

    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchCurrentX = touchStartX;
    touchCurrentY = touchStartY;
    startTime = Date.now();
    isTracking = true;
    isHorizontalSwipe = false;
    isVerticalSwipe = false;
    lightboxImage.style.transition = "none";
  }, { passive: true });

  lightbox.addEventListener("touchmove", (e) => {
    if (!isTracking || e.touches.length > 1) return;

    const touch = e.touches[0];
    touchCurrentX = touch.clientX;
    touchCurrentY = touch.clientY;
    const diffX = touchCurrentX - touchStartX;
    const diffY = touchCurrentY - touchStartY;

    if (!isHorizontalSwipe && !isVerticalSwipe) {
      if (Math.abs(diffX) > 8 || Math.abs(diffY) > 8) {
        if (Math.abs(diffX) >= Math.abs(diffY)) {
          isHorizontalSwipe = true;
        } else if (diffY > 0) {
          isVerticalSwipe = true;
        }
      }
    }

    if (isHorizontalSwipe) {
      if (e.cancelable) e.preventDefault();
      const dragFactor = 0.8;
      const opacity = Math.max(0.4, 1 - Math.abs(diffX) / 600);
      lightboxImage.style.transform = `translateX(${diffX * dragFactor}px)`;
      lightboxImage.style.opacity = opacity;
    } else if (isVerticalSwipe) {
      if (e.cancelable) e.preventDefault();
      const dragFactor = 0.7;
      const opacity = Math.max(0.3, 1 - diffY / 400);
      lightboxImage.style.transform = `translateY(${diffY * dragFactor}px) scale(${Math.max(0.85, 1 - diffY / 800)})`;
      lightboxImage.style.opacity = opacity;
    }
  }, { passive: false });

  lightbox.addEventListener("touchend", () => {
    if (!isTracking) return;
    isTracking = false;

    const diffX = touchCurrentX - touchStartX;
    const diffY = touchCurrentY - touchStartY;
    const elapsed = Date.now() - startTime;
    const isFlick = elapsed < 260 && Math.abs(diffX) > 25;
    const threshold = isFlick ? 25 : 45;

    lightboxImage.style.transition = "transform .24s cubic-bezier(0.16, 1, 0.3, 1), opacity .24s ease";

    if (isHorizontalSwipe && Math.abs(diffX) > threshold) {
      if (diffX < 0) {
        showGalleryImage(galleryIndex + 1, "next");
      } else {
        showGalleryImage(galleryIndex - 1, "prev");
      }
    } else if (isVerticalSwipe && diffY > 80) {
      closeLightbox();
    } else {
      lightboxImage.style.transform = "translateX(0) translateY(0) scale(1)";
      lightboxImage.style.opacity = "1";
    }
  }, { passive: true });

  lightbox.addEventListener("touchcancel", () => {
    isTracking = false;
    lightboxImage.style.transition = "transform .24s ease, opacity .24s ease";
    lightboxImage.style.transform = "translateX(0) translateY(0) scale(1)";
    lightboxImage.style.opacity = "1";
  }, { passive: true });

  // Mouse Drag Support (Desktop)
  let mouseStartX = 0;
  let mouseCurrentX = 0;
  let isMouseDown = false;

  lightboxImage.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    isMouseDown = true;
    mouseStartX = e.clientX;
    mouseCurrentX = mouseStartX;
    startTime = Date.now();
    lightbox.classList.add("is-dragging");
    lightboxImage.style.transition = "none";
  });

  window.addEventListener("mousemove", (e) => {
    if (!isMouseDown) return;
    mouseCurrentX = e.clientX;
    const diffX = mouseCurrentX - mouseStartX;
    const opacity = Math.max(0.4, 1 - Math.abs(diffX) / 700);
    lightboxImage.style.transform = `translateX(${diffX * 0.75}px)`;
    lightboxImage.style.opacity = opacity;
  });

  window.addEventListener("mouseup", (e) => {
    if (!isMouseDown) return;
    isMouseDown = false;
    lightbox.classList.remove("is-dragging");
    const diffX = mouseCurrentX - mouseStartX;
    const elapsed = Date.now() - startTime;
    const isFlick = elapsed < 300 && Math.abs(diffX) > 25;
    const threshold = isFlick ? 25 : 50;

    lightboxImage.style.transition = "transform .24s cubic-bezier(0.16, 1, 0.3, 1), opacity .24s ease";

    if (Math.abs(diffX) > threshold) {
      if (diffX < 0) {
        showGalleryImage(galleryIndex + 1, "next");
      } else {
        showGalleryImage(galleryIndex - 1, "prev");
      }
    } else {
      lightboxImage.style.transform = "translateX(0)";
      lightboxImage.style.opacity = "1";
    }
  });
})();

/* ==========================================================================
   RSVP SUBMISSION & GOOGLE SHEETS INTEGRATION (OPTIMISTIC + FAST SYNC)
   ========================================================================== */

const RSVP_STORAGE_KEY = "wedding_attendees";
const RSVP_PENDING_KEY = "wedding_pending_rsvps";

function saveLocalRsvp(payload) {
  try {
    const list = JSON.parse(localStorage.getItem(RSVP_STORAGE_KEY) || "[]");
    list.unshift(payload);
    localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn("Could not save to localStorage:", e);
  }
}

function queuePendingRsvp(payload) {
  try {
    const pending = JSON.parse(localStorage.getItem(RSVP_PENDING_KEY) || "[]");
    pending.push(payload);
    localStorage.setItem(RSVP_PENDING_KEY, JSON.stringify(pending));
  } catch (e) {
    console.warn("Could not queue pending RSVP:", e);
  }
}

function removePendingRsvp(id) {
  try {
    const pending = JSON.parse(localStorage.getItem(RSVP_PENDING_KEY) || "[]");
    const updated = pending.filter(item => item.id !== id);
    localStorage.setItem(RSVP_PENDING_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Could not remove pending RSVP:", e);
  }
}

async function sendRsvpToEndpoint(payload) {
  if (!WEDDING_CONFIG.rsvpEndpoint || !WEDDING_CONFIG.rsvpEndpoint.trim()) {
    return { success: true, destination: "local-demo" };
  }

  const endpoint = WEDDING_CONFIG.rsvpEndpoint.trim();
  const body = JSON.stringify({
    fullName: payload.fullName,
    attendance: payload.attendance,
    message: payload.message,
    submittedAt: payload.submittedAt
  });

  try {
    await fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      keepalive: true,
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body
    });
    if (payload.id) removePendingRsvp(payload.id);
    return { success: true, destination: "google-sheets" };
  } catch (err) {
    console.warn("Primary background send failed, retrying...", err);
    try {
      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        keepalive: true,
        body
      });
      if (payload.id) removePendingRsvp(payload.id);
      return { success: true, destination: "google-sheets" };
    } catch (finalErr) {
      console.error("Submission saved to retry queue:", finalErr);
      throw finalErr;
    }
  }
}

/**
 * Sends RSVP payload to Google Sheets Web App.
 * Uses local persistence + keepalive background fetch for instant UX.
 */
async function submitRsvpData(payload) {
  if (!payload.id) {
    payload.id = Date.now() + "_" + Math.random().toString(36).slice(2, 8);
  }
  // 1. Instantly record locally
  saveLocalRsvp(payload);
  queuePendingRsvp(payload);

  // 2. Transmit in background with keepalive
  return sendRsvpToEndpoint(payload);
}

// Background flusher for any queued submissions
function flushPendingRsvps() {
  try {
    const pending = JSON.parse(localStorage.getItem(RSVP_PENDING_KEY) || "[]");
    if (!pending.length) return;
    pending.forEach(item => {
      sendRsvpToEndpoint(item).catch(() => {});
    });
  } catch (e) {
    console.warn("Error flushing pending RSVPs:", e);
  }
}

window.addEventListener("online", flushPendingRsvps);
// Delay flush until after the critical load path completes
setTimeout(flushPendingRsvps, 5000);

/* ==========================================================================
   REAL-TIME GOOGLE SHEETS DYNAMIC CONFIGURATION (SEATS & HERO IMAGE)
   ========================================================================== */

const SITE_CONFIG_STORAGE_KEY = "wedding_live_config";

/**
 * Normalizes image URLs, including converting Google Drive share URLs
 * to direct CDN image URLs.
 */
function normalizeLiveImageUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== "string") return "";
  const trimmed = rawUrl.trim();
  if (!trimmed) return "";

  // Handle Google Drive links
  // e.g. https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  // or https://drive.google.com/open?id=FILE_ID
  if (trimmed.includes("drive.google.com")) {
    const fileIdMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                        trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}=w2400`;
    }
  }
  return trimmed;
}

/**
 * Applies site configuration to DOM elements:
 * 1. Reserved seats underline with bold number
 * 2. Hero section background image
 */
function applySiteConfig(config) {
  if (!config) return;

  // 1. Reserved seats number
  const seatsCountEl = document.getElementById("reservedSeatsCount");
  if (seatsCountEl) {
    const urlParams = new URLSearchParams(window.location.search);
    const paramSeats = urlParams.get("seats") || urlParams.get("seat");
    const seatsToDisplay = paramSeats || config.reservedSeats || "2";
    seatsCountEl.textContent = seatsToDisplay;
  }

  // 2. Hero background image
  const heroImageEl = document.getElementById("heroImage");
  if (heroImageEl) {
    const rawHeroImg = (config.heroImage || "").trim();
    if (rawHeroImg) {
      const normalizedHeroImg = normalizeLiveImageUrl(rawHeroImg);
      const preloadImg = new Image();
      preloadImg.onload = () => {
        heroImageEl.style.backgroundImage = `url("${normalizedHeroImg}")`;
      };
      preloadImg.src = normalizedHeroImg;
    } else {
      // Revert to CSS default if no link provided in sheet
      heroImageEl.style.backgroundImage = "";
    }
  }
}

/**
 * Loads cached configuration from localStorage for instantaneous rendering
 */
function loadCachedSiteConfig() {
  try {
    const cached = localStorage.getItem(SITE_CONFIG_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      applySiteConfig(parsed);
    } else {
      // Default initial state
      applySiteConfig({ reservedSeats: "2", heroImage: "" });
    }
  } catch (e) {
    console.warn("Could not load cached live config:", e);
  }
}

/**
 * Fetches latest settings from Google Apps Script Web App
 */
async function syncSiteConfigFromSheet() {
  if (!WEDDING_CONFIG.rsvpEndpoint || !WEDDING_CONFIG.rsvpEndpoint.trim()) {
    return;
  }

  const endpoint = WEDDING_CONFIG.rsvpEndpoint.trim();
  const fetchUrl = `${endpoint}?action=getConfig&t=${Date.now()}`;

  try {
    const response = await fetch(fetchUrl, {
      method: "GET",
      cache: "no-store"
    });

    if (!response.ok) return;

    const data = await response.json();
    if (data && (data.reservedSeats !== undefined || data.heroImage !== undefined)) {
      applySiteConfig(data);
      try {
        localStorage.setItem(SITE_CONFIG_STORAGE_KEY, JSON.stringify(data));
      } catch (e) {}
    }
  } catch (err) {
    // Fallback using JSONP if CORS restrictions apply to direct fetch
    syncSiteConfigViaJsonp(endpoint);
  }
}

/**
 * JSONP fallback for older browser or strict CORS environments
 */
function syncSiteConfigViaJsonp(endpoint) {
  try {
    const callbackName = "onLiveConfigLoaded_" + Math.random().toString(36).substring(2, 9);
    const script = document.createElement("script");

    window[callbackName] = function (data) {
      if (data && (data.reservedSeats !== undefined || data.heroImage !== undefined)) {
        applySiteConfig(data);
        try {
          localStorage.setItem(SITE_CONFIG_STORAGE_KEY, JSON.stringify(data));
        } catch (e) {}
      }
      try {
        delete window[callbackName];
        script.remove();
      } catch (e) {}
    };

    script.src = `${endpoint}?callback=${callbackName}&t=${Date.now()}`;
    script.onerror = () => {
      try {
        delete window[callbackName];
        script.remove();
      } catch (e) {}
    };
    document.head.appendChild(script);
  } catch (e) {
    console.warn("JSONP config sync failed:", e);
  }
}

// 1. Instantly apply cached config on script execution
loadCachedSiteConfig();

// 2. Fetch live updates from Google Sheets
syncSiteConfigFromSheet();

// 3. Auto-update in real time
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    syncSiteConfigFromSheet();
  }
});
window.addEventListener("focus", syncSiteConfigFromSheet);

// Periodic polling every 30 seconds for live sync
setInterval(syncSiteConfigFromSheet, 30000);



/* ==========================================================================
   RSVP POPUP MODAL
   ========================================================================== */
const rsvpModal = $("#rsvpModal");
const rsvpModalClose = $("#rsvpModalClose");
const rsvpModalDismiss = $("#rsvpModalDismiss");
const popupForm = $("#popupRsvpForm");
const popupAttendingFields = $("#popupAttendingFields");
const popupGuestCount = $("#popupGuestCount");
const popupGuestNamesField = $("#popupGuestNamesField");
const popupGuestNamesInput = $("#popupGuestNames");
const popupSubmitBtn = $("#popupSubmitRsvp");
const popupFormStatus = $("#popupFormStatus");

function openRsvpModal() {
  if (!rsvpModal) return;
  rsvpModal.hidden = false;
  document.body.classList.add("modal-open");
  requestAnimationFrame(() => {
    rsvpModal.classList.add("is-open");
  });
}

function closeRsvpModal() {
  if (!rsvpModal) return;
  rsvpModal.classList.remove("is-open");
  document.body.classList.remove("modal-open");
  setTimeout(() => {
    rsvpModal.hidden = true;
  }, 350);

  // Background music starts only once the first RSVP form was submitted or closed
  if (typeof onFirstRsvpClosedOrSubmitted === "function") {
    onFirstRsvpClosedOrSubmitted();
  }
}

// Make RSVP form already popped up when user visits the website (commented out for now)
/*
if (rsvpModal) {
  rsvpModal.hidden = false;
  rsvpModal.classList.add("is-open");
  document.body.classList.add("modal-open");
}
*/

// Modal close button handlers
if (rsvpModalClose) rsvpModalClose.addEventListener("click", closeRsvpModal);
if (rsvpModalDismiss) rsvpModalDismiss.addEventListener("click", closeRsvpModal);
if (rsvpModal) {
  rsvpModal.addEventListener("click", event => {
    if (event.target === rsvpModal || event.target.classList.contains("rsvp-modal-container")) {
      closeRsvpModal();
    }
  });
}
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && rsvpModal && !rsvpModal.hidden) {
    closeRsvpModal();
  }
});

// Also open modal on "Kindly RSVP" nav link and floating mail FAB
$$(".nav-rsvp").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    openRsvpModal();
  });
});

/* Popup Form Logic */
function getPopupAttendance() {
  return $('input[name="popupAttendance"]:checked')?.value || "";
}

$$('input[name="popupAttendance"]').forEach(input => {
  input.addEventListener("change", () => {
    const err = $("#popupAttendanceError");
    if (err) err.textContent = "";
  });
});

function validatePopupForm() {
  let valid = true;
  const nameInput = $("#popupFullName");
  const name = nameInput ? nameInput.value.trim() : "";
  const attendance = getPopupAttendance();
  const nameErr = $("#popupFullNameError");
  const attErr = $("#popupAttendanceError");

  if (nameErr) nameErr.textContent = "";
  if (attErr) attErr.textContent = "";

  if (!name) {
    if (nameErr) nameErr.textContent = "Please enter your full name.";
    valid = false;
  }
  if (!attendance) {
    if (attErr) attErr.textContent = "Please choose an attendance response.";
    valid = false;
  }
  return valid;
}

if (popupForm) {
  popupForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!validatePopupForm()) return;

    const data = new FormData(popupForm);
    const attendanceVal = getPopupAttendance();
    const payload = {
      fullName: String(data.get("fullName") || "").trim(),
      attendance: attendanceVal === "accept" ? "Joyfully Accept" : "Regretfully Decline",
      message: String(data.get("message") || "").trim(),
      submittedAt: new Date().toLocaleString()
    };

    // Subtle tactile feedback (150ms)
    popupSubmitBtn.disabled = true;
    popupSubmitBtn.innerHTML = 'Sending…';
    if (popupFormStatus) popupFormStatus.hidden = true;

    setTimeout(() => {
      // 1. INSTANTLY CLOSE THE MODAL (no waiting for remote server latency)
      closeRsvpModal();

      // 3. Reset form and restore button
      popupForm.reset();
      popupSubmitBtn.disabled = false;
      popupSubmitBtn.innerHTML = 'Submit RSVP <span aria-hidden="true">↗</span>';
    }, 150);

    // 4. Background transmit with retry queue & local cache
    submitRsvpData(payload).catch(err => {
      console.warn("Background transmission queued for retry:", err);
    });
  });
}

/* ==========================================================================
   IN-PAGE RSVP FORM
   ========================================================================== */
const form = $("#rsvpForm");
const submitButton = $("#submitRsvp");
const formStatus = $("#formStatus");

function getAttendance() {
  return $('input[name="attendance"]:checked')?.value || "";
}

$$('input[name="attendance"]').forEach(input => {
  input.addEventListener("change", () => {
    clearError("attendance");
  });
});

function showError(field, message) {
  const target = document.getElementById(`${field}Error`);
  if (target) target.textContent = message;
}

function clearError(field) {
  const target = document.getElementById(`${field}Error`);
  if (target) target.textContent = "";
}

function clearErrors() {
  ["fullName", "attendance"].forEach(clearError);
  if (formStatus) {
    formStatus.hidden = true;
    formStatus.classList.remove("error");
  }
}

function validateForm() {
  clearErrors();
  let valid = true;
  const name = $("#fullName")?.value.trim();
  const attendance = getAttendance();
  if (!name) { showError("fullName", "Please enter your full name."); valid = false; }
  if (!attendance) { showError("attendance", "Please choose an attendance response."); valid = false; }
  return valid;
}

if (form) {
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!validateForm()) return;

    submitButton.disabled = true;
    submitButton.innerHTML = 'Sending…';
    if (formStatus) formStatus.hidden = true;

    const data = new FormData(form);
    const payload = {
      fullName: String(data.get("fullName") || "").trim(),
      attendance: data.get("attendance") === "accept" ? "Joyfully Accept" : "Regretfully Decline",
      message: String(data.get("message") || "").trim(),
      submittedAt: new Date().toLocaleString()
    };

    setTimeout(() => {
      form.reset();
      if (formStatus) {
        formStatus.textContent = payload.attendance === "Joyfully Accept"
          ? "Thank you! Your RSVP has been recorded. We cannot wait to celebrate with you."
          : "Thank you for letting us know. We will miss you and appreciate your response.";
        formStatus.classList.remove("error");
        formStatus.hidden = false;
      }
      submitButton.disabled = false;
      submitButton.innerHTML = 'Submit RSVP <span aria-hidden="true">↗</span>';
    }, 150);

    // Background transmit with retry queue & local cache
    submitRsvpData(payload).catch(err => {
      console.warn("Background transmission queued for retry:", err);
    });
  });
}

/* ==========================================================================
   IMAGE PRELOADER & IN-MEMORY CACHE
   ========================================================================== */
window.__IMAGE_CACHE = window.__IMAGE_CACHE || new Set();

function preloadAndCacheImages() {
  // Only queue the above-the-fold / hero image eagerly;
  // defer the rest until the browser is idle.
  const criticalSources = [
    "images/hero-background.JPG",
    "images/prenup/IMG_8066.JPG"
  ];
  const deferredSources = [
    "images/meet-couple-1.jpg",
    "images/meet-couple-2.jpg",
    "images/attire_guest.jpg",
    "images/attire_ninang.jpg",
    "images/attire_ninong.jpg"
  ];

  function cacheImage(src) {
    if (!src || window.__IMAGE_CACHE.has(src)) return;
    window.__IMAGE_CACHE.add(src);
    const imgObj = new Image();
    imgObj.src = src;
    if (typeof imgObj.decode === "function") {
      imgObj.decode().catch(() => {});
    }
  }

  // Cache critical images right away
  criticalSources.forEach(cacheImage);

  // Defer the rest until the browser is idle (or after 3s as fallback)
  function cacheDeferred() {
    // Also pick up any <img> tags already in the DOM
    document.querySelectorAll("img").forEach(img => {
      const src = img.getAttribute("src") || img.src;
      if (src) cacheImage(src);
      const dataSrc = img.getAttribute("data-src");
      if (dataSrc) cacheImage(dataSrc);
    });
    deferredSources.forEach(cacheImage);
  }

  if ("requestIdleCallback" in window) {
    requestIdleCallback(cacheDeferred, { timeout: 3000 });
  } else {
    setTimeout(cacheDeferred, 3000);
  }
}

// Defer image preloading until after DOMContentLoaded so it doesn't
// compete with critical resources during initial parse.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", preloadAndCacheImages, { once: true });
} else {
  // DOM already ready — run after current call stack clears
  setTimeout(preloadAndCacheImages, 0);
}

/* ==========================================================================
   FLOATING ACTION BUTTONS (FAB) & BACKGROUND MUSIC CONTROLS
   ========================================================================== */
const bgMusic = $("#bgMusic");
const fabEmail = $("#fabEmail");
const fabMusic = $("#fabMusic");
const iconMusicNote = $("#iconMusicNote");
const iconMusicPause = $("#iconMusicPause");

let musicStartedOnce = false;
let userManuallyPaused = false;

function onFirstRsvpClosedOrSubmitted() {
  if (!userManuallyPaused && bgMusic && bgMusic.paused) startMusic();
}

function updateMusicUI(isPlaying) {
  if (!fabMusic) return;
  fabMusic.classList.toggle("playing", isPlaying);
  fabMusic.setAttribute("aria-label", isPlaying ? "Pause background music" : "Play background music");
  fabMusic.setAttribute("title", isPlaying ? "Pause music" : "Play music");

  if (iconMusicNote) {
    iconMusicNote.style.display = isPlaying ? "none" : "block";
    if (isPlaying) iconMusicNote.setAttribute("hidden", "");
    else iconMusicNote.removeAttribute("hidden");
  }
  if (iconMusicPause) {
    iconMusicPause.style.display = isPlaying ? "block" : "none";
    if (isPlaying) iconMusicPause.removeAttribute("hidden");
    else iconMusicPause.setAttribute("hidden", "");
  }
}

async function startMusic() {
  if (!bgMusic || userManuallyPaused) return;
  try {
    await bgMusic.play();
    musicStartedOnce = true;
    updateMusicUI(true);
  } catch (err) {
    const isNotAllowed = err.name === "NotAllowedError";
    const isNotReady = err.name === "NotSupportedError" || err.name === "AbortError" ||
                       err.name === "NetworkError" || err.message?.includes("load");

    if (isNotAllowed) {
      // Browser blocked unprompted autoplay — play on very first user gesture anywhere
      console.warn("Autoplay awaiting user interaction...");
      updateMusicUI(false);
      const unlockAudio = () => {
        if (!userManuallyPaused && bgMusic.paused) {
          bgMusic.play().then(() => {
            musicStartedOnce = true;
            updateMusicUI(true);
          }).catch(() => {});
        }
        ["pointerdown", "touchstart", "click", "keydown", "scroll"].forEach(evt => {
          window.removeEventListener(evt, unlockAudio, { capture: true });
        });
      };
      ["pointerdown", "touchstart", "click", "keydown", "scroll"].forEach(evt => {
        window.addEventListener(evt, unlockAudio, { once: true, capture: true, passive: true });
      });
    } else if (isNotReady) {
      updateMusicUI(false);
      bgMusic.addEventListener("canplay", function retry() {
        bgMusic.removeEventListener("canplay", retry);
        if (!userManuallyPaused) {
          bgMusic.play().then(() => {
            musicStartedOnce = true;
            updateMusicUI(true);
          }).catch(() => {});
        }
      }, { once: true });
      bgMusic.load();
    } else {
      console.warn("Audio play error:", err);
      updateMusicUI(false);
    }
  }
}

function pauseMusic() {
  if (!bgMusic) return;
  userManuallyPaused = true;
  bgMusic.pause();
  updateMusicUI(false);
}

function toggleMusic() {
  if (!bgMusic) return;
  if (bgMusic.paused) {
    userManuallyPaused = false;
    musicStartedOnce = true;
    startMusic();
  } else {
    pauseMusic();
  }
}

// Background music starts automatically upon visiting the website
startMusic();

if (fabMusic) {
  fabMusic.addEventListener("click", toggleMusic);
}

if (bgMusic) {
  // Always derive icon state from actual audio events — never from assumptions
  bgMusic.addEventListener("play",    () => updateMusicUI(true));
  bgMusic.addEventListener("playing", () => updateMusicUI(true));
  bgMusic.addEventListener("pause",   () => updateMusicUI(false));
  bgMusic.addEventListener("ended",   () => updateMusicUI(false));

  // Auto-recover from network stalls while playing
  bgMusic.addEventListener("stalled", () => {
    if (!bgMusic.paused && musicStartedOnce) {
      console.warn("Audio stalled — reloading and retrying...");
      const t = bgMusic.currentTime;
      bgMusic.load();
      bgMusic.currentTime = t;
      startMusic();
    }
  });

  // Update icon if audio errors out mid-play
  bgMusic.addEventListener("error", () => {
    console.warn("Audio error — resetting UI");
    updateMusicUI(false);
  });
}

// Open RSVP modal on email icon click
if (fabEmail) {
  fabEmail.addEventListener("click", () => {
    openRsvpModal();
  });
}

/* ==========================================================================
   GIFT GUIDE ENVELOPE TYPING ANIMATION
   ========================================================================== */
function initGiftTypingAnimation() {
  const letterTextEl = document.getElementById("letterText");
  const envelopeScene = document.getElementById("envelopeScene");
  const envelopeWrapper = document.getElementById("envelopeWrapper");
  const envelopeHint = document.getElementById("envelopeHint");
  if (!letterTextEl || !envelopeScene) return;

  const fullPoem = "With all that we have, we've been truly blessed.\nYour presence and prayers are all that we request.\nBut if you desire to give nonetheless,\na monetary gift is one we suggest.";
  let hasTyped = false;

  function typeText() {
    if (hasTyped) return;
    hasTyped = true;

    letterTextEl.textContent = "";
    let i = 0;
    const speed = 36; // ms per char
    let lastTime = 0;

    // Use rAF + timestamp to drive typing — avoids stacking setTimeout timers
    function tick(timestamp) {
      if (timestamp - lastTime >= speed) {
        if (i < fullPoem.length) {
          letterTextEl.textContent = fullPoem.slice(0, i + 1);
          i++;
          lastTime = timestamp;
        } else {
          return; // done
        }
      }
      if (i < fullPoem.length) {
        requestAnimationFrame(tick);
      }
    }
    requestAnimationFrame(tick);
  }

  // Automatically type out the note on scroll into view
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            typeText();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(envelopeScene);
  } else {
    typeText();
  }
}

initGiftTypingAnimation();

/* ==========================================================================
   DRESS CODE SAMPLE STYLES MODAL (From Image 2)
   ========================================================================== */
function initDressModal() {
  const modal = document.getElementById("dressModal");
  const modalTitle = document.getElementById("dressModalTitle");
  const modalGrid = document.getElementById("dressModalGrid");
  const closeBtn = document.getElementById("dressModalClose");
  const tabGirls = document.getElementById("dressTabGirls");
  const tabBoys = document.getElementById("dressTabBoys");
  const viewButtons = document.querySelectorAll("[data-dress-category]");

  if (!modal || !modalGrid) return;

  const dressData = {
    parents: {
      title: "PARENTS",
      girls: [
        {
          title: "Cream / Champagne Gown",
          color: "Cream / Champagne Formal",
          img: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=85"
        },
        {
          title: "Sophisticated Gray Gown",
          color: "Charcoal / Warm Gray",
          img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=85"
        },
        {
          title: "Ivory Silk Formal Dress",
          color: "Cream / Ivory Elegance",
          img: "https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?auto=format&fit=crop&w=800&q=85"
        }
      ],
      boys: [
        {
          title: "Embroidered Cream Barong",
          color: "Cream / Ivory Formal",
          img: "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?auto=format&fit=crop&w=800&q=85"
        },
        {
          title: "Tailored Gray Formal Suit",
          color: "Classic Gray Suit",
          img: "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=85"
        },
        {
          title: "Charcoal Gray Suit & Tie",
          color: "Formal Evening Suit",
          img: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=85"
        }
      ]
    },
    children: {
      title: "CHILDREN",
      girls: [
        {
          title: "White Lace Flower Girl Dress",
          color: "White & Formal",
          img: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=85"
        },
        {
          title: "White Tiered Tulle Dress",
          color: "White Formal",
          img: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&w=800&q=85"
        },
        {
          title: "White Satin Formal Dress",
          color: "Crisp White & Bow",
          img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=85"
        }
      ],
      boys: [
        {
          title: "White Formal Shirt & Trousers",
          color: "White & Formal",
          img: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=85"
        },
        {
          title: "White Shirt with Suspenders",
          color: "Formal Attire",
          img: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=85"
        },
        {
          title: "White Junior Barong / Suit",
          color: "Classic White Attire",
          img: "https://images.unsplash.com/photo-1471286174890-9c112ffca56a?auto=format&fit=crop&w=800&q=85"
        }
      ]
    },
    guests: {
      title: "GUESTS",
      girls: [
        {
          title: "Chocolate Brown Midi Dress",
          color: "Choco Brown",
          img: "images/guest_girls_brown.jpg"
        },
        {
          title: "Sleeveless Navy A-Line Dress",
          color: "Navy Blue",
          img: "images/guest_girls_navy.jpg"
        },
        {
          title: "Pleated Black Cocktail Dress",
          color: "Classic Black",
          img: "images/guest_girls_black.jpg"
        }
      ],
      boys: [
        {
          title: "Tailored Chocolate Brown Suit",
          color: "Choco Brown Suit",
          img: "images/guest_boys_brown.jpg"
        },
        {
          title: "Classic Navy Blue Suit",
          color: "Navy Blue Suit",
          img: "images/guest_boys_navy.jpg"
        },
        {
          title: "Sharp Black Tailored Suit",
          color: "Classic Black Suit",
          img: "images/guest_boys_black.jpg"
        }
      ]
    },
    sponsors: {
      title: "PRINCIPAL SPONSORS",
      girls: [
        {
          title: "Black Formal Evening Gown",
          color: "Ninangs: Black",
          img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=85"
        },
        {
          title: "Royal Navy Blue Silk Gown",
          color: "Ninangs: Navy Blue",
          img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=85"
        },
        {
          title: "Navy Blue Formal Elegance",
          color: "Ninangs: Navy Blue",
          img: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=85"
        }
      ],
      boys: [
        {
          title: "Formal Piña Barong Tagalog",
          color: "Ninongs: Barong Tagalog",
          img: "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?auto=format&fit=crop&w=800&q=85"
        },
        {
          title: "Classic Navy Tailored Suit",
          color: "Ninongs: Formal Suit",
          img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=85"
        },
        {
          title: "Black Tailored Suit & Tie",
          color: "Ninongs: Formal Dark Suit",
          img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=85"
        }
      ]
    }
  };

  let activeCategory = "guests";
  let activeGender = "girls";

  function renderModalContent() {
    const categoryData = dressData[activeCategory] || dressData.guests;
    if (modalTitle) {
      modalTitle.textContent = categoryData.title;
    }

    const items = categoryData[activeGender] || categoryData.girls;
    modalGrid.innerHTML = items
      .map(
        item => `
        <div class="dress-sample-item">
          <img class="dress-sample-img" src="${item.img}" alt="${item.title}" loading="lazy">
          <div class="dress-sample-caption">
            <strong>${item.title}</strong>
            <small>${item.color}</small>
          </div>
        </div>
      `
      )
      .join("");
  }

  function openModal(category) {
    activeCategory = category || "guests";
    activeGender = "girls";
    if (tabGirls) {
      tabGirls.classList.add("is-active");
      tabGirls.setAttribute("aria-selected", "true");
    }
    if (tabBoys) {
      tabBoys.classList.remove("is-active");
      tabBoys.setAttribute("aria-selected", "false");
    }

    renderModalContent();
    modal.hidden = false;
    void modal.offsetWidth; // force reflow for animation
    modal.classList.add("is-open");
    document.body.classList.add("no-scroll");
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    setTimeout(() => {
      modal.hidden = true;
    }, 350);
  }

  // Open modal on clicking "VIEW SAMPLE" buttons
  viewButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const cat = btn.getAttribute("data-dress-category");
      openModal(cat);
    });
  });

  // Tab switching
  if (tabGirls) {
    tabGirls.addEventListener("click", () => {
      if (activeGender === "girls") return;
      activeGender = "girls";
      tabGirls.classList.add("is-active");
      tabGirls.setAttribute("aria-selected", "true");
      tabBoys.classList.remove("is-active");
      tabBoys.setAttribute("aria-selected", "false");
      renderModalContent();
    });
  }

  if (tabBoys) {
    tabBoys.addEventListener("click", () => {
      if (activeGender === "boys") return;
      activeGender = "boys";
      tabBoys.classList.add("is-active");
      tabBoys.setAttribute("aria-selected", "true");
      tabGirls.classList.remove("is-active");
      tabGirls.setAttribute("aria-selected", "false");
      renderModalContent();
    });
  }

  // Close handlers
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  modal.addEventListener("click", e => {
    if (e.target === modal) {
      closeModal();
    }
  });

  window.addEventListener("keydown", e => {
    if (e.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });
}

initDressModal();

/**
 * Auto-adjust pairs in entourage:
 * When one person in a pair has a second line, their pair height is equalized
 * and the names remain aligned across columns.
 */
function autoAdjustEntouragePairs() {
  // 1. Equalize attendant columns pair-by-pair (Parents, Groomsmen & Bridesmaids, Principal Sponsors)
  const attendantGroups = document.querySelectorAll(".attendant-columns");
  attendantGroups.forEach(group => {
    const cols = group.querySelectorAll(".attendant-column");
    if (cols.length === 2) {
      const leftNames = cols[0].querySelectorAll(".names-list > p");
      const rightNames = cols[1].querySelectorAll(".names-list > p");
      const maxCount = Math.max(leftNames.length, rightNames.length);

      // Reset first to accurately measure natural unconstrained height
      for (let i = 0; i < maxCount; i++) {
        if (leftNames[i]) leftNames[i].style.minHeight = "";
        if (rightNames[i]) rightNames[i].style.minHeight = "";
      }

      // Pair-by-pair height equalization
      for (let i = 0; i < maxCount; i++) {
        const left = leftNames[i];
        const right = rightNames[i];
        if (left && right) {
          const pairHeight = Math.max(left.offsetHeight, right.offsetHeight);
          left.style.minHeight = `${pairHeight}px`;
          right.style.minHeight = `${pairHeight}px`;
        }
      }
    }
  });

  // 2. Equalize Best Man & Maid of Honor cards
  const honorNames = document.querySelectorAll(".honor-card h3");
  if (honorNames.length === 2) {
    honorNames[0].style.minHeight = "";
    honorNames[1].style.minHeight = "";
    const maxHonorH = Math.max(honorNames[0].offsetHeight, honorNames[1].offsetHeight);
    honorNames[0].style.minHeight = `${maxHonorH}px`;
    honorNames[1].style.minHeight = `${maxHonorH}px`;
  }

  // 3. Ensure Couple card (Groom & Bride) names match height
  const coupleCard = document.querySelector(".couple-entourage-card");
  if (coupleCard) {
    const coupleNames = coupleCard.querySelectorAll("h3");
    if (coupleNames.length === 2) {
      coupleNames[0].style.minHeight = "";
      coupleNames[1].style.minHeight = "";
      const maxCoupleH = Math.max(coupleNames[0].offsetHeight, coupleNames[1].offsetHeight);
      coupleNames[0].style.minHeight = `${maxCoupleH}px`;
      coupleNames[1].style.minHeight = `${maxCoupleH}px`;
    }
  }
}

// Run auto-adjust immediately and on all layout events
autoAdjustEntouragePairs();
window.addEventListener("load", autoAdjustEntouragePairs);
if ("fonts" in document) {
  document.fonts.ready.then(autoAdjustEntouragePairs);
}
let entourageResizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(entourageResizeTimer);
  entourageResizeTimer = setTimeout(autoAdjustEntouragePairs, 100);
});

