/*************************************************
 Title              : Alien Game
 Name               : Denis Lim [BCIT TWD-26]
 Instructor         : Jason Harrison
 Development Tools  : HTML, CSS, Javascript, Ajax 
 *************************************************/

//Define global variables and initialization
alien = null
moveTimer = null
jumpTimer = null
moveBackTimer = null
rockTimer1 = null
rockTimer2 = null
rockTimer3 = null
rockTimer4 = null
rock1 = null
rock2 = null
rock3 = null
rock4 = null
plusPoint = null
kickImg = null
myTimer = null
isEnter = false
isBlockRight = false
isBlockLeft = false
isGameOver = false
isCheckSmallBox = false
isCheckMediumBox = false
isStarted = false
isVisibleRock = false
returnValue = 0
stepBackNumber = 0
stepNumber = 0
points = 0
timeSeconds = 0
direction = "right"

//get HTMLElement for alien object
alien = document.getElementById("thealien")
//get HTMLElement for small rock object
smallRock = document.getElementById("earth-rock-small")
//get HTMLElement for medium rock object
mediumRock = document.getElementById("earth-rock-medium")
//get HTMLElement for large rock object
largeRock = document.getElementById("earth-rock-large")

//alien height
alienHeight = alien.height
//small size box width and height
smallRockHeight = smallRock.height
smallRockWidth = smallRock.width
//medium size box width and height
mediumRockHeight = mediumRock.height
mediumRockWidth = mediumRock.width
//large size box width and height
largeRockHeight = largeRock.height
largeRockWidth = largeRock.width

/********Define keyboard function************
 * Enter Key(13)    : start game
 * ArrowUP(38)      : Jump
 * ArrowRight(39)   : Move right
 * ArrowLeft(37)    : Move left
 ********************************************/
document.addEventListener("keydown", function (e) {
    if (isStarted) {
        if (!isGameOver) {
            //jump
            if (e.which == '38') {//ArrowUp(Jump)
                if (isEnter) {
                    makeTheAlienJump()
                }
            } else if (e.which == '39') {//ArrowRight(Go right)
                if (isEnter) {
                    direction = "right"
                    isBlockLeft = false
                    clearInterval(moveBackTimer)
                    moveBackTimer = null
                    stepBackNumber = 0
                    if (moveTimer == null) {
                        if (!isBlockRight) {
                            moveTimer = setInterval(move, 35)
                        }
                    }
                }
            } else if (e.which == '37') {//ArrowLeft(Go left)
                if (isEnter) {
                    direction = "left"
                    isBlockRight = false
                    clearInterval(moveTimer)
                    moveTimer = null
                    stepNumber = 0
                    if (moveBackTimer == null) {
                        if (!isBlockLeft) {
                            moveBackTimer = setInterval(moveBack, 35)
                        }
                    }
                }
            } else if (e.which == '13') {//Enter(start game)
                if (!isEnter) {
                    if (moveTimer == null) {
                        isEnter = true;
                        myTimer = setInterval(updateTime, 1000)
                        setTimeout(gameOver, 60000)
                        makeRocksRain()
                        moveTimer = setInterval(move, 35)
                    }
                    else {
                        clearInterval(moveTimer)
                        moveTimer = null
                    }
                }
            }
        }
    }
})

