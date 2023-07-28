import { StyleSheet, Text, TextInput, View } from 'react-native'
import { useState } from 'react'
import SendEmailButton from '../buttons/SendEmailButton'
import { AntDesign } from '@expo/vector-icons'

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('')

    return (
        <View style={styles.container}>
            <Text>Please, enter your E-mail</Text>
            <View style={{ height: 8 }} />
            <View style={styles.inputView}>
                <AntDesign name='mail' style={styles.icon}/>
                <TextInput
                    placeholder='user@example.com'
                    style={styles.textInput}
                    value={email}
                    onChangeText={e => setEmail(e)}
                    keyboardType='email-address'
                />
            </View>
            <View style={{ height: 32 }} />
            <View style={styles.buttonView}>
                <SendEmailButton email={email} navigation={navigation} />
            </View>
        </View>
    )
}

export default ForgotPasswordScreen

const styles = StyleSheet.create({
    textInput: {
        width: '100%',
        marginLeft: 8
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 8,
        paddingHorizontal: 8
    },
    buttonView: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    inputView: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 6,
        padding: 8
    },
    icon: {
        fontSize: 20
    }
})