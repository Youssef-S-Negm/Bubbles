import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import PendingRequestsScreen from "../screens/PendingRequestsScreen";
import SentRequestsScreen from "../screens/SentRequestsScreen";
import { getUserById, userSubscribeListener } from "../../db/users";
import { auth } from "../../db/config";
import { useEffect, useState } from "react";

const Tab = createMaterialTopTabNavigator()

const ConnectionsStack = () => {
    const [pendingUsers, setPendingUsers] = useState([])
    const [sentRequestsToUsers, setSentRequestsToUsers] = useState([])

    useEffect(() => {
        getUserById(auth.currentUser.uid).then(async currentUser => {
            await Promise.all([
                await Promise.all(currentUser.pendingRequests.map(getUserById)),
                await Promise.all(currentUser.sentRequests.map(getUserById))
            ]).then(([pending, sent]) => {
                setPendingUsers(pending)
                setSentRequestsToUsers(sent)
            })
        });

        const unsubscribe = userSubscribeListener(auth.currentUser.uid, ({ change }) => {
            if (change.type === "modified") {
                getUserById(auth.currentUser.uid).then(async currentUser => {
                    await Promise.all([
                        await Promise.all(currentUser.pendingRequests.map(getUserById)),
                        await Promise.all(currentUser.sentRequests.map(getUserById))
                    ]).then(([pending, sent]) => {
                        setPendingUsers(pending)
                        setSentRequestsToUsers(sent)
                    })
                });
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <Tab.Navigator>
            <Tab.Screen name="Pending requests">
                {props => <PendingRequestsScreen {...props} pendingUsers={pendingUsers} />}
            </Tab.Screen>
            <Tab.Screen name="Sent requests">
                {props => <SentRequestsScreen {...props} sentRequests={sentRequestsToUsers} />}
            </Tab.Screen>
        </Tab.Navigator>
    )
}

export default ConnectionsStack