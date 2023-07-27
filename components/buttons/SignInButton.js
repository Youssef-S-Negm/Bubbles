import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { signIn } from '../../db/auth'
import MaskedView from '@react-native-masked-view/masked-view'
import { AntDesign } from '@expo/vector-icons';

const SignInButton = ({ email, password }) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => {
                signIn(email, password)
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
                                <AntDesign name="login" style={styles.icon} />
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
                        <Text style={styles.buttonText}>Sign In</Text>
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    )
}

export default SignInButton

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