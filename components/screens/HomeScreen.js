import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const HomeScreen = ({ navigation, user }) => {
    return (
        <View>
            <Text>{user.displayName}</Text>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})