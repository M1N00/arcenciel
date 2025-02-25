// Importation des modules Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Configuration Firebase (remplace avec tes propres clés)
const firebaseConfig = {
  apiKey: "AIzaSyB9xEmB-83GBS5fDRrmo7zPBWhReC3QkkE",
  authDomain: "backend-jardin-enfant.firebaseapp.com",
  projectId: "backend-jardin-enfant",
  storageBucket: "backend-jardin-enfant.appspot.com",  // Correction de storageBucket
  messagingSenderId: "840177966004",
  appId: "1:840177966004:web:c265a2b1477356ec6570e1",
  measurementId: "G-PDF27GGNVM"
};

// Activer les logs Firebase Firestore pour débogage
import { setLogLevel } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
setLogLevel("debug");

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

// Sélection des éléments HTML
const Image_activité = document.getElementById('IMAGE');
const Titre = document.getElementById('Titre');
const Description = document.getElementById('DESCRIPTION');

// 🔥 Fonction pour récupérer les données de Firestore et afficher l'image
async function fetchActivityData() {
  try {
    // 🔹 Récupération du document Firestore
    const docRef = doc(db, "Activités", "montagne");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // 🔹 Mise à jour du titre et de la description
      Titre.textContent = data.titre;
      Description.textContent = data.description;

      // 🔹 Chargement de l'image depuis Firebase Storage
      const imageRef = ref(storage, data.imagePath);
      const imageUrl = await getDownloadURL(imageRef);
      Image_activité.src = imageUrl;

    } else {
      console.log("⚠️ Aucune donnée trouvée !");
    }
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des données :", error);
  }
}

// Appel de la fonction au chargement de la page
fetchActivityData();
