// import { initializeApp } from "firebase/app";
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyB-nLWTMjzrsfYiDtHeItdT3Aa2KAEWqoI",
//   authDomain: "crazyfire-app.firebaseapp.com",
//   projectId: "crazyfire-app",
//   storageBucket: "crazyfire-app.appspot.com",
//   messagingSenderId: "218958038563",
//   appId: "1:218958038563:web:07df108430af2145f45396",
//   measurementId: "G-X69JL6FMKQ"
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