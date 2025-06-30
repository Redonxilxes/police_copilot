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
function captchaValido(idDiv) {
  const widget = document.querySelector(`#${idDiv} iframe`);
  const name = widget?.getAttribute("name");
  const response = grecaptcha.getResponse(name);
  if (!response) {
    alert("Por favor, verifica que no eres un robot.");
    return false;
  }
  return true;
}

// Mostrar y ocultar modales
function mostrarRegistro() {
  document.getElementById("modal-registro").style.display = "flex";
}
function cerrarRegistro() {
  document.getElementById("modal-registro").style.display = "none";
}
function mostrarPolitica() {
  document.getElementById("modal-privacidad").style.display = "block";
}
function cerrarModal() {
  document.getElementById("modal-privacidad").style.display = "none";
}

// Registro
function register() {
  if (!captchaValido("captcha-registro")) return;

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

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      alert("¡Registro exitoso!");
      cerrarRegistro();
      window.open("chat.html", "_blank");
    })
    .catch((error) => alert(error.message));
}

// Login
function login() {
  if (!captchaValido("captcha-login")) return;

  const email = document.getElementById("email-login").value;
  const password = document.getElementById("password-login").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "chat.html";
    })
    .catch((error) => {
      alert("Error al iniciar sesión: " + error.message);
    });
}

// Recuperación de contraseña
function resetPassword() {
  const email = document.getElementById("email-login").value;

  if (!email) {
    alert("Ingresa tu correo para recuperar la contraseña.");
    return;
  }

  auth.sendPasswordResetEmail(email)
    .then(() => alert("Revisa tu correo para restablecer tu contraseña."))
    .catch((error) => alert(error.message));
}

// Chat GPT (llamada a backend)
function sendMessage() {
  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  const message = input.value.trim();
  if (message === "") return;

  chatBox.innerHTML += `<div><strong>Tú:</strong> ${message}</div>`;
  input.value = "";

  fetch("/api/openai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  })
  .then((res) => res.json())
  .then((data) => {
    chatBox.innerHTML += `<div><strong>GPT:</strong> ${data.respuesta}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  })
  .catch((err) => {
    console.error(err);
    chatBox.innerHTML += `<div><strong>GPT:</strong> Error al obtener respuesta.</div>`;
  });
}
