// this is an extension and adjustment of the version-one branch of this repo. This incorporates smoother movement and a more open collision detection function, as well as a second enemy. There are more comments in the version-one branch of this repo explaining more of the basics of the code below.

//////////// RULES FOR DEVELOPING THE GAME //////////////
// we need two entities, a hero and an ogre
// the hero should be movable with the WASD or arrow keys
// the ogre should be stationary
// the hero and first ogre should be able to collide to make something happen
// when the hero and ogre one collide, the ogre is removed from the canvas, and a second ogre appears
// when hero and ogre two colide, the game stops, and a message is sent to the user notifying them they have won
///////////// END RULES //////////////

// first we need to grab our elements so we can make them do things //
const game = document.getElementById('canvas')
const movement = document.getElementById('movement')
const message = document.getElementById('status')

// we need to set the game's context to be 2d
const ctx = game.getContext('2d')

// we need to set the attributes width and height according to how the canvas displays
game.setAttribute('width', getComputedStyle(game)['width'])
game.setAttribute('height', getComputedStyle(game)['height']);


// we are making a two classes: hero and ogre.
class Ogre {

    constructor(x,y, color, width, height, alive) {
        this.x = x,
        this.y = y,
        this.color = color,
        this.width = width,
        this.height = height,
        this.alive = true,
        this.render = function () {
            ctx.fillStyle = this.color,
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}

class Hero {
	constructor(x, y, color, width, height) {
		(this.x = x),
			(this.y = y),
			(this.color = color),
			(this.width = width),
			(this.height = height),
			(this.alive = true),
			// we need two additional properies to make our hero move around a bit smoother
			(this.speed = 15),
			// because we are going to rework our movement handler, we need directions, set to be different values that we can update with a keypress
			// our new movement handler will work so if a key is pressed and a direction is set to true, the character will move in that direction until the key is released
			(this.direction = {
				up: false,
				down: false,
				left: false,
				right: false,
			}),
			// we need two key based functions here that will change our hero's movement direction
			// this time, we'll only use WASD keys (purely for the sake of time)
			(this.setDirection = function (key) {
				console.log('this key was pressed', key);
				if (key.toLowerCase() == 'w') {
					this.direction.up = true;
				}
				if (key.toLowerCase() == 'a') {
					this.direction.left = true;
				}
				if (key.toLowerCase() == 's') {
					this.direction.down = true;
				}
				if (key.toLowerCase() == 'd') {
					this.direction.right = true;
				}
			}),
			(this.unsetDirection = function (key) {
				console.log('this key was released', key);
				if (key.toLowerCase() == 'w') {
					this.direction.up = false;
				}
				if (key.toLowerCase() == 'a') {
					this.direction.left = false;
				}
				if (key.toLowerCase() == 's') {
					this.direction.down = false;
				}
				if (key.toLowerCase() == 'd') {
					this.direction.right = false;
				}
			}),
            // we're also adding a movePlayer function that is tied to our directions
            this.movePlayer = function () {
                //movePlayer sends our guy flying in whatever diretion is true
                if (this.direction.up) {
                    this.y -= this.speed
                    // while we're tracking movement, let's stop our hero from exiting the top of the screen
                    if (this.y <= 0) {
                        this.y = 0
                    }
                }
                if (this.direction.left) {
                    this.x -= this.speed;
                    // while we're tracking movement, let's stop our hero from exiting the top of the screen
                    if (this.x <= 0) {
                        this.x = 0;
                    }
                }
                if (this.direction.down) {
                    this.y += this.speed;
                    // while we're tracking movement, let's stop our hero from exiting the top of the screen
                    if (this.y + this.height >= game.height) {
                        this.y = game.height - this.height;
                    }
                }
                if (this.direction.right) {
                    this.x += this.speed;
                    // while we're tracking movement, let's stop our hero from exiting the top of the screen
                    if (this.x + this.width >= game.width) {
                        this.x = game.width - this.width;
                    }
                }
            },
			(this.render = function () {
				(ctx.fillStyle = this.color),
					ctx.fillRect(this.x, this.y, this.width, this.height);
			});
	}
}

const randomPlaceShrekX = (max) => {
    // we can use math random adn canvas dimensions for this
    return Math.floor(Math.random() * max)
}

const player = new Hero(10, 10, 'hotpink', 20, 20)

const ogre = new Ogre(200, 50, '#bada55', 32, 48, true);

const ogreTwo = new Ogre(randomPlaceShrekX(game.width), 50, 'red', 64, 96, true)

// we are replacing our old movement handler function with the two event listeners below

//function that changes the player's direction
document.addEventListener('keydown', (e) => {
    // when a key is pressed, call the setDirection method
    player.setDirection(e.key)
})

// function that stops player from going in a specific direction
document.addEventListener('keyup', (e) => {
    // when any of these keys were pressed and now is released, call the unsetDirection method
    if (['w', 'a', 's', 'd'].includes(e.key)) {
        player.unsetDirection(e.key);
    }
})

// here's the function we'll use to detect collision between entities
// to accurately detect a hit, we need to account for the entire space taken up by each object
// we need to use the hero's x, y, width, and height as well as the ogre's x, y, width, and height

const detectHit = (thing) => {
    // we're bascially using one big if statement to cover all our bases
    // changing references to ogre to thing to reflect new game logic
    if (player.x < thing.x + thing.width
        && player.x + player.width > thing.x
        && player.y < thing.y + thing.height
        && player.y + player.height > thing.y ) {
            // if we have a hit, the ogre dies
            thing.alive = false
        }

}


// we're doing to set up a gameLoop function
// this will be attached to an interval
// this is how we will create animation in our canvas

const gameLoop = () => {
	
    //here we'll use another built in canvas method
	// this is called clearRect, and it clears rectangles (just like fillRect fills rectangles)
	// here, we want to clear out the ENTIRE canvas every single frame (we are clearing, redrawing, clearing, redrawing)

	ctx.clearRect(0, 0, game.width, game.height);

	if (ogre.alive) {
		ogre.render();
		detectHit(ogre);
	} else if (ogreTwo.alive) {
		message.textContent = 'Now kill the other ogre!';
		ogreTwo.render();
		detectHit(ogreTwo);
	} else {
        message.textContent = 'You win!'
    }

	movement.textContent = player.x + ', ' + player.y;
	player.render();
	player.movePlayer();
}

// starts the game on DOM load
document.addEventListener('DOMContentLoaded', function (){
    setInterval(gameLoop, 60)
})
