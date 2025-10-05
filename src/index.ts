class TimeDisplayHandler {
    private yourTimeFormatter: Intl.DateTimeFormat;
    private myTimeFormatter: Intl.DateTimeFormat;

    private constructor(private yourTimeDisplay: HTMLElement, private myTimeDisplay: HTMLElement) {
        const timeOptions: Intl.DateTimeFormatOptions = {
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

    private updateTime(): void {
        const now = new Date();

        this.yourTimeDisplay.textContent = this.yourTimeFormatter.format(now);
        this.myTimeDisplay.textContent = this.myTimeFormatter.format(now)
    }

    static create(): TimeDisplayHandler | null {
        const yourTimeDisplay = document.getElementById("your-time");
        const myTimeDisplay = document.getElementById("my-time");

        if (yourTimeDisplay instanceof HTMLElement && myTimeDisplay instanceof HTMLElement) {
            return new TimeDisplayHandler(yourTimeDisplay, myTimeDisplay);
        }

        console.error(`"your-time" and "my-time" elements are missing.`)
        return null;
    }
}


class PlayTimeFetcher {
    private static API_URL = "https://about.thatnohi.workers.dev";

    private unixTimeNow: number;

    private constructor(private celestePlayTimeSpan: HTMLElement, private osuPlayTimeSpan: HTMLElement, private osuRankSpan: HTMLElement) {
        this.unixTimeNow = Math.floor(Date.now() / 1000);

        this.updateCelestePlayTime();
        this.updateOsuStats();
    }

    private async updateCelestePlayTime(): Promise<void> {
        const rawCelesteCache = localStorage.getItem("celesteCache");

        if (rawCelesteCache) {
            const celesteCache = JSON.parse(rawCelesteCache);

            if (celesteCache.lastUpdateTime + 86400 > this.unixTimeNow) {
                this.celestePlayTimeSpan.textContent = celesteCache.playTime;
                return;
            }
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

    private async updateOsuStats(): Promise<void> {
        const rawOsuCache = localStorage.getItem("osuCache");

        if (rawOsuCache) {
            const osuCache = JSON.parse(rawOsuCache);

            if (osuCache.lastUpdateTime + 86400 > this.unixTimeNow) {
                this.osuPlayTimeSpan.textContent = osuCache.playTime;
                this.osuRankSpan.textContent = osuCache.rank;
                return;
            }
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

    static create(): PlayTimeFetcher | null {
        const celestePlayTimeSpan = document.getElementById("celeste-play-time");
        const osuPlayTimeSpan = document.getElementById("osu-play-time");
        const osuRankSpan = document.getElementById("osu-rank");

        if (celestePlayTimeSpan instanceof HTMLElement && osuPlayTimeSpan instanceof HTMLElement && osuRankSpan instanceof HTMLElement) {
            return new PlayTimeFetcher(celestePlayTimeSpan, osuPlayTimeSpan, osuRankSpan);
        }

        console.error(`"celeste-play-time", "osu-play-time" and "osu-rank" elements are missing.`)
        return null;
    }
}


function main() {
    TimeDisplayHandler.create();
    PlayTimeFetcher.create();
}


main()
