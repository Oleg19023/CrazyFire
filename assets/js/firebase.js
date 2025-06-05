// import { initializeApp } from "firebase/app";
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "",
//   authDomain: "",
//   projectId: "",
//   storageBucket: "",
//   messagingSenderId: "",
//   appId: "",
//   measurementId: ""
// };

// // Инициализация Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

// // Функция для входа в систему
// export async function loginEmailPassword(email, password) {
//   try {
//     const userCredential = await signInWithEmailAndPassword(auth, email, password);
//     console.log("User logged in:", userCredential.user);
//   } catch (error) {
//     console.error("Login error:", error.message);
//   }
// }

// export { auth };