import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connectUsers, refuseConnection } from '../../db/users'
import { Image } from 'react-native'
import { MaterialIcons, Entypo } from '@expo/vector-icons'

const PendingRequestsScreen = ({ pendingUsers }) => {

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
            <Entypo name='cross' style={{ fontSize: 24, color: 'red' }} />
          </TouchableOpacity>
          <View style={{ width: 32 }} />
          <TouchableOpacity
            onPress={async () => {
              await connectUsers(item.id)
            }}
          >
            <MaterialIcons name='done' style={{ fontSize: 24, color: 'green' }} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pendingUsers}
        renderItem={({ item }) => <UserItem item={item} />}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={<View style={{ height: 8 }} />}
      />
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