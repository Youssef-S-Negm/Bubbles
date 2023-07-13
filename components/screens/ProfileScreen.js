import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ProfileScreen = ({ user }) => {
    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                    source={user.photoURL ? { uri: user.photoURL } : require('../../assets/avatar.png')}
                    style={{ width: 150, height: 150, borderRadius: 150 }}
                    resizeMode='contain'
                />
                <Text style={styles.userName}>{user.displayName}</Text>
            </View>
            <Text>E-mail: {user.email}</Text>
            <Text>Phone number: {user.phoneNumber ? user.phoneNumber : 'Unknown'}</Text>
        </View>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 8,
        paddingHorizontal: 8
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 150
    },
    userName: {
        paddingLeft: 8,
        fontSize: 25
    }
})