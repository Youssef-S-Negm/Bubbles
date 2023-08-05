import { StyleSheet, TextInput, View } from 'react-native'
import { useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import CreateGroupChatButton from '../buttons/CreateGroupChatButton';

const CreateGroupChatScreen = ({ navigation }) => {
    const [groupNme, setGroupNme] = useState('')

    return (
        <View style={styles.container}>
            <View style={styles.inputView}>
                <MaterialIcons name='label-outline' style={styles.icon} />
                <TextInput
                    placeholder='Enter group name'
                    value={groupNme}
                    onChangeText={e => setGroupNme(e)}
                    style={styles.textInput}
                />
            </View>
            <CreateGroupChatButton groupName={groupNme} navigation={navigation} />
        </View>
    )
}

export default CreateGroupChatScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 8,
        paddingHorizontal: 8
    },
    icon: {
        fontSize: 20
    },
    textInput: {
        width: '100%',
        marginLeft: 8
    },
    inputView: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 6,
        padding: 8,
        marginBottom: 16
    }
})