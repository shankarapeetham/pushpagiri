/**
 * Sri Pushpagiri Sankara Peetham - Firebase & Storage Helper
 * Supports Firebase v10 compat SDK + LocalStorage offline fallback
 */

const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Initial default photos for 48th Peetadhipatulu
const DEFAULT_PEETHADIPATHI_PHOTOS = [
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

// Helper to get active Firebase Config from localStorage or default
function getFirebaseConfig() {
  try {
    const saved = localStorage.getItem("pushpagiri_firebase_config");
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn("Could not read Firebase config from localStorage", e);
  }
  return DEFAULT_FIREBASE_CONFIG;
}

// Initialize Firebase if config is present
let firebaseApp = null;
let firebaseAuth = null;
let firebaseDb = null;
let firebaseStorage = null;

function initFirebase() {
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
      return true;
    } catch (err) {
      console.warn("Firebase initialization error:", err);
    }
  }
  return false;
}

// Get Photos for 48th Peetadhipatulu
async function loadPeethadipathiPhotos() {
  const isFbInit = initFirebase();
  if (isFbInit && firebaseDb) {
    try {
      const snap = await firebaseDb.collection("peethadipathi_photos").orderBy("date", "desc").get();
      if (!snap.empty) {
        const photos = [];
        snap.forEach(doc => photos.push({ id: doc.id, ...doc.data() }));
        return photos;
      }
    } catch (err) {
      console.warn("Failed to load from Firestore, trying fallback:", err);
    }
  }

  // LocalStorage Fallback
  try {
    const local = localStorage.getItem("peethadipathi_custom_photos");
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}

  return DEFAULT_PEETHADIPATHI_PHOTOS;
}

// Add a photo
async function addPeethadipathiPhoto(photo) {
  const isFbInit = initFirebase();
  if (isFbInit && firebaseDb) {
    try {
      const docRef = await firebaseDb.collection("peethadipathi_photos").add(photo);
      photo.id = docRef.id;
    } catch (err) {
      console.warn("Firestore save failed, saving locally:", err);
    }
  }

  // Save to local storage as mirror/fallback
  try {
    const current = await loadPeethadipathiPhotos();
    current.unshift(photo);
    localStorage.setItem("peethadipathi_custom_photos", JSON.stringify(current));
  } catch (e) {}

  return photo;
}

// Delete a photo
async function deletePeethadipathiPhoto(photoId) {
  const isFbInit = initFirebase();
  if (isFbInit && firebaseDb) {
    try {
      await firebaseDb.collection("peethadipathi_photos").doc(photoId).delete();
    } catch (err) {
      console.warn("Firestore delete failed:", err);
    }
  }

  try {
    let current = await loadPeethadipathiPhotos();
    current = current.filter(p => p.id !== photoId);
    localStorage.setItem("peethadipathi_custom_photos", JSON.stringify(current));
  } catch (e) {}
}