//Detect if aliens touch rocks
function checkTouchBox(alienLeftPos, direction) {
    alienLeftPosPlusWidth = parseInt(alienLeftPos) + alien.width
    largeBoxLeft = parseInt(largeRock.style.left)
    mediumBoxLeft = parseInt(mediumRock.style.left)
    smallBoxLeft = parseInt(smallRock.style.left)
    smallBoxRight = smallBoxLeft + parseInt(smallRock.width)
    mediumBoxRight = mediumBoxLeft + parseInt(mediumRock.width)

    musicKick = document.getElementById('music-kick')
    if (jumpTimer == null) {
        if (direction == "right") {//move to right side
            if (!isCheckSmallBox) {
                if (smallBoxLeft == alienLeftPosPlusWidth) {//for small rock
                    showKickImage(smallRock.style.left)
                    smallRock.style.left = parseInt(smallRock.style.left) + 500 + "px"
                    musicKick.play()
                }
            }
            if (!isCheckMediumBox) {
                if (mediumBoxLeft == alienLeftPosPlusWidth) {//for medium rock
                    clearInterval(moveTimer)
                    moveTimer = null
                    stepNumber = 0
                    isBlockRight = true
                    showJumpMessage(mediumBoxLeft)

                }
            }

            if (largeBoxLeft < alienLeftPosPlusWidth) {//for large rock
                if (parseInt(alienHeight) < parseInt(largeRock.height)) {
                    clearInterval(moveTimer)
                    moveTimer = null
                    turnBack()
                }
            }
        } else {//move to left side
            if (!isCheckSmallBox) {
                if (parseInt(alienLeftPos) == smallBoxRight) {//for small rock
                    showKickImage(smallRock.style.left)
                    smallRock.style.left = parseInt(smallRock.style.left) - 300 + "px"
                    musicKick.play()
                }
            }
            if (!isCheckMediumBox) {
                if (parseInt(alienLeftPos) == mediumBoxRight) {//for medium rock
                    clearInterval(moveBackTimer)
                    moveBackTimer = null
                    stepBackNumber = 0
                    isBlockLeft = true
                    showJumpMessage(mediumBoxRight)
                }
            }
            if (parseInt(alien.style.left) <= 0) {//Check if the alien touches the 0px left.
                clearInterval(moveBackTimer)
                moveBackTimer = null
                direction = "right"
                moveTimer = setInterval(move, 35)
            }
        }
    }
}

//When an alien hits a medium-sized rock, it shows the image to jump.
function showJumpMessage(leftRightposition) {
    jumpmessageImage = document.createElement('img')
    jumpmessageImage.id = 'jump-image'
    jumpmessageImage.src = "images/images/jump.png"
    jumpmessageImage.style.left = leftRightposition - 30 + "px"
    jumpmessageImage.style.bottom = "60px"
    jumpmessageImage.style.position = "absolute"
    document.body.appendChild(jumpmessageImage)
    setTimeout(removeJumpmessageImage, 500)
}

//After 0.5 seconds, the jump image is deleted from the screen.
function removeJumpmessageImage() {
    jumpmessageImage.style.visibility = "hidden"
}

//show kick image when alien hits the small box
function showKickImage(thisLeftPosition) {
    kickImg = document.createElement('img')
    kickImg.id = 'kick-image'
    kickImg.src = "images/images/kick.png"
    kickImg.style.left = thisLeftPosition
    kickImg.style.bottom = "20px"
    kickImg.style.position = "absolute"
    document.body.appendChild(kickImg)
    setTimeout(removeKickImage, 200)
}

//After 0.5 seconds, the kick image is deleted from the screen.
function removeKickImage() {
    kickImg.style.visibility = "hidden"
}

//move left side function - [process:1]
function turnBack() {
    direction = "left"
    moveBackTimer = setInterval(moveBack, 35)
}

//move left side function - [process:2]
function moveBack() {
    alien.style.left = parseInt(alien.style.left) - 1 + "px"
    checkTouchBox(alien.style.left, direction = 'left')
    if (jumpTimer == null) {
        stepBack()
    }
}

//move left side function - [process:3]
function stepBack() {
    stepBackNumber = stepBackNumber + 1
    if (stepBackNumber >= 30) {
        stepBackNumber = 0
    }
    alien.src = "images/alien/alienlwalk" + stepBackNumber + ".gif"
}

//move right side function - [process:1]
function move() {
    alien.style.left = parseInt(alien.style.left) + 1 + "px"
    checkTouchBox(alien.style.left, direction = 'right')
    if (jumpTimer == null) {
        step()
    }
}

//move right side function - [process:2]
function step() {
    stepNumber = stepNumber + 1
    if (stepNumber >= 30) {
        stepNumber = 0
    }
    alien.src = "images/alien/alienrwalk" + stepNumber + ".gif"
}

