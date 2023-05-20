/*
import { mount as mountDevTools } from "@latticexyz/dev-tools";
import { setup } from "./mud/setup";
*/
import mudService from "./services/mud";
import * as PIXI from 'pixi.js';
import { Button, ScrollBox } from '@pixi/ui';
//lkjlkj
class App {
    constructor() {
    }

    async init() {
        await mudService();
        startPixi();
    }
}

const app = new App();
await app.init();

function startPixi() {
    const disableMouse = true;

  let app = new PIXI.Application({ width: 1040, height: 600 });
  console.log("app", app.view.width)
  document.body.appendChild(app.view);
/*
    const container = new PIXI.Container();
    const button = new Button(
    // in this case the font is in a file called 'desyrel.fnt'

        //  new PIXI.BitmapText('text using a fancy font!', {
        //     fontName: 'Desyrel',
        //     fontSize: 35,
        //     align: 'right',
        // })


            new PIXI.Graphics()
                .beginFill(0xFFFFFF)
                .drawRoundedRect(0, 0, 100, 50, 15)


    );

    button.onPress.connect(() => console.log('onPress'));
    container.addChild(button.view);

    app.stage.addChild(container);
    */

    var text = new PIXI.Text("Hello Martin Gaylord!\n Move this exciting goblin with cursor or wasd keys and update its position on the blockchain.\n Test actions with y, x, c, v", {font:"50px Arial", fill:"red"});
    app.stage.addChild(text);


  // Magically load the PNG asynchronously
  let sprite = PIXI.Sprite.from('assets/goblin-gaylord.png');
    sprite.position.set(0, 100);
    sprite.scale.set(0.5);
    //sprite.tint = 0xFF0000;
    sprite.acceleration = new PIXI.Point(0); // only used for mouse
    sprite.mass = 1;

    // Options for how objects interact
    // How fast the red square moves
    const movementSpeed = 0.05;


    app.stage.interactive = true;
    app.stage.hitArea = app.screen;

    // KEYBOARD START
    // Set the width and height of our boxes
    const boxWidth = app.view.width / 10;
    const boxHeight = app.view.height / 10;
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
                sprite.position.x -= boxWidth;
            }
        }

        // D Key is 68
        // Right arrow is 39
        if (key.keyCode === 68 || key.keyCode === 39) {
            // If the D key or the Right arrow is pressed, move the player to the right.
            if (sprite.position.x != app.view.width - boxWidth) {
                // Don't move to the right if the player is at the right side of the stage
                sprite.position.x += boxWidth;
            }
        }

        // action buttons

        // Y Key is 89
        if (key.keyCode === 89 ) {
            alert("soft Fight")
        }
        // X key is 88
        if (key.keyCode === 88 ) {
            alert("hard Fight")
        }
        // C key is 67
        if (key.keyCode === 67 ) {
            alert("counter attack")
        }
        // V key is 86
        if (key.keyCode === 86 ) {
            alert("special ability")
        }

        // move to gameloop
        window.setPosition(Math.round(sprite.x), Math.round(sprite.y));



    }
    // Add the 'keydown' event listener to our document
    document.addEventListener('keydown', onKeyDown);
    //KEYBOARD END

    // mouse events
    const mouseCoords = { x: 0, y: 0 };
    app.stage.on('mousemove', (event) => {
        mouseCoords.x = event.global.x;
        mouseCoords.y = event.global.y;
    });
    // mouse events end

    // Listen for animate update
    app.ticker.add((delta) => {


        if(!disableMouse) {
            // Applied deacceleration for both squares, done by reducing the
            // acceleration by 0.01% of the acceleration every loop
            sprite.acceleration.set(sprite.acceleration.x * 0.99, sprite.acceleration.y * 0.99);

            // If the mouse is off screen, then don't update any further
            if (app.screen.width > mouseCoords.x || mouseCoords.x > 0
                || app.screen.height > mouseCoords.y || mouseCoords.y > 0) {
                // Get the red square's center point
                const redSquareCenterPosition = new PIXI.Point(
                    sprite.x + (sprite.width * 0.5),
                    sprite.y + (sprite.height * 0.5),
                );

                // Calculate the direction vector between the mouse pointer and
                // the red square
                const toMouseDirection = new PIXI.Point(
                    mouseCoords.x - redSquareCenterPosition.x,
                    mouseCoords.y - redSquareCenterPosition.y,
                );

                // Use the above to figure out the angle that direction has
                const angleToMouse = Math.atan2(
                    toMouseDirection.y,
                    toMouseDirection.x,
                );

                // Figure out the speed the square should be travelling by, as a
                // function of how far away from the mouse pointer the red square is
                const distMouseRedSquare = distanceBetweenTwoPoints(
                    mouseCoords,
                    redSquareCenterPosition,
                );
                const redSpeed = distMouseRedSquare * movementSpeed;

                // Calculate the acceleration of the red square
                sprite.acceleration.set(
                    Math.cos(angleToMouse) * redSpeed,
                    Math.sin(angleToMouse) * redSpeed,
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
            if(Math.round(oldCoords.x) != Math.round(sprite.x) || Math.round(oldCoords.y) != Math.round(sprite.y)) {
                window.setPosition(Math.round(sprite.x), Math.round(sprite.y));
            }
        }



    });


  app.stage.addChild(sprite);



/*
     // Based somewhat on this article by Spicy Yoghurt
     // URL for further reading: https://spicyyoghurt.com/tutorials/html5-javascript-game-development/collision-detection-physics
     const app = new PIXI.Application({ background: '#111' });
     document.body.appendChild(app.view);

     // Options for how objects interact
     // How fast the red square moves
     const movementSpeed = 0.05;

     // Strength of the impulse push between two objects
     const impulsePower = 5;

     // Test For Hit
     // A basic AABB check between two different squares
     function testForAABB(object1, object2) {
       const bounds1 = object1.getBounds();
       const bounds2 = object2.getBounds();

       return bounds1.x < bounds2.x + bounds2.width
               && bounds1.x + bounds1.width > bounds2.x
               && bounds1.y < bounds2.y + bounds2.height
               && bounds1.y + bounds1.height > bounds2.y;
     }

     // Calculates the results of a collision, allowing us to give an impulse that
     // shoves objects apart
     function collisionResponse(object1, object2) {
       if (!object1 || !object2) {
         return new PIXI.Point(0);
       }

       const vCollision = new PIXI.Point(
               object2.x - object1.x,
               object2.y - object1.y,
       );

       const distance = Math.sqrt(
               (object2.x - object1.x) * (object2.x - object1.x)
               + (object2.y - object1.y) * (object2.y - object1.y),
       );

       const vCollisionNorm = new PIXI.Point(
               vCollision.x / distance,
               vCollision.y / distance,
       );

       const vRelativeVelocity = new PIXI.Point(
               object1.acceleration.x - object2.acceleration.x,
               object1.acceleration.y - object2.acceleration.y,
       );

       const speed = vRelativeVelocity.x * vCollisionNorm.x
               + vRelativeVelocity.y * vCollisionNorm.y;

       const impulse = impulsePower * speed / (object1.mass + object2.mass);

       return new PIXI.Point(
               impulse * vCollisionNorm.x,
               impulse * vCollisionNorm.y,
       );
     }

     // Calculate the distance between two given points
     function distanceBetweenTwoPoints(p1, p2) {
       const a = p1.x - p2.x;
       const b = p1.y - p2.y;

       return Math.hypot(a, b);
     }

     // The green square we will knock about
     const greenSquare = new PIXI.Sprite(PIXI.Texture.WHITE);
     greenSquare.position.set((app.screen.width - 100) / 2, (app.screen.height - 100) / 2);
     greenSquare.width = 100;
     greenSquare.height = 100;
     greenSquare.tint = 0x00FF00;
     greenSquare.acceleration = new PIXI.Point(0);
     greenSquare.mass = 3;

     // The square you move around
     const redSquare = new PIXI.Sprite(PIXI.Texture.WHITE);
     redSquare.position.set(0, 0);
     redSquare.width = 100;
     redSquare.height = 100;
     redSquare.tint = 0xFF0000;
     redSquare.acceleration = new PIXI.Point(0);
     redSquare.mass = 1;

     const mouseCoords = { x: 0, y: 0 };
     app.stage.interactive = true;
     app.stage.hitArea = app.screen;
     app.stage.on('mousemove', (event) => {
       mouseCoords.x = event.global.x;
       mouseCoords.y = event.global.y;
       console.log("mouseCoords", mouseCoords);

       window.setPosition(Math.round(mouseCoords.x), Math.round(mouseCoords.y));
     });

     // Listen for animate update
     app.ticker.add((delta) => {

       // Applied deacceleration for both squares, done by reducing the
       // acceleration by 0.01% of the acceleration every loop
       redSquare.acceleration.set(redSquare.acceleration.x * 0.99, redSquare.acceleration.y * 0.99);
       greenSquare.acceleration.set(greenSquare.acceleration.x * 0.99, greenSquare.acceleration.y * 0.99);

       // Check whether the green square ever moves off the screen
       // If so, reverse acceleration in that direction
       if (greenSquare.x < 0 || greenSquare.x > (app.screen.width - 100)) {
         greenSquare.acceleration.x = -greenSquare.acceleration.x;
       }

       if (greenSquare.y < 0 || greenSquare.y > (app.screen.height - 100)) {
         greenSquare.acceleration.y = -greenSquare.acceleration.y;
       }

       // If the green square pops out of the cordon, it pops back into the
       // middle
       if ((greenSquare.x < -30 || greenSquare.x > (app.screen.width + 30))
               || greenSquare.y < -30 || greenSquare.y > (app.screen.height + 30)) {
         greenSquare.position.set((app.screen.width - 100) / 2, (app.screen.height - 100) / 2);
       }

       // If the mouse is off screen, then don't update any further
       if (app.screen.width > mouseCoords.x || mouseCoords.x > 0
               || app.screen.height > mouseCoords.y || mouseCoords.y > 0) {
         // Get the red square's center point
         const redSquareCenterPosition = new PIXI.Point(
                 redSquare.x + (redSquare.width * 0.5),
                 redSquare.y + (redSquare.height * 0.5),
         );

         // Calculate the direction vector between the mouse pointer and
         // the red square
         const toMouseDirection = new PIXI.Point(
                 mouseCoords.x - redSquareCenterPosition.x,
                 mouseCoords.y - redSquareCenterPosition.y,
         );

         // Use the above to figure out the angle that direction has
         const angleToMouse = Math.atan2(
                 toMouseDirection.y,
                 toMouseDirection.x,
         );

         // Figure out the speed the square should be travelling by, as a
         // function of how far away from the mouse pointer the red square is
         const distMouseRedSquare = distanceBetweenTwoPoints(
                 mouseCoords,
                 redSquareCenterPosition,
         );
         const redSpeed = distMouseRedSquare * movementSpeed;

         // Calculate the acceleration of the red square
         redSquare.acceleration.set(
                 Math.cos(angleToMouse) * redSpeed,
                 Math.sin(angleToMouse) * redSpeed,
         );
       }

       // If the two squares are colliding
       if (testForAABB(greenSquare, redSquare)) {
         // Calculate the changes in acceleration that should be made between
         // each square as a result of the collision
         const collisionPush = collisionResponse(greenSquare, redSquare);
         // Set the changes in acceleration for both squares
         redSquare.acceleration.set(
                 (collisionPush.x * greenSquare.mass),
                 (collisionPush.y * greenSquare.mass),
         );
         greenSquare.acceleration.set(
                 -(collisionPush.x * redSquare.mass),
                 -(collisionPush.y * redSquare.mass),
         );
       }

       greenSquare.x += greenSquare.acceleration.x * delta;
       greenSquare.y += greenSquare.acceleration.y * delta;

       redSquare.x += redSquare.acceleration.x * delta;
       redSquare.y += redSquare.acceleration.y * delta;
     });

     // Add to stage
     app.stage.addChild(redSquare, greenSquare);

 */
}

