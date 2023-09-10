import { ActivityIndicator, FlatList, Image, Modal, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { useEffect, useRef, useState } from 'react'
import { decryptMessage, downloadAttachment, getChatById, removeUserFromGroupChat, sendMessage } from '../../db/chats'
import { Ionicons, AntDesign, SimpleLineIcons, Entypo, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getUserById } from '../../db/users';
import { auth, db } from '../../db/config';
import { doc, onSnapshot } from 'firebase/firestore';
import ConfirmDeleteMessageButton from '../buttons/ConfirmDeleteMessageButton';
import RejectDeleteMessageButton from '../buttons/RejectDeleteMessageButton';
import * as Picker from 'expo-document-picker'
import { Video, Audio } from 'expo-av'
import * as IntentLauncher from 'expo-intent-launcher'
import * as FileSystem from 'expo-file-system'
import Slider from '@react-native-community/slider';
import CheckBox from 'expo-checkbox'

const MessageItem = ({ item, sender, setDeletedMessage, setModalVisible, setSentAt, chatId }) => {
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [formattedDate, setFormattedDate] = useState(null)

    const handleDecryption = () => {
        try {
            const date = new Date(item.sentAt)

            setFormattedDate(date.getHours() + ':' + date.getMinutes())
            setMessage({
                attachments: item.attachments,
                message: item.message ? decryptMessage(item.message) : null,
                sender: item.sender,
                sentAt: item.sentAt
            })
        } catch (err) {
            console.log(err)
            setError(err)
        }
    }

    useEffect(() => {
        handleDecryption()
    }, [])

    if (message) {
        if (sender.id === auth.currentUser.uid) {
            return (
                <TouchableOpacity
                    onLongPress={() => {
                        setSentAt(item.sentAt)
                        setDeletedMessage(item)
                        setModalVisible(true)
                    }}
                    style={{ alignSelf: 'flex-end', marginLeft: 70 }}
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
                            <View>
                                {message.attachments.length > 0 ?
                                    <View>
                                        {
                                            message.attachments.map((attachment, index) => {
                                                return (
                                                    <View key={index} style={{ alignSelf: 'center', marginBottom: 16 }}>
                                                        {attachment.mimeType.includes('image') ?
                                                            <ImageAttachmentMessageItem
                                                                attachment={attachment}
                                                                chatId={chatId}
                                                                isLoading={isLoading}
                                                                setIsLoading={setIsLoading}
                                                            />
                                                            :
                                                            attachment.mimeType.includes('video') ?
                                                                <VideoAttachmentMessageItem
                                                                    attachment={attachment}
                                                                    isLoading={isLoading}
                                                                    setIsLoading={setIsLoading}
                                                                    chatId={chatId}
                                                                />
                                                                :
                                                                attachment.mimeType.includes('audio') ?
                                                                    <SoundAttachmentMessageItem attachment={attachment} chatId={chatId} />
                                                                    :
                                                                    attachment.mimeType.includes('application') ?
                                                                        <ApplicationTypeAttachmentItem
                                                                            attachment={attachment}
                                                                            chatId={chatId}
                                                                        />
                                                                        : null
                                                        }
                                                    </View>
                                                )
                                            })
                                        }
                                    </View>
                                    :
                                    null}
                                {message.message ?
                                    <Text style={{ color: 'white', fontSize: 16, paddingBottom: 8 }}>{message.message}</Text>
                                    :
                                    null}
                            </View>
                        }
                        <Text style={{ color: 'white', fontSize: 10 }}>{formattedDate}</Text>
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
                    {error ?
                        <View style={{
                            flexDirection: 'row', alignItems: 'center', marginBottom: 8
                        }}>
                            <AntDesign name='warning' size={16} color={'red'} />
                            <Text style={{ color: 'red', fontSize: 16, marginLeft: 4 }}>Error loading message</Text>
                        </View>
                        :
                        <View>
                            {message.attachments.length > 0 ?
                                <View>
                                    {
                                        message.attachments.map((attachment, index) => {
                                            return (
                                                <View key={index} style={{ alignSelf: 'center', marginBottom: 16 }}>
                                                    {attachment.mimeType.includes('image') ?
                                                        <ImageAttachmentMessageItem
                                                            attachment={attachment}
                                                            chatId={chatId}
                                                            isLoading={isLoading}
                                                            setIsLoading={setIsLoading}
                                                        />
                                                        :
                                                        attachment.mimeType.includes('video') ?
                                                            <VideoAttachmentMessageItem
                                                                attachment={attachment}
                                                                isLoading={isLoading}
                                                                setIsLoading={setIsLoading}
                                                                chatId={chatId}
                                                            />
                                                            :
                                                            attachment.mimeType.includes('audio') ?
                                                                <SoundAttachmentMessageItem attachment={attachment} chatId={chatId} />
                                                                :
                                                                attachment.mimeType.includes('application') ?
                                                                    <ApplicationTypeAttachmentItem
                                                                        attachment={attachment}
                                                                        chatId={chatId}
                                                                    />
                                                                    : null
                                                    }
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                                :
                                null}
                            {message.message ?
                                <Text style={{ color: 'black', fontSize: 16, paddingBottom: 8 }}>{message.message}</Text>
                                :
                                null}
                        </View>}
                    <Text style={{ color: 'black', fontSize: 10 }}>{formattedDate}</Text>
                </View>
            )
        }
    }
}

const SoundAttachmentMessageItem = ({ attachment, chatId }) => {
    const [audio, setAudio] = useState()
    const [isAudioPlaying, setIsAudioPlaying] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [sliderValue, setSliderValue] = useState(0)
    const [playBackStatus, setPlayBackStatus] = useState(null)
    const [doesExist, setDoesExist] = useState(false)
    const [isDownloaded, setIsDownloaded] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [localUri, setLocalUri] = useState(null)

    const playAudio = async () => {
        setIsLoading(true)

        if (!audio) {
            const { sound } = await Audio.Sound.createAsync(
                {
                    uri: localUri ? localUri : attachment.url,

                },
                {},
                async status => {
                    if (status.positionMillis) {
                        setSliderValue(Math.floor(status.positionMillis / status.playableDurationMillis * 100))
                    }
                    setPlayBackStatus(status)
                    if (status.didJustFinish) {
                        await sound.playFromPositionAsync(0)
                        await sound.pauseAsync()
                        setIsAudioPlaying(false)
                        setSliderValue(0)
                    }
                }
            )
            setAudio(sound)

            await sound.playAsync()
        } else {
            await audio.playAsync()
        }

        setIsLoading(false)
        setIsAudioPlaying(true)
    }

    const pauseAudio = async () => {
        await audio.pauseAsync()
        setIsAudioPlaying(false)
    }

    const handleAudio = async () => {
        if (isAudioPlaying) {
            await pauseAudio()
        } else {
            await playAudio()
        }
    }

    const checkIfFileExists = async () => {
        let fileInfo = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}/${chatId}/attachments/${attachment.name}`)

        if (fileInfo.exists) {
            setIsDownloaded(true)
            setLocalUri(fileInfo.uri)
        }
        setDoesExist(fileInfo.exists)
    }

    useEffect(() => {
        return audio ?
            () => {
                audio.unloadAsync()
            } : undefined
    }, [audio])

    useEffect(() => {
        checkIfFileExists()
    }, [])

    useEffect(() => {
        if (isDownloaded) {
            checkIfFileExists()
        }
    }, [isDownloaded])

    return (
        <View style={{
            backgroundColor: 'black',
            width: 200,
            borderRadius: 16,
            padding: 4
        }}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <MaterialIcons
                    name='audiotrack'
                    size={20}
                    color={'white'}
                    style={{ marginLeft: 4 }}
                />
                <Text style={{ color: 'white' }}>{attachment.name}</Text>
                {isLoading ?
                    <ActivityIndicator
                        size={20}
                        style={{ marginLeft: 4 }}
                    />
                    :
                    <TouchableOpacity
                        style={{ alignSelf: 'center', }}
                        onPress={handleAudio}
                    >
                        <AntDesign
                            name={isAudioPlaying ? 'pausecircleo' : 'playcircleo'}
                            color={'white'}
                            size={20}
                            style={{ marginRight: 4 }}
                        />
                    </TouchableOpacity>
                }
            </View>
            <Slider
                style={{
                    marginVertical: 4
                }}
                maximumTrackTintColor='#e4e4e4'
                minimumValue={0}
                maximumValue={100}
                value={sliderValue}
                onValueChange={async e => {
                    setSliderValue(e)
                    if (isAudioPlaying) {
                        await audio.playFromPositionAsync(Math.floor(e / 100 * playBackStatus.playableDurationMillis))
                    } else {
                        await audio.playFromPositionAsync(Math.floor(e / 100 * playBackStatus.playableDurationMillis))
                        await audio.pauseAsync()
                    }
                }}
            />
            {playBackStatus ?
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                    <Text style={{ color: 'white' }}>
                        {`${Math.floor((playBackStatus.positionMillis / 1000 / 60))}:${Math.floor(playBackStatus.positionMillis / 1000)}`}
                    </Text>
                    <Text style={{ color: 'white' }}>
                        {`${Math.floor((playBackStatus.playableDurationMillis / 1000 / 60))}:${Math.floor(playBackStatus.playableDurationMillis / 1000)}`}
                    </Text>
                </View>
                : null}
            {doesExist ? null :
                isDownloading ?
                    <ActivityIndicator
                        size={20}
                        style={{
                            alignSelf: 'flex-end',
                            padding: 8
                        }}
                    />
                    :
                    <TouchableOpacity
                        style={{
                            alignSelf: 'flex-end',
                            padding: 8
                        }}
                        onPress={async () => {
                            setIsDownloading(true)
                            await downloadAttachment(attachment.url, attachment.name, chatId, attachment.mimeType)
                            setIsDownloading(false)
                            setIsDownloaded(!isDownloaded)
                        }}
                    >
                        <AntDesign
                            name='download'
                            color={'white'}
                            size={20}
                        />
                    </TouchableOpacity>
            }
        </View>
    )
}

const ApplicationTypeAttachmentItem = ({ attachment, chatId }) => {
    const [doesExist, setDoesExist] = useState(false)
    const [isDownloaded, setIsDownloaded] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)

    const checkIfFileExists = async () => {
        let fileInfo = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}/${chatId}/attachments/${attachment.name}`)

        if (fileInfo.exists) {
            setIsDownloaded(true)
        }
        setDoesExist(fileInfo.exists)
    }

    useEffect(() => {
        checkIfFileExists()
    }, [])

    useEffect(() => {
        if (isDownloaded) {
            checkIfFileExists()
        }
    }, [isDownloaded])

    return (
        <View style={{
            backgroundColor: 'black',
            width: 100,
            height: 100,
            borderRadius: 16
        }}>
            {attachment.mimeType.includes('pdf') ?
                <AntDesign
                    name='pdffile1'
                    color={'white'}
                    size={20}
                    style={{
                        marginTop: 8,
                        marginLeft: 8
                    }}
                /> :
                <Ionicons
                    name='document-outline'
                    color={'white'}
                    size={20}
                    style={{
                        marginTop: 8,
                        marginLeft: 8
                    }}
                />}
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <Text style={{ color: 'white', marginHorizontal: 8, marginVertical: 8 }}>{attachment.name}</Text>
            </View>
            {doesExist ?
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        alignSelf: 'flex-end',
                        padding: 8
                    }}
                    onPress={() => {
                        FileSystem.getContentUriAsync(`${FileSystem.documentDirectory}/${chatId}/attachments/${attachment.name}`).then(async cUri => {
                            await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                                data: cUri,
                                flags: 1,
                                type: attachment.mimeType
                            })
                        })
                    }}
                >
                    <Ionicons
                        name='open-outline'
                        color={'white'}
                        size={20}
                    />
                </TouchableOpacity>
                : isDownloading ?
                    <ActivityIndicator
                        size={'large'}
                        style={{
                            position: 'absolute',
                            alignSelf: 'flex-end',
                            padding: 8
                        }}
                    />
                    :
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            alignSelf: 'flex-end',
                            padding: 8
                        }}
                        onPress={async () => {
                            setIsDownloading(true)
                            await downloadAttachment(attachment.url, attachment.name, chatId, attachment.mimeType)
                            setIsDownloading(false)
                            setIsDownloaded(!isDownloaded)
                        }}
                    >
                        <AntDesign
                            name='download'
                            color={'white'}
                            size={20}
                        />
                    </TouchableOpacity>
            }
        </View>
    )
}

