/**
 * Sri Pushpagiri Sankara Peetham - Firebase & Real-Time Sync Service
 * 
 * Features:
 * 1. Firebase v10 Compat SDK (Auth, Firestore, Storage)
 * 2. Real-time Firestore snapshot listeners (onSnapshot) for live updates
 * 3. Cross-tab real-time synchronization (BroadcastChannel + storage event)
 * 4. Secure Authentication: Email & Password login and account creation
 * 5. Automatic client-side image compression (Canvas-based) for lightning-fast sync
 * 6. Resilient local fallback when Firebase credentials are not yet configured
 */

// Default Firebase Configuration structure
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Seed photos for 48th Peetadhipatulu
const DEFAULT_PEETHADIPATHI_PHOTOS = [
  {
    id: "default-banner",
    url: "images/hp.png",
    caption: "శ్రీ జగద్గురు పుష్పగిరి శంకరాచార్య మహాసంస్థానం - ఆదిశంకర & 48వ పీఠాధిపతులు",
    date: new Date().toISOString()
  },
  {
    id: "default-1",
    url: "images/peethadipathi/Peethadipathi-3.jpg",
    caption: "శ్రీ శ్రీ శ్రీ విద్యా శంకర భారతీ స్వామీజీ - దివ్య దర్శనం",
    date: new Date().toISOString()
  },
  {
    id: "default-2",
    url: "images/peethadipathi/Peethadipathi-2.jpg",
    caption: "పూజ్యశ్రీ స్వామివారి అనుగ్రహాశీస్సులు",
    date: new Date().toISOString()
  },
  {
    id: "default-3",
    url: "images/peethadipathi/Peethadipathi-6.jpg",
    caption: "ధర్మ ప్రవచనం - జగద్గురు స్వామివారు",
    date: new Date().toISOString()
  },
  {
    id: "default-4",
    url: "images/peethadipathi/Peethadipathi-1.jpg",
    caption: "గర్భాలయ పూజా కైంకర్యం",
    date: new Date().toISOString()
  }
];

// Seed YouTube Videos for Sri Pushpagiri Peetham
const DEFAULT_PEETHAM_VIDEOS = [
  {
    id: "default-vid-1",
    youtubeId: "OrHLNSxigoQ",
    title: "పుష్పగిరి మహా సంస్థానం పాత్ర & చంద్రమౌళీశ్వర వైభవం",
    category: "దివ్య ప్రసంగం",
    description: "పుష్పగిరి పీఠ విశేషాలు, శ్రీ చంద్రమౌళీశ్వర స్వామివారి దివ్య వైభవం మరియు పూజ్యశ్రీ స్వామివారి ఆశీస్సులు.",
    date: new Date().toISOString()
  },
  {
    id: "default-vid-2",
    youtubeId: "bHXehVJb_UE",
    title: "మంత్ర మహిమ - శ్రీ విద్యా శంకర భారతీ స్వామీజీ",
    category: "ఆధ్యాత్మిక ప్రవచనం",
    description: "పూజ్యశ్రీ జగద్గురు స్వామివారి అమృతతుల్యమైన ఆధ్యాత్మిక మార్గదర్శనం మరియు వేద మంత్ర రహస్యాలు.",
    date: new Date().toISOString()
  },
  {
    id: "default-vid-3",
    youtubeId: "aTmlvfmF0eM",
    title: "శ్రీ జగద్గురు పుష్పగిరి శంకరాచార్య మహాసంస్థాన వైభవం",
    category: "పీఠ విశేషాలు",
    description: "దక్షిణ కాశీ పుష్పగిరి క్షేత్ర విశేషాలు, అవిచ్ఛిన్న జగద్గురు శంకర పరంపర మరియు ధర్మ రక్షణ యాత్ర.",
    date: new Date().toISOString()
  }
];

// Seed Hero Banner Slides for Homepage Hero Section (Max 5 allowed)
const MAX_HERO_SLIDES = 5;
const DEFAULT_HERO_SLIDES = [
  {
    id: "hero-slide-1",
    url: "https://pushpagirisankarapeetham.org/wp-content/gallery/dharma-prachara-yatra/home-3.jpg",
    tag: "శ్రీ పుష్పగిరి హరిహర క్షేత్రం",
    caption: "చెన్నకేశవ & శాంతాన మల్లేశ్వర స్వామివార్ల సన్నిధి",
    order: 1,
    date: new Date().toISOString()
  },
  {
    id: "hero-slide-2",
    url: "https://pushpagirisankarapeetham.org/wp-content/gallery/dharma-prachara-yatra/396493180_1370311970490604_545877388820617503_n.jpg",
    tag: "జగద్గురు దివ్య దర్శనం",
    caption: "48వ పీఠాధిపతులు పూజ్యశ్రీ విద్యా శంకర భారతీ స్వామీజీ",
    order: 2,
    date: new Date().toISOString()
  },
  {
    id: "hero-slide-3",
    url: "https://pushpagirisankarapeetham.org/wp-content/gallery/dharma-prachara-yatra/IMG-20240403-WA0033.jpg",
    tag: "ధర్మ ప్రచార యాత్ర",
    caption: "సనాతన ధర్మ రక్షణ • అఖండ వైదిక పరంపర",
    order: 3,
    date: new Date().toISOString()
  }
];

// Local storage keys
const STORAGE_KEYS = {
  FIREBASE_CONFIG: "pushpagiri_firebase_config",
  ADMIN_SESSION: "pushpagiri_admin_session",
  LOCAL_ADMIN_CREDS: "pushpagiri_local_admin_creds",
  CUSTOM_PHOTOS: "peethadipathi_custom_photos",
  CUSTOM_VIDEOS: "peetham_custom_videos",
  HERO_SLIDES: "peetham_hero_slides",
  SITE_THEME: "peetham_site_theme",
  SYNC_EVENT: "pushpagiri_sync_event"
};

// ========================================================
// 1. CONFIGURATION MANAGEMENT
// ========================================================

function getFirebaseConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.FIREBASE_CONFIG);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn("Could not read Firebase config from localStorage", e);
  }
  return DEFAULT_FIREBASE_CONFIG;
}

function saveFirebaseConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEYS.FIREBASE_CONFIG, JSON.stringify(config));
    return true;
  } catch (e) {
    console.error("Failed to save Firebase config:", e);
    return false;
  }
}

function isFirebaseConfigured() {
  const cfg = getFirebaseConfig();
  return Boolean(cfg && cfg.apiKey && cfg.apiKey.trim() !== "" && cfg.projectId && cfg.projectId.trim() !== "");
}

