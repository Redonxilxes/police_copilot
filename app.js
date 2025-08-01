// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCB1oPPffremu8LpYgci3IMlOiPHO2xniM",
  authDomain: "police-copilot-trafico-esp.firebaseapp.com",
  projectId: "police-copilot-trafico-esp",
  storageBucket: "police-copilot-trafico-esp.appspot.com",
  messagingSenderId: "249020042812",
  appId: "1:249020042812:web:ea6102d42ee5a4e304bd39",
  measurementId: "G-5RXRM5ZLJY"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Verifica si el reCAPTCHA fue completado
function captchaValido(id) {
  const response = grecaptcha.getResponse(id);
  if (!response) {
    alert("Por favor, verifica que no eres un robot.");
    return false;
  }
  return true;
}

// Abre el modal de registro
function mostrarRegistro() {
  document.getElementById("modal-registro").style.display = "flex";
}

// Cierra el modal de registro
function cerrarRegistro() {
  document.getElementById("modal-registro").style.display = "none";
}

// Registro con campos adicionales
function register() {
  if (!captchaValido('recaptcha-registro')) return;

  const nombre = document.getElementById("nombre").value;
  const apellidos = document.getElementById("apellidos").value;
  const email = document.getElementById("email-registro").value;
  const telefono = document.getElementById("telefono").value;
  const password = document.getElementById("password-registro").value;
  const privacidad = document.getElementById("privacy-check").checked;

  if (!nombre || !apellidos || !email || !telefono || !password) {
    alert("Por favor completa todos los campos.");
    return;
  }

  if (!privacidad) {
    alert("Debes aceptar la política de protección de datos.");
    return;
  }

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => {
      alert("¡Registro exitoso!");
      cerrarRegistro();
      window.open("chat.html", "_blank");
    })
    .catch((error) => alert(error.message));
}

// Inicio de sesión básico
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Redirige al chat
      window.location.href = "chat.html";
    })
    .catch((error) => {
      alert("Error al iniciar sesión: " + error.message);
    });
}

// Recuperación de contraseña
function resetPassword() {
  const email = document.getElementById("email").value;

  if (!email) {
    alert("Ingresa tu correo para recuperar la contraseña.");
    return;
  }

  auth.sendPasswordResetEmail(email)
    .then(() => alert("Revisa tu correo para restablecer tu contraseña."))
    .catch((error) => alert(error.message));
}

// Chat simulado
function sendMessage() {
  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  const message = input.value.trim();
  if (message === "") return;

  chatBox.innerHTML += `<div class="mensaje usuario"><strong>Tú:</strong> ${message}</div>`;
  input.value = "";

  fetch("https://police-copilot.vercel.app/api/openai", { // Reemplaza con tu URL de Vercel
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message: message })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (data.error) {
      throw new Error(data.detalle || data.error);
    }
    chatBox.innerHTML += `<div class="mensaje gpt"><strong>GPT:</strong> ${data.reply}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  })
  .catch(error => {
    console.error("Error al obtener respuesta de GPT:", error);
    chatBox.innerHTML += `<div class="mensaje gpt"><strong>GPT:</strong> Hubo un error al responder: ${error.message}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  });
}
