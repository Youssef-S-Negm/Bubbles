import { ActivityIndicator, FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useState, useEffect } from 'react'
import { getUserById } from '../../db/users'
import { changeGroupName, changeGroupPhoto, removeUserFromGroupChat, setUserAsGroupAdmin } from '../../db/chats'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../db/config'
import { AntDesign } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import * as ImagePicker from 'expo-image-picker'

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
                  await removeUserFromGroupChat(chatId, user.id, 'user')
                  setUser(null)
                  setModalVisible(false)
                }}
              >
                <Text style={{ color: 'red', fontSize: 18 }}>Remove</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  await setUserAsGroupAdmin(chatId, user.id)
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

const EditGroupInfoModal = ({ modalVisible, setModalVisible, chatId, groupName, photoURL }) => {
  const [chatName, setChatName] = useState(groupName)
  const [chosenGroupImage, setChosenGroupImage] = useState(null)
  const [confirmProfilePictureUploadModalVisible, setConfirmProfilePictureUploadModalVisible] = useState(false)

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    })

    if (!result.canceled) {
      setChosenGroupImage(result.assets[0].uri)
      setConfirmProfilePictureUploadModalVisible(true)
    }
  }

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType='slide'
      onRequestClose={() => {
        setModalVisible(false)
      }}
    >
      <ConfirmGroupImageUploadModal
        image={chosenGroupImage}
        modalVisible={confirmProfilePictureUploadModalVisible}
        setModalVisible={setConfirmProfilePictureUploadModalVisible}
        setParentModalVisble={setModalVisible}
        setImage={setChosenGroupImage}
        chatId={chatId}
      />
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Edit group info:</Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ marginRight: 8 }}>
              <Image
                source={photoURL ? { uri: photoURL } : require('../../assets/group-avatar.png')}
                style={styles.image}
              />
              <TouchableOpacity
                style={{ position: 'absolute', alignSelf: 'flex-end', top: 60 }}
                onPress={pickImage}
              >
                <LinearGradient
                  colors={['#00736e', '#6a00c9']}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={{ padding: 8, borderRadius: 25 }}
                >
                  <AntDesign name='edit' color={'white'} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <TextInput
              placeholder='Enter group name'
              style={{ padding: 8, borderWidth: 1, borderRadius: 6, marginVertical: 25 }}
              value={chatName}
              onChangeText={e => setChatName(e)}
            />
          </View>
          <View style={{ flexDirection: 'row', width: 200, justifyContent: 'space-between', marginTop: 8 }}>
            <TouchableOpacity
              style={{ padding: 8 }}
              onPress={() => {
                setModalVisible(false)
              }}
            >
              <Text style={{ fontSize: 16, color: 'grey' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ padding: 8 }}
              onPress={async () => {
                await changeGroupName(chatName, chatId)
                setModalVisible(false)
              }}
            >
              <Text style={{ fontSize: 16, color: 'green' }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const ConfirmGroupImageUploadModal = ({ modalVisible, setModalVisible, setParentModalVisble, image, setImage, chatId }) => {
  const [isUploading, setIsUploading] = useState(false)
  return (
    <Modal
      transparent={true}
      animationType='slide'
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false)
      }}
    >
      {isUploading ?
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ActivityIndicator size={200} />
          </View>
        </View>
        :
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Set this photo as the group photo?</Text>
            <Image
              source={{ uri: image }}
              style={{ height: 150, width: 150, borderRadius: 150 }}
            />
            <View style={{ flexDirection: 'row', width: 200, justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={{ padding: 8 }}
                onPress={() => {
                  setModalVisible(false)
                  setImage(null)
                }}
              >
                <Text style={{ fontSize: 16, color: 'red' }}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ padding: 8 }}
                onPress={async () => {
                  setIsUploading(true)
                  await changeGroupPhoto(image, chatId)
                  setIsUploading(false)
                  setModalVisible(false)
                  setParentModalVisble(false)
                }}
              >
                <Text style={{ fontSize: 16, color: 'green' }}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>}

    </Modal>
  )
}

const GroupChatInfoScreen = ({ navigation, route }) => {
  const { chat, userRole } = route.params
  const [adminMemebers, setAdminMemebers] = useState([])
  const [groupMemebers, setGroupMemebers] = useState([])
  const [editGroupMemberModalVisible, setEditGroupMemberModalVisible] = useState(false)
  const [editGroupInfoModalVisible, setEditGroupInfoModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [currentChat, setCurrentChat] = useState(chat)
  useEffect(() => {

    const getUsers = async () => {
      const admins = []
      const members = []
      await Promise.all(chat.between.map(async user => {
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

    const unsub = onSnapshot(doc(db, 'chats', chat.id), async doc => {
      const chatDoc = doc.data()
      setCurrentChat(chatDoc)
      const admins = []
      const members = []

      await Promise.all(chatDoc.between.map(async user => {
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
    })

    return () => {
      unsub()
    }
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
            setSelectedUser(item)
            setEditGroupMemberModalVisible(true)
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
        chatId={chat.id}
        modalVisible={editGroupMemberModalVisible}
        setModalVisible={setEditGroupMemberModalVisible}
        setUser={setSelectedUser}
        user={selectedUser}
      />
      <EditGroupInfoModal
        chatId={chat.id}
        groupName={chat.groupName}
        modalVisible={editGroupInfoModalVisible}
        setModalVisible={setEditGroupInfoModalVisible}
        photoURL={chat.photoURL}
      />
      <View style={styles.infoContainer}>
        <View style={styles.infoView}>
          <Image
            source={currentChat.photoURL ? { uri: currentChat.photoURL } : require('../../assets/group-avatar.png')}
            style={styles.image}
          />
          <Text style={{ fontSize: 20 }}>{currentChat.groupName}</Text>
        </View>
        {userRole === 'admin' ?
          <TouchableOpacity
            style={{ padding: 8 }}
            onPress={() => {
              setEditGroupInfoModalVisible(true)
            }}
          >
            <AntDesign name='edit' size={20} style={{}} />
          </TouchableOpacity>
          :
          null}
      </View>
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
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: 'white',
    marginRight: 8
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between'
  },
  infoView: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})