import ListFavorites from "@/components/ListFavorites/ListFavorites";
import { StyleSheet, View } from "react-native";

export default function Favorites() {
    return (
        <View style={styles.container}>
            <ListFavorites />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7FAFC",
    },
});
