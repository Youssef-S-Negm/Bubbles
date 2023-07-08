import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import SignInButton from '../buttons/SignInButton'
import SignInWithGoogleButton from '../buttons/SignInWithGoogleButton'
import CreateAccountButton from '../buttons/CreateAccountButton'

const SignInScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (
        <View style={styles.container}>
            <Text style={styles.greetingText}>Welcome to Bubbles!</Text>
            <Text style={styles.normalText}>Please enter your credentials</Text>
            <TextInput
                placeholder='user@example.com'
                keyboardType='email-address'
                textAlign='center'
                style={styles.textInput}
                value={email}
                onChangeText={e => setEmail(e)}
            />
            <View style={{ height: 16 }}></View>
            <TextInput
                placeholder='Password'
                secureTextEntry={true}
                textAlign='center'
                style={styles.textInput}
                value={password}
                onChangeText={(e) => setPassword(e)}
            />
            <View style={styles.forgotPasswordView}>
                <Text
                    style={styles.forgotPasswordText}
                    onPress={() => {
                        //TODO
                    }}
                >
                    forgot password?
                </Text>
            </View>
            <View style={{ height: 8 }} />
            <SignInButton email={email} password={password}/>
            <View style={{height: 8}}/>
            <SignInWithGoogleButton />
            <Text style={styles.normalText}>or</Text>
            <CreateAccountButton />
        </View>
    )
}

export default SignInScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    greetingText: {
        fontSize: 24,
        fontWeight: 'bold',
        padding: 8
    },
    normalText: {
        fontSize: 24,
        padding: 8
    },
    textInput: {
        alignSelf: 'stretch',
        borderWidth: 1,
        padding: 8,
        borderRadius: 6,
    },
    forgotPasswordText: {
        textAlign: 'left',
        color: 'blue',
        textDecorationLine: 'underline'
    },
    forgotPasswordView: {
        alignSelf: 'stretch',
        paddingTop: 4,
        flexDirection: 'row',
    },
    signUpText: {
        textAlign: 'right'
    }
})