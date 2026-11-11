'use strict'

var board_numbers
var board_statuses

function onInit() {
    console.log('onInit()')
    initBoard()
    renderBoard()

    console.log('board_numbers:', board_numbers)
    console.log('board_statuses:', board_statuses)
}

function initBoard() {
    let boardSide = 6
    let totalCards = boardSide * boardSide // 36
    let biggestValue = totalCards / 2   // 18

    let numbers = []
    for (var i = 1; i <= biggestValue; i++) {

        // push each number twice to the list of numbers
        // later we will pick randomly an element from this list
        numbers.push(i)
        numbers.push(i)
    }

    board_numbers = []
    board_statuses = []
    for (var i = 0; i < boardSide; i++) {
        board_numbers[i] = []
        board_statuses[i] = []
        for (var j = 0; j < boardSide; j++) {
            // select a random number from the list of numbers
            // and put it in the board
            var randomIndex = getRandomIntInclusive(0, numbers.length - 1)
            var returnValue = numbers.splice(randomIndex, 1)
            var pickedNumber = returnValue[0]

            board_numbers[i][j] = pickedNumber
            board_statuses[i][j] = 'covered'
        }
    }

    // return board
}

function renderBoard() {

    var htmlContent = ''
    var container = document.querySelector('.container')

    for (var i = 0; i < board_numbers.length; i++) {
        for (var j = 0; j < board_numbers.length; j++) {

            var status = board_statuses[i][j]
            var value = board_numbers[i][j]

            var part = `<div class="card ${status}" onclick="onClickCard(this)" data-i="${i}" data-j="${j}" data-value="${value}">${value}</div>`
            htmlContent += part
        }
    }

    container.innerHTML = htmlContent
}

function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
    // The maximum is inclusive and the minimum is inclusive
}

function showModal(message) {
    var modal = document.querySelector('.modal')
    modal.innerText = message
    modal.classList.remove('hide')
    setTimeout(() => { modal.classList.add('hide') }, 1000)
}

var firstCard = null

function onClickCard(element) {

    var i = element.dataset.i
    var j = element.dataset.j
    var status = board_statuses[i][j]

    if (status !== 'covered') {
        if (status === 'found' || status === 'error') {
            showModal('Select a covered card')
            return
        }

        if (status === 'selected') {
            showModal('Unpick an already selected card')
            firstCard = null
            board_statuses[i][j] = 'covered'
            renderBoard()
            return
        }
    }

    if (!firstCard) {
        showModal('Picked the first card')
        firstCard = element
        board_statuses[i][j] = 'selected'
        renderBoard()
        return
    }

    // picking the second card
    showModal('Picked the second card')
    board_statuses[i][j] = 'selected'
    renderBoard()

    var firstCardI = firstCard.dataset.i
    var firstCardJ = firstCard.dataset.j
    var firstCardValue = firstCard.dataset.value

    var secondCardI = element.dataset.i
    var secondCardJ = element.dataset.j
    var secondCardValue = element.dataset.value

    if (secondCardValue === firstCardValue) {

        setTimeout(() => {
            showModal('Good catch!')
            board_statuses[firstCardI][firstCardJ] = 'found'
            board_statuses[secondCardI][secondCardJ] = 'found'
            firstCard = null
            renderBoard()
            checkForWin()
        }, 1000)

        return

    } else {
        setTimeout(() => {
            showModal('Wrong, no match!')
            board_statuses[firstCardI][firstCardJ] = 'error'
            board_statuses[secondCardI][secondCardJ] = 'error'
            firstCard = null
            renderBoard()

            setTimeout(() => {
                showModal('Clearing selection')
                board_statuses[firstCardI][firstCardJ] = 'covered'
                board_statuses[secondCardI][secondCardJ] = 'covered'
                firstCard = null
                renderBoard()

            }, 1000)
        }, 1000)
    }
}

function checkForWin() {
    var cards = document.querySelectorAll('.card')
    var discovered = document.querySelectorAll('.found')
    if (cards.length === discovered.length) {
        showModal('You Won The Game!')
    }
}

function restartGame() {
    var cards = document.querySelectorAll('.card')
    for (var i = 0; i < cards.length; i++) {
        var card = cards[i]
        card.classList.remove('selected')
        card.classList.remove('found')
        card.classList.remove('error')
        card.classList.add('covered')
    }
    onInit()
}

function quickPeek() {
    // var cards = document.querySelectorAll('.card')
    var coveredCards = document.querySelectorAll('.covered')
    for (var i = 0; i < coveredCards.length; i++) {
        var card = coveredCards[i]
        card.classList.remove('covered')
    }

    setTimeout(() => {
        for (var i = 0; i < coveredCards.length; i++) {
            var card = coveredCards[i]
            card.classList.add('covered')
        }

    }, 1000)
}