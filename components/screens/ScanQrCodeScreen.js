import { Image, Modal, StyleSheet, Text, View } from 'react-native'
import { useEffect, useState } from 'react'
import { BarCodeScanner } from 'expo-barcode-scanner';
import { getUserById } from '../../db/users';
import ConfirmAddUserButton from '../buttons/ConfirmAddUserButton';
import RejectAddUserButton from '../buttons/RejectAddUserButton';

const ScanQrCodeScreen = ({ navigation, user }) => {
    const [hasPermission, setHasPermission] = useState(null)
    const [scanned, setScanned] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [scannedUser, setScannedUser] = useState(null)

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getBarCodeScannerPermissions();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        getUserById(data).then(e => {
            if (e.id === user.id) {
                alert("You can't add yourself")
            } else {
                setScannedUser(e)
                setModalVisible(true)
            }
        })
    };

    const ConfirmModal = () => {
        return (
            <Modal
                animationType='slide'
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false)
                    setScannedUser(null)
                    setScanned(false)
                }}
                style={{ flex: 1 }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        {scannedUser === null ?
                            <Text>User doesn't exist</Text>
                            :
                            <View>
                                <Text style={{ paddingBottom: 8 }}>Would like to connect with this user?</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 8 }}>
                                    <Image
                                        source={scannedUser.photoURL ? { uri: scannedUser.photoURL } : require('../../assets/avatar.png')}
                                        style={{ height: 50, width: 50, borderRadius: 50 }}
                                    />
                                    <Text style={{ paddingLeft: 8 }}>{scannedUser.displayName}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <RejectAddUserButton
                                        setModalVisible={setModalVisible}
                                        setScanned={setScanned}
                                        setUser={setScannedUser}
                                        navigation={navigation}
                                    />
                                    <ConfirmAddUserButton
                                        setModalVisible={setModalVisible}
                                        setScanned={setScanned}
                                        user={scannedUser}
                                        setUser={setScannedUser}
                                        navigation={navigation}
                                    />
                                </View>
                            </View>
                        }
                    </View>
                </View>
            </Modal>
        )
    }

    return (
        <View style={styles.container}>
            <ConfirmModal />
            {hasPermission === null ?
                <Text>Requesting for camera permission</Text>
                : hasPermission ?
                    <BarCodeScanner
                        style={styles.scanner}
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    />
                    : <Text>No access to camera</Text>}

        </View>
    )
}

export default ScanQrCodeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 8,
        paddingTop: 8,
        backgroundColor: 'white',
        alignItems: 'center'
    },
    scanner: {
        width: '80%',
        height: '80%'
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