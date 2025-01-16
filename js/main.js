const API_BASE_URL = "http://localhost:8080/api";



// Initial fetch for deliveries and drones
fetchDeliveries();
fetchDrones();

// Opdater data hvert minut
setInterval(fetchDeliveries, 60000);
setInterval(fetchDrones, 60000);
