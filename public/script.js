let timerInterval; // Kept outside so we can clear it when a new date is chosen

document.getElementById("update-btn").addEventListener("click", function() {
  const nameInput = document.getElementById("event-name-input").value;
  const dateInput = document.getElementById("event-date-input").value;

  // Basic validation to ensure fields aren't empty
  if (!nameInput || !dateInput) {
    alert("Please enter both an event name and a valid date!");
    return;
  }

  // Update the heading to match the user's custom event name
  document.getElementById("event-title").innerText = nameInput;

  // Convert the user's selected date string into a millisecond timestamp
  const targetDate = new Date(dateInput).getTime();

  // Clear any existing timer loop so they don't overlap
  clearInterval(timerInterval);

  // Start a new countdown loop
  timerInterval = setInterval(function() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      clearInterval(timerInterval);
      document.getElementById("timer").innerHTML = "THE EVENT HAS STARTED!";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("timer").innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
  }, 1000);
});
// Function to log the visit to the backend API
async function logVisit() {
  try {
    await fetch('/api/visit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log("Visitor data logged.");
  } catch (error) {
    console.error("Error logging visit:", error);
  }
}

// Call the function immediately when the script loads
logVisit();