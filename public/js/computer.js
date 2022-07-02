//variables
const background = new Audio("./sounds/background.mp3")
background.loop = true
background.volume = 0.5
const special = [1,4,7,8,20]
var music = true
var speech = true
var market = []
var playedCards = []
var current;
var playerCards = []
var computerCards = []
var sharedCards = 5
var pick2 = false
var generalmarket = false
var calledcard = false
var gamesplayed;
var gameswon
var winPercentage
var cards = [
    {'shape' : "card", 'number' : 20},{'shape' : "card", 'number' : 20},{'shape' : "card", 'number' : 20},{'shape' : "card", 'number' : 20},
    {'shape' : "circle", 'number' : 1}, {'shape' : "circle", 'number' : 2},{'shape' : "circle", 'number' : 3},
    {'shape' : "circle", 'number' : 4},{'shape' : "circle", 'number' : 5},{'shape' : "circle", 'number' : 7},
    {'shape' : "circle", 'number' : 8},{'shape' : "circle", 'number' : 10},{'shape' : "circle", 'number' : 11},
    {'shape' : "circle", 'number' : 12}, {'shape' : "circle", 'number' : 13},{'shape' : "circle", 'number' : 14},
    {'shape' : "triangle", 'number' : 1},{'shape' : "triangle", 'number' : 2},{'shape' : "triangle", 'number' : 3},
    {'shape' : "triangle", 'number' : 4}, {'shape' : "triangle", 'number' : 5},{'shape' : "triangle", 'number' : 7},
    {'shape' : "triangle", 'number' : 8},{'shape' : "triangle", 'number' : 10}, {'shape' : "triangle", 'number' : 11},
    {'shape' : "triangle", 'number' : 12},{'shape' : "triangle", 'number' : 13},{'shape' : "triangle", 'number' : 14},
    {'shape' : "star", 'number' : 1}, {'shape' : "star", 'number' : 2},{'shape' : "star", 'number' : 3},
    {'shape' : "star", 'number' : 4},{'shape' : "star", 'number' : 5}, {'shape' : "star", 'number' : 7},
    {'shape' : "star", 'number' : 8},{'shape' : "cross", 'number' : 1},{'shape' : "cross", 'number' : 2},
    {'shape' : "cross", 'number' : 3},{'shape' : "cross", 'number' : 5},
    {'shape' : "cross", 'number' : 7}, {'shape' : "cross", 'number' : 10},{'shape' : "cross", 'number' : 11},
    {'shape' : "cross", 'number' : 13},{'shape' : "cross", 'number' : 14}, {'shape' : "square", 'number' : 1},
    {'shape' : "square", 'number' : 2},{'shape' : "square", 'number' : 3},
    {'shape' : "square", 'number' : 5},{'shape' : "square", 'number' : 7},{'shape' : "square", 'number' : 10},
    {'shape' : "square", 'number' : 11},{'shape' : "square", 'number' : 13},{'shape' : "square", 'number' : 14},

]


//methods
shuffle = (array) => {
    var currentIndex = array.length,  randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
}

shareCards = () => {
    const deck = shuffle(cards)
    const size = sharedCards * 2
    for (let i = 1; i <= size; i++) {
        if (i % 2 == 0) {
            playerCards.push(deck[i])
        }  
        else{
            computerCards.push(deck[i])
        }  
            
    } 
    
    market = deck.slice(size + 1)
    
    const possibleFirst = market.filter(card => { return !special.includes(card['number']) })
    playedCards.push(possibleFirst[0])
    const index = market.indexOf(possibleFirst[0])
    market.splice(index, 1)

    let arr = ["c", "p"]
    current = arr[Math.floor(Math.random() * arr.length)]
    const msg = (current == "p") ? "It is your turn to play" : "It is my turn to play"
    broadCast("Whose Turn?", msg)
    displayGame()
}

