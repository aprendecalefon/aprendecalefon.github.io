// Conexión con Firebase (cuentas y base de datos) — Aprende Calefón
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAy2aUZXwVSxApv5Ar_jUIERYxPEoRQeQ8",
  authDomain: "aprendecaldera.firebaseapp.com",
  projectId: "aprendecaldera",
  storageBucket: "aprendecaldera.firebasestorage.app",
  messagingSenderId: "110864520807",
  appId: "1:110864520807:web:37440db1c061a3811ba6c2"
};

// Correo(s) de administrador: el mismo que va en las reglas de Firestore
export const ADMIN_EMAILS = ["cursos.academiadelexito@gmail.com"];
export const MP_LINK = "https://mpago.la/25EDXe5";
export const WA = "https://wa.me/56993992990?text=";
export const DRIVE_FOLDER = "https://drive.google.com/drive/folders/1yR0QOfEu9D9z-yGz3OIviYX0-8WI-FKd";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider,
  sendPasswordResetEmail, signOut, updateProfile, doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, query, orderBy, limit, getDocs };

export const isAdmin = u => !!u && !!u.email && ADMIN_EMAILS.includes(u.email.toLowerCase());

// Crea el perfil del alumno la primera vez (siempre sin acceso; lo activa el administrador)
export async function ensureProfile(user, name) {
  const ref = doc(db, "users", user.uid);
  const s = await getDoc(ref);
  if (s.exists()) return s.data();
  const data = { name: (name || user.displayName || "").trim(), email: (user.email || "").toLowerCase(), access: false, createdAt: serverTimestamp() };
  await setDoc(ref, data);
  return data;
}

export function authError(e) {
  const c = (e && e.code) || "";
  const M = {
    "auth/invalid-email": "El correo no es válido.",
    "auth/missing-password": "Escribe tu contraseña.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/email-already-in-use": "Ese correo ya tiene una cuenta. Entra con “Ingresar”.",
    "auth/invalid-credential": "Correo o contraseña incorrectos.",
    "auth/wrong-password": "Correo o contraseña incorrectos.",
    "auth/user-not-found": "No hay una cuenta con ese correo.",
    "auth/too-many-requests": "Demasiados intentos. Espera un momento e intenta de nuevo.",
    "auth/popup-closed-by-user": "Se cerró la ventana de Google antes de terminar.",
    "auth/network-request-failed": "Sin conexión. Revisa tu internet.",
    "auth/unauthorized-domain": "Este dominio no está autorizado en Firebase (Authentication → Dominios autorizados)."
  };
  return M[c] || "Ocurrió un error. Intenta de nuevo." + (c ? " (" + c + ")" : "");
}
