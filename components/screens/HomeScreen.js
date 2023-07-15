import { FlatList, StyleSheet, Text, View } from 'react-native'
import { useState } from 'react'
import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons';

const NoChats = () => {
    return (
        <MaskedView
            style={{ flex: 1, flexDirection: 'row' }}
            maskElement={
                <View style={{ flex: 1, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="chatbubble" style={{ fontSize: 60 }} />
                    <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold', textAlign: 'justify' }}>
                        Your chats will appear here when you connect with other users. <Text
                            style={{ textDecorationLine: 'underline' }}
                            onPress={() => {
                                //TODO
                            }}
                        >
                            Search for users here.
                        </Text>
                    </Text>
                </View>
            }
        >
            <LinearGradient
                colors={['#00736e', '#6a00c9']}
                style={{ flex: 1 }}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
            />
        </MaskedView>
    )
}

const HomeScreen = ({ navigation, user }) => {
    const [chats, setChats] = useState([])

    return (
        <View style={styles.container}>
            {chats.length === 0 ? <NoChats />
                :
                <FlatList
                    data={chats}
                />}
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 8,
        paddingHorizontal: 8
    }
})