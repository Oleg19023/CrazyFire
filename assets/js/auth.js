// // Импортируем необходимые функции из Firebase
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// // Инициализируем аутентификацию
// const auth = getAuth();

// // Функция для регистрации пользователя
// export async function register(email, password) {
//   try {
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     console.log("Registered:", userCredential.user);
//   } catch (error) {
//     console.error("Error during registration:", error);
//   }
// }

// // Функция для входа пользователя
// export async function login(email, password) {
//   try {
//     const userCredential = await signInWithEmailAndPassword(auth, email, password);
//     console.log("Logged in:", userCredential.user);
//   } catch (error) {
//     console.error("Error during login:", error);
//   }
// }
