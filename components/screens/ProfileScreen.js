import { Image, Modal, StyleSheet, Text, View } from 'react-native'
import { useState } from 'react'
import SignOutButton from '../buttons/SignOutButton'
import ShowQrCodeButton from '../buttons/ShowQrCodeButton'
import EditProfileButton from '../buttons/EditProfileButton'
import { AntDesign } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg'
import HideQrCodeButton from '../buttons/HideQrCodeButton'

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

const ProfileScreen = ({ user }) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={styles.container}>
            <QrModal modalVisible={modalVisible} setModalVisible={setModalVisible} user={user} />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                    source={user.photoURL ? { uri: user.photoURL } : require('../../assets/avatar.png')}
                    style={{ width: 150, height: 150, borderRadius: 150 }}
                    resizeMode='contain'
                />
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
                <ShowQrCodeButton setModalVisible={setModalVisible} />
            </View>
            <View style={styles.buttonView}>
                <EditProfileButton />
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
    }
})