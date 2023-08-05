import { FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useState } from 'react'
import ConfirmRemoveUserButton from '../buttons/ConfirmRemoveUserButton'
import RejectRemoveUserButton from '../buttons/RejectRemoveUserButton'
import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'
import { AntDesign } from '@expo/vector-icons'
import { getUserById } from '../../db/users'
import { auth } from '../../db/config'

const NoConnections = () => {
    return (
        <MaskedView
            style={{ flex: 1, flexDirection: 'row' }}
            maskElement={
                <View style={{ flex: 1, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                    <AntDesign name="disconnect" style={{ fontSize: 60 }} />
                    <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>You don't have any connections</Text>
                </View>
            }
        >
            <LinearGradient
                colors={['#00736e', '#6a00c9']}
                style={{ flex: 1 }}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
            />
        </MaskedView>
    )
}

const YourConnectionsScreen = ({ yourConnections, setYourConnections }) => {
    const [userToBeRemoved, setUserToBeRemoved] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const handleRefresh = () => {
        setIsRefreshing(true)
        getUserById(auth.currentUser.uid)
            .then(async currentUser => {
                await Promise.all(currentUser.connections.map(getUserById))
                    .then(users => {
                        users.sort((a, b) => a.displayName.toUpperCase() < b.displayName.toUpperCase() ? -1 : a.displayName.toUpperCase() > b.displayName.toUpperCase() ? 1 : 0)
                        setYourConnections(users)
                    })
            })
        setIsRefreshing(false)
    }

    const UserItem = ({ item }) => {
        return (
            <View style={{ flexDirection: 'row', width: '100%', padding: 8, alignItems: 'center', borderRadius: 8, backgroundColor: '#EBEBE4', elevation: 5 }}>
                <Image
                    source={item.photoURL ? { uri: item.photoURL } : require('../../assets/avatar.png')}
                    style={{ height: 50, width: 50, borderRadius: 50, backgroundColor: 'white' }}
                />
                <Text style={{ paddingLeft: 8 }}>{item.displayName}</Text>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <TouchableOpacity
                        onPress={() => {
                            setUserToBeRemoved(item)
                            setModalVisible(true)
                        }}
                    >
                        <Text style={{ color: 'red' }}>remove user</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const ConfirmRemoveModal = () => {
        if (userToBeRemoved !== null) {
            return (
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setUserToBeRemoved(null)
                        setModalVisible(false)
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={{ paddingBottom: 8 }}>Would like to remove this user?</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingBottom: 8 }}>
                                <Image
                                    source={userToBeRemoved.photoURL ? { uri: userToBeRemoved.photoURL } : require('../../assets/avatar.png')}
                                    style={{ height: 50, width: 50, borderRadius: 50 }}
                                />
                                <Text style={{ paddingLeft: 8 }}>{userToBeRemoved.displayName}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <RejectRemoveUserButton setModalVisible={setModalVisible} />
                                <View style={{ width: 32 }} />
                                <ConfirmRemoveUserButton
                                    setModalVisible={setModalVisible}
                                    userId={userToBeRemoved.id}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
            )
        }
    }

    return (
        <View style={styles.container}>
            <ConfirmRemoveModal />
            {yourConnections.length === 0 ?
                <NoConnections />
                :
                <FlatList
                    data={yourConnections}
                    renderItem={({ item }) => <UserItem item={item} />}
                    keyExtractor={item => item.id}
                    ItemSeparatorComponent={<View style={{ height: 8 }} />}
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                />
            }
        </View>
    )
}

export default YourConnectionsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 8,
        paddingHorizontal: 8
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