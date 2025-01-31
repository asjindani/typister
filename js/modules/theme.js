const root = document.querySelector(':root')

function setTheme(theme, themeData) {
    let themes = themeData[theme.type]
    let defaultIndex = themeData.default[theme.type]

    if (theme.name != 'Custom' && theme.type && theme.index === undefined) {
        theme.index = defaultIndex
    }

    localStorage.theme = JSON.stringify(theme)

    if (theme.index !== undefined) {
        if (themes[theme.index]) {
            let themeInfo = {...themes[0], ...themes[defaultIndex], ...themes[theme.index]}
            localStorage.themeInfo = JSON.stringify(themeInfo)
            theme = themes[theme.index]
        }
        if (!theme) {
            theme = themes[defaultIndex]
            localStorage.removeItem('theme')
            localStorage.removeItem('themeInfo')
        }
    } else {
        localStorage.theme = JSON.stringify(theme)
        let themeInfo = {...themes[0], ...themes[defaultIndex], ...theme}
        localStorage.themeInfo = JSON.stringify(themeInfo)
    }

    theme = {...themes[0], ...themes[defaultIndex], ...theme}

    // Updating pre-defined CSS variables with new theme color values which
    // automatically updates the colors of all elements using those variables.
    root.style.setProperty('--primary-color', theme.primary)
    root.style.setProperty('--secondary-color', theme.bg)
    root.style.setProperty('--correct-color', theme.c1)
    root.style.setProperty('--incorrect-color', theme.c2)
    root.style.setProperty('--incomplete-color', theme.c3)
}

function setCustomTheme(themeData) {
    let type = prompt('Enter the type of theme (light/dark): ')
    if (type == null) return
    type = type.toLowerCase()
    while (type != 'light' && type != 'dark')
        type = prompt('Error: Type must be light or dark!\nReenter the type of theme (light/dark): ').toLowerCase()

    let primary = prompt('Enter the primary color (leave blank for default): ')
    if (primary == null) return
    primary = primary.toLowerCase()

    let bg = prompt('Enter the background color (leave blank for default): ').toLowerCase()
    if (bg == null) return
    bg = bg.toLowerCase()

    let theme = {name: 'Custom', type: type}
    if (primary)
        theme.primary = primary
    if (bg)
        theme.bg = bg

    setTheme(theme, themeData)
}

function themeDataToButtons(themeData) {
    ['light', 'dark'].forEach((type) => {
        themeData[type].forEach((theme, index) => {
            let button = document.createElement('button')
            button.innerText = theme.name
            button.onclick = (event) => setTheme({index: index, type: type}, themeData)
            document.querySelector(`#${type.toLowerCase()}Themes p`).appendChild(button)
        })
    })
    // for (let index in themeData["dark"])
    //     document.querySelector('#darkThemes p').innerHTML += `<button onclick="setTheme({index:'${index}', type:'dark'})">${themeData["dark"][index]['name']}</button>`
}

export { setTheme, setCustomTheme, themeDataToButtons }