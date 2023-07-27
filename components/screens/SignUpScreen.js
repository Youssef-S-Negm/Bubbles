import { StyleSheet, TextInput, View } from 'react-native'
import { useState } from 'react'
import SignUpButton from '../buttons/SignUpButton'
import { Ionicons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'

const SignUpScreen = ({ navigation }) => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    return (
        <View style={styles.container}>
            <View style={styles.textInputView}>
                <Ionicons name='person-outline' style={styles.icon} />
                <TextInput
                    placeholder='Username'
                    style={styles.textInput}
                    value={username}
                    onChangeText={e => setUsername(e)}
                />
            </View>
            <View style={styles.textInputView}>
                <AntDesign name="mail" style={styles.icon} />
                <TextInput
                    placeholder='user@example.com'
                    keyboardType='email-address'
                    style={styles.textInput}
                    value={email}
                    onChangeText={e => setEmail(e)}
                />
            </View>
            <View style={styles.textInputView}>
                <MaterialCommunityIcons name='form-textbox-password' style={styles.icon} />
                <TextInput
                    placeholder='Password'
                    style={styles.textInput}
                    secureTextEntry={true}
                    value={password}
                    onChangeText={e => setPassword(e)}
                />
            </View>
            <View style={styles.textInputView}>
                <MaterialCommunityIcons name='form-textbox-password' style={styles.icon} />
                <TextInput
                    placeholder='Confirm password'
                    style={styles.textInput}
                    secureTextEntry={true}
                    value={confirmPassword}
                    onChangeText={e => setConfirmPassword(e)}
                />
            </View>
            <View style={{ height: 32 }} />
            <View style={styles.signUpButtonView}>
                <SignUpButton
                    email={email}
                    password={password}
                    confirmPassword={confirmPassword}
                    username={username}
                    navigation={navigation}
                />
            </View>
        </View>
    )
}

export default SignUpScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
        paddingTop: 8,
        paddingHorizontal: 8
    },
    nameView: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        paddingBottom: 8
    },
    textInput: {
        alignSelf: 'stretch',
        marginLeft: 8
    },
    signUpButtonView: {
        flexDirection: 'row'
    },
    textInputView: {
        width: '100%',
        flexDirection: 'row',
        padding: 8,
        borderWidth: 1,
        borderRadius: 6,
        marginBottom: 8,
        alignItems: 'center'
    },
    icon: {
        fontSize: 20
    }
})