/**
 * Sri Pushpagiri Sankara Peetham - Real-Time Bilingual Language Auto-Translator
 * Provides seamless automated translation between Telugu (తెలుగు) and English (EN)
 * Combines Google Translate Engine with Instant Client-Side Bilingual Dictionary
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'peetham_preferred_lang';
  let currentLanguage = localStorage.getItem(STORAGE_KEY) || 'te';
  let googleInitialized = false;

  // Bilingual UI Dictionary for instant zero-lag translation
  const DICTIONARY = {
    // Nav Links
    "Home": { te: "హోమ్", en: "Home" },
    "About Us": { te: "పీఠం విశేషాలు", en: "About Us" },
    "48th Peetadhipatulu": { te: "48వ పీఠాధిపతులు", en: "48th Peetadhipatulu" },
    "Mutt Activities": { te: "పీఠ కార్యకలాపాలు", en: "Mutt Activities" },
    "Events": { te: "ఉత్సవాలు", en: "Events" },
    "Gallery": { te: "చిత్రమాలిక", en: "Gallery" },
    "Contact": { te: "సంప్రదించండి", en: "Contact" },
    "Donate": { te: "విరాళం", en: "Donate" },

    // Peetham Titles
    "PUSHPAGIRI SANKARA PEETHAM": { te: "పుష్పగిరి శంకర పీఠం", en: "PUSHPAGIRI SANKARA PEETHAM" },
    "శ్రీ జగద్గురు పుష్పగిరి శంకరాచార్య మహాసంస్థానం": { te: "శ్రీ జగద్గురు పుష్పగిరి శంకరాచార్య మహాసంస్థానం", en: "Sri Jagadguru Pushpagiri Sankaracharya Mahasamsthanam" },
    "Sri Jagadguru Pushpagiri Sankaracharya Mahasamsthanam": { te: "శ్రీ జగద్గురు పుష్పగిరి శంకరాచార్య మహాసంస్థానం", en: "Sri Jagadguru Pushpagiri Sankaracharya Mahasamsthanam" },

    // Guru Parampara
    "గురు పరంపర": { te: "గురు పరంపర", en: "Guru Parampara" },
    "శ్రీ దక్షిణామూర్తి స్వామి": { te: "శ్రీ దక్షిణామూర్తి స్వామి", en: "Lord Sri Dakshinamurthy" },
    "శ్రీ వేదవ్యాస మహర్షి": { te: "శ్రీ వేదవ్యాస మహర్షి", en: "Sri Veda Vyasa Maharshi" },
    "శ్రీ ఆది శంకరాచార్యులు": { te: "శ్రీ ఆది శంకరాచార్యులు", en: "Sri Adi Sankaracharya" },
    "47వ పీఠాధిపతులు": { te: "47వ పీఠాధిపతులు", en: "47th Peetadhipatulu" },
    "48వ పీఠాధిపతులు": { te: "48వ పీఠాధిపతులు", en: "48th Peetadhipatulu" },
    "పూజ్యశ్రీ అభినవోద్దండ విద్యానృసింహ భారతీ స్వామీజీ": { te: "పూజ్యశ్రీ అభినవోద్దండ విద్యానృసింహ భారతీ స్వామీజీ", en: "Pujyasri Abhinavoddanda Vidya Nrusimha Bharati Swamiji" },
    "జగద్గురు శ్రీ శ్రీ శ్రీ విద్యా శంకర భారతీ స్వామీజీ": { te: "జగద్గురు శ్రీ శ్రీ శ్రీ విద్యా శంకర భారతీ స్వామీజీ", en: "Jagadguru Sri Sri Sri Vidya Sankara Bharati Swamiji" },

    // Video Section
    "పీఠం విశేష వీడియోలు": { te: "పీఠం విశేష వీడియోలు", en: "Peetham Highlight Videos" },
    "మరిన్ని వీడియోలు": { te: "మరిన్ని వీడియోలు", en: "More Videos" },
    "పూర్తి వీడియో గ్యాలరీని వీక్షించండి": { te: "పూర్తి వీడియో గ్యాలరీని వీక్షించండి", en: "Explore Full Video Gallery" },
    "పీఠం వీడియోల గ్యాలరీ": { te: "పీఠం వీడియోల గ్యాలరీ", en: "Peetham Video Gallery" },
    "దివ్య ప్రసంగం": { te: "దివ్య ప్రసంగం", en: "Divine Discourse" },
    "ఆధ్యాత్మిక ప్రవచనం": { te: "ఆధ్యాత్మిక ప్రవచనం", en: "Spiritual Pravachanam" },
    "వైదిక క్రతువులు": { te: "వైదిక క్రతువులు", en: "Vedic Rituals" },
    "వార్షిక ఉత్సవాలు": { te: "వార్షిక ఉత్సవాలు", en: "Annual Festivals" },

    // Footer & Common Labels
    "ముఖ్య లింకులు": { te: "ముఖ్య లింకులు", en: "Quick Links" },
    "సంప్రదించండి": { te: "సంప్రదించండి", en: "Contact Us" },
    "అన్ని హక్కులు ప్రత్యేకించబడినవి": { te: "అన్ని హక్కులు ప్రత్యేకించబడినవి", en: "All Rights Reserved" },
    "విరాళం ఇవ్వండి": { te: "విరాళం ఇవ్వండి", en: "Donate Online" },
    "బ్యాంక్ ఖాతా వివరాలు": { te: "బ్యాంక్ ఖాతా వివరాలు", en: "Bank Account Details" },
    "భక్తుల సేవలు": { te: "భక్తుల సేవలు", en: "Devotee Services" },
    "దివ్య దర్శనం": { te: "దివ్య దర్శనం", en: "Divine Darshan" }
  };

  // Reverse mapping lookup table
  const REVERSE_LOOKUP = {};
  Object.keys(DICTIONARY).forEach(key => {
    const entry = DICTIONARY[key];
    if (entry.te) REVERSE_LOOKUP[entry.te.trim().toLowerCase()] = entry;
    if (entry.en) REVERSE_LOOKUP[entry.en.trim().toLowerCase()] = entry;
  });

  // Inject suppression CSS for Google Translate banners and tooltips
  function injectTranslateStyles() {
    if (document.getElementById('peetham-translate-styles')) return;
    const style = document.createElement('style');
    style.id = 'peetham-translate-styles';
    style.textContent = `
      .goog-te-banner-frame,
      iframe.goog-te-banner-frame,
      .goog-te-banner-frame.skiptranslate,
      #goog-gt-tt,
      .goog-te-balloon-frame {
        display: none !important;
        visibility: hidden !important;
      }
      body {
        top: 0px !important;
        position: static !important;
      }
      .skiptranslate > iframe {
        display: none !important;
      }
      .goog-tooltip, .goog-tooltip:hover {
        display: none !important;
      }
      .goog-text-highlight {
        background-color: transparent !important;
        box-shadow: none !important;
      }
      #google_translate_element {
        display: none !important;
      }
      .lang-switcher-wrap button,
      .mobile-lang-switch-container button {
        touch-action: manipulation;
      }
    `;
    document.head.appendChild(style);
  }

  // Set Google Translate Cookie
  function setGoogleTranslateCookie(lang) {
    const cookieVal = (lang === 'en') ? '/te/en' : '/en/te';
    const host = window.location.hostname;
    
    document.cookie = `googtrans=${cookieVal}; path=/;`;
    if (host) {
      document.cookie = `googtrans=${cookieVal}; path=/; domain=${host};`;
      const domainParts = host.split('.');
      if (domainParts.length > 1) {
        const rootDomain = '.' + domainParts.slice(-2).join('.');
        document.cookie = `googtrans=${cookieVal}; path=/; domain=${rootDomain};`;
      }
    }
  }

  // Trigger Google Translate engine
  function triggerGoogleTranslate(lang) {
    setGoogleTranslateCookie(lang);

    const combo = document.querySelector('.goog-te-combo');
    if (combo) {
      if (combo.value !== lang) {
        combo.value = lang;
        combo.dispatchEvent(new Event('change'));
      }
      return true;
    }
    return false;
  }

  // Instant Dictionary DOM Scan & Translate
  function translateDOMWithDict(lang) {
    const isTe = (lang === 'te');
    
    // Scan all anchor tags, buttons, headers, and text spans in navigation & headings
    const elements = document.querySelectorAll('nav a, header h1, header p, .sanctum-card h3, .sanctum-card h4, .audio-toggle-btn, footer a, footer h4, .lang-translatable');
    
    elements.forEach(el => {
      // Preserve original text in data attribute on first visit
      if (!el.getAttribute('data-orig-te') && !el.getAttribute('data-orig-en')) {
        const text = el.textContent.trim();
        const match = REVERSE_LOOKUP[text.toLowerCase()];
        if (match) {
          el.setAttribute('data-orig-te', match.te);
          el.setAttribute('data-orig-en', match.en);
        }
      }

      const teText = el.getAttribute('data-orig-te');
      const enText = el.getAttribute('data-orig-en');

      if (teText && enText) {
        if (isTe && el.textContent.trim() !== teText) {
          el.textContent = teText;
        } else if (!isTe && el.textContent.trim() !== enText) {
          el.textContent = enText;
        }
      } else {
        const text = el.textContent.trim();
        const match = REVERSE_LOOKUP[text.toLowerCase()];
        if (match) {
          el.setAttribute('data-orig-te', match.te);
          el.setAttribute('data-orig-en', match.en);
          el.textContent = isTe ? match.te : match.en;
        }
      }
    });
  }

  // Update Visual State of Toggle Buttons (Desktop & Mobile)
  function updateToggleButtonsUI(lang) {
    const isTe = (lang === 'te');

    // Desktop Buttons
    const btnTeList = document.querySelectorAll('.lang-btn-te');
    const btnEnList = document.querySelectorAll('.lang-btn-en');

    btnTeList.forEach(btn => {
      if (isTe) {
        btn.className = "lang-btn-te px-2.5 py-1.5 rounded-lg font-telugu transition-all duration-200 flex items-center gap-1 bg-gradient-to-r from-[#5D000F] to-[#7B0D1E] text-amber-100 shadow-sm font-bold scale-[1.02]";
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.className = "lang-btn-te px-2.5 py-1.5 rounded-lg font-telugu transition-all duration-200 flex items-center gap-1 text-amber-900 hover:text-amber-950 hover:bg-amber-100/60 font-medium";
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    btnEnList.forEach(btn => {
      if (!isTe) {
        btn.className = "lang-btn-en px-2.5 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1 bg-gradient-to-r from-[#5D000F] to-[#7B0D1E] text-amber-100 shadow-sm font-bold scale-[1.02]";
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.className = "lang-btn-en px-2.5 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1 text-amber-900 hover:text-amber-950 hover:bg-amber-100/60 font-medium";
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    // Mobile Buttons
    const mobileBtnTeList = document.querySelectorAll('.mobile-lang-btn-te');
    const mobileBtnEnList = document.querySelectorAll('.mobile-lang-btn-en');

    mobileBtnTeList.forEach(btn => {
      if (isTe) {
        btn.className = "mobile-lang-btn-te px-2 py-1 rounded-md font-telugu transition-all bg-[#5D000F] text-amber-100 font-bold shadow-xs";
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.className = "mobile-lang-btn-te px-2 py-1 rounded-md font-telugu transition-all text-amber-900 hover:bg-amber-100 font-medium";
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    mobileBtnEnList.forEach(btn => {
      if (!isTe) {
        btn.className = "mobile-lang-btn-en px-2 py-1 rounded-md transition-all bg-[#5D000F] text-amber-100 font-bold shadow-xs";
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.className = "mobile-lang-btn-en px-2 py-1 rounded-md transition-all text-amber-900 hover:bg-amber-100 font-medium";
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  }

  // Public Language Switch Handler
  window.setPeethamLanguage = function (lang) {
    if (lang !== 'te' && lang !== 'en') lang = 'te';
    currentLanguage = lang;
    localStorage.setItem(STORAGE_KEY, lang);

    // 1. Update UI buttons immediately
    updateToggleButtonsUI(lang);

    // 2. Perform zero-lag dictionary translation on main elements
    translateDOMWithDict(lang);

    // 3. Trigger Google Translate engine for the rest of the page
    const triggered = triggerGoogleTranslate(lang);

    // If Google Translate element isn't ready yet, poll for it
    if (!triggered) {
      let attempts = 0;
      const pollTimer = setInterval(() => {
        attempts++;
        if (triggerGoogleTranslate(lang) || attempts > 20) {
          clearInterval(pollTimer);
        }
      }, 250);
    }

    // Broadcast language change event
    window.dispatchEvent(new CustomEvent('peetham:languageChanged', { detail: { language: lang } }));
  };

  window.getPeethamLanguage = function () {
    return currentLanguage;
  };

  // Google Translate Global Initialization Hook
  window.googleTranslateElementInit = function () {
    googleInitialized = true;
    try {
      new google.translate.TranslateElement({
        pageLanguage: 'te',
        includedLanguages: 'te,en',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google_translate_element');

      // Apply preferred language once initialized if English
      if (currentLanguage === 'en') {
        setTimeout(() => {
          triggerGoogleTranslate('en');
        }, 300);
      }
    } catch (e) {
      console.warn("Google Translate initialization notice:", e);
    }
  };

  // Load Google Translate API Script
  function loadGoogleTranslateScript() {
    if (document.getElementById('google-translate-script')) return;

    // Create container element
    if (!document.getElementById('google_translate_element')) {
      const container = document.createElement('div');
      container.id = 'google_translate_element';
      container.style.display = 'none';
      document.body.appendChild(container);
    }

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  // Bootstrap on DOM Ready
  function init() {
    injectTranslateStyles();
    loadGoogleTranslateScript();

    // Check stored language
    const saved = localStorage.getItem(STORAGE_KEY) || 'te';
    currentLanguage = saved;

    updateToggleButtonsUI(currentLanguage);

    if (currentLanguage === 'en') {
      translateDOMWithDict('en');
      setTimeout(() => {
        triggerGoogleTranslate('en');
      }, 500);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
