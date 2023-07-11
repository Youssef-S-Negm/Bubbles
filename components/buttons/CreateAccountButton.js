import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'

const CreateAccountButton = ({ navigation }) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => {
                navigation.navigate('Sign Up')
            }}
        >
            <LinearGradient
                colors={['#c4ddfe', '#fed8f7']}
                start={{ x: 0.3, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <View style={styles.buttonText}>
                    <Text style={styles.signUpText}>Create account</Text>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    )
}

export default CreateAccountButton

const styles = StyleSheet.create({
    container: {
        width: 252.5
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