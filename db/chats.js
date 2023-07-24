import { arrayRemove, arrayUnion, collection, doc, getDoc, onSnapshot, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
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

        await updateDoc(docRef, {
            messages: arrayUnion({
                message: message,
                sender: auth.currentUser.uid,
                sentAt: date.toISOString()
            }),
            updatedAt: serverTimestamp()
        })
    } catch (err) {
        console.log('Error sending message:', err);
        ToastAndroid.show("Couldn't send the message", ToastAndroid.SHORT)
    }
}

async function deleteMessage(chatId, sentAt, message) {
    try {
        const docRef = doc(db, 'chats', chatId)

        await updateDoc(docRef, {
            messages: arrayRemove({
                sender: auth.currentUser.uid,
                sentAt: sentAt,
                message: message
            })
        })

        ToastAndroid.show('Message deleted!', ToastAndroid.SHORT)
    } catch (err) {
        console.log("Couldn't delete message:", err);
    }
}

export { getChatById, sendMessage, deleteMessage }