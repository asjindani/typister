import { getWordList } from "../data.js"
import { saveFile } from "./basic.js"
import { setOpen } from "./dialogs.js"

// WORDS

function setCustomWords() {
    let text = prompt('Enter a list of words separated by space: ')

    text = text.trim() // removes leading and trailing spaces
    text = text.replace(/[^0-9a-z ]/gi, '') // removes all non-alphanumeric characters (except space)
    text = text.replace(/  +/g, ' ') // combines multiple spaces into single space
    
    if (!text) return
    let array = text.split(' ')

    localStorage.words = JSON.stringify(array)
    return array
}

async function viewWords(category) {
    let wordList = await getWordList(category)
    setOpen('#emptyDialog')
    document.querySelector('#emptyDialog .content').innerHTML = `<h1>${category.toUpperCase()} WORDS</h1>` + wordList.join(' ')
    // open(`/words${category}.json`, '_blank', 'location=yes, width=500, height=500, status=yes')
}

function textToWordList(text) {
    text = text.trim() // removes leading and trailing spaces
    text = text.replace(/[^0-9a-z ]/gi, '') // removes all non-alphanumeric characters (except space)
    text = text.replace(/  +/g, ' ') // combines multiple spaces into single space
    return text.split(' ')
}

function exportWords(array) {
    let text = array.join(' ')
    let timestamp = Date.now()
    let filename = `TypisterWords${timestamp}.txt`
    saveFile(filename, text)
}

function getWordsFromCategory(category, callback) {
    let wordsCategory = category

	if (category=='custom') {
		let wordList = JSON.parse(localStorage.words || '[]')
		if (callback)
			callback(wordList, category)
	}
	else {
		// In case the category is invalid
		// if (wordCategories.indexOf(category) == -1) {
		// 	localStorage.removeItem('wordsCategory')
		// 	wordsCategory = '100'
		// }

		fetch(`/json/words${wordsCategory}.json`).then((response) => response.json()).then((json) => {
			let wordList = json
			if (callback)
				callback(wordList, category)
		})
	}
}

function createDefaultWordCategoies(wordCategories) {
    for (let category of wordCategories) {
        let element = document.createElement('p')

        let button1 = document.createElement('button')
        button1.classList.add('defaultWordsButton')
        button1.innerText = `${category} Words`
        button1.category = category

        let button2 = document.createElement('button')
        button2.onclick = (event) => viewWords(category)
        button2.innerText = 'View'

        element.appendChild(button1)
        element.append(' ')
        element.appendChild(button2)
        document.getElementById('defaultWords').appendChild(element)
        // document.getElementById('defaultWords').innerHTML += `<p><button onclick="resetWords('${category}')">${category} Words</button> <button onclick="viewWords('${category}')">View</button></p>`
    }
}

export { getWordsFromCategory, viewWords, setCustomWords, exportWords, textToWordList, createDefaultWordCategoies }