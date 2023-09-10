import { StyleSheet, View, Image, TouchableOpacity, ToastAndroid, Modal, Text, FlatList, Dimensions } from 'react-native'
import { useState, useEffect } from 'react'
import { Ionicons, AntDesign } from '@expo/vector-icons'
import * as FileSystem from 'expo-file-system'
import * as IntentLauncher from 'expo-intent-launcher'
import { deleteAttachmentFromLocalStorage } from '../../db/chats'

const { width, height } = Dimensions.get('window')

const AttachmentItem = ({ item, chatId, setUpdated, setModalVisible, setChosenAttachment }) => {
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
          setModalVisible={setModalVisible}
          setChosenAttachment={setChosenAttachment}
        />
        :
        null}
    </View>
  )
}

const ImageAttachmentItem = ({ attachment, chatId, setModalVisible, setChosenAttachment }) => {
  const [doesExist, setDoesExist] = useState(false)
  const [isDownloaded, setIsDownloaded] = useState(false)
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
  }, [])

  useEffect(() => {
    if (isDownloaded) {
      checkIfFileExists()
    }
  }, [isDownloaded])

  return (
    <View>
      <Image
        source={{ uri: localUri }}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 16,
          backgroundColor: 'black'
        }}
        resizeMode='contain'
      />
      <TouchableOpacity
        style={{
          position: 'absolute',
          alignSelf: 'flex-end',
          padding: 8
        }}
        onPress={() => {
          FileSystem.getContentUriAsync(`${FileSystem.documentDirectory}/${chatId}/attachments/${attachment.name}`)
            .then(async cUri => {
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
      <View
        style={{
          position: 'absolute',
          width: '100%',
          top: '52%'
        }}
      >
        <TouchableOpacity
          style={{
            alignSelf: 'flex-end',
            padding: 8,
          }}
          onPress={() => {
            setChosenAttachment(attachment)
            setModalVisible(true)
          }}
        >
          <AntDesign
            name='delete'
            color={'white'}
            size={20}
          />
        </TouchableOpacity>
        <Text style={{
          color: 'white',
          position: 'absolute',
          marginHorizontal: 4,
          marginTop: 4,
          top: '70%'
        }}>{attachment.name}</Text>
      </View>
    </View>
  )
}

const ConfirmDeleteAttachmentModal = ({ attachment, setModalVisible, modalVisible, chatId, setUpdated, updated }) => {
  if (attachment) {
    return (
      <Modal
        animationType='slide'
        onRequestClose={() => {
          setModalVisible(false)
        }}
        visible={modalVisible}
        transparent={true}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Would you like to delete this attachment?</Text>
            {
              attachment.mimeType.includes('image') ?
                <Image
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: 16
                  }}
                  source={{ uri: `${FileSystem.documentDirectory}/${chatId}/attachments/${attachment.name}` }}
                />
                :
                null
            }
            <Text style={{ fontSize: 16 }}>{attachment.name}</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: 200,
                marginTop: 16
              }}
            >
              <TouchableOpacity
                style={{
                  padding: 8
                }}
                onPress={() => {
                  setModalVisible(false)
                }}
              >
                <Text style={{ fontSize: 16, color: 'red' }}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  padding: 8
                }}
                onPress={async () => {
                  await deleteAttachmentFromLocalStorage(chatId, attachment.name)
                  setModalVisible(false)
                  setUpdated(!updated)
                }}
              >
                <Text style={{ fontSize: 16, color: 'green' }}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}

const SavedChatAttachmentsScreen = ({ attachments, chatId, setUpdated, updated }) => {
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false)
  const [chosenAttachment, setChosenAttachment] = useState(null)

  return (
    <View style={styles.container}>
      <ConfirmDeleteAttachmentModal
        attachment={chosenAttachment}
        setModalVisible={setConfirmDeleteModalVisible}
        modalVisible={confirmDeleteModalVisible}
        setUpdated={setUpdated}
        updated={updated}
        chatId={chatId}
      />
      <FlatList
        data={attachments}
        renderItem={({ item }) => <AttachmentItem
          chatId={chatId}
          item={item}
          setChosenAttachment={setChosenAttachment}
          setModalVisible={setConfirmDeleteModalVisible}
          setUpdated={setUpdated}
        />}
        numColumns={4}
        keyExtractor={item => item.url}
      />
      {/* {
        attachments.map((attachment, index) => {
          return <AttachmentItem
            chatId={chatId}
            item={attachment}
            setUpdated={setUpdated}
            setModalVisible={setConfirmDeleteModalVisible}
            setChosenAttachment={setChosenAttachment}
            key={index}
          />
        })
      } */}
    </View>
  )
}

export default SavedChatAttachmentsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 8
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    elevation: 5
  },
  modalTitle: {
    paddingBottom: 8,
    fontWeight: 'bold',
    fontSize: 16
  }
})