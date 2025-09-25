var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var TimeDisplayHandler = /** @class */ (function () {
    function TimeDisplayHandler(yourTimeDisplay, myTimeDisplay) {
        var _this = this;
        this.yourTimeDisplay = yourTimeDisplay;
        this.myTimeDisplay = myTimeDisplay;
        var timeOptions = {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        };
        this.yourTimeFormatter = new Intl.DateTimeFormat("en-US", timeOptions);
        this.myTimeFormatter = new Intl.DateTimeFormat("en-US", __assign(__assign({}, timeOptions), { timeZone: "Europe/Moscow" }));
        this.updateTime();
        setInterval(function () { return _this.updateTime(); }, 1000);
    }
    TimeDisplayHandler.prototype.updateTime = function () {
        var now = new Date();
        this.yourTimeDisplay.textContent = this.yourTimeFormatter.format(now);
        this.myTimeDisplay.textContent = this.myTimeFormatter.format(now);
    };
    TimeDisplayHandler.create = function () {
        var yourTimeDisplay = document.getElementById("your-time");
        var myTimeDisplay = document.getElementById("my-time");
        if (yourTimeDisplay instanceof HTMLElement && myTimeDisplay instanceof HTMLElement) {
            return new TimeDisplayHandler(yourTimeDisplay, myTimeDisplay);
        }
        console.error("\"your-time\" and \"my-time\" elements are missing.");
        return null;
    };
    return TimeDisplayHandler;
}());
var PlayTimeFetcher = /** @class */ (function () {
    function PlayTimeFetcher(celestePlayTimeSpan, osuPlayTimeSpan, osuRankSpan) {
        this.celestePlayTimeSpan = celestePlayTimeSpan;
        this.osuPlayTimeSpan = osuPlayTimeSpan;
        this.osuRankSpan = osuRankSpan;
        this.unixTimeNow = Math.floor(Date.now() / 1000);
        this.updateCelestePlayTime();
        this.updateOsuStats();
    }
    PlayTimeFetcher.prototype.updateCelestePlayTime = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rawCelesteCache, celesteCache, url, response, result, formattedPlayTime;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rawCelesteCache = localStorage.getItem("celesteCache");
                        if (rawCelesteCache) {
                            celesteCache = JSON.parse(rawCelesteCache);
                            if (celesteCache.lastUpdateTime + 86400 > this.unixTimeNow) {
                                this.celestePlayTimeSpan.textContent = celesteCache.playTime;
                                return [2 /*return*/];
                            }
                        }
                        url = "".concat(PlayTimeFetcher.API_URL, "/get-celeste-play-time");
                        return [4 /*yield*/, fetch(url)];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        result = _a.sent();
                        if (result.playTime) {
                            formattedPlayTime = "".concat((result.playTime / 60).toFixed(1), "h");
                            this.celestePlayTimeSpan.textContent = formattedPlayTime;
                            localStorage.setItem("celesteCache", JSON.stringify({
                                lastUpdateTime: this.unixTimeNow,
                                playTime: formattedPlayTime,
                            }));
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PlayTimeFetcher.prototype.updateOsuStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rawOsuCache, osuCache, url, response, result, formattedPlayTime, formattedRank;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rawOsuCache = localStorage.getItem("osuCache");
                        if (rawOsuCache) {
                            osuCache = JSON.parse(rawOsuCache);
                            if (osuCache.lastUpdateTime + 86400 > this.unixTimeNow) {
                                this.osuPlayTimeSpan.textContent = osuCache.playTime;
                                this.osuRankSpan.textContent = osuCache.rank;
                                return [2 /*return*/];
                            }
                        }
                        url = "".concat(PlayTimeFetcher.API_URL, "/get-osu-stats");
                        return [4 /*yield*/, fetch(url)];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        result = _a.sent();
                        if (result.success) {
                            formattedPlayTime = "".concat((result.playTime / 3600).toFixed(1), "h");
                            formattedRank = "#".concat(result.rank.toLocaleString());
                            this.osuPlayTimeSpan.textContent = formattedPlayTime;
                            this.osuRankSpan.textContent = formattedRank;
                            localStorage.setItem("osuCache", JSON.stringify({
                                lastUpdateTime: this.unixTimeNow,
                                playTime: formattedPlayTime,
                                rank: formattedRank,
                            }));
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PlayTimeFetcher.create = function () {
        var celestePlayTimeSpan = document.getElementById("celeste-play-time");
        var osuPlayTimeSpan = document.getElementById("osu-play-time");
        var osuRankSpan = document.getElementById("osu-rank");
        if (celestePlayTimeSpan instanceof HTMLElement && osuPlayTimeSpan instanceof HTMLElement && osuRankSpan instanceof HTMLElement) {
            return new PlayTimeFetcher(celestePlayTimeSpan, osuPlayTimeSpan, osuRankSpan);
        }
        console.error("\"celeste-play-time\", \"osu-play-time\" and \"osu-rank\" elements are missing.");
        return null;
    };
    PlayTimeFetcher.API_URL = "https://about.thatnohi.workers.dev";
    return PlayTimeFetcher;
}());
function main() {
    TimeDisplayHandler.create();
    PlayTimeFetcher.create();
}
main();
