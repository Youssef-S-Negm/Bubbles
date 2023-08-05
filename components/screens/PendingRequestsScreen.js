import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connectUsers, getUserById, refuseConnection } from '../../db/users'
import { Image } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import MaskedView from '@react-native-masked-view/masked-view'
import { useState } from 'react'
import { auth } from '../../db/config'

const NoPendingRequests = () => {
  return (
    <MaskedView
      style={{ flex: 1, flexDirection: 'row' }}
      maskElement={
        <View style={{ flex: 1, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name="pending" style={{ fontSize: 60 }} />
          <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>You don't have pending requests</Text>
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

const PendingRequestsScreen = ({ pendingUsers, setPendingUsers }) => {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    getUserById(auth.currentUser.uid)
      .then(async currentUser => {
        await Promise.all(currentUser.pendingRequests.map(getUserById))
          .then(users => {
            setPendingUsers(users)
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
            onPress={async () => {
              await refuseConnection(item.id)
            }}
          >
            <Text style={{ color: 'red' }}>Decline</Text>
          </TouchableOpacity>
          <View style={{ width: 32 }} />
          <TouchableOpacity
            onPress={async () => {
              await connectUsers(item.id)
            }}
          >
            <Text style={{ color: 'green' }}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {pendingUsers.length === 0 ?
        <NoPendingRequests />
        :
        <FlatList
          data={pendingUsers}
          renderItem={({ item }) => <UserItem item={item} />}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={<View style={{ height: 8 }} />}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
        />}
    </View>
  )
}

export default PendingRequestsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 8,
    paddingHorizontal: 8
  }
})