// ========================================================
// 2. FIREBASE INITIALIZATION
// ========================================================

let firebaseApp = null;
let firebaseAuth = null;
let firebaseDb = null;
let firebaseStorage = null;
let isFbInitialized = false;

function initFirebase() {
  if (isFbInitialized && firebaseApp) return true;
  const config = getFirebaseConfig();

  if (config && config.apiKey && typeof firebase !== "undefined") {
    try {
      if (!firebase.apps.length) {
        firebaseApp = firebase.initializeApp(config);
      } else {
        firebaseApp = firebase.app();
      }
      firebaseAuth = firebase.auth();
      firebaseDb = firebase.firestore();
      firebaseStorage = firebase.storage();
      isFbInitialized = true;
      console.log("Firebase initialized successfully with project:", config.projectId);
      return true;
    } catch (err) {
      console.warn("Firebase initialization error:", err);
    }
  }
  return false;
}

// ========================================================
// 3. REAL-TIME BROADCAST ENGINE (Cross-Tab / Multi-Window)
// ========================================================

let realtimeChannel = null;
try {
  if (typeof BroadcastChannel !== "undefined") {
    realtimeChannel = new BroadcastChannel("pushpagiri_realtime_sync");
  }
} catch (e) {
  console.warn("BroadcastChannel not supported, falling back to window storage events", e);
}

function broadcastRealtimeUpdate(action, payload) {
  const msg = {
    action: action,
    payload: payload,
    timestamp: Date.now()
  };

  // 1. BroadcastChannel
  if (realtimeChannel) {
    try {
      realtimeChannel.postMessage(msg);
    } catch (e) {
      console.warn("BroadcastChannel postMessage failed:", e);
    }
  }

  // 2. LocalStorage trigger (triggers 'storage' event in other tabs)
  try {
    localStorage.setItem(STORAGE_KEYS.SYNC_EVENT, JSON.stringify(msg));
  } catch (e) {}
}

// ========================================================
// 4. CLIENT-SIDE IMAGE COMPRESSION (Fast Real-time transfers)
// ========================================================

/**
 * Resizes and compresses image using HTML5 Canvas to keep base64 lightweight (<150KB)
 * Avoids Firestore 1MB document limit and LocalStorage quotas.
 */
function compressImageFile(file, maxWidth = 1200, maxHeight = 1200, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      return reject(new Error("Selected file is not an image"));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to load image for compression"));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve({
          dataUrl: compressedDataUrl,
          width: width,
          height: height,
          originalSize: file.size,
          compressedSize: Math.round((compressedDataUrl.length * 3) / 4)
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ========================================================
// 5. REAL-TIME PHOTO SUBSCRIPTION & MANAGEMENT
// ========================================================

/**
 * Load photos once (Fallback / Initial check)
 */
async function loadPeethadipathiPhotos() {
  const isFb = initFirebase();
  if (isFb && firebaseDb) {
    try {
      const snap = await firebaseDb.collection("peethadipathi_photos").orderBy("date", "desc").get();
      if (!snap.empty) {
        const photos = [];
        snap.forEach(doc => photos.push({ id: doc.id, ...doc.data() }));
        return photos;
      }
    } catch (err) {
      console.warn("Firestore read failed, falling back to local:", err);
    }
  }

  // Local storage fallback
  try {
    const local = localStorage.getItem(STORAGE_KEYS.CUSTOM_PHOTOS);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}

  return DEFAULT_PEETHADIPATHI_PHOTOS;
}

/**
 * Real-time Subscription for 48th Peetadhipatulu Photos
 * Live listener updates UI instantly across all tabs & devices
 * @param {Function} callback - Called whenever photos change: callback(photos, mode)
 * @returns {Function} unsubscribe - Call to stop listening
 */
function subscribePeethadipathiPhotos(callback) {
  let isFirestoreListening = false;
  let firestoreUnsub = null;

  // 1. Check if Firestore is available
  const isFb = initFirebase();
  if (isFb && firebaseDb) {
    try {
      firestoreUnsub = firebaseDb.collection("peethadipathi_photos")
        .orderBy("date", "desc")
        .onSnapshot(
          snapshot => {
            isFirestoreListening = true;
            const photos = [];
            snapshot.forEach(doc => photos.push({ id: doc.id, ...doc.data() }));
            const result = photos.length > 0 ? photos : DEFAULT_PEETHADIPATHI_PHOTOS;
            
            // Cache locally for offline fast startup
            try {
              localStorage.setItem(STORAGE_KEYS.CUSTOM_PHOTOS, JSON.stringify(result));
            } catch (e) {}

            callback(result, "cloud");
          },
          error => {
            console.warn("Firestore snapshot listener error, switching to local real-time:", error);
            handleLocalFallback();
          }
        );
    } catch (e) {
      console.warn("Could not attach Firestore onSnapshot listener:", e);
      handleLocalFallback();
    }
  } else {
    handleLocalFallback();
  }

  function handleLocalFallback() {
    // Initial emit from local
    loadPeethadipathiPhotos().then(photos => callback(photos, "local"));
  }

  // 2. Attach BroadcastChannel & Storage Event Listeners for Instant Multi-Tab Real-time Sync
  const handleMessage = (evt) => {
    if (evt && evt.data && evt.data.action === "PHOTOS_UPDATED") {
      loadPeethadipathiPhotos().then(photos => callback(photos, isFirestoreListening ? "cloud" : "local"));
    }
  };

  const handleStorageEvent = (e) => {
    if (e.key === STORAGE_KEYS.SYNC_EVENT || e.key === STORAGE_KEYS.CUSTOM_PHOTOS) {
      loadPeethadipathiPhotos().then(photos => callback(photos, isFirestoreListening ? "cloud" : "local"));
    }
  };

  if (realtimeChannel) {
    realtimeChannel.addEventListener("message", handleMessage);
  }
  window.addEventListener("storage", handleStorageEvent);

  // Return Unsubscribe function
  return function unsubscribe() {
    if (firestoreUnsub) {
      try { firestoreUnsub(); } catch (e) {}
    }
    if (realtimeChannel) {
      try { realtimeChannel.removeEventListener("message", handleMessage); } catch (e) {}
    }
    window.removeEventListener("storage", handleStorageEvent);
  };
}

/**
 * Add a new photo (Firestore + Local Mirror + Real-time Broadcast)
 */
async function addPeethadipathiPhoto(photo) {
  let createdId = photo.id || "photo-" + Date.now();
  const session = getActiveAdminSession();
  const now = new Date().toISOString();

  photo.id = createdId;
  photo.date = photo.date || now;
  photo.createdAt = photo.createdAt || now;
  photo.updatedAt = now;
  photo.authorUid = session ? session.uid : "admin-local";
  photo.authorEmail = session ? session.email : "admin@pushpagirisankarapeetham.org";

  const isFb = initFirebase();
  let savedToFirestore = false;

  if (isFb && firebaseDb) {
    try {
      const docRef = await firebaseDb.collection("peethadipathi_photos").add(photo);
      photo.id = docRef.id;
      createdId = docRef.id;
      savedToFirestore = true;
    } catch (err) {
      console.warn("Firestore photo write failed:", err);
    }
  }

  // Update local storage mirror
  try {
    let current = [];
    const local = localStorage.getItem(STORAGE_KEYS.CUSTOM_PHOTOS);
    if (local) {
      current = JSON.parse(local);
    }
    if (!Array.isArray(current) || current.length === 0) {
      current = [...DEFAULT_PEETHADIPATHI_PHOTOS];
    }
    current.unshift(photo);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_PHOTOS, JSON.stringify(current));
  } catch (e) {
    console.warn("Local storage mirror update warning:", e);
  }

  // Broadcast real-time update event
  broadcastRealtimeUpdate("PHOTOS_UPDATED", { photoId: createdId, savedToFirestore });

  return photo;
}