//function that makes rocks fall from the sky
function makeRocksRain() {
    rock1 = document.createElement("img")
    rock1.id = "r1"
    rock1.style.top = "0px"
    rock1.style.position = "absolute"
    rock1.style.left = "100px"
    rock1.width = getRandomRockWidth()
    rock1.src = "images/images/fireball.png"
    document.body.appendChild(rock1)

    rock2 = document.createElement("img")
    rock2.id = "r2"
    rock2.style.top = "0px"
    rock2.style.position = "absolute"
    rock2.style.left = "700px"
    rock2.width = getRandomRockWidth()
    rock2.src = "images/images/fireball.png"
    document.body.appendChild(rock2)

    rock3 = document.createElement("img")
    rock3.id = "r3"
    rock3.style.top = "0px"
    rock3.style.position = "absolute"
    rock3.style.left = "500px"
    rock3.width = getRandomRockWidth()
    rock3.src = "images/images/fireball.png"
    document.body.appendChild(rock3)

    rock4 = document.createElement("img")
    rock4.id = "r4"
    rock4.style.top = "0px"
    rock4.style.position = "absolute"
    rock4.style.left = "1000px"
    rock4.width = getRandomRockWidth()
    rock4.src = "images/images/fireball.png"
    document.body.appendChild(rock4)

    intervalMs = getRandomTime()
    if (intervalMs < 20) {
        intervalMs = intervalMs * 2
    }

    //Make 4 rocks fall one after another with intervalMs
    rockTimer1 = setInterval("fall('r1')", intervalMs)
    rockTimer2 = setInterval("fall('r2')", intervalMs)
    rockTimer3 = setInterval("fall('r3')", intervalMs)
    rockTimer4 = setInterval("fall('r4')", intervalMs)
}

//random to get rock width
function getRandomRockWidth() {
    min = 20
    max = 70
    return Math.floor(Math.random() * Math.floor(max) + min);
}

//random to get rock falling time
function getRandomTime() {
    min = 10
    max = 50
    return Math.floor(Math.random() * Math.floor(max) + min);
}

//random to get rock left position
function getRandomNewLeftPosition() {
    min = 0
    max = window.innerWidth - (parseInt(rock1.style.left) + rock1.width)
    newLeftPosition = Math.floor(Math.random() * Math.floor(max))
    return newLeftPosition;
}

