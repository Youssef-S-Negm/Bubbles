import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { cancelRequest, getUserById } from '../../db/users'
import { LinearGradient } from 'expo-linear-gradient'
import MaskedView from '@react-native-masked-view/masked-view'
import { MaterialIcons } from '@expo/vector-icons'
import { auth } from '../../db/config'
import { useState } from 'react'

const NoSentRequests = () => {
  return (
    <MaskedView
      style={{ flex: 1, flexDirection: 'row' }}
      maskElement={
        <View style={{ flex: 1, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name="cancel-schedule-send" style={{ fontSize: 60 }} />
          <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>You haven't sent any requests recently</Text>
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

const SentRequestsScreen = ({ sentRequests, setSentRequests }) => {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    getUserById(auth.currentUser.uid)
      .then(async currentUser => {
        await Promise.all(currentUser.sentRequests.map(getUserById))
          .then(users => {
            setSentRequests(users)
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
              await cancelRequest(item.id)
            }}
          >
            <Text style={{ color: 'red' }}>Cancel request</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {sentRequests.length === 0 ?
        <NoSentRequests /> :
        <FlatList
          data={sentRequests}
          renderItem={({ item }) => <UserItem item={item} />}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={<View style={{ height: 8 }} />}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
        />}
    </View>
  )
}

export default SentRequestsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 8,
    paddingHorizontal: 8
  }
})