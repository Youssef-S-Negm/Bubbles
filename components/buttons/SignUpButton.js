import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { signUp } from '../../db/auth'
import MaskedView from '@react-native-masked-view/masked-view'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const SignUpButton = ({ email, password, confirmPassword, username, navigation }) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={async () => {
                await signUp(email, password, confirmPassword, username)
                navigation.goBack()
            }}
        >
            <LinearGradient
                colors={['#00736e', '#6a00c9']}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradient}
            >
                <View style={styles.buttonInfoView}>
                    <MaskedView
                        maskElement={
                            <View style={styles.iconView}>
                                <MaterialCommunityIcons name="account-plus" style={styles.icon} />
                            </View>
                        }
                    >
                        <LinearGradient
                            colors={['#00736e', '#6a00c9']}
                            start={{ x: 1, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={styles.iconGradient}
                        />
                    </MaskedView>
                    <View style={{ width: '100%' }}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    )
}

export default SignUpButton

const styles = StyleSheet.create({
    container: {
        width: '70%'
    },
    iconView: {
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconGradient: {
        flex: 1,
        width: 30
    },
    gradient: {
        borderRadius: 6,
        padding: 2.5
    },
    buttonInfoView: {
        backgroundColor: 'white',
        padding: 6,
        borderRadius: 6,
        flexDirection: 'row',
    },
    icon: {
        fontSize: 20
    },
    buttonText: {
        fontSize: 20,
        left: '25%'
    }
})