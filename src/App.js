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
}) => {
    const {
        updateLife,
        updateColor,
        toggleStatus,
        updatePoison,
        updateCommanderDamage,
    } = useGame();
    const [showPoisonModal, setShowPoisonModal] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);

    // Calculate total commander damage for death condition
    const totalCommanderDamage = Object.values(player.commanderDamage)
        .filter((damage) => damage !== null)
        .reduce((sum, damage) => sum + damage, 0);

    const isDead =
        player.life <= 0 || player.poison >= 10 || totalCommanderDamage >= 21;

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
            >
                <div className="flex flex-col items-center gap-4 animate-slide-in">
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
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`p-4 rounded-xl ${
                isDead ? "bg-gray-700" : player.color
            } flex flex-col items-center justify-around h-full transition-all duration-500 transform hover:scale-105`}
        >
            {isDead ? (
                <div className=" inset-0 flex items-center justify-center">
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
                    <div className="flex items-center justify-center">
                        <button
                            onClick={() => setShowColorPicker(!showColorPicker)}
                            className="w-12 h-12 rounded-full"
                            style={{
                                backgroundColor: player.color.split("-")[1],
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
                    <div className="flex items-center gap-6 my-4">
                        <button
                            onClick={() => updateLife(index, player.life - 1)}
                            className="text-4xl text-white"
                        >
                            -
                        </button>
                        <span className="text-7xl font-bold font-mtg">
                            {player.life}
                        </span>
                        <button
                            onClick={() => updateLife(index, player.life + 1)}
                            className="text-4xl text-white"
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
                                    else toggleStatus(index, key);
                                }}
                                className="relative group"
                                title={title}
                            >
                                <i
                                    className={`fas fa-${icon} ${color} text-2xl`}
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
            {showPoisonModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center animate-fade-in">
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
                setGameState((prev) => ({
                    ...prev,
                    players: prev.players.map((p, i) =>
                        i === index
                            ? {
                                  ...p,
                                  commanderDamage: {
                                      ...p.commanderDamage,
                                      [fromPlayer]: Math.max(0, damage),
                                  },
                              }
                            : p
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
                        className={`min-h-screen ${
                            darkMode ? "bg-gray-900" : "bg-white"
                        } flex flex-col items-center justify-center p-4 font-mtg text-white`}
                    >
                        <h1
                            className={` ${
                                darkMode ? "text-white" : "text-black"
                            } text-6xl font-bold mb-8 w-full text-center py-4 animate-slide-down`}
                        >
                            <i className="fa-brands fa-wizards-of-the-coast text-8xl p-4 text-yellow-400" />
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
                className={`min-h-screen ${
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
                className={`min-h-screen max-h-screen ${
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
                <div className="bg-gray-800 p-4 rounded-2xl shadow-xl h-screen my-8 w-full max-w-7xl animate-fade-in">
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
                                    player={player}
                                    index={index}
                                    showCommanderDamage={showCommanderDamage}
                                    setShowCommanderDamage={
                                        setShowCommanderDamage
                                    }
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    onClick={() => {
                        setGameState(null);
                        setStartingLife(null);
                        setShowCommanderDamage(null);
                    }}
                    className="bg-red-500 px-6 py-3 rounded-xl text-2xl animate-slide-up w-full max-w-7xl"
                >
                    Reset Game
                </button>
            </div>
        </GameContext.Provider>
    );
};

export default App;