const VideoAttachmentMessageItem = ({ attachment, isLoading, setIsLoading, chatId }) => {
    const [doesExist, setDoesExist] = useState(false)
    const [isDownloaded, setIsDownloaded] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [localUri, setLocalUri] = useState(null)

    const checkIfFileExists = async () => {
        let fileInfo = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}/${chatId}/attachments/${attachment.name}`)

        if (fileInfo.exists) {
            setIsDownloaded(true)
            setLocalUri(fileInfo.uri)
        }
        setDoesExist(fileInfo.exists)
    }

    useEffect(() => {
        checkIfFileExists()
    }, [])

    useEffect(() => {
        if (isDownloaded) {
            checkIfFileExists()
        }
    }, [isDownloaded])

    return (
        <View>
            <Video
                source={{ uri: localUri ? localUri : attachment.url }}
                style={{
                    width: 200,
                    height: 200,
                    borderRadius: 16,
                    backgroundColor: 'black'
                }}
                useNativeControls
                onLoadStart={() => setIsLoading(true)}
                onReadyForDisplay={() => setIsLoading(false)}
                resizeMode='contain'
            />
            {isLoading ?
                <ActivityIndicator
                    size={'large'}
                    style={{
                        position: 'absolute',
                        alignSelf: 'center',
                        top: 80
                    }}
                />
                : null
            }
            {doesExist ?
                null
                :
                isDownloading ?
                    <ActivityIndicator
                        size={'large'}
                        style={{
                            position: 'absolute',
                            alignSelf: 'flex-end',
                            padding: 8
                        }}
                    />
                    :
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            alignSelf: 'flex-end',
                            padding: 8
                        }}
                        onPress={async () => {
                            setIsDownloading(true)
                            await downloadAttachment(attachment.url, attachment.name, chatId, attachment.mimeType)
                            setIsDownloading(false)
                            setIsDownloaded(!isDownloaded)
                        }}
                    >
                        <AntDesign
                            name='download'
                            color={'white'}
                            size={20}
                        />
                    </TouchableOpacity>
            }
        </View>
    )
}

const ImageAttachmentMessageItem = ({ attachment, chatId, isLoading, setIsLoading }) => {
    const [doesExist, setDoesExist] = useState(false)
    const [isDownloaded, setIsDownloaded] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [localUri, setLocalUri] = useState(null)

    const checkIfFileExists = async () => {
        let fileInfo = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}/${chatId}/attachments/${attachment.name}`)

        if (fileInfo.exists) {
            setIsDownloaded(true)
            setLocalUri(fileInfo.uri)
        }
        setDoesExist(fileInfo.exists)
    }

    useEffect(() => {
        checkIfFileExists()
    }, [])

    useEffect(() => {
        if (isDownloaded) {
            checkIfFileExists()
        }
    }, [isDownloaded])

    return (
        <View>
            <Image
                source={{ uri: localUri ? localUri : attachment.url }}
                style={{
                    width: 200,
                    height: 200,
                    borderRadius: 16,
                    backgroundColor: 'black'
                }}
                resizeMode='contain'
            />
            {doesExist ?
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        alignSelf: 'flex-end',
                        padding: 8
                    }}
                    onPress={() => {
                        FileSystem.getContentUriAsync(`${FileSystem.documentDirectory}/${chatId}/attachments/${attachment.name}`).then(async cUri => {
                            await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                                data: cUri,
                                flags: 1,
                                type: attachment.mimeType
                            })
                        })
                    }}
                >
                    <Ionicons
                        name='open-outline'
                        color={'white'}
                        size={20}
                    />
                </TouchableOpacity>
                :
                isDownloading ?
                    <ActivityIndicator
                        size={'large'}
                        style={{
                            position: 'absolute',
                            alignSelf: 'flex-end',
                            padding: 8
                        }}
                    />
                    :
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            alignSelf: 'flex-end',
                            padding: 8
                        }}
                        onPress={async () => {
                            setIsDownloading(true)
                            await downloadAttachment(attachment.url, attachment.name, chatId, attachment.mimeType)
                            setIsDownloading(false)
                            setIsDownloaded(!isDownloaded)
                        }}
                    >
                        <AntDesign
                            name='download'
                            color={'white'}
                            size={20}
                        />
                    </TouchableOpacity>
            }
        </View>
    )
}

