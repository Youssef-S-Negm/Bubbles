import { StyleSheet, TextInput, View } from 'react-native'
import { useState } from 'react'
import SignUpButton from '../buttons/SignUpButton'

const SignUpScreen = () => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    return (
        <View style={styles.container}>
            <View style={styles.nameView}>
                <TextInput
                    placeholder='First name'
                    style={styles.nameTextInput}
                    value={firstName}
                    onChangeText={e => setFirstName(e)}
                />
                <View style={{ width: 6 }} />
                <TextInput
                    placeholder='Last name'
                    style={styles.nameTextInput}
                    value={lastName}
                    onChangeText={e => setLastName(e)}
                />
            </View>
            <TextInput
                placeholder='user@example.com'
                keyboardType='email-address'
                style={styles.otherTextInputs}
                value={email}
                onChangeText={e => setEmail(e)}
            />
            <View style={{ height: 8 }} />
            <TextInput
                placeholder='Password'
                style={styles.otherTextInputs}
                secureTextEntry={true}
                value={password}
                onChangeText={e => setPassword(e)}
            />
            <View style={{ height: 8 }} />
            <TextInput
                placeholder='Confirm password'
                style={styles.otherTextInputs}
                secureTextEntry={true}
                value={confirmPassword}
                onChangeText={e => setConfirmPassword(e)}
            />
            <View style={{ height: 32 }} />
            <View style={styles.signUpButtonView}>
                <SignUpButton />
            </View>
        </View>
    )
}

export default SignUpScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    nameView: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        paddingBottom: 8
    },
    nameTextInput: {
        flex: 0.5,
        borderWidth: 1,
        padding: 8,
        borderRadius: 6,
    },
    otherTextInputs: {
        alignSelf: 'stretch',
        borderWidth: 1,
        padding: 8,
        borderRadius: 6,
    },
    signUpButtonView: {
        flexDirection: 'row'
    }
})