/**
 * Update an existing photo caption/metadata (Firestore + Local Mirror + Real-time Broadcast)
 */
async function updatePeethadipathiPhoto(photoId, updatedFields) {
  const isFb = initFirebase();
  let updatedInFirestore = false;
  const now = new Date().toISOString();
  updatedFields.updatedAt = now;

  if (isFb && firebaseDb) {
    try {
      await firebaseDb.collection("peethadipathi_photos").doc(photoId).update(updatedFields);
      updatedInFirestore = true;
    } catch (err) {
      console.warn("Firestore photo update failed:", err);
    }
  }

  // Update local storage mirror
  try {
    let current = [];
    const local = localStorage.getItem(STORAGE_KEYS.CUSTOM_PHOTOS);
    if (local) {
      current = JSON.parse(local);
    }
    if (Array.isArray(current)) {
      current = current.map(p => {
        if (p.id === photoId) {
          return { ...p, ...updatedFields };
        }
        return p;
      });
      localStorage.setItem(STORAGE_KEYS.CUSTOM_PHOTOS, JSON.stringify(current));
    }
  } catch (e) {
    console.warn("Local storage update mirror warning:", e);
  }

  // Broadcast real-time update event
  broadcastRealtimeUpdate("PHOTOS_UPDATED", { photoId, updated: true, updatedInFirestore });
  return true;
}

/**
 * Delete a photo (Firestore + Local Mirror + Real-time Broadcast)
 */
async function deletePeethadipathiPhoto(photoId) {
  const isFb = initFirebase();
  let deletedFromFirestore = false;

  if (isFb && firebaseDb) {
    try {
      await firebaseDb.collection("peethadipathi_photos").doc(photoId).delete();
      deletedFromFirestore = true;
    } catch (err) {
      console.warn("Firestore photo delete failed:", err);
    }
  }

  // Remove from local storage mirror
  try {
    let current = [];
    const local = localStorage.getItem(STORAGE_KEYS.CUSTOM_PHOTOS);
    if (local) {
      current = JSON.parse(local);
    }
    if (!Array.isArray(current) || current.length === 0) {
      current = [...DEFAULT_PEETHADIPATHI_PHOTOS];
    }
    current = current.filter(p => p.id !== photoId);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_PHOTOS, JSON.stringify(current));
  } catch (e) {
    console.warn("Local storage delete warning:", e);
  }

  // Broadcast real-time delete event
  broadcastRealtimeUpdate("PHOTOS_UPDATED", { photoId, deleted: true, deletedFromFirestore });
}

// ========================================================
// 5B. REAL-TIME YOUTUBE VIDEO MANAGEMENT & SYNC
// ========================================================

/**
 * Extracts standard 11-character YouTube video ID from various URL formats
 */
function extractYouTubeVideoId(input) {
  if (!input) return "";
  input = String(input).trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return input;
  }
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = input.match(regExp);
  if (match && match[1]) {
    return match[1];
  }
  return input;
}

/**
 * Load videos once (Firestore or Local fallback)
 */
async function loadPeethamVideos() {
  const isFb = initFirebase();
  if (isFb && firebaseDb) {
    try {
      const snap = await firebaseDb.collection("peetham_videos").orderBy("date", "desc").get();
      if (!snap.empty) {
        const videos = [];
        snap.forEach(doc => videos.push({ id: doc.id, ...doc.data() }));
        return videos;
      }
    } catch (err) {
      console.warn("Firestore videos read failed, falling back to local:", err);
    }
  }

  // Local storage fallback
  try {
    const local = localStorage.getItem(STORAGE_KEYS.CUSTOM_VIDEOS);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}

  return DEFAULT_PEETHAM_VIDEOS;
}

/**
 * Real-time Subscription for Peetham YouTube Videos
 * @param {Function} callback - callback(videos, mode)
 * @returns {Function} unsubscribe
 */
