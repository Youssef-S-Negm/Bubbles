import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useState, useEffect } from 'react'
import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons';
import { getUserById } from '../../db/users';
import { auth } from '../../db/config';
import { getChatById } from '../../db/chats';

const NoChats = () => {
    return (
        <MaskedView
            style={{ flex: 1, flexDirection: 'row' }}
            maskElement={
                <View style={{ flex: 1, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="chatbubble" style={{ fontSize: 60 }} />
                    <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold', textAlign: 'justify' }}>
                        Your chats will appear here when you connect with other users.
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

const ChatItem = ({ item }) => {
    if (item.chatType === 'private') {
        const [otherUser, setOtherUser] = useState(null)
        const otherUserId = item.between.filter(e => e !== auth.currentUser.uid)[0]

        useEffect(() => {
            getUserById(otherUserId)
                .then(e => setOtherUser(e))
        }, [])

        return (
            <TouchableOpacity
                onPress={() => {
                    //TODO
                }}
                style={{ flexDirection: 'row', width: '100%' }}
            >
                {otherUser ?
                    <View style={{ flexDirection: 'row', backgroundColor: '#e4e4e4', width: '100%', padding: 8, alignItems: 'center', borderRadius: 6 }}>
                        <Image
                            source={otherUser.photoURL ? { uri: otherUser.photoURL } : require('../../assets/avatar.png')}
                            style={{ height: 50, width: 50, borderRadius: 50, backgroundColor: 'white' }}
                        />
                        <Text style={{ paddingLeft: 8 }}>{otherUser.displayName}</Text>
                    </View> : null}
            </TouchableOpacity>
        )
    }
}

const HomeScreen = ({ navigation }) => {
    const [chats, setChats] = useState([])

    useEffect(() => {
        getUserById(auth.currentUser.uid)
            .then(user => {
                Promise.all(user.chats.map(getChatById))
                    .then(e => {
                        e.sort((a, b) => a.updatedAt.seconds - b.updatedAt.seconds)
                        e.reverse()
                        setChats(e)
                    })
            })
    }, [])

    return (
        <View style={styles.container}>
            {chats.length === 0 ?
                <NoChats navigation={navigation} />
                :
                <FlatList
                    data={chats}
                    renderItem={({ item }) => <ChatItem item={item} />}
                    ItemSeparatorComponent={<View style={{ height: 8 }} />}
                    keyExtractor={item => item.id}
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