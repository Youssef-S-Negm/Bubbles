import { FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useEffect, useRef, useState } from 'react'
import { decryptMessage, getChatById, sendMessage } from '../../db/chats'
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getUserById } from '../../db/users';
import { auth, db } from '../../db/config';
import { doc, onSnapshot } from 'firebase/firestore';
import ConfirmDeleteMessageButton from '../buttons/ConfirmDeleteMessageButton';
import RejectDeleteMessageButton from '../buttons/RejectDeleteMessageButton';

const MessageItem = ({ item, sender, setDeletdedMessage, setModalVisible, setSentAt }) => {
    if (sender.id === auth.currentUser.uid) {
        const date = new Date(item.sentAt)
        const formatted = date.getHours() + ':' + date.getMinutes()

        return (
            <TouchableOpacity
                onLongPress={() => {
                    setSentAt(item.sentAt)
                    setDeletdedMessage(item.message)
                    setModalVisible(true)
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
                    <Text style={{ color: 'white', fontSize: 16, paddingBottom: 8 }}>{decryptMessage(item.message)}</Text>
                    <Text style={{ color: 'white', fontSize: 10 }}>{formatted}</Text>
                </LinearGradient>
            </TouchableOpacity>
        )
    } else {
        const date = new Date(item.sentAt)
        const formatted = date.getHours() + ':' + date.getMinutes()

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
                <Text style={{ color: 'black', fontSize: 16, paddingBottom: 8 }}>{decryptMessage(item.message)}</Text>
                <Text style={{ color: 'black', fontSize: 10 }}>{formatted}</Text>
            </View>
        )
    }
}

const ConfirmDeleteModal = ({ modalVisible, setModalVisible, message, setMessage, setSentAt, sentAt, chatId }) => {
    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setMessage('')
                setSentAt('')
                setModalVisible(false)
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={{ paddingBottom: 8, fontWeight: 'bold', fontSize: 16 }}>Would like to delete this message?</Text>
                    <Text style={{ alignSelf: 'flex-start', fontSize: 16 }}>{decryptMessage(message)}</Text>
                    <View style={{ flexDirection: 'row', paddingTop: 8 }}>
                        <RejectDeleteMessageButton
                            setModalVisible={setModalVisible}
                            setMessage={setMessage}
                        />
                        <View style={{ width: 32 }} />
                        <ConfirmDeleteMessageButton
                            setModalVisible={setModalVisible}
                            sentAt={sentAt}
                            chatId={chatId}
                            message={message}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const ChatScreen = ({ route, navigation }) => {
    const { chatType, metadata } = route.params
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')
    const [usersMap, setUsersMap] = useState(new Map())
    const [deletdedMessage, setDeletdedMessage] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const [sentAt, setSentAt] = useState('')
    const flatListRef = useRef()

    const scrollToBottom = () => {
        flatListRef.current.scrollToEnd({ animated: true });
    }

    useEffect(() => {
        navigation.setOptions({
            headerTitle: props => <Header {...props} />
        })
        if (chatType === 'private') {
            getChatById(metadata.chat.id)
                .then(async e => {
                    await Promise.all(e.between.map(getUserById))
                        .then(users => {
                            users.forEach(user => usersMap.set(user.id, user))
                        })
                    setMessages(e.messages)
                })

            const unsub = onSnapshot(doc(db, "chats", metadata.chat.id), async (doc) => {
                await Promise.all(doc.data().between.map(getUserById))
                    .then(users => {
                        users.forEach(user => usersMap.set(user.id, user))
                    })
                setMessages(doc.data().messages)
            });

            return () => {
                unsub()
            }
        } else if (chatType === 'group') {
            getChatById(metadata.chat.id)
                .then(async e => {
                    await Promise.all(e.between.map(async user => await getUserById(user.id)))
                        .then(users => {
                            users.forEach(user => usersMap.set(user.id, user))
                        })
                    setMessages(e.messages)
                })

            const unsub = onSnapshot(doc(db, "chats", metadata.chat.id), async (doc) => {
                await Promise.all(doc.data().between.map(async user => await getUserById(user.id)))
                    .then(users => {
                        users.forEach(user => usersMap.set(user.id, user))
                    })
                setMessages(doc.data().messages)
            });

            return () => {
                unsub()
            }
        }
    }, [])

    const Header = () => {
        if (chatType === 'private') {
            return (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                        source={metadata.otherUser.photoURL ? { uri: metadata.otherUser.photoURL } : require('../../assets/avatar.png')}
                        style={{ height: 40, width: 40, borderRadius: 40, backgroundColor: 'white' }}
                    />
                    <Text style={{ paddingLeft: 8, fontSize: 16 }}>{metadata.chatTitle}</Text>
                </View>
            )
        } else if (chatType === 'group') {
            return (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                        source={metadata.chatPhoto ? { uri: metadata.chatPhoto } : require('../../assets/avatar.png')}
                        style={{ height: 40, width: 40, borderRadius: 40, backgroundColor: 'white' }}
                    />
                    <Text style={{ paddingLeft: 8, fontSize: 16 }}>{metadata.chatTitle}</Text>
                </View>
            )
        }
    }

    return (
        <View style={styles.container}>
            <ConfirmDeleteModal
                message={deletdedMessage}
                modalVisible={modalVisible}
                setMessage={setDeletdedMessage}
                setModalVisible={setModalVisible}
                setSentAt={setSentAt}
                sentAt={sentAt}
                chatId={metadata.chat.id}
            />
            <FlatList
                data={messages}
                renderItem={({ item }) => <MessageItem
                    item={item}
                    sender={usersMap.get(item.sender)}
                    setDeletdedMessage={setDeletdedMessage}
                    setModalVisible={setModalVisible}
                    setSentAt={setSentAt}
                />}
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
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
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
                                sendMessage(metadata.chat.id, message)
                                setMessage('')
                            }
                        }}
                    >
                        <Ionicons name='send' style={styles.sendIcon} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        scrollToBottom()
                    }}
                >
                    <View style={{ backgroundColor: '#e4e4e4', padding: 4, borderRadius: 6 }}>
                        <AntDesign name='down' style={{ fontSize: 20 }} />
                    </View>
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
        marginTop: 8,
        flex: 1,
        marginRight: 8
    },
    sendIcon: {
        fontSize: 20,
    },
    messageTextInput: {
        paddingRight: 8,
        flex: 1
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        elevation: 5
    }
})