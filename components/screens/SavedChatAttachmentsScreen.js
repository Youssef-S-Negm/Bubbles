import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const SavedChatAttachmentsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>SavedChatAttachmentsScreen</Text>
    </View>
  )
}

export default SavedChatAttachmentsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 8
    }
})