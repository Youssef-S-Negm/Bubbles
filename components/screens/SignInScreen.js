import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import SignInButton from '../buttons/SignInButton'
import SignInWithGoogleButton from '../buttons/SignInWithGoogleButton'
import CreateAccountButton from '../buttons/CreateAccountButton'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'

const SignInScreen = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (
        <View style={styles.container}>
            <Text style={styles.greetingText}>Welcome to Bubbles!</Text>
            <Text style={styles.normalText}>Please enter your credentials</Text>
            <View style={styles.inputView}>
                <AntDesign name='mail' style={styles.iconStyle} />
                <TextInput
                    placeholder='user@example.com'
                    keyboardType='email-address'
                    style={styles.textInput}
                    value={email}
                    onChangeText={e => setEmail(e)}
                />
            </View>
            <View style={{ height: 16 }}></View>
            <View style={styles.inputView}>
                <MaterialCommunityIcons name='form-textbox-password' style={styles.iconStyle}/>
                <TextInput
                    placeholder='Password'
                    secureTextEntry={true}
                    style={styles.textInput}
                    value={password}
                    onChangeText={(e) => setPassword(e)}
                />
            </View>
            <View style={styles.forgotPasswordView}>
                <Text
                    style={styles.forgotPasswordText}
                    onPress={() => {
                        navigation.navigate('Forgot password')
                    }}
                >
                    forgot password?
                </Text>
            </View>
            <View style={{ height: 8 }} />
            <SignInButton email={email} password={password} />
            <View style={{ height: 8 }} />
            <SignInWithGoogleButton />
            <Text style={styles.normalText}>or</Text>
            <CreateAccountButton navigation={navigation} />
        </View>
    )
}

export default SignInScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 32,
        backgroundColor: 'white',
        paddingHorizontal: 8
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
        marginLeft: 8
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
    },
    iconStyle: {
        fontSize: 20
    },
    inputView: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 6,
        padding: 8
    }
})