import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import MaskedView from '@react-native-masked-view/masked-view'
import { Entypo } from '@expo/vector-icons';

const RejectAddUserButton = ({ setUser, setModalVisible, setScanned, navigation }) => {
    return (
        <TouchableOpacity
            onPress={() => {
                setModalVisible(false)
                setUser(null)
                setScanned(false)
                navigation.navigate('FindScreen')
            }}
        >
            <LinearGradient
                colors={['red', 'orange']}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradient}
            >
                <View style={styles.buttonInfoView}>
                    <MaskedView
                        maskElement={
                            <View style={styles.iconView}>
                                <Entypo name="cross" style={styles.icon} />
                            </View>
                        }
                    >
                        <LinearGradient
                            colors={['red', 'orange']}
                            start={{ x: 1, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={styles.iconGradient}
                        />
                    </MaskedView>
                    <Text style={styles.buttonText}>Cancel</Text>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    )
}

export default RejectAddUserButton

const styles = StyleSheet.create({
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
        textAlign: 'center',
        paddingLeft: 8
    }
})