import { arrayRemove, arrayUnion, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "./config";
import { ToastAndroid } from "react-native";
import CryptoJS from 'react-native-crypto-js'
import { TEXT_KEY } from '@env'

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
        let cipherText = CryptoJS.AES.encrypt(message, TEXT_KEY).toString()

        await updateDoc(docRef, {
            messages: arrayUnion({
                message: cipherText,
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

function decryptMessage(message) {
    let bytes = CryptoJS.AES.decrypt(message, TEXT_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
}

export { getChatById, sendMessage, deleteMessage, decryptMessage }