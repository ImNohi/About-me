"use strict";

class TimeDisplayHandler {
    constructor() {
        this.yourTimeDisplay = document.getElementById("your-time");
        this.myTimeDisplay = document.getElementById("my-time");

        const timeOptions = {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        };

        this.yourTimeFormatter = new Intl.DateTimeFormat("en-US", timeOptions);
        this.myTimeFormatter = new Intl.DateTimeFormat("en-US", { ...timeOptions, timeZone: "Europe/Moscow" });

        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
    }

    updateTime() {
        const now = new Date();

        this.yourTimeDisplay.textContent = this.yourTimeFormatter.format(now);
        this.myTimeDisplay.textContent = this.myTimeFormatter.format(now)
    }
}


class PlayTimeFetcher {
    static API_URL = "https://about.thatnohi.workers.dev";

    constructor() {
        this.unixTimeNow = Math.floor(Date.now() / 1000);

        this.celestePlayTimeSpan = document.getElementById("celeste-play-time");
        this.osuPlayTimeSpan = document.getElementById("osu-play-time");
        this.osuRankSpan = document.getElementById("osu-rank");

        this.updateCelestePlayTime();
        this.updateOsuStats();
    }

    async updateCelestePlayTime() {
        const celesteCache = JSON.parse(localStorage.getItem("celesteCache"));

        if (celesteCache?.lastUpdateTime + 86400 > this.unixTimeNow) {
            this.celestePlayTimeSpan.textContent = celesteCache.playTime;
            return;
        }

        const url = `${PlayTimeFetcher.API_URL}/get-celeste-play-time`;

        const response = await fetch(url);

        if (response.ok) {
            const result = await response.json();
            if (result.playTime) {
                const formattedPlayTime = `${(result.playTime / 60).toFixed(1)}h`;
                this.celestePlayTimeSpan.textContent = formattedPlayTime;

                localStorage.setItem("celesteCache", JSON.stringify({
                    lastUpdateTime: this.unixTimeNow,
                    playTime: formattedPlayTime,
                }));
            }
        }
    }

    async updateOsuStats() {
        const osuCache = JSON.parse(localStorage.getItem("osuCache"));

        if (osuCache?.lastUpdateTime + 86400 > this.unixTimeNow) {
            this.osuPlayTimeSpan.textContent = osuCache.playTime;
            this.osuRankSpan.textContent = osuCache.rank;
            return;
        }

        const url = `${PlayTimeFetcher.API_URL}/get-osu-stats`;

        const response = await fetch(url);

        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                const formattedPlayTime = `${(result.playTime / 3600).toFixed(1)}h`
                const formattedRank = `#${result.rank.toLocaleString()}`;

                this.osuPlayTimeSpan.textContent = formattedPlayTime;
                this.osuRankSpan.textContent = formattedRank;

                localStorage.setItem("osuCache", JSON.stringify({
                    lastUpdateTime: this.unixTimeNow,
                    playTime: formattedPlayTime,
                    rank: formattedRank,
                }));
            }
        }
    }
}


function main() {
    new TimeDisplayHandler();
    new PlayTimeFetcher();
}


main()
