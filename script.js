// Get movie select element
const movieSelect = document.getElementById("movie");
let baseTicketPrice = parseInt(movieSelect.value);

// Define price multipliers for different sections
const priceMultipliers = {
  gold: 1.5, // Gold seats cost 50% more
  silver: 1.0, // Silver seats at base price
};

// Add event listener for movie selection change
movieSelect.addEventListener("change", (e) => {
  baseTicketPrice = parseInt(e.target.value);
  updateBookingSummary();
});

// Rest of seat configuration remains the same
const seatAreas = {
  silver: {
    name: "Silver",
    rows: 4,
    seatsPerRow: 8,
    occupied: ["A1", "B4", "C3"],
  },
  gold: {
    name: "Gold",
    rows: 4,
    seatsPerRow: 10,
    occupied: ["E5", "F3", "G4"],
  },
};

let selectedSeats = [];
let selectedSeatsDetails = new Map(); // Store seat type (gold/silver) for each selected seat

// Update handleSeatClick to store seat type
function handleSeatClick(seatButton, areaKey, seatId) {
  if (seatAreas[areaKey].occupied.includes(seatId)) return;

  seatButton.classList.toggle("selected");

  if (selectedSeats.includes(seatId)) {
    selectedSeats = selectedSeats.filter((id) => id !== seatId);
    selectedSeatsDetails.delete(seatId);
  } else {
    selectedSeats.push(seatId);
    selectedSeatsDetails.set(seatId, areaKey);
  }

  updateBookingSummary();
}

// Update booking summary to handle different prices
function updateBookingSummary() {
  const summaryDiv = document.querySelector(".booking-summary");
  const selectedSeatsElem = document.getElementById("selected-seats");
  const totalPriceElem = document.getElementById("total-price");
  const countElem = document.getElementById("count");
  const totalElem = document.getElementById("total");

  if (selectedSeats.length > 0) {
    summaryDiv.style.display = "block";
    selectedSeatsElem.textContent = selectedSeats.join(", ");

    // Calculate total price considering seat types
    let totalPrice = 0;
    selectedSeats.forEach((seatId) => {
      const seatType = selectedSeatsDetails.get(seatId);
      const multiplier = priceMultipliers[seatType];
      totalPrice += baseTicketPrice * multiplier;
    });

    countElem.textContent = selectedSeats.length;
    totalElem.textContent = totalPrice.toFixed(2);

    // Update price breakdown
    const goldSeats = Array.from(selectedSeatsDetails.entries()).filter(
      ([_, type]) => type === "gold"
    ).length;
    const silverSeats = selectedSeats.length - goldSeats;

    totalPriceElem.innerHTML = `
            Total: Rs.${totalPrice.toFixed(2)}<br>
            <small>
                ${
                  goldSeats
                    ? `Gold (${goldSeats} seats): Rs.${(
                        goldSeats *
                        baseTicketPrice *
                        priceMultipliers.gold
                      ).toFixed(2)}<br>`
                    : ""
                }
                ${
                  silverSeats
                    ? `Silver (${silverSeats} seats): Rs.${(
                        silverSeats *
                        baseTicketPrice *
                        priceMultipliers.silver
                      ).toFixed(2)}`
                    : ""
                }
            </small>
        `;
  } else {
    summaryDiv.style.display = "none";
    countElem.textContent = "0";
    totalElem.textContent = "0";
  }
}

// Create seat map function - update to show prices
function createSeatMap() {
  const seatMap = document.querySelector(".seat-map");
  seatMap.innerHTML = "";

  Object.entries(seatAreas).forEach(([areaKey, area]) => {
    const areaDiv = document.createElement("div");
    areaDiv.className = `area ${areaKey}`;
    // Add price information to section title
    const priceMultiplier = priceMultipliers[areaKey];
    areaDiv.innerHTML = `
            <h2 class="area-title">
                ${area.name} Section
                <small style="display: block; font-size: 0.8em; color: #666;">
                    (Rs.${(baseTicketPrice * priceMultiplier).toFixed(
                      2
                    )} per seat)
                </small>
            </h2>
        `;

    // Rest of the seat creation code remains the same
    for (let row = 0; row < area.rows; row++) {
      const rowDiv = document.createElement("div");
      rowDiv.className = "row";

      const rowLabel = document.createElement("div");
      rowLabel.className = "row-label";
      const startChar = areaKey === "gold" ? 65 : 65 + seatAreas.gold.rows;
      rowLabel.textContent = String.fromCharCode(startChar + row);
      rowDiv.appendChild(rowLabel);

      for (let seat = 0; seat < area.seatsPerRow; seat++) {
        const seatButton = document.createElement("button");
        const seatId = `${String.fromCharCode(startChar + row)}${seat + 1}`;
        seatButton.className = `seat ${
          area.occupied.includes(seatId) ? "occupied" : ""
        }`;
        seatButton.textContent = seat + 1;
        seatButton.dataset.seatId = seatId;
        seatButton.dataset.area = areaKey;

        seatButton.addEventListener("click", () =>
          handleSeatClick(seatButton, areaKey, seatId)
        );
        rowDiv.appendChild(seatButton);
      }
      areaDiv.appendChild(rowDiv);
    }
    seatMap.appendChild(areaDiv);
  });
}

// Handle movie selection change to update displayed prices
movieSelect.addEventListener("change", () => {
  createSeatMap(); // Recreate seat map to update displayed prices
});

// Initialize
createSeatMap();

// Handle window resize
window.addEventListener("resize", () => {
  if (window.innerWidth < 768 !== isMobile) {
    location.reload();
  }
});
