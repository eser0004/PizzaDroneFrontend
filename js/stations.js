const stationList = document.getElementById("stationList");

// Hent alle stationer
async function fetchStations() {
    try {
        const response = await fetch(`${API_BASE_URL}/stations`);
        if (!response.ok) {
            throw new Error(`HTTP-fejl! Status: ${response.status}`);
        }
        const stations = await response.json();
        updateStationList(stations);
    } catch (error) {
        console.error("Fejl under hentning af stationer:", error);
        alert("Kunne ikke hente stationer. Prøv igen senere.");
    }
}

// Opdater station-listen
function updateStationList(stations) {
    stationList.innerHTML = ""; // Rens eksisterende data
    stations.forEach((station) => {
        const listItem = document.createElement("li");
        const drones = Array.isArray(station.drones) ? station.drones : [];

        listItem.innerHTML = `
            <p><strong>Station ID:</strong> ${station.stationId}</p>
            <p><strong>Koordinater:</strong> Latitude ${station.latitude}, Longitude ${station.longitude}</p>
            <p><strong>Droner tildelt:</strong> ${drones.length}</p>
            <ul>
                ${drones.map((drone) => `
                    <li>Drone ID: ${drone.droneId}, UUID: ${drone.uuid}, Status: ${drone.status}</li>
                `).join("")}
            </ul>
            <select id="droneSelect-${station.stationId}">
                <option value="" disabled selected>Vælg en drone</option>
            </select>
            <button onclick="assignDrone(${station.stationId})">Tildel Drone</button>
        `;
        stationList.appendChild(listItem);

        fetchDronesForDropdown(station.stationId);
    });
}

// Fetch ledige droner og opdater dropdown
async function fetchDronesForDropdown(stationId) {
    try {
        const response = await fetch(`${API_BASE_URL}/drones`);
        const drones = await response.json();
        const dropdown = document.getElementById(`droneSelect-${stationId}`);

        drones
            .filter((drone) => !drone.stationId) // Kun droner uden station
            .forEach((drone) => {
                const option = document.createElement("option");
                option.value = drone.droneId;
                option.textContent = `Drone ID: ${drone.droneId}, UUID: ${drone.uuid}`;
                dropdown.appendChild(option);
            });
    } catch (error) {
        console.error("Fejl under hentning af droner:", error);
    }
}

// Tildel drone til station
async function assignDrone(stationId) {
    const dropdown = document.getElementById(`droneSelect-${stationId}`);
    const droneId = dropdown.value;

    if (!droneId) {
        alert("Vælg en drone først.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/stations/${stationId}/assign-drone?droneId=${droneId}`, {
            method: "POST",
        });

        if (!response.ok) {
            throw new Error(`Kunne ikke tildele drone. Status: ${response.status}`);
        }

        alert(`Drone med ID ${droneId} blev tildelt station ${stationId}`);
        fetchStations(); // Opdater listen
    } catch (error) {
        console.error("Fejl under tildeling af drone:", error);
    }
}


// Initial indlæsning af stationer
fetchStations();
