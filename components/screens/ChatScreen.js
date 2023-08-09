import { FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useEffect, useRef, useState } from 'react'
import { decryptMessage, getChatById, removeUserFromGroupChat, sendMessage } from '../../db/chats'
import { Ionicons, AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getUserById } from '../../db/users';
import { auth, db } from '../../db/config';
import { doc, onSnapshot } from 'firebase/firestore';
import ConfirmDeleteMessageButton from '../buttons/ConfirmDeleteMessageButton';
import RejectDeleteMessageButton from '../buttons/RejectDeleteMessageButton';

const MessageItem = ({ item, sender, setDeletdedMessage, setModalVisible, setSentAt }) => {
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)

    const handleDecryption = () => {
        try {
            setMessage(decryptMessage(item.message))
        } catch (err) {
            console.log(err)
            setError(err)
        }
    }

    useEffect(() => {
        handleDecryption()
    }, [])

    if (sender.id === auth.currentUser.uid) {
        const date = new Date(item.sentAt)
        const formattedDate = date.getHours() + ':' + date.getMinutes()

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
                    {error ?
                        <View style={{
                            flexDirection: 'row', alignItems: 'center', marginBottom: 8
                        }}>
                            <AntDesign name='warning' size={16} color={'red'} />
                            <Text style={{ color: 'red', fontSize: 16, marginLeft: 4 }}>Error loading message</Text>
                        </View>
                        :
                        <Text style={{ color: 'white', fontSize: 16, paddingBottom: 8 }}>{message}</Text>}
                    <Text style={{ color: 'white', fontSize: 10 }}>{formattedDate}</Text>
                </LinearGradient>
            </TouchableOpacity>
        )
    } else {
        const date = new Date(item.sentAt)
        const formattedDate = date.getHours() + ':' + date.getMinutes()

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
                {error ?
                    <View style={{
                        flexDirection: 'row', alignItems: 'center', marginBottom: 8
                    }}>
                        <AntDesign name='warning' size={16} color={'red'} />
                        <Text style={{ color: 'red', fontSize: 16, marginLeft: 4 }}>Error loading message</Text>
                    </View>
                    :
                    <Text style={{ color: 'black', fontSize: 16, paddingBottom: 8 }}>{message}</Text>}
                <Text style={{ color: 'black', fontSize: 10 }}>{formattedDate}</Text>
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
                    <Text style={styles.modalTitle}>Would like to delete this message?</Text>
                    <Text style={{ alignSelf: 'flex-start', fontSize: 16 }}>{ }</Text>
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

const ChatOptionsModal = ({ modalVisible, setModalVisible, navigation, userRole, chat, setLeaveGroupModalVisble }) => {
    return (
        <Modal
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
            transparent={true}
            style={{ flex: 1 }}
            animationType='fade'
        >
            <TouchableOpacity
                onPress={() => {
                    setModalVisible(false)
                }}
                style={{ flex: 1 }}
            />
            <View style={{
                backgroundColor: 'white',
                elevation: 5,
                position: 'absolute',
                alignSelf: 'flex-end',
                right: 8,
                top: 60,
                padding: 8,
                width: '32%',
                borderRadius: 6
            }}>
                {
                    userRole === 'admin' ?
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('Add user', {
                                    chatId: chat.id,
                                    between: chat.between
                                })
                                setModalVisible(false)
                            }}
                            style={{ width: '100%', marginBottom: 8 }}
                        >
                            <Text style={{ fontSize: 16 }}>Add user</Text>
                        </TouchableOpacity>
                        :
                        null
                }
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Group info', {
                            chat: chat,
                            userRole: userRole,
                        })
                        setModalVisible(false)
                    }}
                    style={{ width: '100%', marginBottom: 8 }}
                >
                    <Text style={{ fontSize: 16 }}>Info</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        setLeaveGroupModalVisble(true)
                    }}
                >
                    <Text style={{ color: 'red', fontSize: 16 }}>Leave group</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

