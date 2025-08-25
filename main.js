function main() {
    const yourTimeDisplay = document.getElementById("your-time");
    const myTimeDisplay = document.getElementById("my-time");

    const timeOptions = {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    };

    const yourTimeFormatter = new Intl.DateTimeFormat("en-US", timeOptions);
    const myTimeFormatter = new Intl.DateTimeFormat("en-US", {...timeOptions, timeZone: "Europe/Moscow"});

    updateTime(yourTimeFormatter, myTimeFormatter, yourTimeDisplay, myTimeDisplay);
    setInterval(updateTime, 1000, yourTimeFormatter, myTimeFormatter, yourTimeDisplay, myTimeDisplay);
}

function updateTime(localTimeFormatter, myTimeFormatter, yourTimeDisplay, myTimeDisplay) {
    const now = new Date();

    const yourTime = localTimeFormatter.format(now);
    const myTime = myTimeFormatter.format(now)

    yourTimeDisplay.textContent = `Your ${yourTime}`;
    myTimeDisplay.textContent = `Is my ${myTime}`;
}


main()
