import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithCredential,
    signOut
} from "@firebase/auth";
import { auth } from "./config";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { addUserToDb } from "./users";

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
                await addUserToDb(auth.currentUser)
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

async function resetPassword(email) {
    await sendPasswordResetEmail(auth, email)
        .then(() => alert("Please, follow the link sent to your e-mail."))
        .catch(err => {
            console.log(err.code)
            if (err.code === "auth/missing-email") {
                alert("E-mail field is empty!")
            }
            if (err.code === "auth/invalid-email") {
                alert("Invalid E-mail!")
            }
            if (err.code === "auth/user-not-found") {
                alert("User doesn't exist. Try creating an account.")
            }
        })
}

async function signInWithGoogle() {
    GoogleSignin.configure({
        webClientId: '547883116788-lqgq2ump6b2974odd8rhd7gug0ql0ref.apps.googleusercontent.com'
    })

    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
    const { idToken } = await GoogleSignin.signIn()
    const googleCredential = GoogleAuthProvider.credential(idToken)
    await signInWithCredential(auth, googleCredential)
    await addUserToDb(auth.currentUser)
}

async function signOutFromApp() {
    try {
        await signOut(auth)
    } catch (err) {
        alert("Couldn't sign out. Please, try again.")
    }
}

export { signUp, signIn, resetPassword, signInWithGoogle, signOutFromApp }