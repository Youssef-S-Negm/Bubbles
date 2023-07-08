import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import { useState } from 'react'

const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState('')

    return (
        <View style={styles.container}>
            <Text>Please, enter your E-mail</Text>
            <View style={{height: 8}}/>
            <TextInput
                placeholder='user@example.com'
                style={styles.textInput}
                value={email}
                onChangeText={e => setEmail(e)}
                keyboardType='email-address'
            />
            <View style={{height: 32}}/>
            <Button title='Send E-mail'/>
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
    }
})