const ConfirmDeleteModal = ({ modalVisible, setModalVisible, message, setMessage, setSentAt, chatId }) => {
    const [decryptedMessage, setDecryptedMessage] = useState('')
    const [error, setError] = useState(null)
    const [isChecked, setIsChecked] = useState(false)

    const handleDecrypt = () => {
        try {
            setDecryptedMessage(decryptMessage(message.message))
        } catch (err) {
            console.log(err);
            setError(err)
        }
    }

    useEffect(() => {
        handleDecrypt()
    }, [message])

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
                    <Text style={{ alignSelf: 'flex-start', fontSize: 16, color: 'black' }}>{decryptedMessage}</Text>
                    {isChecked ?
                        <Text style={{ alignSelf: 'flex-start', color: 'red', marginVertical: 4 }}>
                            <Text style={{ textDecorationLine: 'underline', fontWeight: 'bold' }}>Caution:</Text> All included attachments will be deleted
                        </Text> : null
                    }
                    <View style={{ flexDirection: 'row', alignSelf: 'flex-start' }}>
                        <CheckBox
                            style={{ marginRight: 4, marginTop: 4 }}
                            disabled={false}
                            value={isChecked}
                            onValueChange={e => setIsChecked(e)}
                        />
                        <Text>Delete attachments from local storage</Text>
                    </View>
                    <View style={{ flexDirection: 'row', paddingTop: 8 }}>
                        <RejectDeleteMessageButton
                            setModalVisible={setModalVisible}
                            setMessage={setMessage}
                        />
                        <View style={{ width: 32 }} />
                        <ConfirmDeleteMessageButton
                            setModalVisible={setModalVisible}
                            message={message}
                            chatId={chatId}
                            localStorageFlag={isChecked}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const GroupChatOptionsModal = ({ modalVisible, setModalVisible, navigation, userRole, chat, setLeaveGroupModalVisble }) => {
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
                <TouchableOpacity>
                    <Text>
                        Shared files
                    </Text>
                </TouchableOpacity>
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

const PrivateChatOptionsModal = ({ modalVisible, setModalVisible, navigation, chat }) => {
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
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Shared files', {
                            chat: chat
                        })
                        setModalVisible(false)
                    }}
                    style={{ width: '100%' }}
                >
                    <Text>Shared files</Text>
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

