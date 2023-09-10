import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import { useState, useEffect } from 'react'
import { AntDesign } from '@expo/vector-icons'
import { downloadAttachment } from '../../db/chats'

const { width, height } = Dimensions.get('window')

const AttachmentItem = ({ item, chatId, setUpdated, updated }) => {
  return (
    <View
      style={{
        margin: 4,
        width: width / 5,
        height: height / 5
      }}
    >
      {
        item.mimeType.includes('image') ?
          <ImageAttachmentItem
            attachment={item}
            chatId={chatId}
            setUpdated={setUpdated}
            updated={updated}
          />
          :
          null
      }
    </View>
  )
}

const ImageAttachmentItem = ({ attachment, chatId, setUpdated, updated }) => {
  const [isDownloading, setIsDownloading] = useState(false)

  return (
    <View>
      <Image
        source={{ uri: attachment.url }}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 16,
          backgroundColor: 'black'
        }}
        resizeMode='contain'
      />
      {
        isDownloading ?
          <ActivityIndicator
            size={'large'}
            style={{
              position: 'absolute',
              alignSelf: 'flex-end',
              padding: 8
            }}
          />
          :
          <TouchableOpacity
            style={{
              position: 'absolute',
              alignSelf: 'flex-end',
              padding: 8
            }}
            onPress={async () => {
              setIsDownloading(true)
              await downloadAttachment(attachment.url, attachment.name, chatId, attachment.mimeType)
              setIsDownloading(false)
              setUpdated(!updated)
            }}
          >
            <AntDesign
              name='download'
              color={'white'}
              size={20}
            />
          </TouchableOpacity>
      }
      <Text style={{
        color: 'white',
        position: 'absolute',
        marginHorizontal: 4,
        top: '70%'
      }}>{attachment.name}</Text>
    </View>
  )
}

const UnsavedChatAttachmentsScreen = ({ attachments, chatId, setUpdated, updated }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={attachments}
        renderItem={({ item }) => <AttachmentItem
          item={item}
          chatId={chatId}
          setUpdated={setUpdated}
          updated={updated}
        />}
        keyExtractor={item => item.url}
        numColumns={4}
      />
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