import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { resetPassword } from '../../db/auth'

const SendEmailButton = ({ email, navigation }) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={async () => {
                await resetPassword(email)
                navigation.goBack()
            }}
        >
            <LinearGradient
                colors={['#c4ddfe', '#fed8f7']}
                start={{ x: 0.3, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <View style={styles.buttonText}>
                    <Text style={styles.sendText}>Send E-mail</Text>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    )
}

export default SendEmailButton

const styles = StyleSheet.create({
    container: {
        flex: 0.7,
    },
    sendText: {
        textAlign: 'center',
        fontSize: 20
    },
    gradient: {
        borderRadius: 6,
        padding: 2.5,
    },
    buttonText: {
        backgroundColor: 'white',
        padding: 6,
        borderRadius: 6
    }
})