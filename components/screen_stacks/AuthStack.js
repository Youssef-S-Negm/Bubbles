import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import SignInScreen from '../screens/SignInScreen'
import SignUpScreen from '../screens/SignUpScreen'
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen'
import { View } from 'react-native'

const Stack = createNativeStackNavigator()

const AuthStack = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name='Sign In'
                    component={SignInScreen}
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen name='Sign Up' component={SignUpScreen} />
                <Stack.Screen name='Forgot password' component={ForgotPasswordScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AuthStack