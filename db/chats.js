import { arrayUnion, collection, doc, getDoc, onSnapshot, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { auth, db } from "./config";
import { ToastAndroid } from "react-native";

async function getChatById(id) {
    try {
        const docRef = doc(db, 'chats', id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            return { ...docSnap.data(), id: docSnap.id }
        } else {
            return null
        }
    } catch (err) {
        console.log('Error reading chat document:', err);
    }
}

async function sendMessage(chatId, message) {
    try {
        const docRef = doc(db, 'chats', chatId)
        const date = new Date()
        let formattedDate = date.getHours() + ":" + date.getMinutes()
        if (date.getHours() < 12) {
            formattedDate += 'am'
        } else {
            formattedDate += 'pm'
        }

        await updateDoc(docRef, {
            messages: arrayUnion({
                message: message,
                sender: auth.currentUser.uid,
                sentAt: formattedDate
            }),
            updatedAt: serverTimestamp()
        })
    } catch (err) {
        console.log('Error sending message:', err);
        ToastAndroid.show("Couldn't send the message", ToastAndroid.SHORT)
    }
}

export { getChatById, sendMessage }