const AttachmentsItem = ({ item, message, setMessage, isUploading }) => {
    const [audio, setAudio] = useState()
    const [isAudioPlaying, setIsAudioPlaying] = useState(false)

    const playAudio = async () => {
        if (!audio) {
            const { sound } = await Audio.Sound.createAsync({ uri: item.uri })
            setAudio(sound)

            await sound.playAsync()
        } else {
            await audio.playAsync()
        }

        setIsAudioPlaying(true)
    }

    const pauseAudio = async () => {
        await audio.pauseAsync()
        setIsAudioPlaying(false)
    }

    const handleAudio = async () => {
        if (isAudioPlaying) {
            await pauseAudio()
        } else {
            await playAudio()
        }
    }

    useEffect(() => {
        return audio ?
            () => {
                audio.unloadAsync()
            } : undefined
    }, [audio])

    return (
        <View>
            {item.mimeType.includes('image') ?
                <Image
                    source={{ uri: item.uri }}
                    style={{ width: 80, height: 80, borderRadius: 6 }}
                />
                :
                item.mimeType.includes('video') ?
                    <Video
                        source={{ uri: item.uri }}
                        style={{ width: 80, height: 80, borderRadius: 6, backgroundColor: 'black' }}
                        resizeMode='contain'
                        useNativeControls
                        isLooping
                        shouldPlay
                    />
                    :
                    item.mimeType.includes('audio') ?
                        <View style={{ width: 80, height: 80, borderRadius: 16, backgroundColor: 'black' }}>
                            <MaterialIcons
                                name='audiotrack'
                                size={20}
                                color={'white'}
                                style={{ marginLeft: 4, marginTop: 4 }}
                            />
                            <TouchableOpacity
                                style={{ position: 'absolute', alignSelf: 'center', top: 30 }}
                                onPress={handleAudio}
                            >
                                <AntDesign
                                    name={isAudioPlaying ? 'pausecircleo' : 'playcircleo'}
                                    color={'white'}
                                    size={20}
                                />
                            </TouchableOpacity>
                        </View>
                        :
                        item.mimeType.includes('application') ?
                            <View
                                style={{
                                    width: 80,
                                    height: 80,
                                    backgroundColor: 'black',
                                    borderRadius: 16
                                }}
                            >
                                {item.mimeType.includes('pdf') ?
                                    <AntDesign
                                        name='pdffile1'
                                        color={'white'}
                                        size={20}
                                        style={{
                                            marginTop: 4,
                                            marginLeft: 4
                                        }}
                                    /> :
                                    <Ionicons
                                        name='document-outline'
                                        color={'white'}
                                        size={20}
                                        style={{
                                            marginTop: 4,
                                            marginLeft: 4
                                        }}
                                    />
                                }
                                <Text style={{
                                    color: 'white',
                                    marginTop: 4,
                                    marginHorizontal: 4
                                }}>{item.name}</Text>
                            </View>
                            :
                            <View
                                style={{
                                    width: 80,
                                    height: 80,
                                    backgroundColor: 'black',
                                    borderRadius: 16
                                }}
                            >
                                <Ionicons
                                    name='document-outline'
                                    color={'white'}
                                    size={20}
                                    style={{
                                        marginTop: 4,
                                        marginLeft: 4
                                    }}
                                />
                                <Text style={{
                                    color: 'white',
                                    marginTop: 4,
                                    marginHorizontal: 4
                                }}>{item.name}</Text>
                            </View>
            }
            {isUploading ? <ActivityIndicator size={80} style={{ position: 'absolute', alignSelf: 'center' }} /> : null}
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    alignSelf: 'flex-end',
                    borderWidth: 2,
                    borderColor: 'white',
                    borderRadius: 20,
                    right: 4,
                    top: 4
                }}
                onPress={() => {
                    setMessage({
                        text: message.text,
                        files: message.files.filter(e => e !== item)
                    })
                }}
            >
                <Entypo name='cross' size={20} color={'white'} />
            </TouchableOpacity>
        </View>
    )
}

