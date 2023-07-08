import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { signIn } from '../../db/auth'

const SignInButton = ({email, password}) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => {
                signIn(email, password)
            }}
        >
            <LinearGradient
                colors={['#c4ddfe', '#fed8f7']}
                start={{ x: 0.3, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <View style={styles.buttonText}>
                    <Text style={styles.signInText}>Sign In</Text>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    )
}

export default SignInButton

const styles = StyleSheet.create({
    container: {
        width: 252.5
    },
    signInText: {
        textAlign: 'center',
        fontSize: 20
    },
    gradient: {
        borderRadius: 6,
        padding: 2.5,
    },
    buttonText: {
        backgroundColor: 'white',
        padding: 6,
        borderRadius: 6
    }
})