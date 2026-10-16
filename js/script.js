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

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

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

/* Gallery lightbox */
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
function showGalleryImage(index) {
  galleryIndex = (index + galleryImages.length) % galleryImages.length;
  const item = galleryImages[galleryIndex];
  lightboxImage.src = item.src;
  lightboxImage.alt = item.alt;
  lightboxCaption.textContent = `${galleryIndex + 1} / ${galleryImages.length} · ${item.alt}`;
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
  if (lastFocusedElement) lastFocusedElement.focus();
}
galleryButtons.forEach((button, index) => button.addEventListener("click", () => openLightbox(index)));
$("#lightboxClose").addEventListener("click", closeLightbox);
$("#lightboxPrev").addEventListener("click", () => showGalleryImage(galleryIndex - 1));
$("#lightboxNext").addEventListener("click", () => showGalleryImage(galleryIndex + 1));
lightbox.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", event => {
  if (lightbox.hidden) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showGalleryImage(galleryIndex - 1);
  if (event.key === "ArrowRight") showGalleryImage(galleryIndex + 1);
});

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
setTimeout(flushPendingRsvps, 2000);

/* Toast Notification */
const rsvpToast = $("#rsvpToast");
const rsvpToastText = $("#rsvpToastText");
const rsvpToastClose = $("#rsvpToastClose");
let toastTimeout = null;

function hideRsvpToast() {
  if (!rsvpToast) return;
  rsvpToast.classList.remove("show");
  if (toastTimeout) clearTimeout(toastTimeout);
  setTimeout(() => {
    rsvpToast.setAttribute("hidden", "");
    rsvpToast.style.display = "none";
  }, 350);
}

function showRsvpToast(message, isSuccess = true) {
  if (!rsvpToast || !rsvpToastText) return;
  rsvpToastText.textContent = message;
  rsvpToast.removeAttribute("hidden");
  rsvpToast.style.display = "flex";
  // Force browser reflow to guarantee CSS transition animates in
  void rsvpToast.offsetWidth;
  rsvpToast.classList.add("show");
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(hideRsvpToast, 4800);
}

if (rsvpToast) {
  rsvpToast.addEventListener("click", hideRsvpToast);
}
if (rsvpToastClose) {
  rsvpToastClose.addEventListener("click", (e) => {
    e.stopPropagation();
    hideRsvpToast();
  });
}

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

// Make RSVP form already popped up when user visits the website
if (rsvpModal) {
  rsvpModal.hidden = false;
  rsvpModal.classList.add("is-open");
  document.body.classList.add("modal-open");
}

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

      // 2. Show instant celebratory toast notification
      const greeting = payload.attendance === "Joyfully Accept"
        ? `Thank you, ${payload.fullName}! We can't wait to celebrate with you.`
        : `Thank you for letting us know, ${payload.fullName}. We will miss you!`;
      showRsvpToast(greeting, true);

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
      showRsvpToast(`Thank you, ${payload.fullName}! Your RSVP has been received.`);
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
  const imageSources = [
    "images/hero-background.JPG",
    "images/prenup/IMG_8066.JPG",
    "images/meet-couple-1.jpg",
    "images/meet-couple-2.jpg",
    "images/attire_guest.jpg",
    "images/attire_ninang.jpg",
    "images/attire_ninong.jpg"
  ];

  // Also collect all <img> tags present in DOM
  document.querySelectorAll("img").forEach(img => {
    const src = img.getAttribute("src") || img.src;
    if (src) imageSources.push(src);
    const dataSrc = img.getAttribute("data-src");
    if (dataSrc) imageSources.push(dataSrc);
  });

  // Preload and decode into memory/cache
  imageSources.forEach(src => {
    if (!src || window.__IMAGE_CACHE.has(src)) return;
    window.__IMAGE_CACHE.add(src);

    const imgObj = new Image();
    imgObj.src = src;
    if (typeof imgObj.decode === "function") {
      imgObj.decode().catch(() => {});
    }
  });
}

// Start preloading images immediately so the site is ready behind the modal
preloadAndCacheImages();
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", preloadAndCacheImages);
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

// Background music starts ONLY once the first RSVP form is submitted or closed
function onFirstRsvpClosedOrSubmitted() {
  if (musicStartedOnce) return;
  musicStartedOnce = true;
  startMusic();
}

function updateMusicUI(isPlaying) {
  if (!fabMusic) return;
  fabMusic.classList.toggle("playing", isPlaying);
  fabMusic.setAttribute("aria-label", isPlaying ? "Pause background music" : "Play background music");
  fabMusic.setAttribute("title", isPlaying ? "Pause music" : "Play music");

  if (iconMusicNote) {
    iconMusicNote.hidden = isPlaying;
    iconMusicNote.style.display = isPlaying ? "none" : "block";
  }
  if (iconMusicPause) {
    iconMusicPause.hidden = !isPlaying;
    iconMusicPause.style.display = isPlaying ? "block" : "none";
  }
}

async function startMusic() {
  if (!bgMusic) return;
  try {
    await bgMusic.play();
    updateMusicUI(true);
  } catch (err) {
    console.warn("Audio autoplay waiting for user interaction:", err);
    updateMusicUI(false);
  }
}

function pauseMusic() {
  if (!bgMusic) return;
  bgMusic.pause();
  updateMusicUI(false);
}

function toggleMusic() {
  if (!bgMusic) return;
  if (bgMusic.paused) {
    musicStartedOnce = true;
    startMusic();
  } else {
    pauseMusic();
  }
}

if (fabMusic) {
  fabMusic.addEventListener("click", toggleMusic);
}

if (bgMusic) {
  bgMusic.addEventListener("play", () => updateMusicUI(true));
  bgMusic.addEventListener("pause", () => updateMusicUI(false));
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

    function tick() {
      if (i < fullPoem.length) {
        letterTextEl.textContent = fullPoem.slice(0, i + 1);
        i++;
        setTimeout(tick, speed);
      }
    }
    tick();
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
