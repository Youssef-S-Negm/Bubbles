import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const SentRequestsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>SentRequestsScreen</Text>
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