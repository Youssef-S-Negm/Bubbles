import { StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'

const NavigateToCreateGroupChatButton = ({ navigation }) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => {
                navigation.navigate('Create group chat')
            }}
        >
            <LinearGradient
                colors={['#00736e', '#6a00c9']}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradient}
            >
                <Ionicons name='add' style={styles.icon} />
            </LinearGradient>
        </TouchableOpacity>
    )
}

export default NavigateToCreateGroupChatButton

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignSelf: 'flex-end',
        alignItems: 'center',
        justifyContent: 'center',
        top: '80%',
        right: 8
    },
    gradient: {
        borderRadius: 100,
        elevation: 5
    },
    icon: {
        fontSize: 50,
        color: 'white'
    }
})