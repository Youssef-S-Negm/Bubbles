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
    setDoc,
    updateDoc,
    where
} from "firebase/firestore";
import { auth, db, storage } from "./config";
import { updateProfile } from "firebase/auth";
import { ToastAndroid } from "react-native";
import { getChatById } from "./chats";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

async function addUserToDb(user) {
    try {
        const docRef = doc(db, 'users', user.uid)
        await setDoc(docRef, {
            id: user.uid,
            displayName: user.displayName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            photoURL: user.photoURL,
            connections: [],
            sentRequests: [],
            pendingRequests: [],
            chats: [],
            pendingRequestsSeen: true
        })
    } catch (err) {
        console.log("Error adding the document", err);
    }
}

async function getUserById(id) {
    try {
        const docRef = doc(db, 'users', id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            return docSnap.data()
        } else {
            return null
        }
    } catch (err) {
        console.log('Error reading the document', err);
    }
}

async function updateUserInfo(id, username, phoneNumber) {
    try {
        if (username.length === 0) {
            alert("Username can't be empty")
        } else {
            const docRef = doc(db, 'users', id)
            await updateProfile(auth.currentUser, {
                displayName: username,
                phoneNumber: phoneNumber
            })
            await updateDoc(docRef, {
                displayName: username,
                phoneNumber: phoneNumber.length === 0 ? null : phoneNumber
            })
        }
    } catch (err) {
        console.log("Couldn't update your profile:", err);
    }
}

function userSubscribeListener(id, callback) {
    const unsubscribe = onSnapshot(query(collection(db, "users"), where('id', '==', id)), (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (callback) callback({ change });
        });
    });
    return unsubscribe;
}

async function sendRequest(userToConnectId) {
    const currentUser = await getUserById(auth.currentUser.uid)
    if (currentUser.connections.includes(userToConnectId)) {
        alert('You are already connected!')
    }

    const currentUserRef = doc(db, 'users', auth.currentUser.uid)
    const userToConnectRef = doc(db, 'users', userToConnectId)

    await updateDoc(currentUserRef, {
        sentRequests: arrayUnion(userToConnectId)
    })
    await updateDoc(userToConnectRef, {
        pendingRequests: arrayUnion(auth.currentUser.uid),
        pendingRequestsSeen: false
    })
    ToastAndroid.show('Request sent!', ToastAndroid.SHORT)
}

async function connectUsers(userId2) {
    const currentUser = await getUserById(auth.currentUser.uid)

    if (currentUser.connections.includes(userId2)) {
        alert('You are already connected with this user')
    } else if (userId2 === auth.currentUser.uid) {
        alert("You can't connect with your self")
    } else {
        const userRef1 = doc(db, 'users', auth.currentUser.uid)
        const userRef2 = doc(db, 'users', userId2)
        const currentUser = await getUserById(auth.currentUser.uid)
        const userToBeAdded = await getUserById(userId2)
        const commonChatsId = currentUser.chats.filter(chatId => userToBeAdded.chats.includes(chatId))

        if (commonChatsId.length > 0) {
            const commonChats = await Promise.all(commonChatsId.map(getChatById))
            for (let i = 0; i < commonChats.length; i++) {
                if (commonChats[i].chatType === 'private') {
                    await updateDoc(doc(db, 'chats', commonChatsId[i]), {
                        usersStatus: 'connected',
                        updatedAt: serverTimestamp()
                    })
                    await updateDoc(userRef1, {
                        connections: arrayUnion(userId2),
                        pendingRequests: arrayRemove(userId2),
                        pendingRequestsSeen: true
                    })
                    await updateDoc(userRef2, {
                        connections: arrayUnion(auth.currentUser.uid),
                        sentRequests: arrayRemove(auth.currentUser.uid)
                    })
                }
            }
        } else {
            const chatDocRef = await addDoc(collection(db, 'chats'), {
                chatType: 'private',
                between: [auth.currentUser.uid, userId2],
                messages: [],
                usersStatus: 'connected',
                allAttachments: [],
                updatedAt: serverTimestamp()
            })

            await updateDoc(userRef1, {
                connections: arrayUnion(userId2),
                chats: arrayUnion(chatDocRef.id),
                pendingRequests: arrayRemove(userId2),
                pendingRequestsSeen: true
            })

            await updateDoc(userRef2, {
                connections: arrayUnion(auth.currentUser.uid),
                chats: arrayUnion(chatDocRef.id),
                sentRequests: arrayRemove(auth.currentUser.uid)
            })
        }
    }
}

