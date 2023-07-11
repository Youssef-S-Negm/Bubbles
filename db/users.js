import { doc, setDoc } from "firebase/firestore";
import { db } from "./config";

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

export { addUserToDb }