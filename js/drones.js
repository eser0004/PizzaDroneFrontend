const droneList = document.getElementById("droneList");
const addDroneBtn = document.getElementById("addDroneBtn");

// Hent alle droner
async function fetchDrones() {
    try {
        const response = await fetch(`${API_BASE_URL}/drones`);
        if (!response.ok) {
            throw new Error(`HTTP-fejl! Status: ${response.status}`);
        }
        const drones = await response.json();
        updateDroneList(drones);
    } catch (error) {
        console.error("Fejl under hentning af droner:", error);
        alert("Kunne ikke hente droner. Prøv igen senere.");
    }
}

// Opdater drone-listen
function updateDroneList(drones) {
    droneList.innerHTML = ""; // Rens eksisterende data
    drones.forEach((drone) => {
        const listItem = createDroneListItem(drone);
        droneList.appendChild(listItem);
    });
}

// Opret listeelement for en drone
function createDroneListItem(drone) {
    const listItem = document.createElement("li");
    listItem.textContent = `Drone ID: ${drone.droneId}, UUID: ${drone.uuid}, Status: ${drone.status}`;
    listItem.dataset.droneId = drone.droneId;

    // Slet-knap
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Slet";
    deleteButton.onclick = async () => {
        await deleteDrone(drone.droneId);
        fetchDrones(); // Opdater listen
    };
    listItem.appendChild(deleteButton);

    // Opdater-status-knap
    const updateButton = document.createElement("button");
    updateButton.textContent = "Opdater status";
    updateButton.onclick = () => showStatusDropdown(drone.droneId, listItem, drone.status);
    listItem.appendChild(updateButton);

    return listItem;
}

// Slet en drone
async function deleteDrone(droneId) {
    try {
        const response = await fetch(`${API_BASE_URL}/drones/${droneId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`Kunne ikke slette drone med ID ${droneId}`);
        }

        alert(`Drone med ID ${droneId} er slettet.`);
    } catch (error) {
        console.error("Fejl under sletning af drone:", error);
        alert("Kunne ikke slette dronen. Prøv igen senere.");
    }
}

// Vis dropdown til opdatering af status
function showStatusDropdown(droneId, listItem, currentStatus) {
    const dropdown = document.createElement("select");
    const statuses = ["i drift", "ude af drift", "udfaset"];

    statuses.forEach((status) => {
        const option = document.createElement("option");
        option.value = status;
        option.textContent = status;
        if (status === currentStatus) {
            option.selected = true;
        }
        dropdown.appendChild(option);
    });

    const saveButton = document.createElement("button");
    saveButton.textContent = "Gem";
    saveButton.onclick = async () => {
        const newStatus = dropdown.value;
        await updateDroneStatus(droneId, newStatus);
        fetchDrones(); // Opdater listen
    };

    listItem.innerHTML = ""; // Rens elementet midlertidigt
    listItem.appendChild(dropdown);
    listItem.appendChild(saveButton);
}

// Opdater en drones status
async function updateDroneStatus(droneId, newStatus) {
    try {
        const response = await fetch(`${API_BASE_URL}/drones/update`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ droneId, status: newStatus }),
        });

        if (!response.ok) {
            throw new Error(`Kunne ikke opdatere status for drone med ID ${droneId}`);
        }

        alert(`Drone med ID ${droneId} opdateret til status: ${newStatus}`);
    } catch (error) {
        console.error("Fejl under opdatering af drone:", error);
        alert("Kunne ikke opdatere drone-status. Prøv igen senere.");
    }
}

// Opret en ny drone
addDroneBtn.addEventListener("click", async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/drones/add`, {
            method: "POST",
        });

        if (!response.ok) {
            throw new Error("Kunne ikke oprette en ny drone.");
        }

        alert("Ny drone oprettet!");
        fetchDrones(); // Opdater listen
    } catch (error) {
        console.error("Fejl under oprettelse af drone:", error);
        alert("Kunne ikke oprette en ny drone. Prøv igen senere.");
    }
});

// Initial indlæsning af droner
fetchDrones();
