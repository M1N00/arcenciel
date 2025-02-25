// Importation des modules Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Configuration Firebase (remplace avec tes propres clés)
const firebaseConfig = {
  apiKey: "AIzaSyB9xEmB-83GBS5fDRrmo7zPBWhReC3QkkE",
  authDomain: "backend-jardin-enfant.firebaseapp.com",
  projectId: "backend-jardin-enfant",
  storageBucket: "backend-jardin-enfant.firebasestorage.app",
  messagingSenderId: "840177966004",
  appId: "1:840177966004:web:c265a2b1477356ec6570e1",
  measurementId: "G-PDF27GGNVM"
};

//Mode de débogage avancé pour comprendre ski spasse dans sfoutoir dmerde de firebase 
import { setLogLevel } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
setLogLevel("debug");

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

// Sélection des éléments HTML
var Image_activité = document.getElementById('IMAGE');
var Titre = document.getElementById('Titre');
var Description = document.getElementById('DESCRIPTION');

// 🔥 Étape 1 : Récupérer le titre et la description depuis Firestore
async function fetchActivityData() {
  const docRef = doc(db, "Activités", "montagne");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    Titre.textContent = data.titre;
    Description.textContent = data.description;

    // 🔥 Étape 2 : Récupérer l'image depuis Firebase Storage
    const imageRef = ref(storage, data.imagePath);
    getDownloadURL(imageRef).then((url) => {
      Image_activité.src = url;
    }).catch((error) => {
      console.error("Erreur lors du chargement de l'image :", error);
    });

  } else {
    console.log("Aucune donnée trouvée !");
  }
}

fetchActivityData();