//check two conditions:
//one: the failing rock hits to the alien
//two: the falling rock meets on the ground
function fall(idOfTheRock) {

    let theRock = document.getElementById(idOfTheRock)
    let alienLeftPos = parseInt(alien.style.left)
    let sumAlienWidth = alienLeftPos + parseInt(alien.width) - 40 //alien images have space with 40px
    let theRockLeft = theRock.style.left
    let theRockWidth = theRock.width
    let sumRockWidth = theRockWidth + parseInt(theRockLeft)

    //change rock position from thr top position
    theRock.style.top = parseInt(theRock.style.top) + 1 + "px"

    //check first condition
    if (parseInt(theRock.style.top) + theRock.height == window.innerHeight - alienHeight) {
        if (parseInt(theRockLeft) <= alienLeftPos && alienLeftPos <= sumRockWidth) {
            //minus from the total point
            points--
            document.getElementById("point").innerHTML = points
            //create minus point image
            minusOneImg = document.createElement('img')
            minusOneImg.id = 'minus-one'
            minusOneImg.src = "images/images/minus-one.png"
            minusOneImg.style.left = parseInt(theRock.style.left) - 10 + "px"
            minusOneImg.style.top = parseInt(theRock.style.top) - 50 + "px"
            minusOneImg.style.position = "absolute"
            document.body.appendChild(minusOneImg)
            setTimeout(removeMinusOneImage, 100)
            //The sound of an alien screaming when a rock hits his head
            screamMusic()
            isVisibleRock = true
        } else if (parseInt(theRockLeft) <= sumAlienWidth && sumAlienWidth <= sumRockWidth) {
            //minus from the total point
            points--
            document.getElementById("point").innerHTML = points
            //create minus point image
            minusOneImg = document.createElement('img')
            minusOneImg.id = 'minus-one'
            minusOneImg.src = "images/images/minus-one.png"
            minusOneImg.style.left = parseInt(theRock.style.left) - 10 + "px"
            minusOneImg.style.top = parseInt(theRock.style.top) - 50 + "px"
            minusOneImg.style.position = "absolute"
            document.body.appendChild(minusOneImg)
            setTimeout(removeMinusOneImage, 100)
            //The sound of an alien screaming when a rock hits his head
            screamMusic()
            isVisibleRock = true
        } else {
            isVisibleRock = false
        }
        //remove minus image from the screen after 0.1 second
        function removeMinusOneImage() {
            minusOneImg.style.visibility = "hidden";
            document.body.removeChild(minusOneImg)
        }
    }

    //check second condition
    if (parseInt(theRock.style.top) + theRock.height >= window.innerHeight) {
        if (!isVisibleRock) {
            //When a falling rock touches the ground, it adds 1 point.
            points++
            document.getElementById("point").innerHTML = points
            //make a plus-one image object
            plusPoint = document.createElement("img")
            plusPoint.id = theRock.id + "_fall"
            plusPoint.style.top = parseInt(theRock.style.top) - 50 + "px"
            plusPoint.style.left = parseInt(theRock.style.left) - 10 + "px"
            plusPoint.style.position = "absolute"
            plusPoint.src = "images/images/plus-point.png"
            document.body.appendChild(plusPoint)
            //Play music to celebrate score acquisition
            playBombMusic()
            //After 0.02 seconds, the plus-one image is deleted from the screen.
            setTimeout(removePlusOne, 20)
            //Play music to celebrate score acquisition
            function playBombMusic() {
                musicBomb = document.getElementById('music-bomb')
                musicBomb.play()
            }
            //After 0.02 seconds, the plus-one image is deleted from the screen.
            function removePlusOne() {
                plusPoint.style.visibility = "hidden"
                document.body.removeChild(plusPoint)
            }
        }

        theRock.style.top = "0px"
        theRock.style.left = getRandomNewLeftPosition() + "px"
        theRock.width = getRandomRockWidth()
        theRock.style.visibility = "visible"
        //make rocks falling from the sky again
        if (idOfTheRock == 'r1') {
            clearInterval(rockTimer1)
            rockTimer1 = setInterval("fall('" + idOfTheRock + "')", intervalMs)
        }
        else if (idOfTheRock == "r2") {
            clearInterval(rockTimer2)
            rockTimer2 = setInterval("fall('" + idOfTheRock + "')", intervalMs)
        }
        else if (idOfTheRock == "r3") {
            clearInterval(rockTimer3)
            rockTimer3 = setInterval("fall('" + idOfTheRock + "')", intervalMs)
        }
        else if (idOfTheRock == "r4") {
            clearInterval(rockTimer4)
            rockTimer4 = setInterval("fall('" + idOfTheRock + "')", intervalMs)
        }
        //get rendom falling time for rocks
        intervalMs = getRandomTime()
    }
}

//Count the time in units of one second from the start of the game
function updateTime() {
    timeSeconds++
    document.getElementById("time").innerHTML = 60 - timeSeconds
}

//function called when the game ends after 60 seconds
function gameOver() {
    isGameOver = true
    //terminate all running timers
    clearInterval(rockTimer1)
    clearInterval(rockTimer2)
    clearInterval(rockTimer3)
    clearInterval(rockTimer4)
    clearInterval(moveTimer)
    clearInterval(jumpTimer)
    clearInterval(moveBackTimer)
    clearInterval(myTimer)
    myTimer = null
    //call play again popup
    openPopUp()
}

