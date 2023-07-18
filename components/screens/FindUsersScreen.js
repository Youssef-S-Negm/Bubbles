import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useEffect, useState } from 'react'
import { AntDesign, MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../db/config';
import { sendRequest } from '../../db/users';

const SearchForAUser = () => {
  return (
    <MaskedView
      style={{ flex: 1, flexDirection: 'row' }}
      maskElement={
        <View style={{ flex: 1, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }}>
          <MaterialCommunityIcons name="account-search" style={{ fontSize: 60 }} />
          <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>Try searching for a username</Text>
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
          <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>User not found</Text>
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

const UserItem = ({ item }) => {
  return (
    <View style={{ flexDirection: 'row', width: '100%', padding: 8, alignItems: 'center', borderRadius: 8, backgroundColor: '#EBEBE4', elevation: 5 }}>
      <Image
        source={item.photoURL ? { uri: item.photoURL } : require('../../assets/avatar.png')}
        style={{ height: 50, width: 50, borderRadius: 50 }}
      />
      <Text style={{ paddingLeft: 8 }}>{item.displayName}</Text>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
        <TouchableOpacity
          onPress={async () => {
            await sendRequest(item.id)
          }}
        >
          <Ionicons name="person-add" style={{ fontSize: 20 }} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const FindUsersScreen = ({ navigation, user }) => {
  const [username, setUsername] = useState('')
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const subscribe = onSnapshot(query(collection(db, 'users')), querySnapshot => {
      const users = [];
      setIsLoading(true)

      querySnapshot.forEach(documentSnapshot => {
        if (documentSnapshot.id != user.id && documentSnapshot.data().displayName.toUpperCase().includes(username.toUpperCase()) && username.length > 0) {
          users.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id
          })
        }
      });
      setUsers(users);
      setIsLoading(false)
    });

    return () => subscribe();
  }, [username]);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', borderWidth: 1, borderRadius: 8, alignItems: 'center' }}>
        <TextInput
          placeholder='Type a username'
          style={styles.textInput}
          value={username}
          onChangeText={e => setUsername(e)}
        />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Scan QR code')
          }}
        >
          <AntDesign
            name="camerao"
            size={24}
            color="black"
            style={{ paddingLeft: 8 }}
          />
        </TouchableOpacity>
      </View>
      {users.length === 0 && username.length === 0 ? <SearchForAUser />
        : users.length !== 0 || isLoading ?
          <View style={{ paddingTop: 8, flex: 1 }}>
            <FlatList
              data={users}
              renderItem={({ item }) => <UserItem item={item} userId={user.id} />}
              ItemSeparatorComponent={<View style={{ height: 8 }} />}
              keyExtractor={item => item.id}
            />
          </View> : <NoUserExist />}
    </View>
  )
}

export default FindUsersScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
    paddingHorizontal: 8,
    backgroundColor: 'white'
  },
  textInput: {
    padding: 8,
    width: '88%'
  },
  activityIndicatorContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center'
  }
})