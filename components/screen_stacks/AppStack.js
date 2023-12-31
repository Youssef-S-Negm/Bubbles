import { StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import ChatTab from '../tabs/ChatTab'
import FindTab from '../tabs/FindTab'
import ProfileScreen from '../screens/ProfileScreen'
import ProfileTab from '../tabs/ProfileTab'
import FindUserStack from './FindUserStack'
import ConnectionsStack from './ConnectionsStack'
import ConnectionsTab from '../tabs/ConnectionsTab'
import ChatStack from './ChatStack'

const Tab = createBottomTabNavigator()

const AppTabs = ({ user, setUser }) => {
    return (
        <Tab.Navigator
            initialRouteName='Chats'
            screenOptions={({ route }) => ({
                tabBarShowLabel: false,
                tabBarStyle: styles.tabBarStyle,
                tabBarIcon: ({ focused }) => {
                    if (route.name === 'Home') {
                        return <ChatTab focused={focused} />
                    } else if (route.name === 'Find') {
                        return <FindTab focused={focused} />
                    } else if (route.name === 'Connections') {
                        return <ConnectionsTab focused={focused} />
                    } else if (route.name === 'Profile') {
                        return <ProfileTab focused={focused} user={user} />
                    }
                }
            })}
        >
            <Tab.Screen
                name='Home'
                component={ChatStack}
                options={{
                    headerShown: false
                }}
            />
            <Tab.Screen
                name='Find'
                options={{
                    headerShown: false
                }}
            >
                {props => <FindUserStack {...props} user={user} />}
            </Tab.Screen>
            <Tab.Screen name='Connections'>
                {props => <ConnectionsStack {...props} user={user} />}
            </Tab.Screen>
            <Tab.Screen
                name='Profile'
            >
                {(props) => <ProfileScreen {...props} user={user} setUser={setUser} />}
            </Tab.Screen>
        </Tab.Navigator>
    )
}

const AppStack = ({ user, setUser }) => {
    return (
        <NavigationContainer>
            <AppTabs user={user} setUser={setUser} />
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