import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen";

const Stack = createNativeStackNavigator()

const ChatStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Chats" component={HomeScreen} />
            <Stack.Screen name="Conversation" component={ChatScreen} />
        </Stack.Navigator>
    )
}

export default ChatStack