import Pokemon from "@/interface/Pokemon";
import { alternarFavorito, ehFavorito } from "@/service/FavoritesStorage";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export const typeIcons: Record<string, any> = {
    normal: require('@/assets/icons/normal.svg'),
    fire: require('@/assets/icons/fire.svg'),
    water: require('@/assets/icons/water.svg'),
    electric: require('@/assets/icons/electric.svg'),
    grass: require('@/assets/icons/grass.svg'),
    ice: require('@/assets/icons/ice.svg'),
    fighting: require('@/assets/icons/fighting.svg'),
    poison: require('@/assets/icons/poison.svg'),
    ground: require('@/assets/icons/ground.svg'),
    flying: require('@/assets/icons/flying.svg'),
    psychic: require('@/assets/icons/psychic.svg'),
    bug: require('@/assets/icons/bug.svg'),
    rock: require('@/assets/icons/rock.svg'),
    ghost: require('@/assets/icons/ghost.svg'),
    dragon: require('@/assets/icons/dragon.svg'),
    dark: require('@/assets/icons/dark.svg'),
    steel: require('@/assets/icons/steel.svg'),
    fairy: require('@/assets/icons/fairy.svg'),
};

interface ShowPokemonProps {
    pokemon: Pokemon;
}

export default function ShowPokemon({ pokemon }: ShowPokemonProps) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoadingFavorite, setIsLoadingFavorite] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const checkFavorite = async () => {
            if (pokemon.pokemon_id) {
                try {
                    const fav = await ehFavorito(pokemon.pokemon_id);
                    if (isMounted) {
                        setIsFavorite(fav);
                    }
                } catch (e) {
                    console.error("Erro ao checar favorito:", e);
                } finally {
                    if (isMounted) {
                        setIsLoadingFavorite(false);
                    }
                }
            }
        };
        checkFavorite();
        return () => {
            isMounted = false;
        };
    }, [pokemon.pokemon_id]);

    const handleToggleFavorite = async () => {
        if (!pokemon.pokemon_id) return;
        try {
            const newState = await alternarFavorito(pokemon.pokemon_id);
            setIsFavorite(newState);
        } catch (e) {
            console.error("Erro ao alternar favorito:", e);
        }
    };

    const Type1Icon = pokemon.types ? (typeIcons[pokemon.types.type1]?.default || typeIcons[pokemon.types.type1]) : null;
    const Type2Icon = pokemon.types?.type2 ? (typeIcons[pokemon.types.type2]?.default || typeIcons[pokemon.types.type2]) : null;

    const getStat = (name: string) => {
        return pokemon.stats?.find(
            (stat) => stat.stat.name === name
        )?.base_stat;
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* 9º Nome do Pokémon */}
            <Text style={styles.name}>
                {pokemon.pokemon_name
                    .split("-")
                    .map(
                        (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1)
                    )
                    .join(" ")}
            </Text>

            {/* 10º ID */}
            <Text style={styles.id}>
                Pokédex #{pokemon.pokemon_id}
            </Text>

            {/* 11º Imagem */}
            <Image
                source={{ uri: pokemon.pokemon_image }}
                style={styles.image}
                contentFit="contain"
            />

            {/* Botão de Favorito (Desafio 3 / Roteiro) */}
            <Pressable
                style={[
                    styles.favoriteButton,
                    isFavorite ? styles.favoriteButtonActive : styles.favoriteButtonInactive,
                ]}
                onPress={handleToggleFavorite}
                disabled={isLoadingFavorite}
            >
                {isLoadingFavorite ? (
                    <ActivityIndicator size="small" color="#E53E3E" />
                ) : (
                    <Text
                        style={[
                            styles.favoriteButtonText,
                            isFavorite ? styles.favoriteButtonTextActive : styles.favoriteButtonTextInactive,
                        ]}
                    >
                        {isFavorite ? "❤️ Remover dos favoritos" : "🤍 Adicionar aos favoritos"}
                    </Text>
                )}
            </Pressable>

            {/* 12º Tipos */}
            <View style={styles.types}>
                {Type1Icon && (
                    <Type1Icon
                        width={50}
                        height={50}
                    />
                )}

                {Type2Icon && (
                    <Type2Icon
                        width={50}
                        height={50}
                    />
                )}
            </View>

            {/* 13º Altura e Peso */}
            <View style={styles.infoCard}>
                <Text style={styles.sectionTitle}>
                    Informações
                </Text>

                <Text style={styles.infoText}>
                    Altura: {pokemon.height! / 10} m
                </Text>

                <Text style={styles.infoText}>
                    Peso: {pokemon.weight! / 10} kg
                </Text>
            </View>

            {/* 14º Status */}
            <View style={styles.infoCard}>
                <Text style={styles.sectionTitle}>
                    Status
                </Text>

                <Text style={styles.infoText}>
                    HP: {getStat("hp")}
                </Text>

                <Text style={styles.infoText}>
                    Ataque: {getStat("attack")}
                </Text>

                <Text style={styles.infoText}>
                    Defesa: {getStat("defense")}
                </Text>

                <Text style={styles.infoText}>
                    Ataque Especial: {getStat("special-attack")}
                </Text>

                <Text style={styles.infoText}>
                    Defesa Especial: {getStat("special-defense")}
                </Text>

                <Text style={styles.infoText}>
                    Velocidade: {getStat("speed")}
                </Text>
            </View>

            {/* 15º Habilidades */}
            <View style={styles.infoCard}>
                <Text style={styles.sectionTitle}>
                    Habilidades
                </Text>

                {pokemon.abilities?.map((ability, index) => (
                    <Text
                        key={index}
                        style={styles.infoText}
                    >
                        • {ability.ability.name}
                    </Text>
                ))}
            </View>
        </ScrollView>
    );
}

// 16º Estilos do ShowPokemon
const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: "center",
        backgroundColor: "#F7FAFC",
    },

    name: {
        fontSize: 30,
        fontWeight: "bold",
        marginTop: 10,
        textAlign: "center",
    },

    id: {
        fontSize: 16,
        color: "#718096",
        marginBottom: 10,
        textAlign: "center",
    },

    image: {
        width: 250,
        height: 250,
    },

    types: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        marginBottom: 20,
    },

    favoriteButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 24,
        marginVertical: 12,
        minWidth: 220,
        borderWidth: 1.5,
    },
    favoriteButtonInactive: {
        backgroundColor: "#FFFFFF",
        borderColor: "#E2E8F0",
    },
    favoriteButtonActive: {
        backgroundColor: "#FFF5F5",
        borderColor: "#FEB2B2",
    },
    favoriteButtonText: {
        fontSize: 15,
        fontWeight: "700",
    },
    favoriteButtonTextInactive: {
        color: "#4A5568",
    },
    favoriteButtonTextActive: {
        color: "#E53E3E",
    },
    infoCard: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 12,
        marginBottom: 15,
        alignItems: "center",
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },

    infoText: {
        fontSize: 16,
        marginBottom: 5,
        textAlign: "center",
    },
});