//reset all variables and elements
function resetGame() {
    isStarted = true
    isEnter = false
    isBlockRight = false
    isBlockLeft = false
    isGameOver = false
    isCheckSmallBox = false
    isCheckMediumBox = false
    isVisibleRock = false
    returnValue = 0
    stepBackNumber = 0
    stepNumber = 0
    points = 0
    timeSeconds = 0
    direction = "right"
    jumpTimer = null
    document.body.removeChild(rock1)
    document.body.removeChild(rock2)
    document.body.removeChild(rock3)
    document.body.removeChild(rock4)
    alien.src = "images/alien/alienrwalk0.gif"
    smallRock.style.left = "300px"
    mediumRock.style.left = "600px"
    smallRock.style.visibility = "visible"
    mediumRock.style.visibility = "visible"
    rock1.style.top = "0px"
    rock2.style.top = "0px"
    rock3.style.top = "0px"
    rock4.style.top = "0px"
    alien.style.left = "0px"
    alien.style.bottom = "10px"
    document.getElementById("time").innerHTML = "60"
    document.getElementById("point").innerHTML = "00"
    smallRock.src = "images/images/earth-rock-small.png"
    mediumRock.src = "images/images/earth-rock-medium.png"
}

//when you choose play again button in popup
function playAgain() {
    //call reset function when user clicks play-again button
    resetGame()
    //play music when a new game starts
    playAgainMusic()
    //get HTMLElement for alien object
    alien = document.getElementById("thealien")
    //get HTMLElement for small rock object
    smallRock = document.getElementById("earth-rock-small")
    //get HTMLElement for medium rock object
    mediumRock = document.getElementById("earth-rock-medium")
    //get HTMLElement for large rock object
    largeRock = document.getElementById("earth-rock-large")
    //Get each height and width
    alienHeight = alien.height
    smallRockHeight = smallRock.height
    smallRockWidth = smallRock.width
    mediumRockHeight = mediumRock.height
    mediumRockWidth = mediumRock.width
    largeRockHeight = largeRock.height
    largeRockWidth = largeRock.width
}

//when alien jump action : process_1
function makeTheAlienJump() {
    if (jumpTimer == null) {
        jumpTimer = setInterval(jumpUp, 10)
        setTimeout(stopJumpingUpStartFallingDown, 500)
    }
}

//when alien jump action : process_2
function jumpUp() {
    if (direction == "right") {
        alien.style.bottom = parseInt(alien.style.bottom) + 2 + "px"
        alien.style.left = parseInt(alien.style.left) + 1 + "px"
    } else {
        alien.style.bottom = parseInt(alien.style.bottom) + 2 + "px"
        alien.style.left = parseInt(alien.style.left) - 1 + "px"
    }
}

//when alien jump action : process_3
function stopJumpingUpStartFallingDown() {
    clearInterval(jumpTimer)
    jumpTimer = null
    jumpTimer = setInterval(fallDown, 10)
    setTimeout(finishJumping, 500)
}

//when alien jump action : process_4
function fallDown() {
    if (direction == "right") {
        alien.style.bottom = parseInt(alien.style.bottom) - 2 + "px"
        alien.style.left = parseInt(alien.style.left) + 1 + "px"
    } else {
        alien.style.bottom = parseInt(alien.style.bottom) - 2 + "px"
        alien.style.left = parseInt(alien.style.left) - 1 + "px"
    }
}

//when alien jump action : process_5
function finishJumping() {
    //check the alien hits on the rock when alien arrives on the ground
    checkOverBox()

    if (direction == "right") {
        if (isBlockRight) {
            stepNumber = 0
            clearInterval(moveTimer)
            moveTimer = setInterval(move, 35)
        }
    } else {
        if (isBlockLeft) {
            stepNumber = 0
            clearInterval(moveBackTimer)
            moveBackTimer = setInterval(moveBack, 35)
        }
    }
    clearInterval(jumpTimer)
    jumpTimer = null
}

