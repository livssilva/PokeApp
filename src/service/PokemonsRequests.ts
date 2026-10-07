import Pokemon from "@/interface/Pokemon";

class Requests {
    private api_url;
    private image_url;

    constructor() {
        this.api_url = 'https://pokeapi.co/api/v2/pokemon/';
        this.image_url = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/';
    }

    async fetchPokemonList(offset = 0, limit = 20) {
        try {
            const pokemons: Pokemon[] = [];

            const api_response = await fetch(`${this.api_url}?offset=${offset}&limit=${limit}`);

            if (api_response.ok) {
                const jsonData = await api_response.json();
                jsonData.results.forEach((pokemon: any) => {
                    const urlParts = pokemon.url.split('/');
                    const idString = urlParts[urlParts.length - 2];
                    const id = parseInt(idString, 10);
                    pokemons.push({
                        pokemon_name: pokemon.name,
                        pokemon_image: `${this.image_url}${id}.gif`,
                        pokemon_id: id
                    });
                });

                return pokemons;
            }
        } catch (error) {
            console.error(`[service/Requests] Erro ao fazer requisição à API. ${error}`);
        }
    }

    async fetchPokemonData(pokemon_name: string | number) {
        try {
            const pokemon = {
                pokemon_info: {} as any,
                pokemon_id: 0,
                pokemon_image: ''
            };
            const api_response = await fetch(`${this.api_url}${pokemon_name}`);

            if (api_response.ok) {
                pokemon.pokemon_info = await api_response.json();
                pokemon.pokemon_id = pokemon.pokemon_info.id;
                pokemon.pokemon_image = `${this.image_url}${pokemon.pokemon_id}.gif`;

                return pokemon;
            }

            console.log('Não foi possível obter os dados do Pokémon.');
            return;
        } catch (error) {
            console.error(`[service/Requests] Erro ao fazer requisição à API. ${error}`);
        }
    }
}

export default new Requests;