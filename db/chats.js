import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDoc,
    onSnapshot,
    query,
    serverTimestamp,
    updateDoc
} from "firebase/firestore";
import { auth, db, storage } from "./config";
import { ToastAndroid } from "react-native";
import CryptoJS from 'react-native-crypto-js'
import { deleteObject, getDownloadURL, getMetadata, ref, uploadBytes } from "firebase/storage";
import * as FileSystem from 'expo-file-system'

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
        console.log(message);
        const docRef = doc(db, 'chats', chatId)
        const date = new Date()
        let cipherText
        const urls = []

        if (message.text.length > 0) {
            if (!process.env.EXPO_PUBLIC_TEXT_KEY) {
                throw new Error('Encryption key is not found')
            } else {
                cipherText = CryptoJS.AES.encrypt(message.text, process.env.EXPO_PUBLIC_TEXT_KEY).toString()
            }
        }

        for (let i = 0; i < message.files.length; i++) {
            const date = new Date()
            const formattedDate = "" + date.getDay() + date.getMonth() + date.getFullYear() + date.getHours() + date.getMinutes() + date.getSeconds()
            const mimeType = message.files[i].mimeType
            const fileFormat = mimeType.split('/')[1]
            const storageRef = ref(storage, `chats/${chatId}/attachments/${formattedDate}.${fileFormat}`)

            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest()
                xhr.onload = function () {
                    resolve(xhr.response)
                }
                xhr.onerror = function (e) {
                    console.log(e);
                    reject(new TypeError("Network request failed"))
                }
                xhr.responseType = 'blob'
                xhr.open('GET', message.files[i].uri, true)
                xhr.send(null)
            })

            await uploadBytes(storageRef, blob, { contentType: mimeType })

            const metadata = await getMetadata(storageRef)
            const customMetadata = {
                mimeType: metadata.contentType,
                name: metadata.name,
                url: await getDownloadURL(storageRef)
            }

            blob.close()
            urls.push(customMetadata)
        }

        await updateDoc(docRef, {
            messages: arrayUnion({
                message: cipherText ? cipherText : null,
                sender: auth.currentUser.uid,
                sentAt: date.toISOString(),
                attachments: urls
            }),
            updatedAt: serverTimestamp()
        })
    } catch (err) {
        console.log('Error sending message:', err);
        ToastAndroid.show("Couldn't send the message. Try again later.", ToastAndroid.SHORT)
    }
}

async function deleteMessage(chatId, message) {
    try {
        const docRef = doc(db, 'chats', chatId)

        for (let i = 0; i < message.attachments.length; i++) {
            const storageRef = ref(storage, `chats/${chatId}/attachments/${message.attachments[i].name}`)
            await deleteObject(storageRef)
        }

        await updateDoc(docRef, {
            messages: arrayRemove(message)
        })

        ToastAndroid.show('Message deleted!', ToastAndroid.SHORT)
    } catch (err) {
        console.log("Couldn't delete message:", err);
        ToastAndroid.show("Couldn't delete message. Try again later.", ToastAndroid.LONG)
    }
}

function decryptMessage(message) {
    let bytes

    if (!process.env.EXPO_PUBLIC_TEXT_KEY) {
        throw new Error("Decryption key is not found")
    } else {
        bytes = CryptoJS.AES.decrypt(message, process.env.EXPO_PUBLIC_TEXT_KEY)
        return bytes.toString(CryptoJS.enc.Utf8)
    }
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
            allParticipants: [auth.currentUser.uid],
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
            allParticipants: arrayUnion(userId),
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

async function removeUserFromGroupChat(chatId, userId, userRole) {
    try {
        const chatRef = doc(db, 'chats', chatId)
        const userRef = doc(db, 'users', userId)

        await updateDoc(chatRef, {
            between: arrayRemove({
                id: userId,
                role: userRole
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

async function setUserAsGroupAdmin(chatId, userId) {
    try {
        const chatRef = doc(db, 'chats', chatId)
        const chat = await getChatById(chatId)
        const between = chat.between

        for (let i = 0; i < between.length; i++) {
            if (between[i].id === userId) {
                between[i].role = 'admin'
                break
            }
        }

        await updateDoc(chatRef, {
            between: between,
            updatedAt: serverTimestamp()
        })

        ToastAndroid.show("New admin added", ToastAndroid.SHORT)
    } catch (err) {
        console.log(err)
        ToastAndroid.show("Couldn't add admin. Try again later", ToastAndroid.LONG)
    }
}

async function changeGroupName(groupName, chatId) {
    try {
        const chatDocRef = doc(db, 'chats', chatId)

        await updateDoc(chatDocRef, {
            groupName: groupName,
            updatedAt: serverTimestamp()
        })

        ToastAndroid.show('Group name updated!', ToastAndroid.LONG)
    } catch (err) {
        console.log('Error changing group name:', err);
        ToastAndroid.show("Couldn't change group name. Try again later.", ToastAndroid.LONG)
    }
}

async function changeGroupPhoto(imageUri, chatId) {
    try {
        const storageRef = ref(storage, `/chats/group_chat_pictures/${chatId}.png`)
        const chatDocRef = doc(db, 'chats', chatId)
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.onload = function () {
                resolve(xhr.response)
            }
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError("Network request failed"))
            }
            xhr.responseType = 'blob'
            xhr.open('GET', imageUri, true)
            xhr.send(null)
        })

        await uploadBytes(storageRef, blob, { contentType: 'image/png' })
        blob.close()

        const url = await getDownloadURL(storageRef)

        await updateDoc(chatDocRef, {
            photoURL: url,
            updatedAt: serverTimestamp()
        })

        ToastAndroid.show('Group chat photo updated!', ToastAndroid.LONG)
    } catch (err) {
        console.log('Error updating group chat photo:', err);
        ToastAndroid.show("Couldn't change group chat photo. Try again later.", ToastAndroid.LONG)
    }
}

async function downloadAttachment(url, fileName, chatId) {
    try {
        const directory = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}/${chatId}/attachments/`)

        if (!directory.exists) {
            await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}/${chatId}/attachments/`, { intermediates: true })
        }

        await FileSystem.downloadAsync(url, `${directory.uri}/${fileName}`)

        ToastAndroid.show('Download complete', ToastAndroid.LONG)
    } catch (err) {
        console.log('Error downloading file:', err);
        ToastAndroid.show("Couldn't download file. Try again later.", ToastAndroid.LONG)
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
    removeUserFromGroupChat,
    setUserAsGroupAdmin,
    changeGroupName,
    changeGroupPhoto,
    downloadAttachment
}