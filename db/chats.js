import { addDoc, arrayRemove, arrayUnion, collection, doc, getDoc, onSnapshot, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "./config";
import { ToastAndroid } from "react-native";
import CryptoJS from 'react-native-crypto-js'

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
        let cipherText = CryptoJS.AES.encrypt(message, process.env.EXPO_PUBLIC_TEXT_KEY).toString()

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
        ToastAndroid.show("Couldn't delete message. Try again later.", ToastAndroid.LONG)
    }
}

function decryptMessage(message) {
    let bytes = CryptoJS.AES.decrypt(message, process.env.EXPO_PUBLIC_TEXT_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
}

function chatsSubscribeListener(callback) {
    const unsubscribe = onSnapshot(query(collection(db, "chats")), (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (callback) callback({ change });
        });
    });
    return unsubscribe;
}

async function createGroupChat(groupName) {
    try {
        const docSnap = await addDoc(collection(db, 'chats'), {
            groupName: groupName,
            chatType: 'group',
            between: [{
                id: auth.currentUser.uid,
                role: 'admin'
            }],
            messages: [],
            photoURL: null,
            updatedAt: serverTimestamp()
        })

        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            chats: arrayUnion(docSnap.id)
        })

        ToastAndroid.show(`${groupName} group created successfully!`, ToastAndroid.LONG)
    } catch (err) {
        console.log("Couldn't create group:", err);
        ToastAndroid.show("Couldn't create group. Try agian later!", ToastAndroid.LONG)
    }
}

async function addUserToGroupChat(chatId, userId) {
    try {
        const chatRef = doc(db, 'chats', chatId)
        const userRef = doc(db, 'users', userId)

        await updateDoc(chatRef, {
            between: arrayUnion({
                id: userId,
                role: 'user'
            }),
            updatedAt: serverTimestamp()
        })

        await updateDoc(userRef, {
            chats: arrayUnion(chatId)
        })
        ToastAndroid.show('User added to group', ToastAndroid.LONG)
    } catch (err) {
        console.log('Error adding user to group:', err);
        ToastAndroid.show("Couldn't add user to group. Try again later.", ToastAndroid.LONG)
    }
}

async function removeUserFromGroupChat(chatId, userId) {
    try {
        const chatRef = doc(db, 'chats', chatId)
        const userRef = doc(db, 'users', userId)

        await updateDoc(chatRef, {
            between: arrayRemove({
                id: userId,
                role: 'user'
            }),
            updatedAt: serverTimestamp()
        })

        await updateDoc(userRef, {
            chats: arrayRemove(chatId)
        })

        ToastAndroid.show('User removed from group.', ToastAndroid.SHORT)
    } catch (err) {
        console.log('Error removing user from group:', err);
        ToastAndroid.show("Couldn't remove user from group. Try again later", ToastAndroid.LONG)
    }
}

export {
    getChatById,
    sendMessage,
    deleteMessage,
    decryptMessage,
    chatsSubscribeListener,
    createGroupChat,
    addUserToGroupChat,
    removeUserFromGroupChat
}