import Pokemon from "@/interface/Pokemon";
import { buscarFavoritos, limparFavoritos, removerFavorito } from "@/service/FavoritesStorage";
import Requests from "@/service/PokemonsRequests";
import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function ListFavorites() {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const carregarFavoritos = async () => {
        try {
            setIsLoading(true);
            const favIds = await buscarFavoritos();

            if (favIds.length === 0) {
                setPokemons([]);
                return;
            }

            const pokemonPromises = favIds.map(async (id) => {
                const data = await Requests.fetchPokemonData(id);
                if (data && data.pokemon_info) {
                    return {
                        pokemon_name: data.pokemon_info.name,
                        pokemon_id: data.pokemon_id,
                        pokemon_image: data.pokemon_image,
                    } as Pokemon;
                }
                return null;
            });

            const results = await Promise.all(pokemonPromises);
            const valid = results.filter((p): p is Pokemon => p !== null);
            setPokemons(valid);
        } catch (error) {
            console.error("Erro ao carregar favoritos:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            carregarFavoritos();
        }, [])
    );

    const handleLimparFavoritos = async () => {
        const confirmar = async () => {
            await limparFavoritos();
            setPokemons([]);
        };

        if (Platform.OS === "web") {
            if (typeof window !== "undefined" && window.confirm("Deseja realmente limpar todos os favoritos?")) {
                await confirmar();
            }
        } else {
            Alert.alert(
                "Limpar favoritos",
                "Deseja remover todos os Pokémon dos seus favoritos?",
                [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Limpar", style: "destructive", onPress: confirmar },
                ]
            );
        }
    };

    const handleRemoverFavorito = async (id?: number) => {
        if (!id) return;
        await removerFavorito(id);
        setPokemons((prev) => prev.filter((p) => p.pokemon_id !== id));
    };

    const formatName = (name: string) => {
        return name
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const formatId = (id?: number) => {
        if (!id) return "";
        return `#${String(id).padStart(3, "0")}`;
    };

    if (isLoading && pokemons.length === 0) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#FF3E3E" />
                <Text style={styles.loadingText}>Carregando favoritos...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Text style={styles.headerTitle}>Favoritos</Text>
                    {pokemons.length > 0 && (
                        <Pressable
                            style={styles.clearButton}
                            onPress={handleLimparFavoritos}
                        >
                            <Text style={styles.clearButtonText}>🗑 Limpar favoritos</Text>
                        </Pressable>
                    )}
                </View>

                {/* Desafio 2: Contador de favoritos */}
                <Text style={styles.counterText}>
                    ⭐ {pokemons.length} {pokemons.length === 1 ? "favorito" : "favoritos"}
                </Text>
            </View>

            {pokemons.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>🤍</Text>
                    <Text style={styles.emptyTitle}>Nenhum favorito ainda</Text>
                    <Text style={styles.emptySubtitle}>
                        {"Abra qualquer Pokémon e clique em \"Adicionar aos favoritos\" para salvá-lo aqui!"}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={pokemons}
                    keyExtractor={(item) => String(item.pokemon_id || item.pokemon_name)}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <Pressable
                            style={styles.card}
                            onPress={() =>
                                item.pokemon_id &&
                                router.push(`/pokemon/${item.pokemon_id}` as any)
                            }
                        >
                            {/* ID Badge */}
                            <View style={styles.idBadge}>
                                <Text style={styles.idText}>{formatId(item.pokemon_id)}</Text>
                            </View>

                            {/* Unfavorite Quick Button */}
                            <Pressable
                                style={styles.removeBadge}
                                onPress={() => handleRemoverFavorito(item.pokemon_id)}
                                hitSlop={8}
                            >
                                <Text style={styles.removeBadgeText}>❤️</Text>
                            </Pressable>

                            {/* Sprite */}
                            <View style={styles.imageContainer}>
                                {item.pokemon_image ? (
                                    <Image
                                        source={{ uri: item.pokemon_image }}
                                        style={styles.pokemonImage}
                                        contentFit="contain"
                                        transition={300}
                                    />
                                ) : (
                                    <View style={styles.imagePlaceholder} />
                                )}
                            </View>

                            {/* Name */}
                            <View style={styles.infoContainer}>
                                <Text style={styles.pokemonName}>
                                    {formatName(item.pokemon_name)}
                                </Text>
                            </View>
                        </Pressable>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7FAFC",
        width: "100%",
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F7FAFC",
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#718096",
        fontWeight: "500",
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 16,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#EDF2F7",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
    },
    headerTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: "800",
        color: "#2D3748",
        letterSpacing: -0.5,
    },
    clearButton: {
        backgroundColor: "#FFF5F5",
        borderColor: "#FEB2B2",
        borderWidth: 1,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    clearButtonText: {
        color: "#E53E3E",
        fontSize: 13,
        fontWeight: "700",
    },
    counterText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#718096",
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
    },
    emptyIcon: {
        fontSize: 50,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#2D3748",
        marginBottom: 8,
        textAlign: "center",
    },
    emptySubtitle: {
        fontSize: 15,
        color: "#718096",
        textAlign: "center",
        lineHeight: 22,
    },
    listContent: {
        padding: 12,
        paddingBottom: 40,
    },
    row: {
        justifyContent: "space-between",
    },
    card: {
        backgroundColor: "#FFFFFF",
        flex: 1,
        margin: 6,
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
        position: "relative",
        shadowColor: "#1A202C",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: "#EDF2F7",
    },
    idBadge: {
        position: "absolute",
        top: 10,
        left: 10,
        backgroundColor: "#EDF2F7",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 20,
    },
    idText: {
        fontSize: 11,
        fontWeight: "700",
        color: "#718096",
    },
    removeBadge: {
        position: "absolute",
        top: 8,
        right: 8,
        padding: 4,
    },
    removeBadgeText: {
        fontSize: 16,
    },
    imageContainer: {
        width: 90,
        height: 90,
        marginTop: 10,
        marginBottom: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    pokemonImage: {
        width: "100%",
        height: "100%",
    },
    imagePlaceholder: {
        width: 60,
        height: 60,
        backgroundColor: "#E2E8F0",
        borderRadius: 30,
    },
    infoContainer: {
        alignItems: "center",
        marginTop: 4,
    },
    pokemonName: {
        fontSize: 15,
        fontWeight: "600",
        color: "#2D3748",
        textAlign: "center",
    },
});
