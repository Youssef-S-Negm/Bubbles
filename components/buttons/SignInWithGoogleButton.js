import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import { signInWithGoogle } from '../../db/auth'

const SignInWithGoogleButton = () => {
    return (
        <TouchableOpacity
            onPress={() => {
                signInWithGoogle()
            }}
        >
            <View style={styles.container}>
                <Image
                    source={require('../../assets/googleIcon.png')}
                    style={styles.imgae}
                />
                <View style={{ paddingVertical: 8 }}>
                    <Text style={styles.text}>Sign In with Google</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default SignInWithGoogleButton

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 6,
        borderWidth: 1,
        paddingLeft: 8
    },
    imgae: {
        height: 35,
        width: 35,
        backgroundColor: '#fff',
        borderRadius: 6
    },
    text: {
        paddingHorizontal: 8,
        fontSize: 20,
        color: 'black'
    }
})