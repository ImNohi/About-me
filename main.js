function updateTime() {
    const now = new Date();

    const timeDisplay = document.getElementById("current-time");

    if (timeDisplay) {
        const options = {
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        };
        const formattedTime = now.toLocaleTimeString(undefined, options);

        timeDisplay.innerHTML = formattedTime;
    } else {
        console.error("Error: The element with ID 'current-time' was not found.");
    }
}

updateTime();
setInterval(updateTime, 1000);
