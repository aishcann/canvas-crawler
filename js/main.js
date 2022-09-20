// console.log('js is linked and working')

// make a simple crawler game using HTML5's canvas tag (and the associated properties of that tag) that we can manipulate with javascript 

// we need two entities, a hero and an ogre

// the hero should be movable with the WASD or arrow keys

// the ogre should be stationary

// the hero and ogre should be able to collide to make something happen

// when the hero and ogre collide, the ogre is removed from the canvas, the game stops, and a message is sent to the user notifying them they have won

const game = document.getElementById('canvas')
const movement = document.getElementById('movement')
const message = document.getElementById('status')

// we need to set the game's context to be 2d
// we also SAVE that context to the ctx variable
// this tells our code to do whatever we want it to do in the context of the canvas area

const ctx = game.getContext('2d')


// console.log(game)
// console.log(movement)
// console.log(message);

// one thing we need to do is the computed size of our canvas
// this is because the canvas could have different sizes on different screens
// and we need to be able to access the exact size of the canvas in order to make this function work like a game 

// we need to set the attributes width and height according to how the canvas displays
game.setAttribute('width', getComputedStyle(game)['width'])
game.setAttribute('height', getComputedStyle(game)['height']);

// fillStyle is built in and sets a color to fill whatever shape you're drawing
// ctx.fillStyle = 'green'
// the fillRect takes 4 arugments in the following order: x, y, width, height
// these units are in pixels
// ctx.fillRect(10,10,100,100)

//here is an example of the hero object
// nothice this method uses the function express syntax
// this is because one of the primary differences between a named function with the keyword and an arrow function is the context that 'this' refers to
// const hero = {
//     x: 10,
//     y: 10,
//     color: 'hotpink',
//     width: 20,
//     height: 20,
//     alive: true,
//     render: function () {
//         ctx.fillStyle = this.color,
//         ctx.fillRect(this.x, this.y, this.width, this.height)
//     }

// }

// // here's an example of how to make the hero show up on the canvas
// hero.render()

// //here's an example of an ogre object
// const ogre = {
//     x: 200,
//     y: 100,
//     color: "#bada55",
//     width: 60,
//     height: 120, 
//     alive: true,
//     render: function () {
//         ctx.fillStyle = this.color,
//         ctx.fillRect(this.x, this.y, this.width, this.height)
//     }
// }

// ogre.render()

// because our two crawlers are built of the same key:value pairs, we can use a javascript class to build them

class Crawler {
    // we need a constructor function in order to make differences between instancese of this class
    constructor(x,y, color, width, height) {
        this.x = x,
        this.y = y,
        this.color = color,
        this.width = width,
        this.height = height,
        // we can set hard values inside the constructor as well
        this.alive = true,
        this.render = function () {
            ctx.fillStyle = this.color,
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}

const player = new Crawler(10, 10, 'hotpink', 20, 20)

let ogre = new Crawler(200, 50, '#bada55', 32, 48);

// now we're going to set up our movement handler function
// this will tell our code how our player moves around, and what keys to use to move them
// this function has to be tied to an event handler

const movementHandler = (e) => {
    // this move handler will be associated with a keydown event
    // we're going to use keycodes to tell it to do different movements for different keys
    // here are some keyCodes:
    // w = 87, a = 65, s = 83, d = 68
    // up = 38, left = 37, down = 40, right = 39
    // we COULD use if statements for this, but there is another syntax that's a little bit shorter called a switch / case

    switch (e.keyCode) {
			// we can use multiple cases here for multiple keys to trigger same event

			// move up -- must subtract from the y value in order to move up
			case (87):
			case (38):
				player.y -= 10;
				break;
			// move left
			case (65):
			case (37):
				player.x -= 10;
				break;
			// move down
			case (83):
			case (40):
				player.y += 10;
                break
			// move right
            case (68):
            case (39):
                player.x += 10
                break
		}
}

// here's the function we'll use to detect collision between entities
// to accurately detect a hit, we need to account for the entire space taken up by each object
// we need to use the hero's x, y, width, and height as well as the ogre's x, y, width, and height

const detectHit = () => {
    // we're bascially using one big if statement to cover all our bases
    if (player.x < ogre.x + ogre.width
        && player.x + player.width > ogre.x
        && player.y < ogre.y + ogre.height
        && player.y + player.height > ogre.y ) {
            // if we have a hit, the ogre dies
            ogre.alive = false
            //the game winner is announced 
            message.textContent = 'You win!'
        }

}


// we're doing to set up a gameLoop function
// this will be attached to an interval
// this is how we will create animation in our canvas


const gameLoop = () => {
    //no console.logs in the gameLoop!! it will console.log the computer to hell

    //here we'll use another built in canvas method
    // this is called clearRect, and it clears rectangles (just like fillRect fills rectangles)
    // here, we want to clear out the ENTIRE canvas every single frame (we are clearing, redrawing, clearing, redrawing)

    ctx.clearRect(0,0, game.width, game.height)

    movement.textContent = player.x + ", " + player.y
    player.render()
    
    if (ogre.alive) {
        ogre.render()
    }

    detectHit()
}

// now we're going to attach our movement handler to the keydown event, and we're going to run the gameLoop, and we want to make sure to only do this once all of the DOM content has loaded

document.addEventListener('DOMContentLoaded', function (){
    // once the DOM content loads, we can set up our movement event listener 
    document.addEventListener('keydown', movementHandler)
    // we can also set up our gameLoop interval
    setInterval(gameLoop, 60)
})