async function refuseConnection(userId2) {
    const currentUserDocRef = doc(db, 'users', auth.currentUser.uid)
    const user2DocRef = doc(db, 'users', userId2)

    await updateDoc(currentUserDocRef, {
        pendingRequests: arrayRemove(userId2),
        pendingRequestsSeen: true
    })
    await updateDoc(user2DocRef, {
        sentRequests: arrayRemove(auth.currentUser.uid)
    })
}

async function cancelRequest(userToCancel) {
    const currentUserDocRef = doc(db, 'users', auth.currentUser.uid)
    const userToCancelRef = doc(db, 'users', userToCancel)
    const toBeCancelled = await getUserById(userToCancel)

    await updateDoc(currentUserDocRef, {
        sentRequests: arrayRemove(userToCancel)
    })

    if (toBeCancelled.pendingRequests.length === 1) {
        await updateDoc(userToCancelRef, {
            pendingRequests: arrayRemove(auth.currentUser.uid),
            pendingRequestsSeen: true
        })
    } else if (toBeCancelled.pendingRequests.length > 1) {
        await updateDoc(userToCancelRef, {
            pendingRequests: arrayRemove(auth.currentUser.uid),
        })
    }
}

async function disconnectUsers(userToRemoveId) {
    const currentUser = await getUserById(auth.currentUser.uid)
    const userToBeRemoved = await getUserById(userToRemoveId)
    const commonChatsId = currentUser.chats.filter(chatId => userToBeRemoved.chats.includes(chatId))
    const commonChats = await Promise.all(commonChatsId.map(getChatById))
    const currentUserRef = doc(db, 'users', auth.currentUser.uid)
    const userToBeRemovedRef = doc(db, 'users', userToRemoveId)

    for (let i = 0; i < commonChats.length; i++) {
        if (commonChats[i].chatType === 'private') {
            await updateDoc(doc(db, 'chats', commonChatsId[i]), {
                usersStatus: 'disconnected',
                updatedAt: serverTimestamp()
            })
        }
    }

    await updateDoc(currentUserRef, {
        connections: arrayRemove(userToRemoveId)
    })

    await updateDoc(userToBeRemovedRef, {
        connections: arrayRemove(auth.currentUser.uid)
    })
}

async function updateProfilePicture(fileUri) {
    try {
        const storageRef = ref(storage, `profile_pictures/${auth.currentUser.uid}.png`)
        const userDocRef = doc(db, 'users', auth.currentUser.uid)
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
            xhr.open('GET', fileUri, true)
            xhr.send(null)
        })

        await uploadBytes(storageRef, blob, { contentType: 'image/png' })
        blob.close()

        const url = await getDownloadURL(storageRef)
        
        await updateProfile(auth.currentUser, {
            photoURL: url
        })
        await updateDoc(userDocRef, {
            photoURL: url
        })

        ToastAndroid.show('Profile image updated', ToastAndroid.LONG)
    } catch (err) {
        console.log('Error changing profile image:', err);
        ToastAndroid.show("Couldn't change profile picture. Try again later.", ToastAndroid.LONG)
    }
}

export {
    addUserToDb,
    getUserById,
    updateUserInfo,
    userSubscribeListener,
    sendRequest,
    connectUsers,
    refuseConnection,
    cancelRequest,
    disconnectUsers,
    updateProfilePicture
}
