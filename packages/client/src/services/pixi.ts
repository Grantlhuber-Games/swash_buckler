import * as PIXI from "pixi.js";


let app = null;

// This is the game loop
export default function startGame() { // the name of this function is misleading, it should be called startGame
    const disableMouse = true; // disable mouse movement so that the game can be played with keyboard only

    app = new PIXI.Application({ width: 1920, height: 1080 }); // this is the game window
    // console.log("app", app.view.width);
    document.body.appendChild(app.view); // app.view is the canvas element currently being used. It contains the game

    createLevel(app);
    createHUD(app);

    // for styling the texts
    const textStyle = {
        fontSize: "40px",
        fontWeight: "bold",
        fontFamily: "Arial",
        fill: "white",
    };

    let text = new PIXI.Text(
        "Swash Buckler", textStyle
    );
    app.stage.addChild(text); // adding to app.stage makes it appear on the screen

    // table to debug print the stats of an avatar
    const table = new PIXI.Container();
    app.stage.addChild(table);

    // TODO: Wire up the actual values here
    let healthValue = "none";
    let intentValue = "none";
    let buffValue = "none";

    const healthText = new PIXI.Text(`Health: ${healthValue}`, textStyle);
    table.addChild(healthText);

    const intentText = new PIXI.Text(`Intent: ${intentValue}`, textStyle);
    intentText.position.y = 50;
    table.addChild(intentText);

    const buffText = new PIXI.Text(`Buff: ${buffValue} `, textStyle);
    buffText.position.y = 100;
    table.addChild(buffText);

    const tableWidth = Math.max( //math.max makes sure the table is wide enough to fit all the text
        healthText.width,
        intentText.width,
        buffText.width
    );
    const tableHeight = 450;

    table.pivot.set(tableWidth / 2, tableHeight / 2); // set the pivot to the center of the table

    // Load the avatar image into a sprite
    let sprite = PIXI.Sprite.from("assets/goblin-gaylord.png");
    sprite.position.set(app.view.width / 2 - sprite.width / 2, app.view.height / 2 - sprite.height / 2); // center the avatar

    sprite.scale.set(1); // scale the avatar
    sprite.anchor.set(0.5); // set the anchor to the center of the avatar
    sprite.position.set(app.view.width / 2, app.view.height / 2); // make sure that the avatar can't move outside of the screen

    const avatarBounds = sprite.getBounds();

    table.scale.set(0.5);
    table.position.y = avatarBounds.height - 80;
    table.position.x = avatarBounds.width;

    sprite.addChild(table); // adding to app.stage makes it appear on the screen

    // Options for how objects interact
    // How fast the red square moves
    const movementSpeed = 0.05;

    app.stage.interactive = true;
    app.stage.hitArea = app.screen;

    // KEYBOARD START
    // Set the width and height of our boxes
    const boxWidth = app.view.width / 10;
    const boxHeight = app.view.height / 10;
    let isAvatarFacingRight = false;

    function onKeyDown(key) {
        console.log("keydown", key);
        // W Key is 87
        // Up arrow is 87
        if (key.keyCode === 87 || key.keyCode === 38) {
            // If the W key or the Up arrow is pressed, move the player up.
            if (sprite.position.y != 0) {
                // Don't move up if the player is at the top of the stage
                sprite.position.y -= boxHeight;
            }
        }
        // S Key is 83
        // Down arrow is 40
        if (key.keyCode === 83 || key.keyCode === 40) {
            // If the S key or the Down arrow is pressed, move the player down.
            if (sprite.position.y != app.view.height - boxHeight) {
                // Don't move down if the player is at the bottom of the stage
                sprite.position.y += boxHeight;
            }
        }

        // A Key is 65
        // Left arrow is 37
        if (key.keyCode === 65 || key.keyCode === 37) {
            // If the A key or the Left arrow is pressed, move the player to the left.
            if (sprite.position.x != 0) {
                // Don't move to the left if the player is at the left side of the stage
                sprite.position.x -= boxWidth
                if (isAvatarFacingRight) {
                    sprite.scale.x *= -1; // Flip the avatar image horizontally
                    isAvatarFacingRight = false;
                }
            }
        }

        // D Key is 68
        // Right arrow is 39
        if (key.keyCode === 68 || key.keyCode === 39) {
            // If the D key or the Right arrow is pressed, move the player to the right.
            if (sprite.position.x != app.view.width - boxWidth) {
                // Don't move to the right if the player is at the right side of the stage
                sprite.position.x += boxWidth
                if (!isAvatarFacingRight) {
                    sprite.scale.x *= -1; // Flip the avatar image horizontally
                    isAvatarFacingRight = true;
                }
            }
        }

        // action buttons

        // Y Key is 89
        if (key.keyCode === 89) {
            alert("soft Fight call hurt 20");
            window.hurt(20);
        }
        // X key is 88
        if (key.keyCode === 88) {
            alert("hard Fight call hurt 50");
            window.hurt(50);
        }
        // C key is 67
        if (key.keyCode === 67) {
            alert("counter attack");
        }
        // V key is 86
        if (key.keyCode === 86) {
            alert("special ability");
        }

        // move to gameloop
        window.setPosition(Math.round(sprite.x), Math.round(sprite.y));
    }
    // Add the 'keydown' event listener to our document
    document.addEventListener("keydown", onKeyDown);
    //KEYBOARD END

    // mouse events
    const mouseCoords = { x: 0, y: 0 };
    app.stage.on("mousemove", (event) => {
        mouseCoords.x = event.global.x;
        mouseCoords.y = event.global.y;
    });
    // mouse events end

    // Toggle the visibility of the table on click
    sprite.interactive = true;
    sprite.on("click", () => {
        table.visible = !table.visible;
    });

    // Listen for animate update
    app.ticker.add((delta) => {
        if (!disableMouse) {
            // Applied deacceleration for both squares, done by reducing the
            // acceleration by 0.01% of the acceleration every loop
            sprite.acceleration.set(
                sprite.acceleration.x * 0.99,
                sprite.acceleration.y * 0.99
            );

            // If the mouse is off screen, then don't update any further
            if (
                app.screen.width > mouseCoords.x ||
                mouseCoords.x > 0 ||
                app.screen.height > mouseCoords.y ||
                mouseCoords.y > 0
            ) {
                // Get the red square's center point
                const redSquareCenterPosition = new PIXI.Point(
                    sprite.x + sprite.width * 0.5,
                    sprite.y + sprite.height * 0.5
                );

                // Calculate the direction vector between the mouse pointer and
                // the red square
                const toMouseDirection = new PIXI.Point(
                    mouseCoords.x - redSquareCenterPosition.x,
                    mouseCoords.y - redSquareCenterPosition.y
                );

                // Use the above to figure out the angle that direction has
                const angleToMouse = Math.atan2(toMouseDirection.y, toMouseDirection.x);

                // Figure out the speed the square should be travelling by, as a
                // function of how far away from the mouse pointer the red square is
                const distMouseRedSquare = distanceBetweenTwoPoints(
                    mouseCoords,
                    redSquareCenterPosition
                );
                const redSpeed = distMouseRedSquare * movementSpeed;

                // Calculate the acceleration of the red square
                sprite.acceleration.set(
                    Math.cos(angleToMouse) * redSpeed,
                    Math.sin(angleToMouse) * redSpeed
                );

                // Calculate the distance between two given points
                function distanceBetweenTwoPoints(p1, p2) {
                    const a = p1.x - p2.x;
                    const b = p1.y - p2.y;

                    return Math.hypot(a, b);
                }
            }

            // Add grantlhuber
            let oldCoords = { x: sprite.x, y: sprite.y };

            sprite.x += sprite.acceleration.x * delta;
            sprite.y += sprite.acceleration.y * delta;

            // Add grantlhuber
            if (
                Math.round(oldCoords.x) != Math.round(sprite.x) ||
                Math.round(oldCoords.y) != Math.round(sprite.y)
            ) {
                window.setPosition(Math.round(sprite.x), Math.round(sprite.y));
            }
        }
    });

    // Function to toggle fullscreen mode

    app.stage.addChild(sprite);
}

