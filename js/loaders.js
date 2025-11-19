async function fetchJSON(what) {
    // YOUR CODE HERE
    const response = await fetch(what);
    if (!response.ok) {
        throw new Error(`Error HTTP ${response.status} al cargar ${what}`);
    }
    const data = await response.json(); // Convierte JSON
    return data;
}
module.exports = { fetchJSON };