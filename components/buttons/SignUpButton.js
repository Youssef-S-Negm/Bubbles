import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'

const SignUpButton = () => {
  return (
    <TouchableOpacity
            style={styles.container}
            onPress={() => {
                //TODO
            }}
        >
            <LinearGradient
                colors={['#c4ddfe', '#fed8f7']}
                start={{ x: 0.3, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <View style={styles.buttonText}>
                    <Text style={styles.signUpText}>Sign Up</Text>
                </View>
            </LinearGradient>
        </TouchableOpacity>
  )
}

export default SignUpButton

const styles = StyleSheet.create({
    container: {
        flex: 0.7
    },
    signUpText: {
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