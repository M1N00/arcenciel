// Importation des modules Firebase
import firebase from "./node_modules/firebase/app";
import "./node_modules/firebase/firestore";

// Configuration Firebase
var firebaseConfig = {
    apiKey: "AIzaSyB9xEmB-83GBS5fDRrmo7zPBWhReC3QkkE",
    authDomain: "backend-jardin-enfant.firebaseapp.com",
    projectId: "backend-jardin-enfant",
    storageBucket: "backend-jardin-enfant.firebasestorage.app",
    messagingSenderId: "840177966004",
    appId: "1:840177966004:web:c265a2b1477356ec6570e1"
};

// Initialisation de Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Accès à Firestore
const db = firebase.firestore();

// Fonction pour récupérer et imprimer le titre
function fetchActivityTitle() {
    db.collection("Activities").doc("montagne").get()
        .then((doc) => {
            if (doc.exists) {
                console.log("Titre:", doc.data().titre);
            } else {
                console.log("Aucun document trouvé !");
            }
        })
        .catch((error) => {
            console.error("Erreur lors de la récupération du document:", error);
        });
}

// Appel de la fonction avec un délai de 2 secondes
setTimeout(fetchActivityTitle, 2000);