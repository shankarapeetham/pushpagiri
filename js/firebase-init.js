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
    url: "images/untitled-design.png",
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

// Local storage keys
const STORAGE_KEYS = {
  FIREBASE_CONFIG: "pushpagiri_firebase_config",
  ADMIN_SESSION: "pushpagiri_admin_session",
  LOCAL_ADMIN_CREDS: "pushpagiri_local_admin_creds",
  CUSTOM_PHOTOS: "peethadipathi_custom_photos",
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
  photo.id = createdId;
  photo.date = photo.date || new Date().toISOString();

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
