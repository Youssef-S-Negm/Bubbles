import { StyleSheet, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { AntDesign } from '@expo/vector-icons'

const EditProfilePictureButton = ({ onPress }) => {

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
        >
            <LinearGradient
                colors={['#00736e', '#6a00c9']}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ padding: 8, borderRadius: 25 }}
            >
                <AntDesign name='edit' size={20} color={'white'} />
            </LinearGradient>
        </TouchableOpacity>
    )
}

export default EditProfilePictureButton

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignSelf: 'flex-end',
        top: 110
    }
})