function subscribePeethamVideos(callback) {
  let isFirestoreListening = false;
  let firestoreUnsub = null;

  const isFb = initFirebase();
  if (isFb && firebaseDb) {
    try {
      firestoreUnsub = firebaseDb.collection("peetham_videos")
        .orderBy("date", "desc")
        .onSnapshot(
          snapshot => {
            isFirestoreListening = true;
            const videos = [];
            snapshot.forEach(doc => videos.push({ id: doc.id, ...doc.data() }));
            const result = videos.length > 0 ? videos : DEFAULT_PEETHAM_VIDEOS;
            try {
              localStorage.setItem(STORAGE_KEYS.CUSTOM_VIDEOS, JSON.stringify(result));
            } catch (e) {}
            callback(result, "cloud");
          },
          error => {
            console.warn("Firestore videos snapshot error, falling back:", error);
            handleLocalVideosFallback();
          }
        );
    } catch (e) {
      console.warn("Could not attach Firestore onSnapshot for videos:", e);
      handleLocalVideosFallback();
    }
  } else {
    handleLocalVideosFallback();
  }

  function handleLocalVideosFallback() {
    loadPeethamVideos().then(videos => callback(videos, "local"));
  }

  // BroadcastChannel & Storage Event Listeners
  const handleMessage = (evt) => {
    if (evt && evt.data && evt.data.action === "VIDEOS_UPDATED") {
      loadPeethamVideos().then(videos => callback(videos, isFirestoreListening ? "cloud" : "local"));
    }
  };

  const handleStorageEvent = (e) => {
    if (e.key === STORAGE_KEYS.SYNC_EVENT || e.key === STORAGE_KEYS.CUSTOM_VIDEOS) {
      loadPeethamVideos().then(videos => callback(videos, isFirestoreListening ? "cloud" : "local"));
    }
  };

  if (realtimeChannel) {
    realtimeChannel.addEventListener("message", handleMessage);
  }
  window.addEventListener("storage", handleStorageEvent);

  return function unsubscribe() {
    if (firestoreUnsub) {
      try { firestoreUnsub(); } catch (e) {}
    }
    if (realtimeChannel) {
      try { realtimeChannel.removeEventListener("message", handleMessage); } catch (e) {}
    }
    window.removeEventListener("storage", handleStorageEvent);
  };
}

/**
 * Add a new YouTube video
 */
async function addPeethamVideo(video) {
  const session = getActiveAdminSession();
  const now = new Date().toISOString();
  let createdId = video.id || "vid-" + Date.now();

  const cleanId = extractYouTubeVideoId(video.youtubeId || video.url);
  video.id = createdId;
  video.youtubeId = cleanId;
  video.date = video.date || now;
  video.createdAt = video.createdAt || now;
  video.updatedAt = now;
  video.authorUid = session ? session.uid : "admin-local";
  video.authorEmail = session ? session.email : "admin@pushpagirisankarapeetham.org";

  const isFb = initFirebase();
  let savedToFirestore = false;

  if (isFb && firebaseDb) {
    try {
      const docRef = await firebaseDb.collection("peetham_videos").add(video);
      video.id = docRef.id;
      createdId = docRef.id;
      savedToFirestore = true;
    } catch (err) {
      console.warn("Firestore video write failed:", err);
    }
  }

  // Update local storage mirror
  try {
    let current = [];
    const local = localStorage.getItem(STORAGE_KEYS.CUSTOM_VIDEOS);
    if (local) current = JSON.parse(local);
    if (!Array.isArray(current) || current.length === 0) {
      current = [...DEFAULT_PEETHAM_VIDEOS];
    }
    current.unshift(video);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_VIDEOS, JSON.stringify(current));
  } catch (e) {
    console.warn("Local storage video mirror update error:", e);
  }

  // Broadcast real-time update
  broadcastRealtimeUpdate("VIDEOS_UPDATED", { videoId: createdId, savedToFirestore });
  return video;
}

/**
 * Update a YouTube video
 */
async function updatePeethamVideo(videoId, updatedFields) {
  const isFb = initFirebase();
  let updatedInFirestore = false;
  const now = new Date().toISOString();
  updatedFields.updatedAt = now;

  if (updatedFields.youtubeId) {
    updatedFields.youtubeId = extractYouTubeVideoId(updatedFields.youtubeId);
  }

  if (isFb && firebaseDb) {
    try {
      await firebaseDb.collection("peetham_videos").doc(videoId).update(updatedFields);
      updatedInFirestore = true;
    } catch (err) {
      console.warn("Firestore video update failed:", err);
    }
  }

  // Update local storage mirror
  try {
    let current = [];
    const local = localStorage.getItem(STORAGE_KEYS.CUSTOM_VIDEOS);
    if (local) current = JSON.parse(local);
    if (Array.isArray(current)) {
      current = current.map(v => {
        if (v.id === videoId) return { ...v, ...updatedFields };
        return v;
      });
      localStorage.setItem(STORAGE_KEYS.CUSTOM_VIDEOS, JSON.stringify(current));
    }
  } catch (e) {
    console.warn("Local storage update video warning:", e);
  }

  broadcastRealtimeUpdate("VIDEOS_UPDATED", { videoId, updated: true, updatedInFirestore });
  return true;
}

/**
 * Delete a YouTube video
 */
async function deletePeethamVideo(videoId) {
  const isFb = initFirebase();
  let deletedFromFirestore = false;

  if (isFb && firebaseDb) {
    try {
      await firebaseDb.collection("peetham_videos").doc(videoId).delete();
      deletedFromFirestore = true;
    } catch (err) {
      console.warn("Firestore video delete failed:", err);
    }
  }

  // Remove from local storage mirror
  try {
    let current = [];
    const local = localStorage.getItem(STORAGE_KEYS.CUSTOM_VIDEOS);
    if (local) current = JSON.parse(local);
    if (!Array.isArray(current) || current.length === 0) {
      current = [...DEFAULT_PEETHAM_VIDEOS];
    }
    current = current.filter(v => v.id !== videoId);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_VIDEOS, JSON.stringify(current));
  } catch (e) {
    console.warn("Local storage video delete warning:", e);
  }

  broadcastRealtimeUpdate("VIDEOS_UPDATED", { videoId, deleted: true, deletedFromFirestore });
  return true;
}

// ========================================================
// 6. SECURITY & AUTHENTICATION SERVICE (Email & Password)
// ========================================================

/**
 * Authenticate Admin with Email and Password
 */
