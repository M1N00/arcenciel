document.addEventListener("DOMContentLoaded", function () {
    // 1. INITIALISATION DE FIREBASE
    // Remplace les valeurs ci-dessous par celles de ta configuration Firebase.
    var firebaseConfig = {
      apiKey: "AIzaSyB9xEmB-83GBS5fDRrmo7zPBWhReC3QkkE",
      authDomain: "backend-jardin-enfant.firebaseapp.com",
      projectId: "backend-jardin-enfant",
      storageBucket: "backend-jardin-enfant.firebasestorage.app",
      messagingSenderId: "840177966004",
      appId: "1:840177966004:web:c265a2b1477356ec6570e1"
    };
    // Initialisation de Firebase
    firebase.initializeApp(firebaseConfig);
    // Récupère l'instance du service Storage
    var storage = firebase.storage();
  
    // 2. INITIALISATION D'EMAILJS
    // Remplace "u0luYOls1ADrXhG0M" par ton User ID EmailJS.
    emailjs.init("u0luYOls1ADrXhG0M");
  
    // 3. GESTION DU DRAG & DROP / SÉLECTION DU FICHIER
    const dropZone = document.getElementById("dropZone");
    const fileInput = document.getElementById("fileInput");
    const fileNameDisplay = document.getElementById("fileName");
    let selectedFile = null;
  
    // Ouvrir le sélecteur de fichier en cliquant sur la zone de dépôt
    dropZone.addEventListener("click", () => fileInput.click());
  
    // Quand l'utilisateur sélectionne un fichier via le sélecteur
    fileInput.addEventListener("change", (event) => {
      selectedFile = event.target.files[0];
      fileNameDisplay.textContent = selectedFile ? selectedFile.name : "";
    });
  
    // Gérer l'événement "dragover" pour ajouter un style
    dropZone.addEventListener("dragover", (event) => {
      event.preventDefault();
      dropZone.classList.add("dragover");
    });
  
    dropZone.addEventListener("dragleave", () => {
      dropZone.classList.remove("dragover");
    });
  
    // Gérer le "drop" pour récupérer le fichier déposé
    dropZone.addEventListener("drop", (event) => {
      event.preventDefault();
      dropZone.classList.remove("dragover");
      selectedFile = event.dataTransfer.files[0];
      fileNameDisplay.textContent = selectedFile ? selectedFile.name : "";
    });
  
    // 4. ENVOI DU FICHIER : UPLOAD SUR FIREBASE & ENVOI DE L'EMAIL
    document.getElementById("uploadForm").addEventListener("submit", async function (event) {
      event.preventDefault();
      if (!selectedFile) {
        alert("Sélectionne un fichier !");
        return;
      }
  
      try {
        // Crée une référence dans Firebase Storage (ici dans le dossier "uploads")
        const storageRef = storage.ref('uploads/' + selectedFile.name);
        // Uploade le fichier sur Firebase Storage
        const snapshot = await storageRef.put(selectedFile);
        // Récupère l'URL de téléchargement du fichier
        const downloadURL = await snapshot.ref.getDownloadURL();
        console.log("Fichier disponible à l'URL :", downloadURL);
  
        // Prépare les paramètres pour EmailJS
        const emailParams = {
          file_url: downloadURL, // Ce paramètre doit correspondre à ta variable dans le template EmailJS
        };
  
        // Envoie l'email avec EmailJS
        await emailjs.send("service_5djo6mt", "template_jqdy4fj", emailParams, "u0luYOls1ADrXhG0M");
        alert("Fichier envoyé !");
      } catch (error) {
        console.error("Erreur lors de l'upload ou l'envoi de l'email :", error);
        alert("Échec de l'envoi !");
      }
    });
  });