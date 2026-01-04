// loaders.js - BACKEND BERTSIOA
export { fetchJSON, fetchPlayer, fetchSolution };

const API_URL = 'http://localhost:3000/api'; // URL de tu backend

// Función para obtener datos según tipo
async function fetchJSON(what, difference_In_Days) {
    // Orain backend-era deitzen du, fitxategi estatikoen ordez
    let endpoint;

    if (what === 'fullplayers25') {
        endpoint = `${API_URL}/players`;
    } else if (what === 'solution25') {
        // Interfazeak IDen array bat espero du, baina backend-ak eguneko jokalaria itzuli beharko luke
        endpoint = `${API_URL}/solution/${difference_In_Days}`;
    }

    const response = await fetch(endpoint);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json(); // { success, data, message }
}

// Obtener un jugador por ID
async function fetchPlayer(playerId) {
    const response = await fetch(`${API_URL}/players/${playerId}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json(); // { success, data, message }
}

// Obtener la solución del día directamente
async function fetchSolution(gameNumber) {
    const response = await fetch(`${API_URL}/solution/${gameNumber}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json(); // { success, data, message }
}
