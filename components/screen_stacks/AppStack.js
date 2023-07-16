import { StyleSheet, View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import HomeScreen from '../screens/HomeScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import FindUsersScreen from '../screens/FindUsersScreen'
import ChatTab from '../tabs/ChatTab'
import FindTab from '../tabs/FindTab'
import ProfileScreen from '../screens/ProfileScreen'
import ProfileTab from '../tabs/ProfileTab'

const Tab = createBottomTabNavigator()

const AppTabs = ({ user, setUser }) => {
    return (
        <Tab.Navigator
            initialRouteName='Chats'
            screenOptions={({ route }) => ({
                tabBarShowLabel: false,
                tabBarStyle: styles.tabBarStyle,
                tabBarIcon: ({ focused }) => {
                    if (route.name === 'Chats') {
                        return <ChatTab focused={focused} />
                    } else if (route.name === 'Find') {
                        return <FindTab focused={focused} />
                    } else if (route.name === 'Profile') {
                        return <ProfileTab focused={focused} user={user} />
                    }
                }
            })}
        >
            <Tab.Screen
                name='Chats'
            >
                {(props) => <HomeScreen {...props} user={user} />}
            </Tab.Screen>
            <Tab.Screen
                name='Find'
                component={FindUsersScreen}
            />
            <Tab.Screen
                name='Profile'
            >
                {(props) => <ProfileScreen {...props} user={user} setUser={setUser}/>}
            </Tab.Screen>
        </Tab.Navigator>
    )
}

const AppStack = ({ user, setUser }) => {
    return (
        <NavigationContainer>
            <AppTabs user={user} setUser={setUser}/>
        </NavigationContainer>
    )
}

export default AppStack

const styles = StyleSheet.create({
    tabBarStyle: {
        position: 'absolute',
        bottom: 20,
        left: 16,
        right: 16,
        backgroundColor: 'white',
        borderRadius: 10,
        height: 60,
        elevation: 3
    }
})