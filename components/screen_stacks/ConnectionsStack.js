import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import PendingRequestsScreen from "../screens/PendingRequestsScreen";
import SentRequestsScreen from "../screens/SentRequestsScreen";
import { getUserById, userSubscribeListener } from "../../db/users";
import { auth } from "../../db/config";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import YourConnectionsScreen from "../screens/YourConnectionsScreen";

const Tab = createMaterialTopTabNavigator()

const ConnectionsStack = () => {
    const [pendingUsers, setPendingUsers] = useState([])
    const [sentRequestsToUsers, setSentRequestsToUsers] = useState([])
    const [yourConnections, setYourConnections] = useState([])

    useEffect(() => {
        getUserById(auth.currentUser.uid).then(async currentUser => {
            await Promise.all([
                await Promise.all(currentUser.pendingRequests.map(getUserById)),
                await Promise.all(currentUser.sentRequests.map(getUserById)),
                await Promise.all(currentUser.connections.map(getUserById))
            ]).then(([pending, sent, connections]) => {
                connections.sort((a, b) => a.displayName.toUpperCase() < b.displayName.toUpperCase() ? -1 : a.displayName.toUpperCase() > b.displayName.toUpperCase() ? 1 : 0)
                setPendingUsers(pending)
                setSentRequestsToUsers(sent)
                setYourConnections(connections)
            })
        });

        const unsubscribe = userSubscribeListener(auth.currentUser.uid, ({ change }) => {
            if (change.type === "modified") {
                getUserById(auth.currentUser.uid).then(async currentUser => {
                    await Promise.all([
                        await Promise.all(currentUser.pendingRequests.map(getUserById)),
                        await Promise.all(currentUser.sentRequests.map(getUserById)),
                        await Promise.all(currentUser.connections.map(getUserById))
                    ]).then(([pending, sent, connections]) => {
                        connections.sort((a, b) => a.displayName.toUpperCase() < b.displayName.toUpperCase() ? -1 : a.displayName.toUpperCase() > b.displayName.toUpperCase() ? 1 : 0)
                        setPendingUsers(pending)
                        setSentRequestsToUsers(sent)
                        setYourConnections(connections)
                    })
                });
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarShowLabel: false,
                tabBarIcon: ({ focused }) => {
                    if (route.name === 'Pending requests') {
                        return <Text style={{
                            color: focused ? '#323D98' : '#EBEBE4',
                            fontSize: 12
                        }}>Pending requests</Text>
                    } else if (route.name === 'Sent requests') {
                        return <Text style={{
                            color: focused ? '#323D98' : '#EBEBE4',
                            fontSize: 12
                        }}>Sent requests</Text>
                    } else if (route.name === 'Your connections') {
                        return <Text style={{
                            color: focused ? '#323D98' : '#EBEBE4',
                            fontSize: 12
                        }}>Your connections</Text>
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
            <Tab.Screen name="Pending requests">
                {props => <PendingRequestsScreen {...props} pendingUsers={pendingUsers} setPendingUsers={setPendingUsers} />}
            </Tab.Screen>
            <Tab.Screen name="Sent requests">
                {props => <SentRequestsScreen {...props} sentRequests={sentRequestsToUsers} setSentRequests={setSentRequestsToUsers} />}
            </Tab.Screen>
            <Tab.Screen name="Your connections">
                {props => <YourConnectionsScreen {...props} yourConnections={yourConnections} setYourConnections={setYourConnections} />}
            </Tab.Screen>
        </Tab.Navigator>
    )
}

export default ConnectionsStack