displayGame = () => {
    //display count
    document.getElementById("computer-count").innerHTML = computerCards.length
    document.getElementById("player-count").innerHTML = playerCards.length
    document.getElementById("market-count").innerHTML = market.length

    //draw images
    let cnt = 0
    if (computerCards.length > 4 && window.innerWidth >= 600 ) {
        cnt = 4
    }
    else if (computerCards.length > 3 && window.innerWidth <= 600 ) {
        cnt = 3
    }
    else{
        cnt = computerCards.length
    }

    //played cards
    const currentplay = playedCards[playedCards.length - 1]
    const src = "./cards/" + currentplay['shape'] + "-" + currentplay['number'] + ".jpg"
    document.getElementById("played-cards").innerHTML = '<img src="' + src + '" class="game-card"/>'

    document.getElementById("computer").innerHTML = ''
    $('.player-area').slick('unslick')
    document.getElementById("player").innerHTML = ''
    //computer
    for (let v = 0; v < cnt; v++) {
        const div = document.createElement("div")
        const img = document.createElement("img")
        div.className = "padded"
        img.src = "./cards/cover.jpg" 
        img.className = "game-card"
        div.appendChild(img)    
        document.getElementById("computer").appendChild(div)
    }

    $(".player-area").slick({
        // normal options...
        infinite: false,
        dots : false,

        // the magic
        responsive: [
            {breakpoint: 3000,settings: {slidesToShow: 5}},
            {breakpoint: 1024,settings: {slidesToShow: 4}}, 
            {breakpoint: 600,settings: {slidesToShow: 3}}, 
            {breakpoint: 300, settings: "unslick" /* destroys slick*/}
        ]
    });

    //player
    playerCards.map((item, i) => {
        const src = "./cards/" + item['shape'] + "-" + item['number'] + ".jpg"
        const div = document.createElement("div")
        const img = document.createElement("img")
        div.className = "padded"
        div.id = JSON.stringify(item)
        div.addEventListener("click", playHand)
        img.src = src
        img.id = JSON.stringify(item)
        img.style.cursor = "pointer"
        img.className = "game-card"
        div.appendChild(img)    
        $('.player-area').slick('slickAdd', div)
    })

    //check market
    if (market.length == 0) {
        market = playedCards.slice(0, playedCards.length - 1)
        displayGame()
    }
   
    checkTurn()
}

checkTurn = () => {
    if (current == "c") {
        computerPlay()
    }
}

broadCast = (caption, message) => {
    toastr.options.progressBar = true;
    toastr.info(message, caption)

    //speech
    if (speech == true) {
        var synth = window.speechSynthesis;
    	var utterThis = new SpeechSynthesisUtterance(message);
        synth.speak(utterThis);
    }
}

gotoMarket = (role) => {
    if (role == "player") {
        if (current !== "p") {
            broadCast("Oops!", "It is not your turn to play")
        }
        else{
            //market
            let n = 0
            
            if (playedCards[playedCards.length - 1]['number'] == 7 && pick2 !== false) {
                n = pick2
            }
            else{
                n = 1
            }
            
            for (let k = 0; k < n; k++) {
                const newcard = market[0]
                playerCards.push(newcard)
                market.splice(0, 1)   
                     
            }
            pick2 = false
            generalmarket = false
            current = "c"
            displayGame()
        }
    } 
    else {
        if (current !== "p") {
           //market
           let n = 0
            
            if (playedCards[playedCards.length - 1]['number'] == 7 && pick2 !== false) {
                n = pick2
            }
            else{
               n = 1
            }
           
           for (let k = 0; k < n; k++) {
               const newcard = market[0]
               computerCards.push(newcard)
               market.splice(0, 1)   
                    
           }
            pick2 = false
            generalmarket = false
            current = "p"
            displayGame() 
        }
    }
}

selectShape = (shape) => {
    calledcard = shape
    document.getElementById("card-selection").style.display = 'none'
    current = "c"
    displayGame()
}

checkCard = (number, role) =>  {
    if (number == 1 || number == 8) {
        current = role
    }
    else if (number == 7) {
        pick2 = (pick2 == false) ? 2 : pick2 + 2
        if (role == "c") {
            broadCast("Oops!", "Pick " + pick2);
        }
        current = (role == "c") ? "p" : "c"
     }
    else if (number == 4) {
        generalmarket = true
        if (role == "c") {
            broadCast("Oops!", "General market");
        }
        current = (role == "c") ? "p" : "c"
    }
    else if (number == 20) {
        if (role == "p") {
            document.getElementById("card-selection").style.display = 'flex'
        }
        else{
            const cardshapes = ["circle", "cross", "square", "star", "triangle"]
            calledcard = cardshapes[Math.floor(Math.random() * cardshapes.length)]
            const calls = ["I need ", "Give me ", "Play "]
            const ind = calls[Math.floor(Math.random() * calls.length)]
            current = "p"
            broadCast("Select Card", ind + calledcard)
            displayGame()
        }
    }
    else{
        current = (role == "c") ? "p" : "c"
    }

    //announce warning and last card
    if (computerCards.length == 2) {
        broadCast("Hehe", "Warning card")
    } 
    else if (computerCards.length == 1) {
        broadCast("Hehe", "Last card")
    }

    //check for win
    if (role == "p") {
        checkWin('player', number) 
    } else {
        checkWin('computer', number) 
    }   
    
}

