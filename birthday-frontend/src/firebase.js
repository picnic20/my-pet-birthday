// src/firebase.js (Reactody용 올바른 모습)
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCoaW7ZDVGqsTqNjMItuuC6Drmii9wylpo",
  authDomain: "stable-being-497702-i2.firebaseapp.com",
  projectId: "stable-being-497702-i2",
  storageBucket: "stable-being-497702-i2.firebasestorage.app",
  messagingSenderId: "460437137026",
  appId: "1:460437137026:web:065fe858287e8ea0a9369b",
  measurementId: "G-07MJPC7N9L"
};

const app = initializeApp(firebaseConfig);
// 2. 웹 분석 서비스 가동 (브라우저 환경 대응용)
if (typeof window !== "undefined") {
  getAnalytics(app);
};

// 3. ⭐ [핵심] App.jsx에서 불러다 쓸 진짜 실시간 인증 모듈 내보내기
export const auth = getAuth(app);