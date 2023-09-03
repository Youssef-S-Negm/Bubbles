import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import AllChatAttachmentsScreen from '../screens/AllChatAttachmentsScreen'
import SavedChatAttachmentsScreen from '../screens/SavedChatAttachmentsScreen'
import UnsavedChatAttachmentsScreen from '../screens/UnsavedChatAttachmentsScreen'

const Tab = createMaterialTopTabNavigator()

const ChatAttachmentsStack = () => {
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
            <Tab.Screen name='All attachments' component={AllChatAttachmentsScreen} />
            <Tab.Screen name='Saved attachments' component={SavedChatAttachmentsScreen} />
            <Tab.Screen name='Unsaved attachments' component={UnsavedChatAttachmentsScreen} />
        </Tab.Navigator>
    )
}

export default ChatAttachmentsStack