async function authLoginAdmin(email, password) {
  email = (email || "").trim().toLowerCase();
  password = (password || "").trim();

  if (!email || !email.includes("@")) {
    throw new Error("దయచేసి సరైన ఈమెయిల్ చిరునామాను నమోదు చేయండి (Please enter a valid email address).");
  }
  if (!password || password.length < 6) {
    throw new Error("పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి (Password must be at least 6 characters).");
  }

  const isFb = initFirebase();
  if (isFb && firebaseAuth) {
    // 1. Cloud Authentication via Firebase
    try {
      const userCred = await firebaseAuth.signInWithEmailAndPassword(email, password);
      const session = {
        email: userCred.user.email,
        uid: userCred.user.uid,
        provider: "firebase",
        loginTime: new Date().toISOString()
      };
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session));
      localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session));
      return session;
    } catch (fbErr) {
      let msg = fbErr.message;
      if (fbErr.code === "auth/user-not-found") {
        msg = "ఈ ఈమెయిల్‌తో ఖాతా కనుగొనబడలేదు. దయచేసి 'కొత్త ఖాతా సృష్టించండి' ఎంచుకోండి (User not found. Please register).";
      } else if (fbErr.code === "auth/wrong-password" || fbErr.code === "auth/invalid-credential") {
        msg = "తప్పు పాస్‌వర్డ్ నమోదైంది. దయచేసి సరిచూసుకోండి (Invalid password. Please check your credentials).";
      } else if (fbErr.code === "auth/invalid-email") {
        msg = "చెల్లని ఈమెయిల్ ఆకృతి (Invalid email format).";
      }
      throw new Error(msg);
    }
  }

  // 2. Resilient Secure Local Authentication
  // Checks if credentials were registered locally or initializes admin
  let localCreds = null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOCAL_ADMIN_CREDS);
    if (raw) localCreds = JSON.parse(raw);
  } catch (e) {}

  if (localCreds) {
    if (localCreds.email.toLowerCase() === email && localCreds.password === password) {
      const session = {
        email: email,
        uid: "local-" + btoa(email).substring(0, 8),
        provider: "local_secure",
        loginTime: new Date().toISOString()
      };
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session));
      localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session));
      return session;
    } else {
      throw new Error("తప్పు ఈమెయిల్ లేదా పాస్‌వర్డ్ (Incorrect email or password).");
    }
  } else {
    // First-time setup: establish this admin account
    const newCreds = { email, password, createdAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.LOCAL_ADMIN_CREDS, JSON.stringify(newCreds));
    const session = {
      email: email,
      uid: "admin-" + Date.now(),
      provider: "local_secure",
      loginTime: new Date().toISOString()
    };
    sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session));
    localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session));
    return session;
  }
}

/**
 * Register / Create New Admin Account (Email & Password)
 */
async function authRegisterAdmin(email, password, confirmPassword) {
  email = (email || "").trim().toLowerCase();
  password = (password || "").trim();
  confirmPassword = (confirmPassword || "").trim();

  if (!email || !email.includes("@")) {
    throw new Error("దయచేసి సరైన ఈమెయిల్ చిరునామాను నమోదు చేయండి (Please enter a valid email address).");
  }
  if (!password || password.length < 6) {
    throw new Error("పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి (Password must be at least 6 characters).");
  }
  if (password !== confirmPassword) {
    throw new Error("పాస్‌వర్డ్‌లు సరిపోలడం లేదు (Passwords do not match).");
  }

  const isFb = initFirebase();
  if (isFb && firebaseAuth) {
    try {
      const userCred = await firebaseAuth.createUserWithEmailAndPassword(email, password);
      const session = {
        email: userCred.user.email,
        uid: userCred.user.uid,
        provider: "firebase",
        loginTime: new Date().toISOString()
      };
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session));
      localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session));
      return session;
    } catch (fbErr) {
      let msg = fbErr.message;
      if (fbErr.code === "auth/email-already-in-use") {
        msg = "ఈ ఈమెయిల్ ఇప్పటికే వాడుకలో ఉంది. దయచేసి సైన్ ఇన్ చేయండి (Email already registered. Please sign in).";
      } else if (fbErr.code === "auth/weak-password") {
        msg = "పాస్‌వర్డ్ చాలా బలహీనంగా ఉంది. కనీసం 6 అక్షరాలు ఉపయోగించండి (Weak password).";
      }
      throw new Error(msg);
    }
  }

  // Local Admin Registration
  const creds = { email, password, createdAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEYS.LOCAL_ADMIN_CREDS, JSON.stringify(creds));
  const session = {
    email: email,
    uid: "admin-" + Date.now(),
    provider: "local_secure",
    loginTime: new Date().toISOString()
  };
  sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session));
  localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session));
  return session;
}

/**
 * Get Active Admin Session (Strict Route Guard)
 */
function getActiveAdminSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) || localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
    if (raw) {
      const session = JSON.parse(raw);
      if (session && session.email) return session;
    }
  } catch (e) {}
  return null;
}

/**
 * Logout Admin & Clear Session
 */
async function authLogoutAdmin() {
  if (firebaseAuth) {
    try {
      await firebaseAuth.signOut();
    } catch (e) {}
  }
  sessionStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  localStorage.removeItem("pushpagiri_admin_user");
}

/**
 * Listen for Authentication Changes
 */
function subscribeAuthState(callback) {
  initFirebase();
  if (firebaseAuth) {
    return firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        const session = {
          email: user.email,
          uid: user.uid,
          provider: "firebase",
          loginTime: new Date().toISOString()
        };
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session));
        callback(session);
      } else {
        const activeLocal = getActiveAdminSession();
        if (activeLocal && activeLocal.provider === "local_secure") {
          callback(activeLocal);
        } else {
          sessionStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
          localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
          callback(null);
        }
      }
    });
  } else {
    // Check local session
    const session = getActiveAdminSession();
    callback(session);
    return () => {};
  }
}

/**
 * Send Password Reset Email
 */
async function authResetPassword(email) {
  email = (email || "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    throw new Error("దయచేసి సరైన ఈమెయిల్ చిరునామాను నమోదు చేయండి (Please enter a valid email address).");
  }

  const isFb = initFirebase();
  if (isFb && firebaseAuth) {
    try {
      await firebaseAuth.sendPasswordResetEmail(email);
      return {
        success: true,
        message: "పాస్‌వర్డ్ రీసెట్ లింక్ మీ ఈమెయిల్‌కు విజయవంతంగా పంపబడింది (Password reset link sent to your email successfully)."
      };
    } catch (fbErr) {
      let msg = fbErr.message;
      if (fbErr.code === "auth/user-not-found") {
        msg = "ఈ ఈమెయిల్‌తో ఖాతా కనుగొనబడలేదు (No account registered with this email).";
      } else if (fbErr.code === "auth/invalid-email") {
        msg = "చెల్లని ఈమెయిల్ ఆకృతి (Invalid email format).";
      }
      throw new Error(msg);
    }
  }

  // Local fallback
  return {
    success: true,
    message: "స్థానిక మోడ్: మీరు నేరుగా 'రిజిస్టర్ అడ్మిన్' ట్యాబ్ ద్వారా పాస్‌వర్డ్ మార్చుకోవచ్చు లేదా కొత్తగా సెట్ చేయవచ్చు (Local mode active: You can re-register or sign in)."
  };
}

/**
 * Test Firebase Connection & Verify Firestore/Auth Status
 */
