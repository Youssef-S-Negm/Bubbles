import { StyleSheet, View, Text, Image, TouchableOpacity, ActivityIndicator, FlatList, Dimensions } from 'react-native'
import { useState, useEffect } from 'react'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import * as FileSystem from 'expo-file-system'
import * as IntentLauncher from 'expo-intent-launcher'
import { downloadAttachment } from '../../db/chats'

const { width, height } = Dimensions.get('window')

const AttachmentItem = ({ item, chatId, setUpdated, updated }) => {
  return (
    <View
      style={{
        margin: 4,
        width: width / 5,
        height: height / 5,
      }}
    >
      {item.mimeType.includes('image') ?
        <ImageAttachmentItem
          attachment={item}
          chatId={chatId}
          setUpdated={setUpdated}
          updated={updated}
        />
        :
        null}
    </View>
  )
}

const ImageAttachmentItem = ({ attachment, chatId, setUpdated, updated }) => {
  const [doesExist, setDoesExist] = useState(false)
  const [isDownloaded, setIsDownloaded] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [localUri, setLocalUri] = useState(null)

  const checkIfFileExists = async () => {
    let fileInfo = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}/${chatId}/attachments/${attachment.name}`)

    if (fileInfo.exists) {
      setIsDownloaded(true)
      setLocalUri(fileInfo.uri)
    }
    setDoesExist(fileInfo.exists)
  }

  useEffect(() => {
    checkIfFileExists()
  }, [updated])

  useEffect(() => {
    if (isDownloaded) {
      checkIfFileExists()
    }
  }, [isDownloaded])

  return (
    <View>
      <Image
        source={{ uri: localUri ? localUri : attachment.url }}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 16,
          backgroundColor: 'black'
        }}
        resizeMode='contain'
      />
      {doesExist ?
        <TouchableOpacity
          style={{
            position: 'absolute',
            alignSelf: 'flex-end',
            padding: 8
          }}
          onPress={() => {
            FileSystem.getContentUriAsync(`${FileSystem.documentDirectory}/${chatId}/attachments/${attachment.name}`).then(async cUri => {
              await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                data: cUri,
                flags: 1,
                type: attachment.mimeType
              })
            })
          }}
        >
          <Ionicons
            name='open-outline'
            color={'white'}
            size={20}
          />
        </TouchableOpacity>
        :
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
              setIsDownloaded(!isDownloaded)
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

const AllChatAttachmentsScreen = ({ attachments, chatId, setUpdated, updated }) => {
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
        numColumns={4}
        keyExtractor={item => item.url}
        ItemSeparatorComponent={<View style={{ height: 4 }} />}
      />
    </View>
  )
}

export default AllChatAttachmentsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 8,
    justifyContent: 'center'
  }
})