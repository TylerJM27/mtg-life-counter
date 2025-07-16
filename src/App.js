// App.jsx
import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    useCallback,
    useEffect,
} from "react";

const GameContext = createContext();

const useGame = () => useContext(GameContext);

const PlayerBox = ({
    player,
    index,
    showCommanderDamage,
    setShowCommanderDamage,
    openCommanderSearch,
}) => {
    const {
        updateLife,
        updateColor,
        toggleStatus,
        updatePoison,
        updateCommanderDamage,
        updateCommander,
    } = useGame();
    const [showPoisonModal, setShowPoisonModal] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);

    // Calculate total commander damage for death condition
    const hasTaken21FromOneCommander = Object.values(
        player.commanderDamage
    ).some((damage) => damage >= 21);

    const isDead =
        player.life <= 0 || player.poison >= 10 || hasTaken21FromOneCommander;

    const statusIcons = [
        {
            key: "monarch",
            icon: "crown",
            title: "Monarch",
            color: player.status.monarch ? "text-white" : "text-gray-400",
        },
        {
            key: "initiative",
            icon: "flag",
            title: "Initiative",
            color: player.status.initiative ? "text-white" : "text-gray-400",
        },
        {
            key: "city",
            icon: "city",
            title: "City's Blessing",
            color: player.status.city ? "text-white" : "text-gray-400",
        },
        {
            key: "poison",
            icon: "biohazard",
            title: "Poison Counters",
            color: "text-green-400",
        },
        {
            key: "commander",
            icon: "dragon",
            title: "Commander Damage",
            color: "text-red-400",
        },
        {
            key: "search",
            icon: "search",
            title: "Search Commander",
            color: "text-blue-400",
        },
    ];

    // If showing commander damage and not the current player, show damage input
    if (
        showCommanderDamage !== null &&
        showCommanderDamage !== index &&
        !isDead
    ) {
        const damage = player.commanderDamage[showCommanderDamage] || 0;
        return (
            <div
                className={`p-4 rounded-xl ${player.color} flex flex-col items-center justify-center h-full transition-all duration-500 transform hover:scale-105`}
                style={{
                    backgroundImage: player.commander?.image_uris?.art_crop
                        ? `url(${player.commander.image_uris.art_crop})`
                        : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="flex flex-col items-center gap-4 animate-slide-in bg-black bg-opacity-60 p-4 rounded-xl">
                    <span className="font-mtg text-xl">
                        Damage to Player {index + 1}
                    </span>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() =>
                                updateCommanderDamage(
                                    index,
                                    showCommanderDamage,
                                    damage - 1
                                )
                            }
                            className="text-4xl text-white"
                        >
                            -
                        </button>
                        <span className="text-5xl font-bold font-mtg">
                            {damage}
                        </span>
                        <button
                            onClick={() =>
                                updateCommanderDamage(
                                    index,
                                    showCommanderDamage,
                                    damage + 1
                                )
                            }
                            className="text-4xl text-white"
                        >
                            +
                        </button>
                        <span className="font-mtg text-lg text-red-400">
                            Total Life: {player.life}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            data-testid={`player-box-${index}`}
            className={`p-2 sm:p-4 rounded-xl ${
                isDead ? "bg-gray-700" : player.color
            } flex flex-col items-center justify-between h-full max-h-[90dvh] overflow-y-auto transition-all duration-500 transform hover:scale-105 relative`}
            style={{
                backgroundImage:
                    player.commander?.image_uris?.art_crop && !isDead
                        ? `url(${player.commander.image_uris.art_crop})`
                        : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* Overlay for better text readability */}
            {player.commander?.image_uris?.art_crop && !isDead && (
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-xl" />
            )}

            <div className="relative z-10 flex flex-col items-center justify-around h-full w-full">
                {isDead ? (
                    <div className="flex items-center justify-center">
                        <i className="relative fas fa-skull-crossbones text-9xl text-gray-400 animate-fade-in" />
                    </div>
                ) : showCommanderDamage === index ? (
                    <div className="flex flex-col items-center gap-4 animate-slide-in">
                        <button
                            onClick={() => setShowCommanderDamage(null)}
                            className="absolute top-2 right-2 text-2xl"
                        >
                            <i className="fas fa-times" />
                        </button>
                        <span className="font-mtg text-xl pt-5">
                            Tracking Commander Damage
                        </span>
                        <span className="font-mtg text-lg">
                            Adjust in other players' boxes
                        </span>
                    </div>
                ) : (
                    <>
                        {!player.commander && (
                            <div className="flex items-center justify-center">
                                <button
                                    onClick={() =>
                                        setShowColorPicker(!showColorPicker)
                                    }
                                    className="w-12 h-12 rounded-full"
                                    style={{
                                        backgroundColor:
                                            player.color.split("-")[1],
                                    }}
                                >
                                    <div
                                        className={`w-12 h-12 rounded-full border-2 ${
                                            player.color === player.color
                                                ? "border-white"
                                                : "border-transparent"
                                        }`}
                                    />
                                </button>
                                {showColorPicker && (
                                    <div className="flex items-center justify-center top-20 left-1/2 -translate-x-1/2 flex gap-2 bg-gray-800 p-2 rounded-xl animate-slide-in">
                                        {[
                                            "bg-red-500",
                                            "bg-blue-500",
                                            "bg-green-500",
                                            "bg-yellow-500",
                                            "bg-purple-500",
                                        ].map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => {
                                                    updateColor(index, color);
                                                    setShowColorPicker(false);
                                                }}
                                                className={`w-6 h-6 rounded-full ${color} ${
                                                    player.color === color
                                                        ? "ring-2 ring-white"
                                                        : ""
                                                }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        {/* Commander name display */}
                        {player.commander && (
                            <div className="text-center bg-black bg-opacity-60 px-3 py-1 rounded-lg">
                                <span className="font-mtg text-sm text-white">
                                    {player.commander.name}
                                </span>
                            </div>
                        )}

                        <div className="flex items-center gap-6 my-4">
                            <button
                                onClick={() =>
                                    updateLife(index, player.life - 1)
                                }
                                className="text-4xl text-white drop-shadow-lg p-4 md:p-8" // Added p-4 for larger hit area
                            >
                                -
                            </button>
                            <span className="text-5xl sm:text-7xl font-bold font-mtg text-white drop-shadow-lg">
                                {player.life}
                            </span>
                            <button
                                onClick={() =>
                                    updateLife(index, player.life + 1)
                                }
                                className="text-4xl text-white drop-shadow-lg p-4 md:p-8" // Added p-4
                            >
                                +
                            </button>
                        </div>
                        <div className="flex gap-4 flex-wrap justify-center">
                            {statusIcons.map(({ key, icon, title, color }) => (
                                <button
                                    key={key}
                                    onClick={() => {
                                        if (key === "poison")
                                            setShowPoisonModal(true);
                                        else if (key === "commander")
                                            setShowCommanderDamage(index);
                                        else if (key === "search") {
                                            console.log(
                                                "Opening commander search modal for player",
                                                index
                                            );
                                            openCommanderSearch(index);
                                        } else toggleStatus(index, key);
                                    }}
                                    className="relative group"
                                    title={title}
                                    {...(key === "search" && {
                                        "data-testid": `commander-search-${index}`,
                                    })}
                                >
                                    <i
                                        className={`fas fa-${icon} ${color} text-2xl drop-shadow-lg`}
                                    />
                                    {key === "poison" && player.poison > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 text-sm flex items-center justify-center font-mtg">
                                            {player.poison}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Poison Modal */}
            {showPoisonModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center animate-fade-in z-50">
                    <div className="bg-gray-800 p-8 rounded-xl flex flex-col gap-6 w-96">
                        <div className="flex justify-center w-full gap-4 font-mtg text-2xl">
                            <span>Poison Counters</span>
                            <button onClick={() => setShowPoisonModal(false)}>
                                <i className="fas fa-times text-2xl" />
                            </button>
                        </div>
                        <div className="flex gap-6 items-center justify-center">
                            <button
                                onClick={() =>
                                    updatePoison(index, player.poison - 1)
                                }
                                className="text-4xl text-white"
                            >
                                -
                            </button>
                            <span className="text-3xl font-mtg">
                                {player.poison}
                            </span>
                            <button
                                onClick={() =>
                                    updatePoison(index, player.poison + 1)
                                }
                                className="text-4xl text-white"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const App = () => {
    const [gameState, setGameState] = useState(null);
    const [startingLife, setStartingLife] = useState(null);
    const [customLife, setCustomLife] = useState("");
    const [error, setError] = useState(null);
    const [showCommanderDamage, setShowCommanderDamage] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const [winner, setWinner] = useState(null);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showCommanderSearch, setShowCommanderSearch] = useState(null); // use index
    const [commanderSearch, setCommanderSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!commanderSearch.trim()) {
                setSearchResults([]);
                return;
            }

            setIsSearching(true);
            fetch(
                `https://api.scryfall.com/cards/search?q=${encodeURIComponent(
                    commanderSearch
                )}+type:legendary+type:creature&order=name`
            )
                .then((res) => res.json())
                .then((data) => {
                    if (data.data) {
                        setSearchResults(data.data.slice(0, 10));
                    } else {
                        setSearchResults([]);
                    }
                })
                .catch(() => setSearchResults([]))
                .finally(() => setIsSearching(false));
        }, 300);

        return () => clearTimeout(timer);
    }, [commanderSearch]);

    // Check for winner
    useEffect(() => {
        if (!gameState || gameState.players.length === 1) return; // Skip for 1 player

        const alivePlayers = gameState.players.filter((player, index) => {
            const hasTaken21FromOneCommander = Object.values(
                player.commanderDamage
            ).some((damage) => damage >= 21);

            return (
                player.life > 0 &&
                player.poison < 10 &&
                !hasTaken21FromOneCommander
            );
        });

        if (alivePlayers.length === 1) {
            const winnerIndex = gameState.players.findIndex((p) =>
                alivePlayers.includes(p)
            );
            setWinner({ player: alivePlayers[0], index: winnerIndex });
        } else if (alivePlayers.length === 0) {
            setWinner({ draw: true });
        }
    }, [gameState]);

    const startGame = (life, players) => {
        const initialPlayers = Array(players)
            .fill()
            .map((_, i) => ({
                life,
                color: `bg-${
                    ["red", "blue", "green", "yellow", "purple", "pink"][i]
                }-500`,
                status: { monarch: false, initiative: false, city: false },
                poison: 0,
                commander: null,
                commanderDamage: Array(players)
                    .fill(0)
                    .reduce(
                        (acc, _, idx) => ({
                            ...acc,
                            [idx]: idx === i ? null : 0,
                        }),
                        {}
                    ),
            }));
        setGameState({ players: initialPlayers });
        setWinner(null);
    };

    const gameActions = useMemo(
        () => ({
            updateLife: (index, life) =>
                setGameState((prev) => ({
                    ...prev,
                    players: prev.players.map((p, i) =>
                        i === index ? { ...p, life: Math.max(0, life) } : p
                    ),
                })),
            updateColor: (index, color) =>
                setGameState((prev) => ({
                    ...prev,
                    players: prev.players.map((p, i) =>
                        i === index ? { ...p, color } : p
                    ),
                })),
            toggleStatus: (index, key) =>
                setGameState((prev) => ({
                    ...prev,
                    players: prev.players.map((p, i) =>
                        i === index
                            ? {
                                  ...p,
                                  status: {
                                      ...p.status,
                                      [key]: !p.status[key],
                                  },
                              }
                            : p
                    ),
                })),
            updatePoison: (index, poison) =>
                setGameState((prev) => ({
                    ...prev,
                    players: prev.players.map((p, i) =>
                        i === index ? { ...p, poison: Math.max(0, poison) } : p
                    ),
                })),
            updateCommanderDamage: (index, fromPlayer, damage) =>
                setGameState((prev) => {
                    const updatedPlayers = prev.players.map((p, i) => {
                        if (i !== index) return p;

                        const current = p.commanderDamage[fromPlayer] || 0;
                        const clamped = Math.max(0, damage);

                        // If already at 0 and trying to subtract, ignore
                        if (current === 0 && damage < 0) return p;

                        const newLife = p.life - (clamped - current);

                        return {
                            ...p,
                            commanderDamage: {
                                ...p.commanderDamage,
                                [fromPlayer]: clamped,
                            },
                            life: newLife,
                        };
                    });

                    return {
                        ...prev,
                        players: updatedPlayers,
                    };
                }),

            updateCommander: (index, commander) =>
                setGameState((prev) => ({
                    ...prev,
                    players: prev.players.map((p, i) =>
                        i === index ? { ...p, commander } : p
                    ),
                })),
        }),
        []
    );

    const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

    const validateCustomLife = (value) => {
        const num = parseFloat(value);
        if (isNaN(num) || !Number.isInteger(num) || num < 1) {
            setError(
                "Starting life must be a whole number greater than or equal to 1."
            );
            return false;
        }
        setError(null);
        return true;
    };

    const handleCustomLifeSubmit = () => {
        if (validateCustomLife(customLife)) {
            setStartingLife(Math.max(1, parseInt(customLife)));
        }
    };

    if (!gameState) {
        if (startingLife === null) {
            return (
                <div className="relative">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`fixed top-4 right-4 z-50 p-3`}
                    >
                        <i
                            className={`${
                                darkMode
                                    ? "text-white fa-sun"
                                    : "text-gray-900 fa-moon"
                            } fas text-5xl`}
                        />
                    </button>
                    <div
                        className={`full-viewport ${
                            darkMode ? "bg-gray-900" : "bg-white"
                        } flex flex-col items-center justify-center p-4 font-mtg text-white`}
                    >
                        <h1
                            className={` ${
                                darkMode ? "text-white" : "text-black"
                            } text-6xl font-bold mb-8 w-full text-center py-4 animate-slide-down`}
                        >
                            <i className="hidden fa-brands fa-wizards-of-the-coast text-8xl p-4 text-yellow-400" />
                            Magic The Gathering
                        </h1>

                        <div className="bg-gray-800 p-6 rounded-xl shadow-lg animate-fade-in">
                            <h2 className="text-3xl mb-4 flex items-center justify-center">
                                Select Starting Life
                            </h2>
                            <div className="flex gap-4 flex-wrap justify-center">
                                {[20, 30, 40].map((life) => (
                                    <button
                                        key={life}
                                        onClick={() => setStartingLife(life)}
                                        className="bg-yellow-400 px-8 py-3 rounded-xl text-2xl"
                                    >
                                        {life}
                                    </button>
                                ))}
                                <input
                                    type="number"
                                    value={customLife}
                                    onChange={(e) =>
                                        setCustomLife(e.target.value)
                                    }
                                    placeholder="Custom Life"
                                    className="bg-gray-700 px-4 py-3 rounded-xl text-white w-40 text-xl text-center"
                                    min="1"
                                    step="1"
                                />
                                {customLife && (
                                    <button
                                        onClick={handleCustomLifeSubmit}
                                        className="bg-blue-500 px-6 py-3 rounded-xl text-2xl"
                                    >
                                        Set
                                    </button>
                                )}
                            </div>
                        </div>
                        {error && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center animate-fade-in">
                                <div className="flex flex-col bg-red-600 p-6 rounded-xl shadow-lg items-center">
                                    <p className="text-xl mb-4">{error}</p>
                                    <button
                                        onClick={() => setError(null)}
                                        className="bg-gray-700 px-6 py-2 rounded-xl"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div
                className={`full-viewport ${
                    darkMode ? "bg-gray-900" : "bg-white"
                } flex flex-col items-center justify-center p-4 font-mtg text-white`}
            >
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`fixed top-4 right-4 z-50 p-3`}
                >
                    <i
                        className={`${
                            darkMode
                                ? "text-white fa-sun"
                                : "text-gray-900 fa-moon"
                        } fas text-5xl`}
                    />
                </button>
                <h1
                    className={` ${
                        darkMode ? "text-white" : "text-black"
                    } text-6xl font-bold mb-8 w-full text-center py-4 animate-slide-down`}
                >
                    <i className="fa-brands fa-wizards-of-the-coast text-8xl p-4 text-yellow-300" />
                    Magic The Gathering Life Counter
                </h1>
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg animate-fade-in ">
                    <h2 className="text-3xl mb-4 flex items-center justify-center">
                        Select Number of Players
                    </h2>
                    <div className="grid grid-cols-3 gap-4">
                        {diceFaces.map((face, i) => (
                            <button
                                key={i + 1}
                                onClick={() => startGame(startingLife, i + 1)}
                                className=" px-2 py-1 rounded-xl text-9xl text-yellow-400"
                            >
                                {face}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const getGridStyles = (count) => {
        if (count === 1) return "grid-cols-1";
        if (count === 2) return "grid-rows-2 sm:grid-cols-2 sm:grid-rows-4";
        if (count === 3) return " grid-rows-3 sm:grid-rows-1";
        if (count === 4) return "sm:grid-cols-2 sm:grid-rows-2";
        if (count === 5)
            return "grid-cols-2 grid-rows-[1fr_1fr_1fr] sm:grid-cols-3 sm:grid-rows-[1fr_1fr]";
        if (count === 6)
            return "grid-cols-2 grid-rows-3 sm:grid-cols-3 sm:grid-rows-2";
        return "grid-cols-1";
    };

    const getBoxStyles = (count, index) => {
        if (count === 2 && index === 0) return "sm:row-span-full";
        if (count === 2 && index === 1) return "sm:row-span-full";
        if (count === 3 && index === 2)
            return "col-span-1 sm:col-span-2 row-span-2";
        if (count === 5 && index === 2) return "sm:row-span-2";
        if (count === 5 && index === 4)
            return "col-span-2 sm:col-span-1 row-span-1";
        return "";
    };

    return (
        <GameContext.Provider value={gameActions}>
            <div
                className={`full-viewport ${
                    darkMode ? "bg-gray-900" : "bg-white"
                } flex flex-col items-center justify-center p-2 sm:p-4 font-mtg text-white`}
            >
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`hidden xl:block fixed top-4 right-4 z-50 p-3`}
                >
                    <i
                        className={`${
                            darkMode
                                ? "text-white fa-sun"
                                : "text-gray-900 fa-moon"
                        } fas text-5xl`}
                    />
                </button>
                <h1
                    className={`hidden xl:block ${
                        darkMode ? "text-white" : "text-black"
                    } text-4xl font-bold sm:text-6xl sm:mb-8 w-full text-center py-2 sm:py-4 animate-slide-down`}
                >
                    <i className="fa-brands fa-wizards-of-the-coast text-8xl p-4 text-yellow-300" />
                    Magic The Gathering Life Counter
                </h1>
                <div className="bg-gray-800 p-2 sm:p-4 rounded-2xl shadow-xl h-full my-2 sm:my-8 w-full max-w-7xl animate-fade-in overflow-y-auto">
                    <div
                        className={`grid ${getGridStyles(
                            gameState.players.length
                        )} gap-4 h-full`}
                    >
                        {gameState.players.map((player, index) => (
                            <div
                                key={index}
                                className={`grid animate-slide-in ${getBoxStyles(
                                    gameState.players.length,
                                    index
                                )}`}
                            >
                                <PlayerBox
                                    key={index}
                                    player={player}
                                    index={index}
                                    showCommanderDamage={showCommanderDamage}
                                    setShowCommanderDamage={
                                        setShowCommanderDamage
                                    }
                                    openCommanderSearch={setShowCommanderSearch}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                {/* Winner Popup */}
                {winner && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center animate-fade-in z-50">
                        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-8 rounded-2xl shadow-2xl text-center max-w-md animate-slide-in">
                            {winner.draw ? (
                                <>
                                    <h2 className="text-4xl font-bold font-mtg text-black mb-4">
                                        It's a Draw!
                                    </h2>
                                    <p className="text-xl text-black mb-6">
                                        All players have been eliminated
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-4xl font-bold font-mtg text-black mb-4">
                                        🎉 Victory! 🎉
                                    </h2>
                                    <p className="text-2xl text-black mb-4">
                                        Player {winner.index + 1} Wins!
                                    </p>
                                    {winner.player.commander && (
                                        <div className="mb-4">
                                            <img
                                                src={
                                                    winner.player.commander
                                                        .image_uris?.normal ||
                                                    winner.player.commander
                                                        .image_uris?.large
                                                }
                                                alt={
                                                    winner.player.commander.name
                                                }
                                                className="w-48 h-auto rounded-lg mx-auto mb-2 shadow-lg"
                                            />
                                            <p className="text-lg font-mtg text-black">
                                                with{" "}
                                                {winner.player.commander.name}
                                            </p>
                                        </div>
                                    )}
                                    <div className="text-lg text-black mb-6">
                                        <p>Life: {winner.player.life}</p>
                                        <p>Poison: {winner.player.poison}</p>
                                    </div>
                                </>
                            )}
                            <button
                                onClick={() => {
                                    setGameState(null);
                                    setStartingLife(null);
                                    setShowCommanderDamage(null);
                                    setWinner(null);
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl text-xl font-mtg transition-colors"
                            >
                                New Game
                            </button>
                        </div>
                    </div>
                )}
                {console.log("showCommanderSearch =", showCommanderSearch)}
                {/* Commander Search Modal */}
                {showCommanderSearch !== null && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center animate-fade-in z-50 overflow-y-auto">
                        <div className="bg-gray-800 mt-8 p-6 rounded-xl w-11/12 max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-mtg text-xl text-white">
                                    Search Commander
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowCommanderSearch(null);
                                        setCommanderSearch("");
                                        setSearchResults([]);
                                    }}
                                    className="text-white text-xl"
                                >
                                    <i className="fas fa-times" />
                                </button>
                            </div>

                            {/* Input */}
                            <input
                                type="text"
                                value={commanderSearch}
                                onChange={(e) =>
                                    setCommanderSearch(e.target.value)
                                }
                                placeholder="Search Commander..."
                                className="w-full p-3 rounded-lg bg-gray-700 text-white mb-4"
                                autoFocus
                            />

                            {/* Results (always visible, scrollable) */}
                            <div className="flex-1 overflow-y-auto">
                                {isSearching ? (
                                    <div className="text-center text-white">
                                        Searching...
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    <div className="space-y-2">
                                        {searchResults.map((card) => (
                                            <button
                                                key={card.id}
                                                onClick={() => {
                                                    gameActions.updateCommander(
                                                        showCommanderSearch,
                                                        card
                                                    );
                                                    setShowCommanderSearch(
                                                        null
                                                    );
                                                    setCommanderSearch("");
                                                    setSearchResults([]);
                                                }}
                                                className="w-full p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-left text-white flex items-center gap-3"
                                            >
                                                {card.image_uris?.small && (
                                                    <img
                                                        src={
                                                            card.image_uris
                                                                .small
                                                        }
                                                        alt={card.name}
                                                        className="w-12 h-12 rounded object-cover"
                                                    />
                                                )}
                                                <div>
                                                    <div className="font-mtg">
                                                        {card.name}
                                                    </div>
                                                    <div className="text-sm text-gray-300">
                                                        {card.type_line}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : commanderSearch ? (
                                    <div className="text-center text-gray-400">
                                        No results found
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-400">
                                        Start typing to search for a commander.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Reset Confirmation Modal */}
                {showResetConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center animate-fade-in z-50">
                        <div className="bg-gray-800 p-8 rounded-xl shadow-lg text-center">
                            <h3 className="text-2xl font-mtg text-white mb-4">
                                Reset Game?
                            </h3>
                            <p className="text-white mb-6">
                                Are you sure? This will end the current game and
                                return to the main menu.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => {
                                        setGameState(null);
                                        setStartingLife(null);
                                        setShowCommanderDamage(null);
                                        setShowResetConfirm(false);
                                    }}
                                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-mtg transition-colors"
                                >
                                    Yes, Reset
                                </button>
                                <button
                                    onClick={() => setShowResetConfirm(false)}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-mtg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => setShowResetConfirm(true)}
                    className="bg-red-500 px-6 py-3 rounded-xl text-2xl animate-slide-up w-full max-w-7xl"
                >
                    Reset Game
                </button>
            </div>
        </GameContext.Provider>
    );
};

export default App;
