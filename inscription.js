// Attend que le DOM soit entièrement chargé avant d'exécuter le script
document.addEventListener("DOMContentLoaded", function () {

    // Configuration Firebase pour se connecter à la base de données
    var firebaseConfig = {
        apiKey: "AIzaSyB9xEmB-83GBS5fDRrmo7zPBWhReC3QkkE",
        authDomain: "backend-jardin-enfant.firebaseapp.com",
        projectId: "backend-jardin-enfant",
        storageBucket: "backend-jardin-enfant.firebasestorage.app",
        messagingSenderId: "840177966004",
        appId: "1:840177966004:web:c265a2b1477356ec6570e1"
    };
  
    // Initialisation de Firebase avec la configuration fournie
    firebase.initializeApp(firebaseConfig);
  
    // Obtention du service de stockage Firebase
    var storage = firebase.storage();
  
    // Initialisation du service EmailJS avec l'identifiant utilisateur
    emailjs.init("u0luYOls1ADrXhG0M");
  
    // Récupération des éléments HTML par leur ID
    const dropZone = document.getElementById("dropZone"); // Zone de dépôt des fichiers
    const fileInput = document.getElementById("fileInput"); // Champ d'input pour les fichiers
    const fileListDisplay = document.getElementById("fileList"); // Élément pour afficher les fichiers sélectionnés
    let selectedFiles = []; // Tableau pour stocker les fichiers sélectionnés
  
    // Permet de déclencher l'ouverture de l'explorateur de fichiers en cliquant sur la zone de dépôt
    dropZone.addEventListener("click", () => fileInput.click());
  
    // Événement déclenché lors de la sélection de fichiers via l'input
    fileInput.addEventListener("change", (event) => {
        selectedFiles = Array.from(event.target.files); // Stocke les fichiers sélectionnés
        displayFileNames(); // Met à jour l'affichage des noms des fichiers
    });
  
    // Gestion du survol d'un fichier sur la zone de dépôt (ajoute une classe CSS)
    dropZone.addEventListener("dragover", (event) => {
        event.preventDefault(); // Empêche le comportement par défaut du navigateur
        dropZone.classList.add("dragover"); // Ajoute une classe CSS pour l'effet visuel
    });
  
    // Gestion du départ du survol du fichier sur la zone de dépôt (retire la classe CSS)
    dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove("dragover");
    });
  
    // Gestion du dépôt de fichiers dans la zone de dépôt
    dropZone.addEventListener("drop", (event) => {
        event.preventDefault(); // Empêche le comportement par défaut du navigateur
        dropZone.classList.remove("dragover"); // Retire la classe CSS
        selectedFiles = Array.from(event.dataTransfer.files); // Stocke les fichiers déposés
        displayFileNames(); // Met à jour l'affichage des noms des fichiers
    });
  
    // Fonction pour afficher les noms des fichiers sélectionnés dans la liste
    function displayFileNames() {
        fileListDisplay.innerHTML = selectedFiles.map(file => `<li>${file.name}</li>`).join("");
    }

    // Fonction pour générer une chaîne de 10 chiffres aléatoires
    function generateRandomString(length) {
        const characters = '0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
  
    // Gestion de l'envoi du formulaire d'upload
    document.getElementById("uploadForm").addEventListener("submit", async function (event) {
        event.preventDefault(); // Empêche la soumission classique du formulaire
  
        // Vérifie si au moins un fichier a été sélectionné
        if (selectedFiles.length === 0) {
            alert("Sélectionne au moins un fichier !");
            return;
        }
  
        try {
            // Désactive le bouton d'envoi pour éviter les doubles soumissions
            document.getElementById('BOUTON').disabled = true;
            let fileLinks = []; // Tableau pour stocker les URLs des fichiers uploadés
  
            // Boucle sur chaque fichier sélectionné pour l'envoyer sur Firebase Storage
            for (const file of selectedFiles) {
                const randomString = generateRandomString(10); // Génère une chaîne de 10 chiffres aléatoires
                const fileName = file.name.replace(/(\.[\w\d_-]+)$/i, `_${randomString}$1`); // Ajoute la chaîne au nom du fichier
                const storageRef = storage.ref('uploads/' + fileName); // Référence du fichier dans Firebase
                const snapshot = await storageRef.put(file); // Envoi du fichier
                const downloadURL = await snapshot.ref.getDownloadURL(); // Obtention du lien de téléchargement
                fileLinks.push(downloadURL); // Ajoute l'URL au tableau
            }
  
            // Paramètres pour l'envoi de l'email via EmailJS
            const emailParams = {
                file_urls: fileLinks.join("\n") // Convertit les liens en texte
            };
  
            // Envoi de l'email contenant les liens des fichiers uploadés
            await emailjs.send("service_5djo6mt", "template_jqdy4fj", emailParams, "u0luYOls1ADrXhG0M");
            alert("Fichiers envoyés !"); // Message de confirmation
        } catch (error) {
            console.error("Erreur lors de l'upload ou l'envoi de l'email :", error);
            alert("Échec de l'envoi !"); // Message d'erreur en cas de problème
        }
    });
  });
