import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen";
import CreateGroupChatScreen from "../screens/CreateGroupChatScreen";

const Stack = createNativeStackNavigator()

const ChatStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Chats" component={HomeScreen} />
            <Stack.Screen name="Conversation" component={ChatScreen} />
            <Stack.Screen name="Create group chat" component={CreateGroupChatScreen} />
        </Stack.Navigator>
    )
}

export default ChatStack