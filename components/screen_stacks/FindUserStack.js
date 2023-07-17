import { createNativeStackNavigator } from '@react-navigation/native-stack'
import FindUsersScreen from '../screens/FindUsersScreen'
import ScanQrCodeScreen from '../screens/ScanQrCodeScreen'

const Stack = createNativeStackNavigator()

const FindUserStack = ({ user }) => {
    return (
        <Stack.Navigator initialRouteName='FindScreen'>
            <Stack.Screen
                name='FindScreen'
                options={{title: 'Find a user'}}
            >
                {props => <FindUsersScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name='Scan QR code'>
                {props => <ScanQrCodeScreen {...props} user={user} />}
            </Stack.Screen>
        </Stack.Navigator>
    )
}

export default FindUserStack