async function testFirebaseConnection() {
  const cfg = getFirebaseConfig();
  if (!cfg || !cfg.apiKey || !cfg.projectId) {
    return {
      connected: false,
      mode: "local",
      message: "Firebase credentials not entered yet. Running in offline/local high-speed sync mode."
    };
  }

  const isFb = initFirebase();
  if (!isFb || !firebaseDb) {
    return {
      connected: false,
      mode: "unreachable",
      message: "Could not initialize Firebase client. Please verify API key and Project ID."
    };
  }

  const startTime = Date.now();
  try {
    // Probe Firestore read on peethadipathi_photos
    const snap = await firebaseDb.collection("peethadipathi_photos").limit(1).get();
    const latency = Date.now() - startTime;
    return {
      connected: true,
      mode: "cloud",
      latencyMs: latency,
      projectId: cfg.projectId,
      message: `Firebase connection verified! Firestore response time: ${latency}ms. Project: ${cfg.projectId}.`
    };
  } catch (err) {
    const latency = Date.now() - startTime;
    return {
      connected: false,
      mode: "error",
      latencyMs: latency,
      message: `Firebase Firestore error: ${err.message}`
    };
  }
}

// ========================================================
// 8. GLOBAL SITE THEME REAL-TIME SERVICE
// Only authenticated admins can modify; applies globally to all visitors
// ========================================================

const DEFAULT_SITE_THEME = "orange";
const VALID_SITE_THEMES = ["orange", "blue", "red", "gold"];

// Apply theme to document element immediately
function applyThemeToDOM(theme) {
  if (!VALID_SITE_THEMES.includes(theme)) theme = DEFAULT_SITE_THEME;
  document.documentElement.setAttribute('data-theme', theme);
  window.dispatchEvent(new CustomEvent('peetham:themeChanged', { detail: { theme } }));
}

// Initial immediate theme application from localStorage to avoid FOUC
try {
  const cachedTheme = localStorage.getItem(STORAGE_KEYS.SITE_THEME) || DEFAULT_SITE_THEME;
  applyThemeToDOM(cachedTheme);
} catch (e) {}

/**
 * Load Global Site Theme
 */
async function loadSiteTheme() {
  const isFb = initFirebase();
  if (isFb && firebaseDb) {
    try {
      const doc = await firebaseDb.collection("peetham_settings").doc("site_theme").get();
      if (doc.exists && doc.data() && doc.data().theme) {
        const theme = doc.data().theme;
        if (VALID_SITE_THEMES.includes(theme)) {
          localStorage.setItem(STORAGE_KEYS.SITE_THEME, theme);
          applyThemeToDOM(theme);
          return theme;
        }
      }
    } catch (e) {
      console.warn("Firestore theme load error, using fallback:", e);
    }
  }

  const localTheme = localStorage.getItem(STORAGE_KEYS.SITE_THEME) || DEFAULT_SITE_THEME;
  applyThemeToDOM(localTheme);
  return localTheme;
}

/**
 * Subscribe to Global Site Theme in Real-Time
 * Updates automatically when Admin sets a new theme in the dashboard
 */
function subscribeSiteTheme(callback) {
  const isFb = initFirebase();
  let unsubFirestore = null;

  // Immediate cached invocation
  const initialTheme = localStorage.getItem(STORAGE_KEYS.SITE_THEME) || DEFAULT_SITE_THEME;
  applyThemeToDOM(initialTheme);
  if (typeof callback === 'function') callback(initialTheme, "cached");

  if (isFb && firebaseDb) {
    try {
      unsubFirestore = firebaseDb.collection("peetham_settings").doc("site_theme")
        .onSnapshot(doc => {
          if (doc.exists && doc.data() && doc.data().theme) {
            const theme = doc.data().theme;
            if (VALID_SITE_THEMES.includes(theme)) {
              localStorage.setItem(STORAGE_KEYS.SITE_THEME, theme);
              applyThemeToDOM(theme);
              if (typeof callback === 'function') callback(theme, "firebase");
            }
          }
        }, err => {
          console.warn("Firestore theme listener warning:", err);
        });
    } catch (e) {
      console.warn("Firestore theme listener setup warning:", e);
    }
  }

  // Cross-tab real-time sync listeners
  const onStorageChange = (e) => {
    if (e.key === STORAGE_KEYS.SITE_THEME && e.newValue) {
      if (VALID_SITE_THEMES.includes(e.newValue)) {
        applyThemeToDOM(e.newValue);
        if (typeof callback === 'function') callback(e.newValue, "local_storage");
      }
    }
  };
  window.addEventListener('storage', onStorageChange);

  let onBroadcast = null;
  if (typeof BroadcastChannel !== 'undefined') {
    const channel = new BroadcastChannel("peetham_theme_channel");
    onBroadcast = (msg) => {
      if (msg && msg.data && msg.data.theme) {
        const theme = msg.data.theme;
        if (VALID_SITE_THEMES.includes(theme)) {
          localStorage.setItem(STORAGE_KEYS.SITE_THEME, theme);
          applyThemeToDOM(theme);
          if (typeof callback === 'function') callback(theme, "broadcast");
        }
      }
    };
    channel.addEventListener('message', onBroadcast);
  }

  return () => {
    if (unsubFirestore) {
      try { unsubFirestore(); } catch (e) {}
    }
    window.removeEventListener('storage', onStorageChange);
  };
}

/**
 * Admin Action: Update Global Site Theme
 * Only authenticated administrators can execute this.
 * Updates Firestore + Local Mirror + Broadcasts to all open browser sessions worldwide.
 */
async function setGlobalSiteTheme(themeName) {
  if (!VALID_SITE_THEMES.includes(themeName)) {
    throw new Error(`అమాన్యమైన థీమ్ (Invalid theme: ${themeName}). Valid options: ${VALID_SITE_THEMES.join(', ')}`);
  }

  // Verify Admin Session
  const session = getAdminSession();
  if (!session) {
    throw new Error("థీమ్ మార్చడానికి నిర్వాహక అధికారాలు అవసరం (Admin authentication required to change site theme).");
  }

  const isFb = initFirebase();
  let savedToFirestore = false;
  const now = new Date().toISOString();

  const themePayload = {
    theme: themeName,
    updatedAt: now,
    updatedByUid: session.uid || (firebaseAuth && firebaseAuth.currentUser ? firebaseAuth.currentUser.uid : "admin"),
    updatedByEmail: session.email || (firebaseAuth && firebaseAuth.currentUser ? firebaseAuth.currentUser.email : "admin")
  };

  if (isFb && firebaseDb) {
    try {
      await firebaseDb.collection("peetham_settings").doc("site_theme").set(themePayload, { merge: true });
      savedToFirestore = true;
    } catch (err) {
      console.warn("Firestore save theme failed, using local mirror:", err);
    }
  }

  // Update local storage mirror
  try {
    localStorage.setItem(STORAGE_KEYS.SITE_THEME, themeName);
  } catch (e) {}

  // Apply to current DOM
  applyThemeToDOM(themeName);

  // Broadcast across all open tabs
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel("peetham_theme_channel");
      channel.postMessage({ type: "THEME_UPDATED", theme: themeName, savedToFirestore });
    }
    broadcastRealtimeUpdate("THEME_UPDATED", { theme: themeName, savedToFirestore });
  } catch (e) {}

  return { success: true, theme: themeName, savedToFirestore };
}

