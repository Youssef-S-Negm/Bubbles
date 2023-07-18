import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import PendingRequestsScreen from "../screens/PendingRequestsScreen";
import SentRequestsScreen from "../screens/SentRequestsScreen";
import { getUserById, setPendingRequestsSeenToFalse, userSubscribeListener } from "../../db/users";
import { auth } from "../../db/config";
import { useEffect, useState } from "react";

const Tab = createMaterialTopTabNavigator()

const ConnectionsStack = () => {
    const [pendingUsers, setPendingUsers] = useState([])
    

    useEffect(() => {
        getUserById(auth.currentUser.uid).then(async currentUser => {
            const users = await Promise.all(
                currentUser.pendingRequests.map(getUserById)
            )
            setPendingUsers(users)
        });

        const unsubscribe = userSubscribeListener(auth.currentUser.uid, ({ change }) => {
            if (change.type === "modified") {
                getUserById(auth.currentUser.uid).then(async currentUser => {
                    const users = await Promise.all(
                        currentUser.pendingRequests.map(getUserById)
                    )
                    setPendingUsers(users)
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
            <Tab.Screen name="Sent requests" component={SentRequestsScreen} />
        </Tab.Navigator>
    )
}

export default ConnectionsStack