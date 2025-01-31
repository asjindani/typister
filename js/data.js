const themes = fetch('/json/themes.json').then((response) => response.json()),
     words100 = fetch('/json/words100.json').then((response) => response.json()),
     words1000 = fetch('/json/words1000.json').then((response) => response.json()),
     words58K = fetch('/json/words58k.json').then((response) => response.json()),
     words370K = fetch('/json/words370k.json').then((response) => response.json());

function getTotalSeconds() {
    return +(localStorage.seconds || 30)
}

function getTotalWords() {
    return parseInt(localStorage.totalWords || 200)
}

function getCurrentTheme(themeData) {
    if (localStorage.theme)
        try {
            return JSON.parse(localStorage.theme)
        } catch {}

    // Checks whether the user prefers dark mode
    let is_dark = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
    let type = (is_dark ? 'dark' : 'light')
    return {index: themeData.default[type], type: type}
}

function getWordsCategory() {
    return (localStorage.words) ? 'custom' : localStorage.wordsCategory || '100'
}

async function getWordList(category) {
    if (category == 'custom')
        return JSON.parse(localStorage.words || '[]')
    if (category == '100')
        return words100
    if (category == '1000')
        return words1000
    if (category == '58K')
        return words58K
    if (category == '370K')
        return words370K
    throw new Error(`Cannot get words from category "${category}"`)
}

export { themes, getTotalSeconds, getTotalWords, getCurrentTheme, getWordsCategory, getWordList }