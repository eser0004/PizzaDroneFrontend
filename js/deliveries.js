const deliveryTableBody = document.querySelector("#deliveryTable tbody");

// Hent leveringer
async function fetchDeliveries() {
    try {
        const response = await fetch(`${API_BASE_URL}/deliveries`);
        const deliveries = await response.json();
        updateDeliveryTable(deliveries);
    } catch (error) {
        console.error("Fejl under hentning af leveringer:", error);
        alert("Kunne ikke hente leveringer. Prøv igen senere.");
    }
}

// Opdater leveringstabellen
function updateDeliveryTable(deliveries) {
    deliveryTableBody.innerHTML = ""; // Rens eksisterende data
    deliveries.forEach((delivery) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${delivery.leveringId}</td>
            <td>${delivery.adresse}</td>
            <td>${delivery.pizza ? delivery.pizza.titel : "Ingen"}</td>
            <td>${delivery.antal || 1}</td>
            <td>${delivery.status || "Ikke startet"}</td>
            <td>${delivery.drone ? delivery.drone.serialUuid : "Ingen drone"}</td>
            <td>
                ${delivery.status === "Mangler drone"
            ? `<button onclick="assignDrone(${delivery.leveringId})">Tildel Drone</button>`
            : ""
        }
                <button onclick="deleteDelivery(${delivery.leveringId})">Slet</button>
            </td>
        `;

        deliveryTableBody.appendChild(row);
    });
}

// Slet en levering
async function deleteDelivery(leveringId) {
    try {
        await fetch(`${API_BASE_URL}/deliveries/${leveringId}`, {
            method: "DELETE",
        });
        alert(`Levering ${leveringId} slettet`);
        fetchDeliveries();
    } catch (error) {
        console.error("Fejl under sletning af levering:", error);
        alert("Kunne ikke slette leveringen. Prøv igen senere.");
    }
}

// Initialisering
fetchDeliveries();
