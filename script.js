import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// SUAS CONFIGURAÇÕES DO FIREBASE (Copie as mesmas que usou no cadastro/login)
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "seu-id",
    appId: "seu-app-id"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Elementos da Interface
const loginLink = document.getElementById('login-link');
const userProfile = document.getElementById('user-profile');
const userNameSpan = document.getElementById('user-name');
const logoutBtn = document.getElementById('logout-btn');
const userDropdown = document.getElementById('user-dropdown');

// 1. Observador de Estado de Autenticação
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // USUÁRIO LOGADO
        loginLink.style.display = 'none';
        userProfile.style.display = 'flex';

        // Busca o nome real no Firestore
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            userNameSpan.innerText = docSnap.data().username;
        } else {
            userNameSpan.innerText = "Jogador";
        }
    } else {
        // USUÁRIO DESLOGADO
        loginLink.style.display = 'block';
        userProfile.style.display = 'none';
    }
});

// 2. Lógica do Dropdown (Abrir/Fechar ao clicar no perfil)
userProfile.addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
});

// Fechar dropdown ao clicar fora
window.addEventListener('click', () => {
    userDropdown.style.display = 'none';
});

// 3. Lógica de Logout
logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signOut(auth).then(() => {
        alert("Você saiu da arena!");
        window.location.reload();
    });
});