const ChatScreen = ({ route, navigation }) => {
    const { chatType, metadata } = route.params
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState({
        text: '',
        files: []
    })
    const [usersMap, setUsersMap] = useState(new Map())
    const [deletedMessage, setDeletedMessage] = useState('')
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [groupChatOptionsModalVisbible, setGroupChatOptionsModalVisbible] = useState(false)
    const [privateChatOptionsModalVisible, setPrivateChatOptionsModalVisible] = useState(false)
    const [leaveGroupModalVisble, setLeaveGroupModalVisble] = useState(false)
    const [sentAt, setSentAt] = useState('')
    const [currentUserRole, setCurrentUserRole] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const flatListRef = useRef()

    const checkSize = (result) => {
        for (let i = 0; i < result.assets.length; i++) {
            if (result.assets[i].size > 20000000) {
                return false
            }
        }
        return true
    }

    const pickFile = async () => {
        const result = await Picker.getDocumentAsync({
            multiple: true
        })

        console.log(result);

        if (!result.canceled) {
            if (checkSize(result)) {
                setMessage({
                    text: message.text,
                    files: [
                        ...message.files,
                        ...result.assets
                    ]
                })
            } else {
                ToastAndroid.show('Keep file size under 20 MB.', ToastAndroid.LONG)
            }
        }
    }

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
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 0.9, justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                        source={metadata.chatPhoto ?
                            { uri: metadata.chatPhoto } : chatType === 'private' ?
                                require('../../assets/avatar.png') : require('../../assets/group-avatar.png')}
                        style={{ height: 40, width: 40, borderRadius: 40, backgroundColor: 'white' }}
                    />
                    <Text style={{ paddingLeft: 8, fontSize: 16 }}>{metadata.chatTitle}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        if (chatType === 'group') {
                            setGroupChatOptionsModalVisbible(true)
                        } else {
                            setPrivateChatOptionsModalVisible(true)
                        }
                    }}
                >
                    <SimpleLineIcons name='options-vertical' size={16} />
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <ConfirmDeleteModal
                message={deletedMessage}
                modalVisible={deleteModalVisible}
                setMessage={setDeletedMessage}
                setModalVisible={setDeleteModalVisible}
                setSentAt={setSentAt}
                sentAt={sentAt}
                chatId={metadata.chat.id}
            />
            {chatType === 'group' ?
                <GroupChatOptionsModal
                    modalVisible={groupChatOptionsModalVisbible}
                    setModalVisible={setGroupChatOptionsModalVisbible}
                    navigation={navigation}
                    userRole={currentUserRole}
                    chat={metadata.chat}
                    setLeaveGroupModalVisble={setLeaveGroupModalVisble}
                />
                :
                <PrivateChatOptionsModal
                    chat={metadata.chat}
                    modalVisible={privateChatOptionsModalVisible}
                    setModalVisible={setPrivateChatOptionsModalVisible}
                    navigation={navigation}
                />
            }
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
                    setDeletedMessage={setDeletedMessage}
                    setModalVisible={setDeleteModalVisible}
                    setSentAt={setSentAt}
                    chatId={metadata.chat.id}
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
            {message.files.length > 0 ?
                <View>
                    <FlatList
                        data={message.files}
                        horizontal={true}
                        renderItem={({ item }) => <AttachmentsItem item={item} message={message} setMessage={setMessage} isUploading={isUploading} />}
                        ItemSeparatorComponent={<View style={{ width: 8 }} />}
                        style={{ marginTop: 8 }}
                    />
                </View>
                :
                null}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={styles.inputView}>
                    <TextInput
                        placeholder='Type your message here'
                        value={message.text}
                        onChangeText={e => setMessage({ text: e, files: [...message.files] })}
                        multiline={true}
                        style={styles.messageTextInput}
                    />
                    <TouchableOpacity
                        style={{ marginRight: 8 }}
                        onPress={pickFile}
                    >
                        <Ionicons name='attach' size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={async () => {
                            if (message.text.length > 0 || message.files.length > 0) {
                                setIsUploading(true)
                                await sendMessage(metadata.chat.id, message)
                                setMessage({
                                    text: '',
                                    files: []
                                })
                                setIsUploading(false)
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