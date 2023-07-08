import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "@firebase/auth";
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
                await updateProfile(auth.currentUser, {
                    displayName: firstName + " " + lastName
                })
            }
        } else {
            alert("Password and confirm password doesn't match")
        }
    }
}

async function signIn(email, password) {
    if (email === "" || password === "") {
        alert("Empty fields aren't allowed")
    } else {
        await signInWithEmailAndPassword(auth, email, password)
            .catch(err => {
                console.log(err.code)
                if (err.code === "auth/user-not-found") {
                    alert("User doesn't exist. Try creating an account")
                }
                if (err.code === "auth/wrong-password") {
                    alert("Wrong password")
                }
            })
    }
}

export { signUp, signIn }