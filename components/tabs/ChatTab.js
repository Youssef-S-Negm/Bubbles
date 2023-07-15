import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'
import { AntDesign } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

const ChatTab = ({ focused }) => {
    return (
        focused ?
            <MaskedView
                style={styles.maskedView}
                maskElement={
                    <View style={styles.view}>
                        <AntDesign
                            name="message1"
                            style={styles.icon}
                        />
                    </View>
                }
            >
                <LinearGradient
                    colors={['#00736e', '#6a00c9']}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={ styles.gradient }
                />
            </MaskedView>
            :
            <View style={styles.view}>
                <AntDesign name="message1" style={styles.iconDisabled} />
            </View>
    )
}

export default ChatTab

const styles = StyleSheet.create({
    maskedView: {
        flex: 1,
        flexDirection: 'row'
    },
    view: {
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center'
    },
    icon: {
        fontSize: 30
    },
    gradient: {
        flex: 1,
        width: 30
    },
    iconDisabled: {
        fontSize: 30,
        color: '#EBEBE4'
    }
})