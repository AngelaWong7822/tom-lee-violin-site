/**
 * Tom Lee Violin Studio — language toggle (EN / Traditional Chinese),
 * scroll progress, ambient gold-dust canvas (home), scroll parallax, contact form,
 * placeholders & iframe titles.
 */

(function () {
  "use strict";

  const STORAGE_KEY = "tomlee-violin-lang";
  const SUPPORTED = ["en", "zh"];
  const CONTACT_EMAIL = "tomleeviolin@gmail.com";

  /** 與站內 wa.me 連結一致（香港 +852） */
  const CONTACT_WHATSAPP_PHONE = "85295179962";

  /** 副標留空＝彈窗只顯示標題；詳情可放 whatsapp */
  const CONTACT_SUCCESS = {
    whatsapp: {
      en: "",
      zh: "",
    },
  };

  const PAGE = document.body.getAttribute("data-page") || "home";

  const metaDescription = {
    home: {
      en: "Tom Lee Violin Studio — Professional violin instruction and performance in Hong Kong. Private violin and viola lessons, group classes, music theory, violin sales, trial lessons, events, and exam coaching.",
      zh: "Tom Lee 小提琴工作室 — 香港專業小提琴教學與演出。個別課程、中提琴、小組課、樂理、小提琴買賣、試堂、活動演出及考級指導。",
    },
    "videos-teaching": {
      en: "Teaching videos and demonstrations — Tom Lee Violin Studio, Hong Kong. Technique, repertoire tips, and practice ideas.",
      zh: "教學影片與示範 — Tom Lee 小提琴工作室（香港）。技巧、曲目與練習建議。",
    },
    "videos-popular": {
      en: "Pop and contemporary violin performances by Tom Lee — Hong Kong. Covers and arrangements for listening and events.",
      zh: "Tom Lee 小提琴流行曲及當代作品演奏（香港）——適合欣賞與活動。",
    },
    gallery: {
      en: "Artistic gallery — concert solo highlights and industry collaborations. Tom Lee Violin Studio, Hong Kong.",
      zh: "藝術足跡 — 演奏會獨奏精選與業界合作紀錄。Tom Lee 小提琴工作室（香港）。",
    },
  };

  const documentTitle = {
    home: {
      en: "Tom Lee Violin Studio | Professional Violin Teaching & Performance",
      zh: "Tom Lee 小提琴工作室 | 專業小提琴教學與演出",
    },
    "videos-teaching": {
      en: "Teaching Videos | Tom Lee Violin Studio",
      zh: "教學影片 | Tom Lee 小提琴工作室",
    },
    "videos-popular": {
      en: "Pop & Contemporary | Tom Lee Violin Studio",
      zh: "流行曲演奏 | Tom Lee 小提琴工作室",
    },
    gallery: {
      en: "Artistic Gallery | Tom Lee Violin Studio",
      zh: "藝術足跡 | Tom Lee 小提琴工作室",
    },
  };

  function getStoredLang() {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v && SUPPORTED.includes(v)) return v;
    } catch (_) {
      /* ignore */
    }
    return null;
  }

  function setStoredLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (_) {
      /* ignore */
    }
  }

  function applyTranslations(lang) {
    document.querySelectorAll("[data-en][data-zh]").forEach(function (el) {
      if (el.querySelector("a")) {
        return;
      }
      const text = el.getAttribute("data-" + lang);
      if (text != null) {
        el.textContent = text;
      }
    });
  }

  function updatePlaceholders(lang) {
    const key = lang === "zh" ? "zh" : "en";
    document.querySelectorAll("[data-ph-en][data-ph-zh]").forEach(function (el) {
      const ph = el.getAttribute("data-ph-" + key);
      if (ph != null) {
        el.setAttribute("placeholder", ph);
      }
    });
  }

  function updateIframeTitles(lang) {
    const suffix = lang === "zh" ? "zh" : "en";
    document.querySelectorAll("[data-title-en][data-title-zh]").forEach(function (el) {
      const t = el.getAttribute("data-title-" + suffix);
      if (t) {
        el.setAttribute("title", t);
      }
    });
  }

  function initScrollProgress() {
    const bar = document.getElementById("scroll-progress-bar");
    if (!bar) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      bar.style.width = "0%";
      return;
    }
    function onScroll() {
      const h = document.documentElement;
      const st = h.scrollTop || document.body.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? (st / max) * 100 : 0;
      bar.style.width = p + "%";
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /**
   * Hero + section-header scroll parallax (home): violin photo vs text move at different rates;
   * desktop-only image drift; text + section titles use gentler motion on all viewports.
   */
  function initHeroParallax() {
    const hero = document.querySelector(".hero");
    const img = document.querySelector(".hero-image");
    const heroContent = document.querySelector(".hero-content--parallax-target");
    const sectionHeaders = document.querySelectorAll(".section-header--parallax");
    if (!hero || !img) return;

    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopMq = window.matchMedia("(min-width: 900px)");

    function imageParallaxEnabled() {
      return !reduceMq.matches && desktopMq.matches;
    }

    function textParallaxEnabled() {
      return !reduceMq.matches;
    }

    function clearImageParallax() {
      img.classList.remove("hero-image--parallax");
      img.style.removeProperty("transform");
    }

    function clearHeroContentParallax() {
      if (!heroContent) return;
      heroContent.classList.remove("hero-content--parallax-active");
      heroContent.style.removeProperty("transform");
    }

    function clearSectionParallax() {
      sectionHeaders.forEach(function (el) {
        el.classList.remove("section-header--parallax-active");
        el.style.removeProperty("transform");
      });
    }

    let ticking = false;
    function updateTransform() {
      const vh = window.innerHeight;
      const rect = hero.getBoundingClientRect();
      const heroVisible = !(rect.bottom < 0 || rect.top > vh);

      if (imageParallaxEnabled() && heroVisible) {
        img.classList.add("hero-image--parallax");
        const range = vh + rect.height;
        const t = range > 0 ? (vh - rect.top) / range : 0.5;
        const eased = Math.max(0, Math.min(1, t));
        const yImg = (eased - 0.5) * 30;
        img.style.transform = "translate3d(0, " + yImg.toFixed(2) + "px, 0) scale(1.07)";
      } else {
        clearImageParallax();
      }

      if (textParallaxEnabled() && heroContent && heroVisible) {
        heroContent.classList.add("hero-content--parallax-active");
        const range = vh + rect.height;
        const t = range > 0 ? (vh - rect.top) / range : 0.5;
        const eased = Math.max(0, Math.min(1, t));
        const depth = desktopMq.matches ? 1 : 0.55;
        const yText = (eased - 0.5) * -20 * depth;
        heroContent.style.transform = "translate3d(0, " + yText.toFixed(2) + "px, 0)";
      } else if (heroContent) {
        clearHeroContentParallax();
      }

      if (!textParallaxEnabled()) {
        clearSectionParallax();
        return;
      }

      sectionHeaders.forEach(function (el) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -80 || r.top > vh + 80) {
          el.classList.remove("section-header--parallax-active");
          el.style.removeProperty("transform");
          return;
        }
        el.classList.add("section-header--parallax-active");
        const range = vh + r.height;
        const t = range > 0 ? (vh - r.top) / range : 0.5;
        const eased = Math.max(0, Math.min(1, t));
        const amp = desktopMq.matches ? 14 : 9;
        const y = (eased - 0.5) * amp;
        el.style.transform = "translate3d(0, " + y.toFixed(2) + "px, 0)";
      });
    }

    function onScrollOrResize() {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (reduceMq.matches) {
            clearImageParallax();
            clearHeroContentParallax();
            clearSectionParallax();
          } else {
            updateTransform();
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    function onMediaChange() {
      if (reduceMq.matches) {
        clearImageParallax();
        clearHeroContentParallax();
        clearSectionParallax();
      } else {
        updateTransform();
      }
    }

    reduceMq.addEventListener("change", onMediaChange);
    desktopMq.addEventListener("change", onMediaChange);
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    onMediaChange();
  }

  /** Subtle floating gold dust — concert hall atmosphere (home page only) */
  function initAmbientDust() {
    if (PAGE !== "home") return;
    const canvas = document.getElementById("ambient-dust");
    if (!canvas) return;
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMq.matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let particles = [];
    let rafId = 0;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.floor(window.innerWidth * dpr);
      h = Math.floor(window.innerHeight * dpr);
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      const area = w * h;
      const count = Math.min(110, Math.max(48, Math.floor(area / 14000)));
      particles = [];
      for (let i = 0; i < count; i++) {
        const big = i % 5 === 0;
        const baseR = (big ? Math.random() * 1.4 + 0.9 : Math.random() * 1.0 + 0.45) * dpr;
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r0: baseR,
          vx: (Math.random() - 0.5) * 0.072 * dpr,
          vy: (Math.random() - 0.5) * 0.058 * dpr,
          a: big ? Math.random() * 0.18 + 0.22 : Math.random() * 0.2 + 0.12,
          ph: Math.random() * Math.PI * 2,
          twPhase: Math.random() * Math.PI * 2,
          twSpeed: 0.35 + Math.random() * 0.85,
        });
      }
    }

    function tick() {
      const t = performance.now() * 0.001;
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.ph += 0.0028 + (i % 7) * 0.00035;
        p.x += p.vx + Math.sin(p.ph) * 0.1 * dpr;
        p.y += p.vy + Math.cos(p.ph * 0.73) * 0.085 * dpr;
        if (p.x < -8) p.x = w + 8;
        if (p.x > w + 8) p.x = -8;
        if (p.y < -8) p.y = h + 8;
        if (p.y > h + 8) p.y = -8;
        const twinkle = 0.62 + 0.38 * (0.5 + 0.5 * Math.sin(t * p.twSpeed + p.twPhase));
        const breathe = 0.94 + 0.06 * (0.5 + 0.5 * Math.sin(t * (p.twSpeed * 0.6) + p.twPhase * 1.3));
        const alpha = Math.min(0.95, p.a * twinkle);
        const radius = p.r0 * breathe;
        ctx.fillStyle = "rgba(255, 220, 160, " + alpha + ")";
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      rafId = window.requestAnimationFrame(tick);
    }

    function onReduceChange() {
      if (reduceMq.matches) {
        window.cancelAnimationFrame(rafId);
        ctx.clearRect(0, 0, w, h);
      } else {
        resize();
        tick();
      }
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    reduceMq.addEventListener("change", onReduceChange);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        window.cancelAnimationFrame(rafId);
      } else if (!reduceMq.matches) {
        rafId = window.requestAnimationFrame(tick);
      }
    });
    tick();
  }

  function onContactSuccessEscape(e) {
    if (e.key === "Escape") {
      closeContactSuccessModal();
    }
  }

  function closeContactSuccessModal() {
    const modal = document.getElementById("contact-success-modal");
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onContactSuccessEscape);
  }

  function hideContactFormSuccess() {
    closeContactSuccessModal();
  }

  function showContactFormSuccess(mode) {
    const modal = document.getElementById("contact-success-modal");
    const detail = document.getElementById("contact-success-modal-detail");
    const okBtn = document.querySelector(".contact-success-modal__ok");
    if (!modal) return;
    const lang = document.documentElement.getAttribute("lang") || "";
    const useZh = lang.toLowerCase().indexOf("zh") === 0;
    const pack = CONTACT_SUCCESS[mode] || CONTACT_SUCCESS.whatsapp;
    if (detail && pack) {
      var sub = useZh ? pack.zh : pack.en;
      detail.textContent = sub || "";
      detail.hidden = !sub;
    }
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    document.removeEventListener("keydown", onContactSuccessEscape);
    document.addEventListener("keydown", onContactSuccessEscape);
    if (okBtn && typeof okBtn.focus === "function") {
      window.requestAnimationFrame(function () {
        okBtn.focus();
      });
    }
  }

  function initContactSuccessModal() {
    const modal = document.getElementById("contact-success-modal");
    if (!modal) return;
    const panel = modal.querySelector(".contact-success-modal__panel");
    modal.querySelectorAll("[data-contact-success-close]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.stopPropagation();
        closeContactSuccessModal();
      });
    });
    if (panel) {
      panel.addEventListener("click", function (e) {
        e.stopPropagation();
      });
    }
  }

  function refreshContactFormUi() {
    var lang = document.documentElement.getAttribute("lang") || "";
    var key = lang.toLowerCase().indexOf("zh") === 0 ? "zh" : "en";
    applyTranslations(key);
    updatePlaceholders(key);
  }

  /** 送出後開 WhatsApp，訊息已預填查詢內容。 */
  function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;
    form.querySelectorAll("input, select, textarea").forEach(function (el) {
      el.addEventListener(
        "focus",
        function () {
          hideContactFormSuccess();
        },
        { passive: true }
      );
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const nameEl = document.getElementById("contact-name");
      const emailEl = document.getElementById("contact-email");
      const phoneEl = document.getElementById("contact-phone");
      const purposeEl = document.getElementById("contact-purpose");
      const messageEl = document.getElementById("contact-message");
      if (!nameEl || !emailEl || !purposeEl || !messageEl) return;
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const name = nameEl.value.trim();
      const email = emailEl.value.trim();
      const phone = phoneEl ? phoneEl.value.trim() : "";
      const message = messageEl.value.trim();
      const opt = purposeEl.options[purposeEl.selectedIndex];
      const purposeText = opt ? opt.textContent.trim() : "";
      const lang = document.documentElement.getAttribute("lang") || "";
      const useZh = lang.toLowerCase().indexOf("zh") === 0;
      var waBody;
      if (useZh) {
        waBody =
          "【Tom Lee 小提琴工作室 — 網站查詢】\n" +
          "姓名：" +
          name +
          "\n電郵：" +
          email +
          "\n電話：" +
          (phone || "—") +
          "\n意向：" +
          purposeText +
          "\n\n留言：\n" +
          message;
      } else {
        waBody =
          "Tom Lee Violin Studio — Website enquiry\n" +
          "Name: " +
          name +
          "\nEmail: " +
          email +
          "\nPhone: " +
          (phone || "—") +
          "\nInterest: " +
          purposeText +
          "\n\nMessage:\n" +
          message;
      }
      const waUrl = "https://wa.me/" + CONTACT_WHATSAPP_PHONE + "?text=" + encodeURIComponent(waBody);

      showContactFormSuccess("whatsapp");
      window.setTimeout(function () {
        form.reset();
        refreshContactFormUi();
        window.location.href = waUrl;
      }, 400);
    });
  }

  function setFooterCopyright(lang) {
    const el = document.getElementById("footer-copyright");
    if (!el) return;
    const year = new Date().getFullYear();
    if (lang === "zh") {
      el.textContent = "© " + year + " Tom Lee 小提琴工作室。版權所有。";
    } else {
      el.textContent = "© " + year + " Tom Lee Violin Studio. All rights reserved.";
    }
  }

  function updateMetaAndTitle(lang) {
    const titles = documentTitle[PAGE] || documentTitle.home;
    const metas = metaDescription[PAGE] || metaDescription.home;
    document.title = titles[lang] || titles.en;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) {
      desc.setAttribute("content", metas[lang] || metas.en);
    }
    document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";
  }

  function setActiveButton(lang) {
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      const isActive = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
    const langGroup = document.querySelector(".lang-switch");
    if (langGroup) {
      langGroup.setAttribute("aria-label", lang === "zh" ? "語言" : "Language");
    }
  }

  function initLanguage(lang) {
    if (!SUPPORTED.includes(lang)) lang = "en";
    applyTranslations(lang);
    updatePlaceholders(lang);
    updateIframeTitles(lang);
    setFooterCopyright(lang);
    updateMetaAndTitle(lang);
    setActiveButton(lang);
    setStoredLang(lang);
  }

  function resolveInitialLang() {
    const stored = getStoredLang();
    if (stored) return stored;
    const navLang = (navigator.language || "").toLowerCase();
    if (navLang.startsWith("zh")) return "zh";
    return "en";
  }

  function initCertMarquee() {
    document.querySelectorAll("[data-cert-marquee]").forEach(function (viewport) {
      setupOneCertMarquee(viewport);
    });
  }

  function setupOneCertMarquee(viewport) {
    const track = viewport.querySelector(".cert-marquee__track");
    const wrap = viewport.closest(".cert-marquee-wrap");
    const btnPrev = wrap && wrap.querySelector(".cert-marquee__nav--prev");
    const btnNext = wrap && wrap.querySelector(".cert-marquee__nav--next");
    if (!track) return;

    const cards = track.querySelectorAll(".cert-card");
    if (cards.length < 2) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const loopSecondsAttr = viewport.getAttribute("data-cert-loop-seconds");
    const loopSecondsParsed = parseFloat(loopSecondsAttr || "");
    const loopSeconds = Math.max(8, Number.isFinite(loopSecondsParsed) ? loopSecondsParsed : 36);
    const centerMode = viewport.classList.contains("cert-marquee--center-mode") && !reduceMotion;

    let loopW = 0;
    function syncLoopWidth() {
      const sw = track.scrollWidth;
      loopW = sw > 0 ? sw / 2 : 0;
    }

    syncLoopWidth();
    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(syncLoopWidth).observe(track);
    }
    window.addEventListener("resize", syncLoopWidth, { passive: true });
    window.requestAnimationFrame(syncLoopWidth);

    function stepPx() {
      const w = cards[0].getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      return w + gap;
    }

    let hoverPaused = false;
    let btnPaused = false;
    let btnPausedTimer = null;

    function isPaused() {
      return reduceMotion || hoverPaused || btnPaused;
    }

    viewport.addEventListener("mouseenter", function () {
      hoverPaused = true;
    });
    viewport.addEventListener("mouseleave", function () {
      hoverPaused = false;
    });

    function pauseFromButtons() {
      btnPaused = true;
      clearTimeout(btnPausedTimer);
      btnPausedTimer = setTimeout(function () {
        btnPaused = false;
      }, 2600);
    }

    viewport.addEventListener(
      "scroll",
      function () {
        const lw = loopW;
        if (lw <= 0) return;
        if (viewport.scrollLeft >= lw) {
          viewport.scrollLeft -= lw;
        }
      },
      { passive: true }
    );

    const maxDt = 0.05;
    let lastTs = performance.now();

    function updateCenterFocus() {
      if (!centerMode || cards.length === 0) {
        return;
      }
      const vr = viewport.getBoundingClientRect();
      const mid = vr.left + vr.width * 0.5;
      let best = null;
      let bestDist = Infinity;
      cards.forEach(function (card) {
        const r = card.getBoundingClientRect();
        if (r.width <= 0) {
          return;
        }
        const c = r.left + r.width * 0.5;
        const d = Math.abs(c - mid);
        if (d < bestDist) {
          bestDist = d;
          best = card;
        }
      });
      cards.forEach(function (card) {
        card.classList.toggle("cert-card--center", card === best);
      });
    }

    function tick(now) {
      if (!isPaused()) {
        const lw = loopW;
        if (lw > 0) {
          let dt = (now - lastTs) / 1000;
          lastTs = now;
          if (dt > maxDt) {
            dt = maxDt;
          }
          const speed = lw / loopSeconds;
          let next = viewport.scrollLeft + speed * dt;
          if (next >= lw - 0.25) {
            next -= lw;
          }
          viewport.scrollLeft = next;
        }
      } else {
        lastTs = now;
      }
      updateCenterFocus();
      window.requestAnimationFrame(tick);
    }
    if (!reduceMotion) {
      window.requestAnimationFrame(tick);
    }

    function scrollNext() {
      const step = stepPx();
      const lw = loopW;
      pauseFromButtons();
      syncLoopWidth();
      if (viewport.scrollLeft + step >= lw - 2) {
        viewport.scrollLeft -= lw;
      }
      viewport.scrollBy({ left: step, behavior: "smooth" });
    }

    function scrollPrev() {
      const step = stepPx();
      const lw = loopW;
      pauseFromButtons();
      syncLoopWidth();
      if (viewport.scrollLeft < step + 2) {
        viewport.scrollLeft += lw;
      }
      viewport.scrollBy({ left: -step, behavior: "smooth" });
    }

    if (btnNext) {
      btnNext.addEventListener("click", scrollNext);
    }
    if (btnPrev) {
      btnPrev.addEventListener("click", scrollPrev);
    }
  }

  function initGroupScheduleModal() {
    const modal = document.getElementById("group-schedule-modal");
    if (!modal) return;

    const closers = modal.querySelectorAll("[data-schedule-modal-close]");
    const panel = modal.querySelector(".schedule-modal__panel");
    let lastFocus = null;
    let openBtnRef = null;

    function onKey(e) {
      if (e.key === "Escape") {
        close();
      }
    }

    function close() {
      modal.setAttribute("hidden", "");
      modal.hidden = true;
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      if (openBtnRef) {
        openBtnRef.setAttribute("aria-expanded", "false");
      }
      if (lastFocus && typeof lastFocus.focus === "function") {
        lastFocus.focus();
      }
      openBtnRef = null;
    }

    function open(trigger) {
      lastFocus = document.activeElement;
      openBtnRef = trigger;
      modal.removeAttribute("hidden");
      modal.hidden = false;
      if (openBtnRef) {
        openBtnRef.setAttribute("aria-expanded", "true");
      }
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", onKey);
      const closeBtn = modal.querySelector(".schedule-modal__close");
      if (closeBtn) {
        closeBtn.focus();
      }
    }

    document.addEventListener(
      "click",
      function (e) {
        const raw = e.target;
        const el = raw && raw.nodeType === 3 ? raw.parentElement : raw;
        const trigger = el && el.closest ? el.closest("#group-schedule-modal-open") : null;
        if (!trigger) return;
        e.preventDefault();
        e.stopPropagation();
        open(trigger);
      },
      false
    );

    closers.forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.stopPropagation();
        close();
      });
    });

    if (panel) {
      panel.addEventListener("click", function (e) {
        e.stopPropagation();
      });
    }
  }

  function initCertLightbox() {
    const lb = document.getElementById("cert-lightbox");
    if (!lb) return;
    const img = lb.querySelector(".lightbox__img");
    const cap = lb.querySelector(".lightbox__caption");
    const panel = lb.querySelector(".lightbox__panel");
    const closeBtn = lb.querySelector(".lightbox__close");
    if (!img || !cap || !panel) return;

    const closers = lb.querySelectorAll("[data-lightbox-close]");
    let lastFocus = null;

    function onKey(e) {
      if (e.key === "Escape") {
        close();
      }
    }

    function close() {
      lb.hidden = true;
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      if (lastFocus && typeof lastFocus.focus === "function") {
        lastFocus.focus();
      }
    }

    function open(trigger) {
      const figure = trigger.closest("figure");
      if (!figure) return;
      const thumb = trigger.querySelector(".cert-card__img");
      const figcap = figure.querySelector(".cert-caption");
      if (!thumb) return;
      img.src = thumb.currentSrc || thumb.src;
      img.alt = thumb.alt || "";
      cap.textContent = figcap ? figcap.textContent.trim() : "";
      lastFocus = document.activeElement;
      lb.hidden = false;
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", onKey);
      if (closeBtn) {
        closeBtn.focus();
      }
    }

    document.querySelectorAll(".cert-card__trigger").forEach(function (btn) {
      btn.addEventListener("click", function () {
        open(btn);
      });
    });

    closers.forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.stopPropagation();
        close();
      });
    });

    panel.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLanguage(resolveInitialLang());
    initScrollProgress();
    initAmbientDust();
    initHeroParallax();
    initContactForm();
    initContactSuccessModal();
    initCertMarquee();
    initGroupScheduleModal();
    initCertLightbox();

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const lang = btn.getAttribute("data-lang");
        if (lang && SUPPORTED.includes(lang)) {
          initLanguage(lang);
        }
      });
    });
  });
})();
