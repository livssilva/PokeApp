import { Platform } from "react-native";
import * as FileSystem from "expo-file-system/legacy";

const STORAGE_KEY = "pokeapp_favoritos";
const FILE_NAME = "favoritos.json";

interface FavoritosData {
    favoritos: number[];
}

function getFileUri(): string {
    return `${FileSystem.documentDirectory || ""}${FILE_NAME}`;
}

// ==================== WEB (localStorage) ====================
function lerFavoritosWeb(): number[] {
    try {
        if (typeof window === "undefined" || !window.localStorage) {
            return [];
        }
        const dados = localStorage.getItem(STORAGE_KEY);
        if (!dados) return [];
        const parsed: FavoritosData = JSON.parse(dados);
        return Array.isArray(parsed?.favoritos) ? parsed.favoritos : [];
    } catch (error) {
        console.error("Erro ao ler favoritos do localStorage:", error);
        return [];
    }
}

function salvarFavoritosWeb(favoritos: number[]): void {
    try {
        if (typeof window !== "undefined" && window.localStorage) {
            const data: FavoritosData = { favoritos };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
    } catch (error) {
        console.error("Erro ao salvar favoritos no localStorage:", error);
    }
}

// ==================== NATIVO (Android / iOS - expo-file-system) ====================
async function lerFavoritosNativo(): Promise<number[]> {
    try {
        const fileUri = getFileUri();
        const info = await FileSystem.getInfoAsync(fileUri);
        if (!info.exists) {
            return [];
        }
        const content = await FileSystem.readAsStringAsync(fileUri);
        const parsed: FavoritosData = JSON.parse(content);
        return Array.isArray(parsed?.favoritos) ? parsed.favoritos : [];
    } catch (error) {
        console.error("Erro ao ler favoritos do arquivo nativo:", error);
        return [];
    }
}

async function salvarFavoritosNativo(favoritos: number[]): Promise<void> {
    try {
        const fileUri = getFileUri();
        const data: FavoritosData = { favoritos };
        await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data));
    } catch (error) {
        console.error("Erro ao salvar favoritos no arquivo nativo:", error);
    }
}

// ==================== FUNÇÕES PÚBLICAS ====================

export async function buscarFavoritos(): Promise<number[]> {
    if (Platform.OS === "web") {
        return lerFavoritosWeb();
    }
    return await lerFavoritosNativo();
}

export async function salvarFavoritos(favoritos: number[]): Promise<void> {
    // Desafio 4: Evitar duplicados
    const uniqueFavoritos = Array.from(new Set(favoritos));
    if (Platform.OS === "web") {
        salvarFavoritosWeb(uniqueFavoritos);
    } else {
        await salvarFavoritosNativo(uniqueFavoritos);
    }
}

export async function adicionarFavorito(id: number): Promise<void> {
    const favoritos = await buscarFavoritos();
    if (!favoritos.includes(id)) {
        favoritos.push(id);
        await salvarFavoritos(favoritos);
    }
}

export async function removerFavorito(id: number): Promise<void> {
    const favoritos = await buscarFavoritos();
    const novosFavoritos = favoritos.filter((favId) => favId !== id);
    await salvarFavoritos(novosFavoritos);
}

export async function ehFavorito(id: number): Promise<boolean> {
    const favoritos = await buscarFavoritos();
    return favoritos.includes(id);
}

export async function alternarFavorito(id: number): Promise<boolean> {
    const isFav = await ehFavorito(id);
    if (isFav) {
        await removerFavorito(id);
        return false;
    } else {
        await adicionarFavorito(id);
        return true;
    }
}

export async function limparFavoritos(): Promise<void> {
    await salvarFavoritos([]);
}

export async function obterTotalFavoritos(): Promise<number> {
    const favoritos = await buscarFavoritos();
    return favoritos.length;
}

export default {
    buscarFavoritos,
    salvarFavoritos,
    adicionarFavorito,
    removerFavorito,
    ehFavorito,
    alternarFavorito,
    limparFavoritos,
    obterTotalFavoritos,
};
