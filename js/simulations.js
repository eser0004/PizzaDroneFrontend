const simulatePizzaDropdown = document.getElementById("simulatePizza");
const simulateCreateBtn = document.getElementById("simulateCreateBtn");
const simulateAddressInput = document.getElementById("simulateAddress");
const simulateAntalInput = document.getElementById("simulateAntal");
const simulateFinishBtn = document.getElementById("simulateFinishBtn");
const simulateLeveringIdInput = document.getElementById("simulateLeveringId");

// Hent pizzaer for dropdown
async function fetchPizzasForDropdown() {
    try {
        const response = await fetch(`${API_BASE_URL}/pizzas`);
        const pizzas = await response.json();
        updatePizzaDropdown(pizzas);
    } catch (error) {
        console.error("Fejl under hentning af pizzaer:", error);
    }
}

// Opdater pizza-dropdown
function updatePizzaDropdown(pizzas) {
    simulatePizzaDropdown.innerHTML = "<option value=''>Vælg en pizza</option>";
    pizzas.forEach((pizza) => {
        const option = document.createElement("option");
        option.value = pizza.pizzaId;
        option.textContent = `${pizza.titel} - ${pizza.pris} DKK`;
        simulatePizzaDropdown.appendChild(option);
    });
}

// Simuler oprettelse af levering
simulateCreateBtn.addEventListener("click", async () => {
    const pizzaId = simulatePizzaDropdown.value;
    const adresse = simulateAddressInput.value;
    const antal = simulateAntalInput.value;

    if (!pizzaId || !adresse) {
        alert("Udfyld alle felter for at oprette en levering.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/deliveries/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pizzaId, adresse, antal }),
        });

        if (!response.ok) throw new Error("Kunne ikke oprette levering.");

        alert("Levering oprettet!");
        fetchDeliveries();
    } catch (error) {
        console.error("Fejl under oprettelse af levering:", error);
    }
});

// Simuler afslutning af levering
simulateFinishBtn.addEventListener("click", async () => {
    const leveringId = simulateLeveringIdInput.value;

    if (!leveringId) {
        alert("Indtast et levering ID.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/deliveries/finish`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ leveringId }),
        });

        if (!response.ok) throw new Error("Kunne ikke afslutte levering.");

        alert("Levering afsluttet!");
        fetchDeliveries();
    } catch (error) {
        console.error("Fejl under afslutning af levering:", error);
    }
});

// Initialisering
fetchPizzasForDropdown();
