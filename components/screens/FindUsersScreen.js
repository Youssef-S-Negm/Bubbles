import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'

const FindUsersScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={{fontSize: 20, paddingBottom: 8}}>Find a user</Text>
      <TextInput placeholder='Type a user name' style={styles.textInput}/>
    </View>
  )
}

export default FindUsersScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
    paddingHorizontal: 8
  },
  textInput: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 6
  }
})