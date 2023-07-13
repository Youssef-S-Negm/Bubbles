import { LinearGradient } from 'expo-linear-gradient'
import { Image, StyleSheet, View } from 'react-native';

const ProfileTab = ({ focused, user }) => {
    return (
        focused ?
            <LinearGradient
                colors={['#c4ddfe', '#fed8f7']}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradient}
            >
                <Image source={user.photoURL? {uri: user.photoURL}:require('../../assets/avatar.png')} resizeMode='contain' style={styles.image} />
            </LinearGradient>
            :
            <View style={styles.view}>
                <Image source={user.photoURL? {uri: user.photoURL}:require('../../assets/avatar.png')} resizeMode='contain' style={styles.image} />
            </View>
    )
}

export default ProfileTab

const styles = StyleSheet.create({
    view: {
        width: 40,
        height: 40,
        backgroundColor: '#EBEBE4',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 40
    },
    gradient: {
        width: 40,
        height: 40,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 35,
        height: 35,
        borderRadius: 30
    }
})