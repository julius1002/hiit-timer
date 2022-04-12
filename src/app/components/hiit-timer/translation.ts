    
    const translation: any = {
    "German": {
        "Break": "Pause",
        "1": "1",
        "2": "2",
        "3": "3",
        "You are done": "Du bist durch",
        "Break Over": "Pause vorbei",
        "Last Round": "Letzte Runde",
        "Starting": "Auf gehts",
        "Delay": (value: number) => value === 0 ? "Starte" : "Starte in " + (value === 1 ? "einer Sekunde" : value + " Sekunden")
    },
    "English": {
        "Break": "Break",
        "1": "1",
        "2": "2",
        "3": "3",
        "You are done": "You are done",
        "Break Over": "Break Over",
        "Last Round": "Last Round",
        "Halfway Through" : "Halfway Through",
        "Delay": (value: number) => value === 0 ? "Starting" : "Starting in " + (value === 1 ? "one Second" : value + " Seconds")
    },
    "French": {
        "Break": "Pause",
        "1": "1",
        "2": "2",
        "3": "3",
        "You are done": "Vous avez fini",
        "Break Over": "Fin de la pause",
        "Last Round": "Dernier tour",
        "Delay": (value: number) => value === 0 ? "Commence" : "Début dans " + (value === 1 ? "une Seconde" : value + " secondes")
    },
    "Spanish": {
        "Break": "Descanso",
        "1": "1",
        "2": "2",
        "3": "3",
        "You are done": "Ya está",
        "Break Over": "Pausa al final",
        "Last Round": "Última ronda",
        "Delay": (value: number) => value === 0 ? "Comienza!" : "Comienza en " + (value === 1 ? "un segundo" : value + " segundos")
    }
}

export { translation }