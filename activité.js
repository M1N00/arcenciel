// Importation des modules Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Configuration Firebase
const firebaseConfig = { /* votre configuration */ };

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

// Activer la persistance offline
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn("Mode multi-onglet non supporté");
    } else if (err.code === 'unimplemented') {
      console.warn("Le navigateur ne supporte pas le stockage offline");
    }
  });

// Éléments HTML
const Image_activité = document.getElementById('IMAGE');
const Titre = document.getElementById('Titre');
const Description = document.getElementById('DESCRIPTION');

// 🔥 Version améliorée avec gestion offline
async function fetchActivityData() {
  const docRef = doc(db, "Activités", "montagne");
  
  try {
    // Essayer d'abord la version serveur
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      console.log("⚠️ Document non trouvé");
      return;
    }

    updateUI(docSnap.data());
    
  } catch (error) {
    if (error.code === 'unavailable') {
      // Fallback au cache
      try {
        const cachedSnap = await getDocFromCache(docRef);
        updateUI(cachedSnap.data());
        console.warn("⚠️ Données en cache");
      } catch (cacheError) {
        showError("Aucune donnée disponible offline");
      }
    } else {
      showError(`Erreur: ${error.message}`);
    }
  }
}

function updateUI(data) {
  Titre.textContent = data.titre;
  Description.textContent = data.description;
  
  // Chargement image avec cache
  getDownloadURL(ref(storage, data.imagePath))
    .then(url => {
      Image_activité.src = url;
      Image_activité.style.display = 'block';
    })
    .catch((storageError) => {
      console.error("Erreur image:", storageError);
      Image_activité.style.display = 'none';
    });
}

function showError(message) {
  Titre.textContent = "Erreur de connexion";
  Description.textContent = message;
  Image_activité.style.display = 'none';
}

// Démarrer immédiatement
fetchActivityData();