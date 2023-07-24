import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useEffect, useRef, useState } from 'react'
import { getChatById, sendMessage } from '../../db/chats'
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getUserById } from '../../db/users';
import { auth, db } from '../../db/config';
import { doc, onSnapshot } from 'firebase/firestore';
import { useScrollToTop } from '@react-navigation/native';

const MessageItem = ({ item, sender }) => {
    if (sender.id === auth.currentUser.uid) {
        return (
            <TouchableOpacity
                onPress={() => {
                    //TODO
                }}
                style={{ alignSelf: 'flex-end' }}
            >
                <LinearGradient
                    colors={['#00736e', '#6a00c9']}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{
                        padding: 8,
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        borderBottomLeftRadius: 16,
                        marginLeft: 70
                    }}
                >
                    <Text style={{ color: 'white', fontWeight: 'bold', paddingBottom: 8 }}>You</Text>
                    <Text style={{ color: 'white', fontSize: 16, paddingBottom: 8 }}>{item.message}</Text>
                    <Text style={{ color: 'white', fontSize: 10 }}>{item.sentAt}</Text>
                </LinearGradient>
            </TouchableOpacity>
        )
    } else {
        return (
            <View style={{
                alignSelf: 'flex-start',
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                borderBottomRightRadius: 16,
                backgroundColor: '#e4e4e4',
                padding: 8,
                marginRight: 70
            }}>
                <Text style={{ color: 'black', fontWeight: 'bold', paddingBottom: 8 }}>{sender.displayName}</Text>
                <Text style={{ color: 'black', fontSize: 16, paddingBottom: 8 }}>{item.message}</Text>
                <Text style={{ color: 'black', fontSize: 10 }}>{item.sentAt}</Text>
            </View>
        )
    }
}

const ChatScreen = ({ route, navigation }) => {
    const { chatTitle, chat, otherUser } = route.params
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')
    const [usersMap, setUsersMap] = useState(new Map())
    const flatListRef = useRef()
    useScrollToTop(flatListRef)

    const scrollToBottom = () => {
        flatListRef.current.scrollToEnd({ animated: true });
    }

    useEffect(() => {
        navigation.setOptions({
            headerTitle: props => <Header {...props} />
        })
        getChatById(chat.id)
            .then(async e => {
                await Promise.all(e.between.map(getUserById))
                    .then(users => {
                        users.forEach(user => usersMap.set(user.id, user))
                    })
                setMessages(e.messages)
            })

        const unsub = onSnapshot(doc(db, "chats", chat.id), async (doc) => {
            await Promise.all(doc.data().between.map(getUserById))
                .then(users => {
                    users.forEach(user => usersMap.set(user.id, user))
                })
            setMessages(doc.data().messages)
        });

        return () => {
            unsub()
        }
    }, [])

    const Header = () => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                    source={otherUser.photoURL ? { uri: otherUser.photoURL } : require('../../assets/avatar.png')}
                    style={{ height: 40, width: 40, borderRadius: 40, backgroundColor: 'white' }}
                />
                <Text style={{ paddingLeft: 8, fontSize: 16 }}>{chatTitle}</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                renderItem={({ item }) => <MessageItem item={item} sender={usersMap.get(item.sender)} />}
                ItemSeparatorComponent={<View style={{ height: 8 }} />}
                ref={flatListRef}
                onLayout={() => {
                    if (messages.length > 0) {
                        scrollToBottom()
                    }
                }}
                onContentSizeChange={() => {
                    if (messages.length > 0) {
                        scrollToBottom()
                    }
                }}
            />
            <TouchableOpacity
                onPress={() => {
                    scrollToBottom()
                }}
                style={{
                    position: 'absolute',
                    alignSelf: 'flex-end',
                    top: '87%',
                    right: 8
                }}
            >
                <View style={{ backgroundColor: '#e4e4e4', padding: 4, borderRadius: 6 }}>
                    <AntDesign name='down' style={{ fontSize: 20 }} />
                </View>
            </TouchableOpacity>
            <View style={styles.inputView}>
                <TextInput
                    placeholder='Type your message here'
                    value={message}
                    onChangeText={e => setMessage(e)}
                    multiline={true}
                    style={styles.messageTextInput}
                />
                <TouchableOpacity
                    onPress={() => {
                        if (message.length > 0) {
                            sendMessage(chat.id, message)
                            setMessage('')
                        }
                    }}
                >
                    <Ionicons name='send' style={styles.sendIcon} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ChatScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 8,
        paddingBottom: 90
    },
    inputView: {
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 6,
        padding: 8,
        alignItems: 'center',
        marginTop: 8
    },
    sendIcon: {
        fontSize: 20,
    },
    messageTextInput: {
        paddingRight: 8,
        width: '94%'
    }
})