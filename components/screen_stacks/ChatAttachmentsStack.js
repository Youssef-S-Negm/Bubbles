import { Text } from 'react-native'
import { useEffect, useState } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import AllChatAttachmentsScreen from '../screens/AllChatAttachmentsScreen'
import SavedChatAttachmentsScreen from '../screens/SavedChatAttachmentsScreen'
import UnsavedChatAttachmentsScreen from '../screens/UnsavedChatAttachmentsScreen'
import * as FileSystem from 'expo-file-system'

const Tab = createMaterialTopTabNavigator()

const ChatAttachmentsStack = ({ route }) => {
    const { chat } = route.params
    const [savedAttachments, setSavedAttachments] = useState([])
    const [UnsavedAttachments, setUnsavedAttachments] = useState([])
    const [updated, setUpdated] = useState(false)
    const attachmentsDirectory = `${FileSystem.documentDirectory}/${chat.id}/attachments/`

    const doesExist = async (fileName) => {
        const directory = await FileSystem.getInfoAsync(attachmentsDirectory + fileName)
        return directory.exists
    }

    const filterAttachments = () => {
        const saved = []
        const unsaved = []
        chat.allAttachments.forEach(async attachment => {
            if (await doesExist(attachment.name)) {
                saved.push(attachment)
            } else {
                unsaved.push(attachment)
            }
        });
        setSavedAttachments(saved)
        setUnsavedAttachments(unsaved)
    }

    useEffect(() => {
        filterAttachments()
    }, [updated])

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarShowLabel: false,
                tabBarIcon: ({ focused }) => {
                    if (route.name === 'All attachments') {
                        return <Text style={{
                            color: focused ? '#323D98' : '#EBEBE4',
                            fontSize: 12
                        }}
                            numberOfLines={1}
                        >
                            All
                        </Text>
                    } else if (route.name === 'Saved attachments') {
                        return <Text style={{
                            color: focused ? '#323D98' : '#EBEBE4',
                            fontSize: 12
                        }}
                            numberOfLines={1}
                        >
                            Saved
                        </Text>
                    } else if (route.name === 'Unsaved attachments') {
                        return <Text style={{
                            color: focused ? '#323D98' : '#EBEBE4',
                            fontSize: 12
                        }}
                            numberOfLines={1}
                        >
                            Unsaved
                        </Text>
                    }
                },
                tabBarIconStyle: {
                    flex: 1,
                    width: '100%',
                },
                tabBarIndicatorStyle: {
                    backgroundColor: '#323D98'
                }
            })}
        >
            <Tab.Screen name='All attachments'>
                {props => <AllChatAttachmentsScreen
                    {...props}
                    attachments={chat.allAttachments}
                    chatId={chat.id}
                    setUpdated={setUpdated}
                    updated={updated}
                />}
            </Tab.Screen>
            <Tab.Screen name='Saved attachments'>
                {props => <SavedChatAttachmentsScreen
                    {...props}
                    attachments={savedAttachments}
                    chatId={chat.id}
                    setUpdated={setUpdated}
                    updated={updated}
                />}
            </Tab.Screen>
            <Tab.Screen name='Unsaved attachments'>
                {props => <UnsavedChatAttachmentsScreen
                    {...props}
                    attachments={UnsavedAttachments}
                    chatId={chat.id}
                    setUpdated={setUpdated}
                    updated={updated}
                />}
            </Tab.Screen>
        </Tab.Navigator>
    )
}

export default ChatAttachmentsStack