import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useState, useEffect } from 'react'
import { Ionicons, Fontisto, MaterialIcons } from '@expo/vector-icons'
import { getUserById } from '../../db/users'
import { auth } from '../../db/config'
import { addUserToGroupChat } from '../../db/chats'
import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'

const NoUsersToAdd = () => {
  return (
    <MaskedView
      style={{ flex: 1, flexDirection: 'row' }}
      maskElement={
        <View style={{ flex: 1, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }}>
          <Fontisto name="persons" style={{ fontSize: 60 }} />
          <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>All connected users joined the group.</Text>
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

const NoUserExist = () => {
  return (
    <MaskedView
      style={{ flex: 1, flexDirection: 'row' }}
      maskElement={
        <View style={{ flex: 1, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name="search-off" style={{ fontSize: 60 }} />
          <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>No user exist in your cennections with this username.</Text>
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

const AddUserToGroupChatScreen = ({ route, navigation }) => {
  const { chatId, between } = route.params
  const [username, setUsername] = useState('')
  const [users, setUsers] = useState([])
  const [displayedUsers, setDisplayedUsers] = useState([])

  const UserItem = ({ item, chatId }) => {
    return (
      <View style={{ padding: 8, backgroundColor: '#e4e4e4', borderRadius: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={item.photoURL ? { uri: item.photoURL } : require('../../assets/avatar.png')}
            style={{ height: 50, width: 50, borderRadius: 50, backgroundColor: 'white' }}
          />
          <Text style={{ marginLeft: 8 }}>{item.displayName}</Text>
        </View>
        <TouchableOpacity
          onPress={async () => {
            await addUserToGroupChat(chatId, item.id)
            navigation.goBack()
          }}
        >
          <Ionicons name='add' size={20} />
        </TouchableOpacity>
      </View>
    )
  }

  useEffect(() => {
    getUserById(auth.currentUser.uid)
      .then(async user => {
        await Promise.all(user.connections.map(getUserById))
          .then(users => {
            const filteredUsersArray = users.filter(e => {
              return !between.some(b => {
                return b.id === e.id
              })
            })
            filteredUsersArray.sort((a, b) => a.displayName.toUpperCase() < b.displayName.toUpperCase() ? -1 : a.displayName.toUpperCase() > b.displayName.toUpperCase() ? 1 : 0)
            setUsers(filteredUsersArray)
            setDisplayedUsers(filteredUsersArray)
          })
      })
  }, [])

  useEffect(() => {
    setDisplayedUsers(users.filter(e => {
      return e.displayName.toUpperCase().includes(username.toUpperCase())
    }))
  }, [username])

  if (users.length === 0) {
    return (
      <View style={styles.container}>
        <NoUsersToAdd />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputView}>
        <Ionicons name='person-outline' size={20} />
        <TextInput
          placeholder='Enter username'
          value={username}
          onChangeText={e => setUsername(e)}
          style={styles.textInput}
        />
      </View>
      {displayedUsers.length === 0 ?
        <NoUserExist />
        :
        <FlatList
          data={displayedUsers}
          renderItem={({ item }) => <UserItem item={item} chatId={chatId} />}
          ItemSeparatorComponent={<View style={{ height: 8 }} />}
        />}
    </View>
  )
}

export default AddUserToGroupChatScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingTop: 8
  },
  inputView: {
    flexDirection: 'row',
    width: '100%',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 8
  },
  textInput: {
    width: '100%',
    marginLeft: 8
  }
})