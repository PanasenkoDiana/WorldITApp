import { FlatList, Text, View, RefreshControl } from "react-native";
import { PostCard } from "../../entities/post/ui/PostCard";
import { styles } from "./UserPost.styles";
import { useEffect } from "react";
import { usePost } from "../../hooks";
import { Main } from "../../../main/ui/main";

export default function UserPost(props: {
	haveHeader: boolean;
	isMyPosts?: boolean;
}) {
	const {
		posts,
		myPosts,
		isLoading,
		refresh,
		setRefresh,
		getAllPosts,
		getMyPosts,
	} = usePost();

	const data = props.isMyPosts ? myPosts.slice().reverse() : posts.slice().reverse();

	const onRefresh = () => {
		setRefresh(true);
		Promise.all([getAllPosts(), getMyPosts()]).finally(() =>
			setTimeout(() => setRefresh(false), 1000)
		);
	};

	useEffect(() => {
		getAllPosts();
		getMyPosts();
	}, []);

	if (isLoading && !refresh) {
		return (
			<View style={styles.container}>
				<Text>Loading...</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<FlatList
				data={data}
				keyExtractor={(post) => post.id.toString()}
				refreshing={refresh}
				contentContainerStyle={{ gap: 5 }}
				refreshControl={
					<RefreshControl refreshing={refresh} onRefresh={onRefresh} />
				}
				ListHeaderComponent={props.haveHeader ? <Main /> : null}
				renderItem={({ item }) => (
					<PostCard
						id={BigInt(item.id)}
						topic={item.topic}
						author_id={item.author_id}
						user_app_profile={item.user_app_profile}
						title={item.title}
						content={item.content}
						post_app_link={item.post_app_link}
						post_app_post_tags={item.post_app_post_tags}
						post_app_post_images={item.post_app_post_images}
						post_app_post_likes={item.post_app_post_likes}
						post_app_post_views={item.post_app_post_views}
						onRefresh={onRefresh}
					/>
				)}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
}
