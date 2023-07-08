import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAWlpG_GlgdWD2xiEUSFxh72HZBd8UD5rM",
  authDomain: "bubbles-1ab82.firebaseapp.com",
  projectId: "bubbles-1ab82",
  storageBucket: "bubbles-1ab82.appspot.com",
  messagingSenderId: "547883116788",
  appId: "1:547883116788:web:19fca08658b094a38316a1",
  measurementId: "G-TJWCDLG3QN"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)

export { auth }