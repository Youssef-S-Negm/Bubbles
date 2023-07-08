import { StyleSheet, Text, TextInput, View } from 'react-native'
import { useState } from 'react'
import SendEmailButton from '../buttons/SendEmailButton'

const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState('')

    return (
        <View style={styles.container}>
            <Text>Please, enter your E-mail</Text>
            <View style={{ height: 8 }} />
            <TextInput
                placeholder='user@example.com'
                style={styles.textInput}
                value={email}
                onChangeText={e => setEmail(e)}
                keyboardType='email-address'
            />
            <View style={{ height: 32 }} />
            <View style={styles.buttonView}>
                <SendEmailButton email={email} />
            </View>
        </View>
    )
}

export default ForgotPasswordScreen

const styles = StyleSheet.create({
    textInput: {
        alignSelf: 'stretch',
        borderWidth: 1,
        padding: 8,
        borderRadius: 6,
    },
    container: {
        flex: 1
    },
    buttonView: {
        flexDirection: 'row',
        justifyContent: 'center'
    }
})