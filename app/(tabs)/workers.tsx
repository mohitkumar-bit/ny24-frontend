import { View, Text, StyleSheet } from "react-native";

const WorkersScreen = () => {
    return (
        <View style={styles.container}>
            <Text>WorkersScreen</Text>
            <Text> Search Workers</Text>
        </View>
    );
};

export default WorkersScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
})