checkWin = (player, number) => {
    if (player == "player") {
        if(playerCards.length == 0 ){
            if (!special.includes(number)) {
                endGame('win')
            }
            else{
                playerCards.push(market[0])
                market.splice(0,1)
            }
            
        }
        
    }
    else{
        if (computerCards.length == 0 && !special.includes(number)) {
            if (!special.includes(number)) {
                endGame('lose')
            }
            else{
                computerCards.push(market[0])
                market.splice(0,1)
                
            }
        }
        
    }
    if (number !== 20) {
        displayGame()
    }
}

playHand = (e) => {
    if (current !== "p") {
        broadCast("Oops!", "It is not your turn to play")
    }
    else{
        //play game
        const hand = JSON.parse(e.target.id)
        const shape = hand['shape']
        const number = parseInt(hand['number'])
         
        if (!special.includes(playedCards[playedCards.length - 1]['number'])) {
            if (number == 20 || playedCards[playedCards.length - 1]['number'] == number || playedCards[playedCards.length - 1]['shape'] == shape) {
                playedCards.push(hand)
                const temp = []
                playerCards.map((item,i) => {
                    if (item["shape"] == shape && parseInt(item["number"]) == number) {
                        temp.push(i)
                    }
                })
                playerCards.splice(temp[0],1)                
                checkCard(number, "p")
            }
            else{
                broadCast("Oops!", "The card must have the same shape or the same number")
            }
        }
        else{
            if (playedCards[playedCards.length - 1]['number'] == 4 && generalmarket == true) {
                broadCast("Oops!", "You must go to market!")
            }
            else if (playedCards[playedCards.length - 1]['number'] == 7 && pick2 !== false) {
                if (number == 7) {
                    playedCards.push(hand)
                    const temp = []
                    playerCards.map((item,i) => {
                        if (item["shape"] == shape && parseInt(item["number"]) == number) {
                            temp.push(i)
                        }
                    })
                    playerCards.splice(temp[0],1)                
                    checkCard(number, "p")
                }
                else{
                    broadCast("Oops!", "You must pick " + pick2);
                }
            }
            else if (playedCards[playedCards.length - 1]['number'] == 20 && calledcard !== false) {
                
                if (shape == calledcard) {
                    playedCards.push(hand)
                    const temp = []
                    playerCards.map((item,i) => {
                        if (item["shape"] == shape && parseInt(item["number"]) == number) {
                            temp.push(i)
                        }
                    })
                    playerCards.splice(temp[0],1)  
                    calledcard = false
                    checkCard(number, "p")
                } 
                else if(number == 20){
                    playedCards.push(hand)
                    const temp = []
                    playerCards.map((item,i) => {
                        if (item["shape"] == shape && parseInt(item["number"]) == number) {
                            temp.push(i)
                        }
                    })
                    playerCards.splice(temp[0],1) 
                    calledcard = false               
                    checkCard(number, "p")
                }
                else {
                    broadCast("Oops!", "You must play " + calledcard)
                }
            }
            else{
                if (number == 20 || playedCards[playedCards.length - 1]['number'] == number || playedCards[playedCards.length - 1]['shape'] == shape) {
                    playedCards.push(hand)
                    const temp = []
                    playerCards.map((item,i) => {
                        if (item["shape"] == shape && parseInt(item["number"]) == number) {
                            temp.push(i)
                        }
                    })
                    playerCards.splice(temp[0],1)                
                    checkCard(number, "p")
                }
                else{
                    broadCast("Oops!", "The card must have the same shape or the same number")
                }
            }
            
           
        }
    }
    
}