// Auto-subscribe to theme on DOM ready for all pages that import firebase-init.js
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      subscribeSiteTheme((theme) => {
        applyThemeToDOM(theme);
      });
    });
  } else {
    subscribeSiteTheme((theme) => {
      applyThemeToDOM(theme);
    });
  }
}

// ========================================================
// 9. HOMEPAGE HERO SLIDER REAL-TIME SERVICE (1 to 5 Images)
// Supports dynamic adding, deleting, ordering and live sync
// ========================================================

/**
 * Load Hero Banner Slides
 * Returns 1 to 5 slides ordered by order number.
 */
async function loadHeroSlides() {
  const isFb = initFirebase();
  if (isFb && firebaseDb) {
    try {
      const snap = await firebaseDb.collection("peetham_hero_slides").orderBy("order", "asc").get();
      if (!snap.empty) {
        const slides = [];
        snap.forEach(doc => {
          slides.push({ id: doc.id, ...doc.data() });
        });
        localStorage.setItem(STORAGE_KEYS.HERO_SLIDES, JSON.stringify(slides));
        return slides;
      }
    } catch (e) {
      console.warn("Firestore hero slides load warning, using local mirror:", e);
    }
  }

  // Fallback to local storage mirror
  try {
    const local = localStorage.getItem(STORAGE_KEYS.HERO_SLIDES);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.slice(0, MAX_HERO_SLIDES);
      }
    }
  } catch (e) {}

  // Initial seed fallback
  localStorage.setItem(STORAGE_KEYS.HERO_SLIDES, JSON.stringify(DEFAULT_HERO_SLIDES));
  return DEFAULT_HERO_SLIDES;
}

/**
 * Subscribe to Hero Banner Slides in Real-Time
 * Updates automatically when Admin adds, removes or reorders hero slides
 */
function subscribeHeroSlides(callback) {
  const isFb = initFirebase();
  let unsubFirestore = null;

  // Immediate cached invocation
  let cached = null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HERO_SLIDES);
    if (raw) cached = JSON.parse(raw);
  } catch (e) {}
  if (!Array.isArray(cached) || cached.length === 0) {
    cached = DEFAULT_HERO_SLIDES;
  }
  if (typeof callback === 'function') callback(cached, "cached");

  // Firestore Snapshot Listener
  if (isFb && firebaseDb) {
    try {
      unsubFirestore = firebaseDb.collection("peetham_hero_slides")
        .orderBy("order", "asc")
        .onSnapshot(snap => {
          if (!snap.empty) {
            const slides = [];
            snap.forEach(doc => {
              slides.push({ id: doc.id, ...doc.data() });
            });
            localStorage.setItem(STORAGE_KEYS.HERO_SLIDES, JSON.stringify(slides));
            if (typeof callback === 'function') callback(slides, "firebase");
          } else {
            const local = localStorage.getItem(STORAGE_KEYS.HERO_SLIDES);
            const fallback = local ? JSON.parse(local) : DEFAULT_HERO_SLIDES;
            if (typeof callback === 'function') callback(fallback, "firebase_empty");
          }
        }, err => {
          console.warn("Firestore hero slides listener warning:", err);
        });
    } catch (e) {
      console.warn("Firestore hero slides listener setup warning:", e);
    }
  }

  // Cross-tab sync via storage events
  const onStorageChange = (e) => {
    if (e.key === STORAGE_KEYS.HERO_SLIDES && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed) && typeof callback === 'function') {
          callback(parsed, "local_storage");
        }
      } catch (err) {}
    }
  };
  window.addEventListener('storage', onStorageChange);

  // Cross-tab sync via BroadcastChannel
  let onBroadcast = null;
  let broadcastChannel = null;
  if (typeof BroadcastChannel !== 'undefined') {
    broadcastChannel = new BroadcastChannel("peetham_hero_channel");
    onBroadcast = (msg) => {
      if (msg && msg.data && msg.data.type === "HERO_SLIDES_UPDATED" && Array.isArray(msg.data.slides)) {
        if (typeof callback === 'function') callback(msg.data.slides, "broadcast");
      }
    };
    broadcastChannel.addEventListener('message', onBroadcast);
  }

  return () => {
    if (unsubFirestore) {
      try { unsubFirestore(); } catch (e) {}
    }
    window.removeEventListener('storage', onStorageChange);
    if (broadcastChannel && onBroadcast) {
      try { broadcastChannel.removeEventListener('message', onBroadcast); } catch (e) {}
    }
  };
}

/**
 * Save a Hero Slide (Add new or Update existing)
 * Enforces maximum 5 slides restriction.
 */
