import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import MaskedView from '@react-native-masked-view/masked-view'
import { Ionicons } from '@expo/vector-icons'
import { createGroupChat } from '../../db/chats'

const CreateGroupChatButton = ({ navigation, groupName }) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={async () => {
                if (groupName.length === 0) {
                    alert("You haven't specified a group name")
                } else {
                    await createGroupChat(groupName)
                    navigation.goBack()
                }
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
                                <Ionicons name="add" style={styles.icon} />
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
                    <Text style={styles.buttonText}>Create group chat</Text>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    )
}

export default CreateGroupChatButton

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center'
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
        textAlign: 'center',
        paddingHorizontal: 8
    }
})