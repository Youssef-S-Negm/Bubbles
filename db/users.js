import { collection, doc, getDoc, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore";
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
            photoURL: user.photoURL
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
                phoneNumber: phoneNumber.length === 0? null: phoneNumber
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

export { addUserToDb, getUserById, updateUserInfo, userSubscribeListener }