async function saveHeroSlide(slideData) {
  const session = getAdminSession();
  if (!session) {
    throw new Error("చిత్రాన్ని సేవ్ చేయడానికి నిర్వాహక లాగిన్ అవసరం (Admin session required to save hero slide).");
  }

  if (!slideData.url || !slideData.url.trim()) {
    throw new Error("చిత్రం URL లేదా అప్‌లోడ్ ఫైల్ తప్పనిసరి (Image URL or file required).");
  }

  const currentSlides = await loadHeroSlides();
  const isUpdating = Boolean(slideData.id && currentSlides.some(s => s.id === slideData.id));

  // Enforce Max 5 Slides
  if (!isUpdating && currentSlides.length >= MAX_HERO_SLIDES) {
    throw new Error(`గరిష్టంగా ${MAX_HERO_SLIDES} చిత్రాలు మాత్రమే అనుమతించబడతాయి (Maximum ${MAX_HERO_SLIDES} slides allowed). దయచేసి ఇప్పటికే ఉన్న చిత్రాన్ని తొలగించండి.`);
  }

  const now = new Date().toISOString();
  const slideId = slideData.id || ("hero-slide-" + Date.now());
  const orderNum = Number(slideData.order) || (isUpdating ? (slideData.order || 1) : (currentSlides.length + 1));

  const slidePayload = {
    id: slideId,
    url: slideData.url.trim(),
    tag: (slideData.tag || "శ్రీ పుష్పగిరి హరిహర క్షేత్రం").trim(),
    caption: (slideData.caption || "").trim(),
    order: orderNum,
    date: slideData.date || now,
    createdAt: slideData.createdAt || now,
    updatedAt: now,
    authorUid: session.uid || (firebaseAuth && firebaseAuth.currentUser ? firebaseAuth.currentUser.uid : "admin"),
    authorEmail: session.email || (firebaseAuth && firebaseAuth.currentUser ? firebaseAuth.currentUser.email : "admin")
  };

  const isFb = initFirebase();
  let savedToFirestore = false;

  if (isFb && firebaseDb) {
    try {
      await firebaseDb.collection("peetham_hero_slides").doc(slideId).set(slidePayload, { merge: true });
      savedToFirestore = true;
    } catch (err) {
      console.warn("Firestore hero slide save failed, using local mirror:", err);
    }
  }

  // Update local storage mirror
  let updatedList = [];
  try {
    const local = localStorage.getItem(STORAGE_KEYS.HERO_SLIDES);
    let list = local ? JSON.parse(local) : [...DEFAULT_HERO_SLIDES];
    if (isUpdating) {
      list = list.map(s => s.id === slideId ? slidePayload : s);
    } else {
      list.push(slidePayload);
    }
    list.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    updatedList = list.slice(0, MAX_HERO_SLIDES);
    localStorage.setItem(STORAGE_KEYS.HERO_SLIDES, JSON.stringify(updatedList));
  } catch (e) {
    console.warn("Local storage mirror save failed:", e);
  }

  // Broadcast across tabs
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel("peetham_hero_channel");
      channel.postMessage({ type: "HERO_SLIDES_UPDATED", slides: updatedList, savedToFirestore });
    }
    broadcastRealtimeUpdate("HERO_SLIDES_UPDATED", { slideId, savedToFirestore });
  } catch (e) {}

  return { success: true, slide: slidePayload, savedToFirestore };
}

/**
 * Delete a Hero Slide
 */
async function deleteHeroSlide(slideId) {
  const session = getAdminSession();
  if (!session) {
    throw new Error("చిత్రాన్ని తొలగించడానికి నిర్వాహక లాగిన్ అవసరం (Admin session required).");
  }

  const isFb = initFirebase();
  let deletedFromFirestore = false;

  if (isFb && firebaseDb) {
    try {
      await firebaseDb.collection("peetham_hero_slides").doc(slideId).delete();
      deletedFromFirestore = true;
    } catch (err) {
      console.warn("Firestore hero slide delete failed:", err);
    }
  }

  let updatedList = [];
  try {
    const local = localStorage.getItem(STORAGE_KEYS.HERO_SLIDES);
    let list = local ? JSON.parse(local) : [...DEFAULT_HERO_SLIDES];
    list = list.filter(s => s.id !== slideId);
    list.forEach((s, idx) => { s.order = idx + 1; });
    updatedList = list;
    localStorage.setItem(STORAGE_KEYS.HERO_SLIDES, JSON.stringify(updatedList));
  } catch (e) {}

  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel("peetham_hero_channel");
      channel.postMessage({ type: "HERO_SLIDES_UPDATED", slides: updatedList, deletedFromFirestore });
    }
    broadcastRealtimeUpdate("HERO_SLIDES_UPDATED", { slideId, deleted: true, deletedFromFirestore });
  } catch (e) {}

  return { success: true, deletedFromFirestore };
}

/**
 * Reorder Hero Slides
 */
async function reorderHeroSlides(orderedSlideIds) {
  const session = getAdminSession();
  if (!session) {
    throw new Error("నిర్వాహక లాగిన్ అవసరం (Admin session required).");
  }

  const currentSlides = await loadHeroSlides();
  const reordered = [];

  orderedSlideIds.forEach((id, index) => {
    const found = currentSlides.find(s => s.id === id);
    if (found) {
      found.order = index + 1;
      found.updatedAt = new Date().toISOString();
      reordered.push(found);
    }
  });

  const isFb = initFirebase();
  if (isFb && firebaseDb) {
    try {
      const batch = firebaseDb.batch();
      reordered.forEach(slide => {
        const ref = firebaseDb.collection("peetham_hero_slides").doc(slide.id);
        batch.set(ref, slide, { merge: true });
      });
      await batch.commit();
    } catch (e) {
      console.warn("Firestore batch reorder warning:", e);
    }
  }

  localStorage.setItem(STORAGE_KEYS.HERO_SLIDES, JSON.stringify(reordered));

  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel("peetham_hero_channel");
      channel.postMessage({ type: "HERO_SLIDES_UPDATED", slides: reordered });
    }
    broadcastRealtimeUpdate("HERO_SLIDES_UPDATED", { reordered: true });
  } catch (e) {}

  return reordered;
}

/**
 * Reset Hero Slides to Default 3 Holy Photos
 */
async function resetHeroSlidesToDefault() {
  const session = getAdminSession();
  if (!session) {
    throw new Error("నిర్వాహక లాగిన్ అవసరం (Admin session required).");
  }

  const isFb = initFirebase();
  if (isFb && firebaseDb) {
    try {
      const snap = await firebaseDb.collection("peetham_hero_slides").get();
      const batch = firebaseDb.batch();
      snap.forEach(doc => batch.delete(doc.ref));
      DEFAULT_HERO_SLIDES.forEach(s => {
        const ref = firebaseDb.collection("peetham_hero_slides").doc(s.id);
        batch.set(ref, s);
      });
      await batch.commit();
    } catch (e) {
      console.warn("Firestore reset batch error:", e);
    }
  }

  localStorage.setItem(STORAGE_KEYS.HERO_SLIDES, JSON.stringify(DEFAULT_HERO_SLIDES));

  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel("peetham_hero_channel");
      channel.postMessage({ type: "HERO_SLIDES_UPDATED", slides: DEFAULT_HERO_SLIDES });
    }
    broadcastRealtimeUpdate("HERO_SLIDES_UPDATED", { reset: true });
  } catch (e) {}

  return DEFAULT_HERO_SLIDES;
}

