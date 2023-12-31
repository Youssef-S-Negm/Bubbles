import { ActivityIndicator, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useEffect, useState } from 'react'
import SignOutButton from '../buttons/SignOutButton'
import ShowQrCodeButton from '../buttons/ShowQrCodeButton'
import EditProfileButton from '../buttons/EditProfileButton'
import { AntDesign } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg'
import HideQrCodeButton from '../buttons/HideQrCodeButton'
import DoneEditProfileButton from '../buttons/DoneEditProfileButton'
import CancelEditProfileButton from '../buttons/CancelEditProfileButton'
import { getUserById, updateProfilePicture, userSubscribeListener } from '../../db/users'
import EditProfilePictureButton from '../buttons/EditProfilePictureButton'
import * as ImagePicker from 'expo-image-picker'

const QrModal = ({ modalVisible, setModalVisible, user }) => {
    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false)
            }}
            style={{ flex: 1 }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <QRCode
                        value={user.id}
                        enableLinearGradient={true}
                        linearGradient={['#6a00c9', '#00736e']}
                        size={200}
                    />
                    <View style={{ height: 8 }} />
                    <HideQrCodeButton setModalVisible={setModalVisible} />
                </View>
            </View>
        </Modal>
    )
}

const EditProfileModal = ({ modalVisible, setModalVisible, user }) => {
    const [username, setUsername] = useState(user.displayName)
    const [phone, setPhone] = useState(user.phoneNumber ? user.phoneNumber : '')

    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false)
            }}
            style={{ flex: 1 }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.textInputView}>
                        <AntDesign name="user" size={24} color="black" />
                        <View style={{ width: 8 }} />
                        <TextInput
                            placeholder='Enter your username'
                            value={username}
                            onChangeText={e => setUsername(e)}
                            style={styles.textInput}
                        />
                    </View>
                    <View style={{ height: 8 }} />
                    <View style={styles.textInputView}>
                        <AntDesign name="phone" size={24} color="black" />
                        <View style={{ width: 8 }} />
                        <TextInput
                            placeholder='Enter your phone number'
                            value={phone}
                            onChangeText={e => setPhone(e)}
                            keyboardType='phone-pad'
                            style={styles.textInput}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', paddingTop: 8, }}>
                        <CancelEditProfileButton setModalVisible={setModalVisible} />
                        <View style={{ width: 16 }} />
                        <DoneEditProfileButton
                            setModalVisible={setModalVisible}
                            id={user.id}
                            username={username}
                            phoneNumber={phone}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const ConfirmProfilePictureUploadModal = ({ image, setImage, modalVisible, setModalVisible, isUploading, setIsUploading }) => {
    if (image) {
        return (
            <Modal
                transparent={true}
                animationType='slide'
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false)
                    setImage(null)
                }}
            >
                {isUploading ?
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <ActivityIndicator size={150} />
                        </View>
                    </View>
                    :
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Set this photo as your profile picture?</Text>
                            <Image source={{ uri: image }} style={{ height: 150, width: 150, borderRadius: 150, marginBottom: 8 }} />
                            <View style={{ flexDirection: 'row', width: 200, justifyContent: 'space-between' }}>
                                <TouchableOpacity
                                    style={{ padding: 8 }}
                                    onPress={() => {
                                        setImage(null)
                                        setModalVisible(false)
                                    }}
                                >
                                    <Text style={{ fontSize: 16, color: 'red' }}>No</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ padding: 8 }}
                                    onPress={async () => {
                                        setIsUploading(true)
                                        await updateProfilePicture(image)
                                        setIsUploading(false)
                                        setImage(null)
                                        setModalVisible(false)
                                    }}
                                >
                                    <Text style={{ fontSize: 16, color: 'green' }}>Yes</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                }

            </Modal>
        )
    }
}

const ProfileScreen = ({ user, setUser }) => {
    const [qrModalVisible, setQrModalVisible] = useState(false);
    const [editProfileModalVisible, setEditProfileModalVisible] = useState(false)
    const [confirmProfilePictureUploadModalVisible, setConfirmProfilePictureUploadModalVisible] = useState(false)
    const [chosenProfileImage, setChosenProfileImage] = useState(null)
    const [isUploading, setIsUploading] = useState(false)

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        })

        if (!result.canceled) {
            setChosenProfileImage(result.assets[0].uri)
            setConfirmProfilePictureUploadModalVisible(true)
        }
    }

    useEffect(() => {
        const unsubscribe = userSubscribeListener(user.id, ({ change }) => {
            if (change.type === "modified") {
                getUserById(user.id).then(e => setUser(e))
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);


    return (
        <View style={styles.container}>
            <QrModal
                modalVisible={qrModalVisible}
                setModalVisible={setQrModalVisible}
                user={user}
            />
            <EditProfileModal
                modalVisible={editProfileModalVisible}
                setModalVisible={setEditProfileModalVisible}
                user={user}
            />
            <ConfirmProfilePictureUploadModal
                image={chosenProfileImage}
                setImage={setChosenProfileImage}
                modalVisible={confirmProfilePictureUploadModalVisible}
                setModalVisible={setConfirmProfilePictureUploadModalVisible}
                setIsUploading={setIsUploading}
                isUploading={isUploading}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View>
                    <Image
                        source={user.photoURL ? { uri: user.photoURL } : require('../../assets/avatar.png')}
                        style={{ width: 150, height: 150, borderRadius: 150 }}
                        resizeMode='contain'
                    />
                    <EditProfilePictureButton onPress={pickImage} />
                </View>
                <Text style={styles.userName}>{user.displayName}</Text>
            </View>
            <View style={{ height: 8 }} />
            <View style={styles.infoTextView}>
                <AntDesign name="mail" style={styles.icon} />
                <Text style={styles.infoText}>{user.email}</Text>
            </View>
            <View style={{ height: 8 }} />
            <View style={styles.infoTextView}>
                <AntDesign name="phone" style={styles.icon} />
                <Text style={styles.infoText}>{user.phoneNumber ? user.phoneNumber : 'Unknown'}</Text>
            </View>
            <View style={{ height: 32 }} />
            <View style={styles.buttonView}>
                <ShowQrCodeButton setModalVisible={setQrModalVisible} />
            </View>
            <View style={styles.buttonView}>
                <EditProfileButton setModalVisible={setEditProfileModalVisible} />
            </View>
            <View style={styles.buttonViewSignOut}>
                <SignOutButton />
            </View>
        </View>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 8,
        paddingHorizontal: 8,
        backgroundColor: 'white'
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 150
    },
    userName: {
        paddingLeft: 8,
        fontSize: 25
    },
    buttonView: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 8
    },
    infoTextView: {
        width: '100%',
        flexDirection: 'row',
        alignContent: 'center',
        borderRadius: 6,
        borderWidth: 1,
        padding: 8
    },
    infoText: {
        fontSize: 20
    },
    icon: {
        fontSize: 20,
        alignSelf: 'center',
        paddingRight: 8
    },
    buttonViewSignOut: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 8,
        flex: 1,
        alignItems: 'flex-end',
        paddingBottom: 115
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
    textInputView: {
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        padding: 8
    }
})