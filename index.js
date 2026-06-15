const API_URL = "https://pokeapi.co/api/v2/pokemon?limit=20";

const loadButton = document.getElementById("load-pokemon");
const pokemonContainer = document.getElementById("pokemon-list");
const statusText = document.getElementById("status");

/**
 * Crea una card para mostrar un Pokémon
 */
function createPokemonCard(name, image) {

    const card = document.createElement("div");
    card.classList.add("pokemon-card");

    card.innerHTML = `
        <img src="${image}" alt="${name}">
        <h3>${name}</h3>
    `;

    return card;
}

/**
 * Obtiene los detalles de un Pokémon
 */
async function getPokemonDetails(url) {

    const response = await axios.get(url);

    return {
        name: response.data.name,
        image:
            response.data.sprites.other["official-artwork"].front_default ||
            response.data.sprites.front_default
    };
}

/**
 * Carga los primeros 20 Pokémon
 */
async function loadPokemon() {

    try {

        loadButton.disabled = true;
        statusText.textContent = "Cargando Pokémon...";
        pokemonContainer.innerHTML = "";

        // Obtener listado de Pokémon
        const response = await axios.get(API_URL);

        console.log("Respuesta de la API:", response.data);

        const pokemonList = response.data.results;

        console.log("Lista de Pokémon:", pokemonList);

        // Obtener detalles de cada Pokémon
        const pokemonDetails = await Promise.all(
            pokemonList.map(pokemon =>
                getPokemonDetails(pokemon.url)
            )
        );

        console.log("Detalles completos:", pokemonDetails);

        // Mostrar cards
        pokemonDetails.forEach(pokemon => {

            console.log("Pokémon cargado:", pokemon.name);

            const card = createPokemonCard(
                pokemon.name,
                pokemon.image
            );

            pokemonContainer.appendChild(card);
        });

        statusText.textContent = "Pokémon cargados correctamente.";

    } catch (error) {

        console.error("Error al cargar Pokémon:", error);

        statusText.textContent =
            "Ocurrió un error al cargar los Pokémon.";

    } finally {

        loadButton.disabled = false;
    }
}

loadButton.addEventListener("click", loadPokemon);