//check if alien touch over the box 
function checkOverBox() {
    let alienLeftPos = parseInt(alien.style.left)
    let sumAlienWidth = alienLeftPos + parseInt(alien.width)
    let mediumBoxLeftPos = mediumRock.style.left
    let sumMediumBoxWidth = mediumRockWidth + parseInt(mediumBoxLeftPos)
    let smallBoxLeftPos = smallRock.style.left
    let sumSmallBoxWidth = smallRockWidth + parseInt(smallBoxLeftPos)

    if (!isCheckMediumBox) {
        if (parseInt(mediumBoxLeftPos) <= alienLeftPos && alienLeftPos <= sumMediumBoxWidth) {
            mediumRock.src = "images/images/boom.png"
            boomMusic()
            setTimeout(removeMediumBox, 500)
        } else if (parseInt(mediumBoxLeftPos) <= sumAlienWidth && sumAlienWidth <= sumMediumBoxWidth) {
            mediumRock.src = "images/images/boom.png"
            boomMusic()
            setTimeout(removeMediumBox, 500)
        }
    }
    if (!isCheckSmallBox) {
        if (parseInt(smallBoxLeftPos) <= alienLeftPos && alienLeftPos <= sumSmallBoxWidth) {
            smallRock.src = "images/images/boom.png"
            boomMusic()
            setTimeout(removeSmallBox, 500)
        } else if (parseInt(smallBoxLeftPos) <= sumAlienWidth && sumAlienWidth <= sumSmallBoxWidth) {
            smallRock.src = "images/images/boom.png"
            boomMusic()
            setTimeout(removeSmallBox, 500)
        }
    }
}

//After 0.5 seconds, the small bomb image is deleted from the screen.
function removeSmallBox() {
    smallRock.style.visibility = "hidden";
    smallRock.style.right = 0
    isCheckSmallBox = true
}
//After 0.5 seconds, the medium bomb image is deleted from the screen.
function removeMediumBox() {
    mediumRock.style.visibility = "hidden";
    mediumRock.style.right = 0
    isCheckMediumBox = true
}

/********************[Ajax]******************************  
    When user clicks the end game button in the pop-up, 
    the contents of the external file are displayed 
    on the screen using ajax.
********************************************************/
function callEndingMessage() {
    $('#ending-message').load('ending.txt')
    ajaxPopup.style.display = "block"
}
//When the user clicks the music play button
function playEndAudio() {
    musicEnding = document.getElementById('music-ending')
    musicEnding.play()
}
//When the user clicks play-again button
function playAgainMusic() {
    musicPlayAgain = document.getElementById('music-play-again')
    musicPlayAgain.play()
}
//When the bomb goes off
function boomMusic() {
    musicBoom = document.getElementById('music-boom')
    musicBoom.play()
}
//The sound of an alien screaming when a rock hits his head
function screamMusic() {
    musicScream = document.getElementById('music-scream')
    musicScream.play()
}

// Get the game over popup
endModal = document.getElementById("end-popup")
// Get the play-again button that opens the popup
btnPlayAgain = document.getElementById("play-again")
// Get the end-button that opens the popup
btnPlayEnd = document.getElementById("play-end")
// Get the mute-button
btnMute = document.getElementById('btn-audio-off')
// Get the play-button
btnPlay = document.getElementById('btn-audio-on')
// Get the opening music id value
musicPlayGame = document.getElementById('music-opening')
// Get the intro popup
introModal = document.getElementById('intro-popup')
// Get the start button that opens the intro popup
btnStart = document.getElementById('btn-start')
// Get the start button that opens the ajax popup
ajaxPopup = document.getElementById('ajax-popup')

//When the user clicks the start button in intro popup
btnStart.onclick = function () {
    introModal.style.display = "none"
    isStarted = true
}

// When the user clicks the play-again button
btnPlayAgain.onclick = function () {
    endModal.style.display = "none"
    setupAudio()
    playAgain()
}
// When time becomes 60 seconds, open the game over popup
openPopUp = function () {
    endModal.style.display = "block"
    musicPlayGame.pause()
    playEndAudio()
}

// When the user clicks the play-end button
btnPlayEnd.onclick = function () {
    endModal.style.display = "none"
    callEndingMessage()
}
// When the user clicks the play music button
btnMute.onclick = function () {
    musicPlayGame.play()
    btnMute.style.display = 'none'
    btnPlay.style.display = 'flex'
}
// When the user clicks the mute music button
btnPlay.onclick = function () {
    musicPlayGame.pause()
    btnPlay.style.display = 'none'
    btnMute.style.display = 'flex'
}
// set the audio
function setupAudio() {
    musicPlayGame.pause()
    btnPlay.style.display = 'none'
    btnMute.style.display = 'flex'
}
