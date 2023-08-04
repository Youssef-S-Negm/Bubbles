import { FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useState, useEffect } from 'react'
import { getUserById } from '../../db/users'
import { removeUserFromGroupChat } from '../../db/chats'

const EditGroupMemberModal = ({ modalVisible, setModalVisible, chatId, user, setUser }) => {
  if (user) {
    return (
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false)
          setUser(null)
        }}
        style={{ flex: 1 }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Selected user:</Text>
            <View style={styles.userInfo}>
              <Image
                source={user.photoURL ? { uri: user.photoURL } : require('../../assets/avatar.png')}
                style={{ height: 50, width: 50, borderRadius: 50, backgroundColor: 'white' }}
              />
              <Text style={{ marginLeft: 8 }}>{user.displayName}</Text>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => {
                  setUser(null)
                  setModalVisible(false)
                }}
              >
                <Text style={{ color: 'grey', fontSize: 18 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  await removeUserFromGroupChat(chatId, user.id)
                  setUser(null)
                  setModalVisible(false)
                }}
              >
                <Text style={{ color: 'red', fontSize: 18 }}>Remove</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setUser(null)
                  setModalVisible(false)
                }}
              >
                <Text style={{ color: 'green', fontSize: 18 }}>Set as admin</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}

const GroupChatInfoScreen = ({ navigation, route }) => {
  const { between, userRole, chatId } = route.params
  const [adminMemebers, setAdminMemebers] = useState([])
  const [groupMemebers, setGroupMemebers] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [userToRemove, setUserToRemove] = useState(null)

  useEffect(() => {
    const admins = []
    const members = []

    const getUsers = async () => {
      await Promise.all(between.map(async user => {
        const userObj = { ...await getUserById(user.id), role: user.role }
        return userObj
      }))
        .then(users => {
          users.forEach(user => {
            if (user.role === 'admin') {
              admins.push(user)
            }
            if (user.role === 'user') {
              members.push(user)
            }
          })
          admins.sort((a, b) => a.displayName.toUpperCase() < b.displayName.toUpperCase() ? -1 : a.displayName.toUpperCase() > b.displayName.toUpperCase() ? 1 : 0)
          members.sort((a, b) => a.displayName.toUpperCase() < b.displayName.toUpperCase() ? -1 : a.displayName.toUpperCase() > b.displayName.toUpperCase() ? 1 : 0)
          setAdminMemebers(admins)
          setGroupMemebers(members)
        })
    }

    getUsers()
  }, [])

  const AdminUserItem = ({ item }) => {
    return (
      <View style={{ padding: 8, backgroundColor: '#e4e4e4', borderRadius: 6, flexDirection: 'row', alignItems: 'center' }}>
        <View style={styles.userInfo}>
          <Image
            source={item.photoURL ? { uri: item.photoURL } : require('../../assets/avatar.png')}
            style={{ height: 50, width: 50, borderRadius: 50, backgroundColor: 'white' }}
          />
          <Text style={{ marginLeft: 8 }}>{item.displayName}</Text>
        </View>
      </View>
    )
  }

  const MemeberUserItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{ padding: 8, backgroundColor: '#e4e4e4', borderRadius: 6, flexDirection: 'row', alignItems: 'center' }}
        onPress={() => {
          if (userRole === 'admin') {
            setUserToRemove(item)
            setModalVisible(true)
          }
        }}
      >
        <View style={styles.userInfo}>
          <Image
            source={item.photoURL ? { uri: item.photoURL } : require('../../assets/avatar.png')}
            style={{ height: 50, width: 50, borderRadius: 50, backgroundColor: 'white' }}
          />
          <Text style={{ marginLeft: 8 }}>{item.displayName}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <EditGroupMemberModal
        chatId={chatId}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setUser={setUserToRemove}
        user={userToRemove}
      />
      <Text style={{ ...styles.title, marginTop: 0 }}>Group admins</Text>
      <FlatList
        data={adminMemebers}
        renderItem={({ item }) => <AdminUserItem item={item} />}
        ItemSeparatorComponent={<View style={{ height: 8 }} />}
        style={styles.list}
      />
      <Text style={styles.title}>Group members</Text>
      <FlatList
        data={groupMemebers}
        renderItem={({ item }) => <MemeberUserItem item={item} />}
        ItemSeparatorComponent={<View style={{ height: 8 }} />}
        style={styles.list}
      />
    </View>
  )
}

export default GroupChatInfoScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 8
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginVertical: 8
  },
  list: {
    flexGrow: 0,
    maxHeight: '50%'
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
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 18,
    alignSelf: 'flex-start'
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 300,
    marginTop: 16
  }
})