function toggleFullscreen() {
    if (document.fullscreenElement) {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            // Chrome, Safari and Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            // IE/Edge
            document.msExitFullscreen();
        }
    } else {
        // Enter fullscreen
        if (app.view.requestFullscreen) {
            app.view.requestFullscreen();
        } else if (app.view.mozRequestFullScreen) {
            // Firefox
            app.view.mozRequestFullScreen();
        } else if (app.view.webkitRequestFullscreen) {
            // Chrome, Safari and Opera
            app.view.webkitRequestFullscreen();
        } else if (app.view.msRequestFullscreen) {
            // IE/Edge
            app.view.msRequestFullscreen();
        }
    }
}

function createLevel(app) {
    // Create a sprite for the background image
    const randomNumber = Math.floor(Math.random() * 4) + 1;
    const background = PIXI.Sprite.from(`assets/background_0${randomNumber}.png`);
    background.width = app.view.width;
    background.height = app.view.height;
    app.stage.addChild(background);
}

function createHUD(app) {
    // Create a container for the fullscreen button
    const fullscreenButtonContainer = new PIXI.Container();
    // Create a button element for fullscreen
    const fullscreenButton = new PIXI.Text(" Fullscreen", {
        fontSize: "20px",
        fill: "white",
    });
    // Set the position of the fullscreen button
    fullscreenButton.position.set(0, 50);
    // Make it interactive to enable mouse and touch events
    fullscreenButton.interactive = true;
    fullscreenButtonContainer.addChild(fullscreenButton);
    // Attach a click event listener to the fullscreen button
    fullscreenButton.on("click", toggleFullscreen);
    app.stage.addChild(fullscreenButtonContainer);
    // Attach the toggleFullscreen function to the button's click event
    fullscreenButton.addEventListener("click", toggleFullscreen);
}
