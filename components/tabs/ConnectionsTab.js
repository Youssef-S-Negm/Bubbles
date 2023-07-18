import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';
import { auth } from '../../db/config';
import { getUserById, userSubscribeListener } from '../../db/users';

const ConnectionsTab = ({ focused }) => {
    const [pendingRequestsSeen, setPendingRequestsSeen] = useState(true)

    useEffect(() => {
        getUserById(auth.currentUser.uid).then(e => setPendingRequestsSeen(e.pendingRequestsSeen))

        const unsubscribe = userSubscribeListener(auth.currentUser.uid, ({ change }) => {
            if (change.type === "modified") {
                getUserById(auth.currentUser.uid).then(e => setPendingRequestsSeen(e.pendingRequestsSeen))
            }
        });

        return () => {
            unsubscribe();
        };
    }, [])

    return (
        focused ?
            <MaskedView
                style={styles.maskedView}
                maskElement={
                    <View style={styles.view}>
                        <MaterialCommunityIcons
                            name="transit-connection-variant"
                            style={styles.icon}
                        />
                    </View>
                }
            >
                <LinearGradient
                    colors={['#00736e', '#6a00c9']}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.gradient}
                />
            </MaskedView>
            :
            <View style={styles.view}>
                {!pendingRequestsSeen ? <View style={{ backgroundColor: 'red', width: 5, height: 5, alignSelf: 'flex-end', borderRadius: 5 }} /> : null}
                <MaterialCommunityIcons
                    name="transit-connection-variant"
                    style={styles.iconDisabled}
                />
            </View>
    )
}

export default ConnectionsTab

const styles = StyleSheet.create({
    maskedView: {
        flex: 1,
        flexDirection: 'row'
    },
    view: {
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center'
    },
    icon: {
        fontSize: 30
    },
    gradient: {
        flex: 1,
        width: 30
    },
    iconDisabled: {
        fontSize: 30,
        color: '#EBEBE4'
    }
})