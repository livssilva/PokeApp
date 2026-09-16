export default interface Pokemon {
    pokemon_name: string;
    pokemon_image: string;
    pokemon_id?: number;

    types?: PokemonType;

    height?: number;
    weight?: number;

    stats?: PokemonStat[];

    abilities?: PokemonAbility[];
}

interface PokemonType {
    type1: string;
    type2?: string;
}

interface PokemonStat {
    base_stat: number;

    stat: {
        name: string;
    };
}

interface PokemonAbility {
    ability: {
        name: string;
    };
}