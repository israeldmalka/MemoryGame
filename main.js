'use strict'

var gBoard

function onInit() {
    console.log('onInit()')
    gBoard = createBoard()
    renderBoard()

    console.log('board:', gBoard)
}

function createBoard() {
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

    let board = []
    for (var i = 0; i < boardSide; i++) {
        board[i] = []
        for (var j = 0; j < boardSide; j++) {
            // select a random number from the list of numbers
            // and put it in the board
            var randomIndex = getRandomIntInclusive(0, numbers.length - 1)
            var returnValue = numbers.splice(randomIndex, 1)
            var pickedNumber = returnValue[0]
            board[i][j] = pickedNumber
        }
    }

    return board
}

function renderBoard() {

    var html = ''
    var container = document.querySelector('.container')

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var part = `<div class="card card-${i}-${j} covered" onclick="onClickCard(this)">${gBoard[i][j]}</div>`
            html = html + part
        }
    }

    container.innerHTML = html
}

function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
    // The maximum is inclusive and the minimum is inclusive
}

var firstCard = null

function showModal(message) {
    var modal = document.querySelector('.modal')
    modal.innerText = message
    modal.classList.remove('hide')
    setTimeout(() => { modal.classList.add('hide') }, 1000)
}

function onClickCard(element) {

    // clicking an already discovered card
    if (element.classList.contains('found') ||
        element.classList.contains('error')) {
        showModal('That card was already discovered')
        return
    }

    if (!firstCard) {
        // picking the first card
        firstCard = element
        element.classList.remove('covered')
        element.classList.add('selected')
        showModal('Picked the first card')
        return
    }

    // clicked the same card again
    if (firstCard === element) {
        element.classList.remove('selected')
        element.classList.add('covered')
        firstCard = null
        showModal('Unpicked the first card')
        return
    }

    // picking the second card
    showModal('Picked the second card')
    element.classList.remove('covered')
    element.classList.add('selected')

    if (element.innerText === firstCard.innerText) {
        // correct

        setTimeout(() => {
            showModal('Good catch!')

            firstCard.classList.remove('selected')
            element.classList.remove('selected')

            firstCard.classList.add('found')
            element.classList.add('found')

            firstCard = null

            checkForWin()

        }, 1000)

        return

    } else {
        // wrong choice

        setTimeout(() => {

            showModal('Wrong, no match!')

            firstCard.classList.remove('selected')
            element.classList.remove('selected')

            firstCard.classList.add('error')
            element.classList.add('error')

            setTimeout(() => {
                showModal('Clearing selection')

                firstCard.classList.remove('error')
                element.classList.remove('error')

                firstCard.classList.add('covered')
                element.classList.add('covered')

                firstCard = null
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