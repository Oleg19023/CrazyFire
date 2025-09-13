const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { onDocumentCreated } = require("firebase-functions/v2/firestore"); // <<< ИМПОРТИРУЕМ НОВЫЙ МОДУЛЬ

// Инициализируем Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// ID цен из Stripe
const PRICE_ID_100_COINS = "price_1RooPICx81tTXrrEXssJWwaY";
const PRICE_ID_500_COINS = "price_1RooPiCx81tTXrrEcmQetKvN";
const PRICE_ID_1000_COINS = "price_1RooQ9Cx81tTXrrEohBpRACs";
// -------------------------

/**
 * Эта облачная функция автоматически запускается, когда расширение Stripe
 * создает новый документ об успешном платеже в Firestore.
 */
exports.grantCoinsOnSuccessfulPayment = onDocumentCreated("customers/{userId}/payments/{paymentId}", async (event) => {
  
    const snap = event.data;
    if (!snap) {
      functions.logger.error("Нет данных в событии onDocumentCreated.");
      return null;
    }

    const paymentData = snap.data();
    const userId = event.params.userId;

    // 1. Проверяем, что платеж действительно прошел успешно
    if (paymentData.status !== "succeeded") {
      functions.logger.info(`Платеж ${snap.id} не имеет статуса 'succeeded'. Начисление отменено.`);
      return null;
    }

    // 2. Определяем, сколько монет нужно начислить
    let coinsToAdd = 0;
    if (paymentData.items && paymentData.items.length > 0) {
      const priceId = paymentData.items[0].price.id;

      switch (priceId) {
        case PRICE_ID_100_COINS:
          coinsToAdd = 100;
          break;
        case PRICE_ID_500_COINS:
          coinsToAdd = 500;
          break;
        case PRICE_ID_1000_COINS:
          coinsToAdd = 1000;
          break;
        default:
          functions.logger.warn(`Неизвестный Price ID: ${priceId} для пользователя ${userId}. Монеты не начислены.`);
          return null;
      }
    } else {
        functions.logger.error(`В данных о платеже ${snap.id} отсутствуют товары (items).`);
        return null;
    }

    // 3. Безопасно начисляем монеты на баланс пользователя
    const userRef = db.collection("users").doc(userId);

    try {
      await userRef.update({
        balance: admin.firestore.FieldValue.increment(coinsToAdd),
      });
      
      functions.logger.log(`Успешно начислено ${coinsToAdd} FireCoins пользователю ${userId}.`);

      const currency = paymentData.currency.toUpperCase();
      const amountPaid = paymentData.amount / 100;

      await userRef.collection("transactions").add({
          amount: coinsToAdd,
          amount_paid: amountPaid,
          currency: currency,
          type: 'deposit_stripe',
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          paymentId: snap.id,
          status: 'completed',
      });

      return { status: "success", message: `Начислено ${coinsToAdd} монет.` };

    } catch (error) {
      functions.logger.error(`Ошибка при начислении монет пользователю ${userId}:`, error);
      return { status: "error", message: "Ошибка при обновлении баланса." };
    }
});

// functions/index.js

const { onCall } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/v2/params");
const { logger } = require("firebase-functions");
const { GoogleGenerativeAI } = require("@google/genai"); // <<< ИМПОРТИРУЕМ НОВЫЙ SDK

// "Провозглашаем" наш секрет
const geminiApiKey = defineSecret("GEMINI_KEY");

// Наша единственная функция, которая будет общаться с Gemini
exports.callGemini = onCall({ secrets: [geminiApiKey] }, async (request) => {
    const prompt = request.data.prompt;

    // Простая и надежная проверка
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
        logger.warn("Функция вызвана без промпта.", { receivedData: request.data });
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a non-empty "prompt" string.');
    }

    try {
        // --- НОВЫЙ СПОСОБ РАБОТЫ ЧЕРЕЗ SDK ---
        
        // 1. Инициализируем клиент, передавая ему ключ из секрета
        const genAI = new GoogleGenerativeAI(geminiApiKey.value());

        // 2. Выбираем модель
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }); // Рекомендуется использовать 1.5-flash для большей стабильности

        // 3. Генерируем контент
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        logger.info("Успешно получен ответ от Gemini SDK.");
        return { text: text };

    } catch (error) {
        logger.error("Ошибка при работе с @google/genai SDK:", error);
        throw new functions.https.HttpsError('internal', 'Произошла ошибка при обращении к AI.');
    }
});