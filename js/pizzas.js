const pizzaList = document.getElementById("pizzaList");
const addPizzaForm = document.getElementById("addPizzaForm");

// Hent alle pizzaer
async function fetchPizzas() {
    try {
        const response = await fetch(`${API_BASE_URL}/pizzas`);
        if (!response.ok) {
            throw new Error(`HTTP-fejl! Status: ${response.status}`);
        }
        const pizzas = await response.json();
        updatePizzaList(pizzas);
    } catch (error) {
        console.error("Fejl under hentning af pizzaer:", error);
        alert("Kunne ikke hente pizzaer. Prøv igen senere.");
    }
}

// Opdater pizza-listen
function updatePizzaList(pizzas) {
    pizzaList.innerHTML = ""; // Rens eksisterende data
    pizzas.forEach((pizza) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${pizza.titel} - ${pizza.pris} kr.`;

        // Slet-knap
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Slet";
        deleteButton.onclick = async () => {
            await deletePizza(pizza.pizzaId);
            fetchPizzas(); // Opdater listen
        };
        listItem.appendChild(deleteButton);

        pizzaList.appendChild(listItem);
    });
}

// Tilføj en ny pizza
addPizzaForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const pizzaTitle = document.getElementById("pizzaTitle").value.trim();
    const pizzaPrice = parseInt(document.getElementById("pizzaPrice").value);

    try {
        const response = await fetch(`${API_BASE_URL}/pizzas/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ titel: pizzaTitle, pris: pizzaPrice }),
        });

        if (!response.ok) {
            throw new Error("Kunne ikke tilføje pizzaen.");
        }

        alert("Pizza tilføjet!");
        addPizzaForm.reset(); // Rens formularen
        fetchPizzas(); // Opdater listen
    } catch (error) {
        console.error("Fejl under tilføjelse af pizza:", error);
        alert("Kunne ikke tilføje pizzaen. Prøv igen senere.");
    }
});

// Slet en pizza
async function deletePizza(pizzaId) {
    try {
        const response = await fetch(`${API_BASE_URL}/pizzas/${pizzaId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`Kunne ikke slette pizza med ID ${pizzaId}`);
        }

        alert(`Pizza med ID ${pizzaId} er slettet.`);
    } catch (error) {
        console.error("Fejl under sletning af pizza:", error);
        alert("Kunne ikke slette pizzaen. Prøv igen senere.");
    }
}

// Initial indlæsning af pizzaer
fetchPizzas();
