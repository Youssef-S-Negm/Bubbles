import { doc, getDoc } from "firebase/firestore";
import { db } from "./config";

async function getChatById(id) {
    try {
        const docRef = doc(db, 'chats', id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            return {...docSnap.data(), id: docSnap.id}
        } else {
            return null
        }
    } catch (err) {
        console.log('Error reading chat document:', err);
    }
}

export { getChatById }