const LeaveGroupModal = ({ modalVisible, setModalVisible, chatId, navigation, userRole }) => {
    return (
        <Modal
            transparent={true}
            onRequestClose={() => {
                setModalVisible(false)
            }}
            visible={modalVisible}
            animationType='slide'
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Would you like to leave this group?</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 200 }}>
                        <TouchableOpacity
                            style={{ padding: 8 }}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={{ fontSize: 16, color: 'red' }}>No</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ padding: 8 }}
                            onPress={() => {
                                navigation.goBack()
                                removeUserFromGroupChat(chatId, auth.currentUser.uid, userRole)
                            }}
                        >
                            <Text style={{ fontSize: 16, color: 'green' }}>Yes</Text>
                        </TouchableOpacity>
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
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [chatOptionsModalVisbible, setChatOptionsModalVisbible] = useState(false)
    const [leaveGroupModalVisble, setLeaveGroupModalVisble] = useState(false)
    const [sentAt, setSentAt] = useState('')
    const [currentUserRole, setCurrentUserRole] = useState(null)
    const flatListRef = useRef()
    const [currentChat, setCurrentChat] = useState(metadata.chat)

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
                    await Promise.all(e.allParticipants.map(async user => await getUserById(user)))
                        .then(users => {
                            users.forEach(user => usersMap.set(user.id, user))
                        })
                    for (let i = 0; i < e.between.length; i++) {
                        if (e.between[i].id === auth.currentUser.uid) {
                            setCurrentUserRole(e.between[i].role)
                            break
                        }
                    }
                    setMessages(e.messages)
                })

            const unsub = onSnapshot(doc(db, "chats", metadata.chat.id), async (doc) => {
                await Promise.all(doc.data().allParticipants.map(async user => await getUserById(user)))
                    .then(users => {
                        users.forEach(user => usersMap.set(user.id, user))
                        for (let i = 0; i < doc.data().between.length; i++) {
                            if (doc.data().between[i].id === auth.currentUser.uid) {
                                setCurrentUserRole(doc.data().between[i].role)
                                break
                            }
                        }
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
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 0.9, justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            source={metadata.chatPhoto ? { uri: metadata.chatPhoto } : require('../../assets/group-avatar.png')}
                            style={{ height: 40, width: 40, borderRadius: 40, backgroundColor: 'white' }}
                        />
                        <Text style={{ paddingLeft: 8, fontSize: 16 }}>{metadata.chatTitle}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            setChatOptionsModalVisbible(true)
                        }}
                    >
                        <SimpleLineIcons name='options-vertical' size={16} />
                    </TouchableOpacity>
                </View>
            )
        }
    }

    return (
        <View style={styles.container}>
            <ConfirmDeleteModal
                message={deletdedMessage}
                modalVisible={deleteModalVisible}
                setMessage={setDeletdedMessage}
                setModalVisible={setDeleteModalVisible}
                setSentAt={setSentAt}
                sentAt={sentAt}
                chatId={metadata.chat.id}
            />
            <ChatOptionsModal
                modalVisible={chatOptionsModalVisbible}
                setModalVisible={setChatOptionsModalVisbible}
                navigation={navigation}
                userRole={currentUserRole}
                chat={metadata.chat}
                setLeaveGroupModalVisble={setLeaveGroupModalVisble}
            />
            <LeaveGroupModal
                chatId={metadata.chat.id}
                modalVisible={leaveGroupModalVisble}
                setModalVisible={setLeaveGroupModalVisble}
                navigation={navigation}
                userRole={currentUserRole}
            />
            <FlatList
                data={messages}
                renderItem={({ item }) => <MessageItem
                    item={item}
                    sender={usersMap.get(item.sender)}
                    setDeletdedMessage={setDeletdedMessage}
                    setModalVisible={setDeleteModalVisible}
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
    },
    modalTitle: {
        paddingBottom: 8,
        fontWeight: 'bold',
        fontSize: 16
    }
})