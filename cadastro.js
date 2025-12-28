
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Configurações do seu Firebase (SUBSTITUA PELOS SEUS DADOS AQUI)
const firebaseConfig = {
    apiKey: "AIzaSyAYaN88jxj2g5chrLGWpLdzV0KFupeN82s",
    authDomain: "gamestorm-fef7e.firebaseapp.com",
    projectId: "gamestorm-fef7e",
    storageBucket: "gamestorm-fef7e.firebasestorage.app",
    messagingSenderId: "568454886222",
    appId: "1:568454886222:web:1897bd53af881a3587a41f"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const form = document.getElementById('form-cadastro');
const errorDiv = document.getElementById('error-message');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // 1. Validações básicas de front-end
    if (password !== confirmPassword) {
    showError("As senhas não coincidem.");
    return;
    }

    try {
    // 2. REGRA: Verificar se o Nome de Usuário já existe no banco
    const q = query(collection(db, "usuarios"), where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        showError("Este nome de usuário já está em uso. Escolha outro.");
        return;
    }

    // 3. Criar usuário no Firebase Auth (E-mail e Senha)
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 4. Salvar dados extras (username) no Firestore
    await setDoc(doc(db, "usuarios", user.uid), {
        username: username,
        email: email,
        createdAt: new Date()
    });

    alert("Conta criada com sucesso! Redirecionando...");
    window.location.href = "login.html";

    } catch (error) {
    console.error(error);
    if (error.code === 'auth/email-already-in-use') {
        showError("Este e-mail já está cadastrado.");
    } else {
        showError("Erro ao criar conta: " + error.message);
    }
    }
});

function showError(msg) {
    errorDiv.innerText = msg;
    errorDiv.style.display = 'block';
}

// Limpar erro ao digitar
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
    errorDiv.style.display = 'none';
    });
});