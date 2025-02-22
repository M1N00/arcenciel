document.addEventListener("DOMContentLoaded", function () {
  var firebaseConfig = {
      apiKey: "AIzaSyB9xEmB-83GBS5fDRrmo7zPBWhReC3QkkE",
      authDomain: "backend-jardin-enfant.firebaseapp.com",
      projectId: "backend-jardin-enfant",
      storageBucket: "backend-jardin-enfant.firebasestorage.app",
      messagingSenderId: "840177966004",
      appId: "1:840177966004:web:c265a2b1477356ec6570e1"
  };
  firebase.initializeApp(firebaseConfig);
  var storage = firebase.storage();
  emailjs.init("u0luYOls1ADrXhG0M");

  const dropZone = document.getElementById("dropZone");
  const fileInput = document.getElementById("fileInput");
  const fileListDisplay = document.getElementById("fileList");
  let selectedFiles = [];

  dropZone.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", (event) => {
      selectedFiles = Array.from(event.target.files);
      displayFileNames();
  });

  dropZone.addEventListener("dragover", (event) => {
      event.preventDefault();
      dropZone.classList.add("dragover");
  });

  dropZone.addEventListener("dragleave", () => {
      dropZone.classList.remove("dragover");
  });

  dropZone.addEventListener("drop", (event) => {
      event.preventDefault();
      dropZone.classList.remove("dragover");
      selectedFiles = Array.from(event.dataTransfer.files);
      displayFileNames();
  });

  function displayFileNames() {
      fileListDisplay.innerHTML = selectedFiles.map(file => `<li>${file.name}</li>`).join("");
  }

  document.getElementById("uploadForm").addEventListener("submit", async function (event) {
      event.preventDefault();
      if (selectedFiles.length === 0) {
          alert("Sélectionne au moins un fichier !");
          return;
      }

      try {
          document.getElementById('BOUTON').disabled = true;
          let fileLinks = [];

          for (const file of selectedFiles) {
              const storageRef = storage.ref('uploads/' + file.name);
              const snapshot = await storageRef.put(file);
              const downloadURL = await snapshot.ref.getDownloadURL();
              fileLinks.push(downloadURL);
          }

          const emailParams = {
              file_urls: fileLinks.join("\n")
          };

          await emailjs.send("service_5djo6mt", "template_jqdy4fj", emailParams, "u0luYOls1ADrXhG0M");
          alert("Fichiers envoyés !");
      } catch (error) {
          console.error("Erreur lors de l'upload ou l'envoi de l'email :", error);
          alert("Échec de l'envoi !");
      }
  });
});
