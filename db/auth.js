import { createUserWithEmailAndPassword } from "@firebase/auth";
import { auth } from "./config";

async function signUp(email, password, confirmPassword, firstName, lastName) {
    if (password === "" || email === "" || firstName === "" || lastName === "") {
        alert("Empty fields aren't allowed")
    } else {
        if (password === confirmPassword) {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
                .catch(err => {
                    if (err.code === 'auth/email-already-in-use') {
                        alert("Email already exists. Try signing in to your account.")
                    }
                    if (err.code === 'auth/invalid-email') {
                        alert("Invalid email address!")
                    }
                })

            if (userCredential && auth.currentUser) {
                updateProfile(auth.currentUser, {
                    displayName: firstName + " " + lastName
                })
            }
        } else {
            alert("Password and confirm password doesn't match")
        }
    }
}

export { signUp }