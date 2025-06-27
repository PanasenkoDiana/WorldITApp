import {
    FlatList,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
} from "react-native";
import { useFriends } from "../../hooks/useFriends";
import { useEffect, useState } from "react";
import { FriendCard } from "../../entities/ui/FriendCard/FriendCard";
import { styles } from "./FriendsPage.styles";
import { User } from "../../../../shared/types";

interface IFriendsPage {
    selectedPage: string;
    setSelectedPage: (page: string) => void;
}

export function FriendsPage(props: IFriendsPage) {
    const [refresh, setRefresh] = useState(false);
    const { selectedPage, setSelectedPage } = props;
    const {
        isLoading,
        friends,
        recommends,
        requests,
        getAllFriends,
        getRecommends,
        getRequests,
    } = useFriends();

    function onRefresh() {
        setRefresh(true);
        getRequests();
        getRecommends();
        getAllFriends();
        setTimeout(() => {
            setRefresh(false);
        }, 2000);
    }

    useEffect(() => {
        if (selectedPage === "main") {
            getRequests();
            getRecommends();
            getAllFriends();
        }
        if (selectedPage === "requests") {
            getRequests();
        }
        if (selectedPage === "recommends") {
            getRecommends();
        }
        if (selectedPage === "all") {
            getAllFriends();
        }
    }, [selectedPage]);

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (props.selectedPage == "main") {
        const usersRequests: User[] = requests.map((request) => {
            return request.from;
        });
        return (
            <View style={styles.container}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refresh}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    <View style={styles.main}>
                        {requests.length > 0 ? (
                            <View style={styles.mainContainer}>
                                <View style={styles.buttonContainer}>
                                    <Text style={styles.text}>Запити</Text>
                                    <TouchableOpacity
                                        onPress={() =>
                                            setSelectedPage("requests")
                                        }
                                    >
                                        <Text
                                            style={[
                                                styles.text,
                                                styles.seeAllText,
                                            ]}
                                        >
                                            Дивитись всі
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.content}>
                                    <FlatList
                                        contentContainerStyle={styles.list}
										scrollEnabled={false}
                                        refreshing={isLoading}
                                        data={usersRequests.splice(0, 2)}
                                        renderItem={({ item }) => (
                                            <FriendCard
                                                variant="request"
                                                {...item} // <--- Corrected
                                            />
                                        )}
                                    />
                                </View>
                            </View>
                        ) : (
                            <></>
                        )}
                        {recommends.length > 0 ? (
                            <View style={styles.mainContainer}>
                                <View style={styles.buttonContainer}>
                                    <Text style={styles.text}>
                                        Рекомендації
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() =>
                                            setSelectedPage("recommends")
                                        }
                                    >
                                        <Text
                                            style={[
                                                styles.text,
                                                styles.seeAllText,
                                            ]}
                                        >
                                            Дивитись всі
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.content}>
                                    <FlatList
                                        contentContainerStyle={styles.list}
										scrollEnabled={false}
                                        refreshing={isLoading}
                                        data={recommends.splice(0, 2)}
                                        renderItem={({ item }) => (
                                            <FriendCard
                                                variant="notFriend"
                                                {...item} // <--- Corrected
                                            />
                                        )}
                                    />
                                </View>
                            </View>
                        ) : (
                            <></>
                        )}

                        {friends.length > 0 ? (
                            <View style={styles.mainContainer}>
                                <View style={styles.buttonContainer}>
                                    <Text style={styles.text}>Всі друзі</Text>
                                    <TouchableOpacity
                                        onPress={() =>
                                            setSelectedPage("friends")
                                        }
                                    >
                                        <Text
                                            style={[
                                                styles.text,
                                                styles.seeAllText,
                                            ]}
                                        >
                                            Дивитись всі
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.content}>
                                    <FlatList
                                        contentContainerStyle={styles.list}
                                        refreshing={isLoading}
										scrollEnabled={false}
                                        data={friends.splice(0, 2)}
                                        renderItem={({ item }) => (
                                            <FriendCard
                                                variant="friend"
                                                {...item} // <--- Corrected
                                            />
                                        )}
                                    />
                                </View>
                            </View>
                        ) : (
                            <></>
                        )}
                    </View>
                </ScrollView>
            </View>
        );
    }

    if (props.selectedPage == "requests") {
        const usersRequests: User[] = requests.map((request) => {
            return request.from;
        });
        return (
            <View style={styles.container}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refresh}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    <FlatList
                        contentContainerStyle={styles.list}
                        refreshing={isLoading}
						scrollEnabled={false}
                        data={usersRequests}
                        renderItem={({ item }) => (
                            <FriendCard
                                variant="request"
                                {...item} // <--- Corrected
                            />
                        )}
                    />
                </ScrollView>
            </View>
        );
    }

    if (props.selectedPage == "recommends") {
        return (
            <View style={styles.container}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refresh}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    <FlatList
                        contentContainerStyle={styles.list}
						scrollEnabled={false}
                        refreshing={isLoading}
                        data={recommends}
                        renderItem={({ item }) => (
                            <FriendCard
                                variant="notFriend"
                                {...item} // <--- Corrected
                            />
                        )}
                    />
                </ScrollView>
            </View>
        );
    }

    if (props.selectedPage == "all") {
        return (
            <View style={styles.container}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refresh}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    <FlatList
                        contentContainerStyle={styles.list}
						scrollEnabled={false}
                        refreshing={isLoading}
                        data={friends}
                        renderItem={({ item }) => (
                            <FriendCard
                                variant="friend"
                                {...item} // <--- Corrected
                            />
                        )}
                    />
                </ScrollView>
            </View>
        );
    }
}