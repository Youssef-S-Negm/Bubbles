import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen";
import CreateGroupChatScreen from "../screens/CreateGroupChatScreen";
import AddUserToGroupChatScreen from "../screens/AddUserToGroupChatScreen";
import GroupChatInfoScreen from "../screens/GroupChatInfoScreen";

const Stack = createNativeStackNavigator()

const ChatStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Chats" component={HomeScreen} />
            <Stack.Screen name="Conversation" component={ChatScreen} />
            <Stack.Screen name="Create group chat" component={CreateGroupChatScreen} />
            <Stack.Screen name="Add user" component={AddUserToGroupChatScreen} />
            <Stack.Screen name="Group info" component={GroupChatInfoScreen} />
        </Stack.Navigator>
    )
}

export default ChatStack