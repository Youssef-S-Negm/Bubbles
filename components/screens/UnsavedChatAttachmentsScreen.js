import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const UnsavedChatAttachmentsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>UnsavedChatAttachmentsScreen</Text>
    </View>
  )
}

export default UnsavedChatAttachmentsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 8
    }
})