computerPlay = () => {
    setTimeout(() => {
        if (current !== "p") {
            const hand = shuffle(computerCards.filter(card => {
                return card["shape"] == playedCards[playedCards.length - 1]['shape'] || card["number"] == playedCards[playedCards.length - 1]['number']
            }))

            if (hand.length == 0) {
                gotoMarket('computer')
            }
            else{
                
                if (!special.includes(playedCards[playedCards.length - 1]['number']) || hand[0]["number"] == 20) {
                    playedCards.push(hand[0])
                    computerCards.splice(computerCards.indexOf(hand[0]), 1)
                    checkCard(hand[0]["number"], "c")
                }
                else{
                    //special numbers
                    if (playedCards[playedCards.length - 1]['number'] == 4 && generalmarket == true) {
                        gotoMarket('computer')
                    }
                    else if (playedCards[playedCards.length - 1]['number'] == 7 && pick2 !== false) {
                        const sevens = computerCards.filter(card => {return card["number"] == 7})
                        if (sevens.length == 0) {
                            gotoMarket('computer')
                        }
                        else{
                            playedCards.push(sevens[0])
                            computerCards.splice(computerCards.indexOf(sevens[0]), 1)
                            checkCard(sevens[0]["number"], "c")
                        }
                    }
                    else if (playedCards[playedCards.length - 1]['number'] == 20 && calledcard !== false) {
                        const twenties = computerCards.filter(card => {return card["shape"] == calledcard})
                        if (twenties.length == 0) {
                            gotoMarket('computer')
                        }
                        else{
                            playedCards.push(twenties[0])
                            computerCards.splice(computerCards.indexOf(twenties[0]), 1)
                            calledcard = false
                            checkCard(twenties[0]["number"], "c")
                        }
                    }
                    else{
                        //gotoMarket('computer')
                        playedCards.push(hand[0])
                        computerCards.splice(computerCards.indexOf(hand[0]), 1)
                        checkCard(hand[0]["number"], "c")
                    }
                    
                }
            }
        }
    }, 2000);
}

startGame = () => {
    background.play()
    document.getElementById("settings").style.display = 'none'
    document.getElementById("main").style.display = 'block'
    localStorage.setItem("whot_games_played", (parseInt(gamesplayed) + 1).toString() )
    shareCards()
}

setSharedCards = (no) =>{
    sharedCards = (no !== "") ?  no : 5
}

getStatistics = () => {
    gamesplayed = (localStorage.getItem("whot_games_played") == null || isNaN(localStorage.getItem("whot_games_played"))) ? 0 :localStorage.getItem("whot_games_played")
    gameswon = (localStorage.getItem("whot_games_won") == null || isNaN(localStorage.getItem("whot_games_won"))) ? 0 :localStorage.getItem("whot_games_won")
    const cent = (gamesplayed == 0) ? "0" : ((gameswon / gamesplayed) * 100).toString()
    if (cent.includes(".")) {
        winPercentage = cent.split(".")[0] + "." + cent.split(".")[1].substring(0,2) + "%"
    } 
    else {
        winPercentage = cent + "%"
    }
    document.getElementById("played").innerHTML = gamesplayed
    document.getElementById("won").innerHTML = gameswon
    document.getElementById("percent").innerHTML = winPercentage
   
}

toggleOptionsMenu = () => {
    const dropdown = document.getElementById("dropdown")
    dropdown.style.position = "absolute"
    dropdown.style.display = (dropdown.style.display == "none") ? "block" : "none"
}

setOption = (option) => {
    switch (option) {
        case "music":
            music = !music
            break;
        case "speech":
            speech = !speech
            break;
    
    }

    //stop music if false
    if (music == false) {
        background.pause()
    }
    else{
        background.play()
    }
}

endGame = (type) => {
    switch (type) {
        case "end":
            document.getElementById("game-ended").innerHTML = "GAME ENDED"
            break;
        case "lose":
            document.getElementById("game-ended").innerHTML = "YOU LOSE"
            break;
        case "win":
            localStorage.setItem("whot_games_won", (parseInt(gameswon) + 1).toString() )
            document.getElementById("game-ended").innerHTML = "YOU WIN"
            break;
    
    }
    document.getElementById("main").style.display = 'none'
    document.getElementById("gameover").style.display = "flex"
    
}


//event listeners

window.addEventListener("load", () => {
    setTimeout(() => {
        document.getElementById("loader").style.display = 'none'
        document.getElementById("settings").style.display = 'flex'
        getStatistics()
    }, 4000);
})
