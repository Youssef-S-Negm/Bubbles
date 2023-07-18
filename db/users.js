import { addDoc, arrayRemove, arrayUnion, collection, doc, getDoc, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { auth, db } from "./config";
import { updateProfile } from "firebase/auth";

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
        return
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
    const userRef1 = doc(db, 'users', auth.currentUser.uid)
    const userRef2 = doc(db, 'users', userId2)

    const chatDocRef = await addDoc(collection(db, 'chats'), {
        chatType: 'private',
        between: [auth.currentUser.uid, userId2],
        messages: [],
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

export { addUserToDb, getUserById, updateUserInfo, userSubscribeListener, sendRequest, connectUsers, refuseConnection }
