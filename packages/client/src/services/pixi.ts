import * as PIXI from "pixi.js";
import attributes from "contracts/src/models/Attributes.mjs";

// PIXI_APP
let app = null;

const globalVars = {
    // for styling the texts
    textStyle: {
        fontSize: "30px",
        fontWeight: "bold",
        fontFamily: "Arial",
        fill: "white",
    },
    pixiStats: {},
};

/**
 * Enum for common colors.
 * @readonly
 * @enum {{name: string, hex: string}}
 */
const ANIMATIONS = Object.freeze({
    ATTACK_01:   { name: "Attack01", file: "attack_01" },
    DIE:   { name: "Die" },
    IDLE:   { name: "Idle" },
    RISE:   { name: "Rise" },
    WALK:   { name: "Walk" },

});


// This is the game loop
export default function initPixi(mudApp: any) { // the name of this function is misleading, it should be called startGame
    console.log("myAvatar", mudApp.myAvatar);
    if(!mudApp) {
        alert("mudApp / avatar is null");
    }

    const disableMouse = true; // disable mouse movement so that the game can be played with keyboard only


    const PIXI_ASSETS = generateAssetArray(mudApp.myAvatar.character.charClass);

    app = new PIXI.Application({ width: 1920, height: 1080 }); // this is the game window
    // console.log("app", app.view.width);
    document.body.appendChild(app.view); // app.view is the canvas element currently being used. It contains the game
    PIXI.Assets.load(PIXI_ASSETS).then(() => {
        createLevel(app);
        createHUD(app);

        const mainContainer = new PIXI.Container();
        const playerContainer = new PIXI.Container();
        playerContainer.interactive = true;

        //const statsContainer = new PIXI.Container();

        const playerSprite = createPlayerAnimated(app, mudApp.myAvatar);
        playerContainer.addChild(playerSprite);

        mainContainer.addChild(playerContainer);
        // createPlayerStats
        const statsTable = createPlayerStats(playerContainer, playerSprite);
        /*
        app.stage.addChild(statsTable);
        mainContainer.addChild(statsTable);
        */
        //app.stage.interactive = true;

        app.stage.hitArea = app.screen;


        addKeyboardHandler(app, playerSprite, mudApp, globalVars.pixiStats);
        addStatsChangeHandler(app, playerSprite, mudApp, globalVars.pixiStats);

        // mouse events
        const mouseCoords = { x: 0, y: 0 };
        app.stage.on("mousemove", (event) => {
            mouseCoords.x = event.global.x;
            mouseCoords.y = event.global.y;
        });
        // mouse events end


        // Listen for animate update
        app.ticker.add((delta) => {
            if (!disableMouse) {
                mouseAction(app, playerSprite, mouseCoords, delta);
            }
        });

        // Function to toggle fullscreen mode
        app.stage.addChild(mainContainer);
    });
}

function generateAssetArray(charClass) {
    console.log("generateAssetArray", charClass)
    const assets = [
        "assets/background/background_01.png",
        "assets/background/background_02.png",
        "assets/background/background_03.png",
        "assets/background/background_04.png",
/*
        "assets/sprites/archer/idle.json",
        "assets/sprites/archer/die.json",
        "assets/sprites/archer/rise.json",
        "assets/sprites/archer/walk.json",
        "assets/sprites/archer/attack_01.json",


        "assets/sprites/bandit/idle.json",
        "assets/sprites/bandit/die.json",
        "assets/sprites/bandit/rise.json",
        "assets/sprites/bandit/walk.json",
        "assets/sprites/bandit/attack_01.json"
*/
    ];

    const classesAll = [
        "archer",
        "bandit",
        "death_knight",
        "necromancer",
        "warlock",
        "warrior"
    ];

    const classes = [charClass];
    //FIXME use anim enums
    const animations = [
        "attack_01",
        "die",
        "idle",
        "rise",
        "walk"
    ];

    for(let classEntry of classes) {
        for(let animEntry of animations) {
            assets.push("assets/sprites/" + classEntry + "/" + animEntry + ".json")
        }
    }
    console.warn("generateAssets", assets)
    return assets;
}



// FIXME if function has app param it does not work, because view is empty
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

function createLevel(app: PIXI.Application) {
    // Create a sprite for the background image
    const randomNumber = Math.floor(Math.random() * 4) + 1;
    const background = PIXI.Sprite.from(`assets/background/background_0${randomNumber}.png`);
    background.width = app.view.width;
    background.height = app.view.height;
    app.stage.addChild(background);
}

function createHUD(app: PIXI.Application) {
    // Create a text element for the title
    let text = new PIXI.Text(
        "Swash Buckler", globalVars.textStyle
    );
    app.stage.addChild(text); // adding to app.stage makes it appear on the screen

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

function createPlayer(app: PIXI.Application) {
    // Load the avatar image into a sprite
    const playerSprite = PIXI.Sprite.from("assets/goblin-gaylord.png");
    playerSprite.position.set(app.view.width / 2 - playerSprite.width / 2, app.view.height / 2 - playerSprite.height / 2); // center the avatar
    playerSprite.scale.set(1); // scale the avatar
    playerSprite.anchor.set(0.5); // set the anchor to the center of the avatar
    playerSprite.position.set(app.view.width / 2, app.view.height / 2); // make sure that the avatar can't move outside of the screen

    // Toggle the visibility of the table on click
    playerSprite.interactive = true;
    return playerSprite;
}

function createPlayerAnimated(app: PIXI.Application, avatar) {
    console.log("createPlayerAnimated", avatar)


    const CHAR_CLASS = avatar.character.charClass || "archer";
        const animations = PIXI.Assets.cache.get('assets/sprites/' + CHAR_CLASS + '/idle.json').data.animations;
        console.log("createPlayerAnimated", animations);

        const playerSprite = PIXI.AnimatedSprite.fromFrames(animations["Idle"]);
        console.log(playerSprite);
        // configure + start animation:
        playerSprite.animationSpeed = 1 / 5                      // 6 fps
        //playerSprite.position.set(1500, background.height - 780); // almost bottom-left corner of the canvas
        playerSprite.play();

        // Load the avatar image into a sprite
        //const playerSprite = PIXI.Sprite.from("assets/sprites/");
        playerSprite.position.set(app.view.width / 2 - playerSprite.width / 2, app.view.height / 2 - playerSprite.height / 2); // center the avatar
        playerSprite.scale.set(0.5); // scale the avatar
        playerSprite.anchor.set(0.5); // set the anchor to the center of the avatar
        playerSprite.position.set(app.view.width / 2, app.view.height / 2); // make sure that the avatar can't move outside of the screen

        // Toggle the visibility of the table on click
        playerSprite.interactive = true;
        return playerSprite;
}

function animatePlayer(playerSprite: PIXI.AnimatedSprite, avatar, animationType) {
    console.log("animatePlayer", playerSprite, animationType);
    const CHAR_CLASS = avatar.character.charClass || "archer";
    const animFile = animationType.file?animationType.file:animationType.name.toLowerCase();
    const animations = PIXI.Assets.cache.get('assets/sprites/'  + CHAR_CLASS + "/" + animFile + '.json').data.animations;
    //console.log("animatePlayer", animations);
    //playerSprite.stop();
    //let frameName = animationType.name;
    let playerSpriteNew = PIXI.AnimatedSprite.fromFrames(animations[animationType.name]);
    //playerSprite = playerSpriteNew;

    playerSprite.textures = playerSpriteNew.textures;

    playerSprite.play();
    //playerSprite.play();
    return playerSprite;
}



/**
 *
 * @param playerSprite
 */
function createPlayerStats(container: PIXI.Container, playerSprite: PIXI.Sprite) {

    const avatarBounds = playerSprite.getBounds();
    // table to debug print the stats of an avatar
    const table = new PIXI.Container();
    container.addChild(table);
    //container.addChild(table);

    // TODO: Wire up the actual values here

    let statsValues = [
        {
            name: "Name",
            value: "none"
        },
        {
            name: "Attributes",
            value: "none"
        },
        {
            name: "Health",
            value: "none"
        },
        {
            name: "Stamina",
            value: "none"
        },
        {
            name: "Position",
            value: "none"
        },/*

        {
            name: "Intent",
            value: "none"
        }*/
    ];

    const DISTANCE_BETWEEN_Y = 30;
    let pixiRetElement = [],
        pixiObjRet = {},
        counterYDist = 0;

    for (let stat of statsValues) {
        let statText = new PIXI.Text(`${stat.name}: ${stat.value}`, globalVars.textStyle);
        statText.position.y = statText.position.y + counterYDist * DISTANCE_BETWEEN_Y;
        table.addChild(statText);
        globalVars.pixiStats[stat.name] = statText;
        pixiRetElement.push(statText);
        counterYDist++;
    }
   let widthElements = pixiRetElement.map((x) => x.width)

    const tableWidth = Math.max(...widthElements);
    console.log("tableWidth", tableWidth)



    /*
    const bg = new PIXI.Sprite(PIXI.Texture.WHITE);
    bg.width = tableWidth;
    bg.pivot.set(tableWidth / 2, tableHeight / 2)
    bg.height = table.height;
    bg.position.x = table.position.x;// = table.position.x;
    bg.position.y = table.position.y;// = table.position.x;
    bg.tint = 0x000000;
    bg.height = 450;
    bg.height = table.height * 2;
    table.addChild(bg)
     */
    const tableHeight = 450;
    table.pivot.set(tableWidth / 2, tableHeight / 2); // set the pivot to the center of the table
    table.scale.set(0.5);
    table.position.y = avatarBounds.height - 80;
    table.position.x = avatarBounds.width;

    playerSprite.on("click", () => {
        console.log("table", table)
        table.visible = !table.visible;
    });

    // FIXME this is responsible for the table not being visible
    playerSprite.addChild(table); // adding to app.stage makes it appear on the screen

    // return mapping easy key value access to update
    return table;
}

function addKeyboardHandler(app: PIXI.Application, playerSprite: PIXI.Sprite, mudApp, pixiObjRet) {
    // KEYBOARD START
    // Set the width and height of our boxes
    const boxWidth = app.view.width / 10;
    const boxHeight = app.view.height / 10;
    let isAvatarFacingRight = true;

    // delegates
    function onKeyDown(key) {
        console.log("keydown", key);
        // W Key is 87
        // Up arrow is 87
        if (key.keyCode === 87 || key.keyCode === 38) {
            // If the W key or the Up arrow is pressed, move the player up.
            if (playerSprite.position.y != 0) {
                // Don't move up if the player is at the top of the stage
                playerSprite.position.y -= boxHeight;
                playerSprite = animatePlayer(playerSprite, mudApp.myAvatar, ANIMATIONS.WALK);
                window.setPosition(Math.round(playerSprite.x), Math.round(playerSprite.y));
                console.log("pixi mudApp.myAvatar.position", mudApp.myAvatar.position);


            }
        }
        // S Key is 83
        // Down arrow is 40
        if (key.keyCode === 83 || key.keyCode === 40) {
            // If the S key or the Down arrow is pressed, move the player down.
            if (playerSprite.position.y != app.view.height - boxHeight) {
                // Don't move down if the player is at the bottom of the stage
                playerSprite.position.y += boxHeight;
                playerSprite = animatePlayer(playerSprite, ANIMATIONS.WALK);
                window.setPosition(Math.round(playerSprite.x), Math.round(playerSprite.y));
                console.log("pixi mudApp.myAvatar.position", mudApp.myAvatar.position);
            }

        }

        // A Key is 65
        // Left arrow is 37
        if (key.keyCode === 65 || key.keyCode === 37) {
            // If the A key or the Left arrow is pressed, move the player to the left.
            if (playerSprite.position.x != 0) {
                // Don't move to the left if the player is at the left side of the stage
                playerSprite.position.x -= boxWidth
                if (isAvatarFacingRight) {
                    playerSprite.scale.x *= -1; // Flip the avatar image horizontally
                    isAvatarFacingRight = false;
                }
                playerSprite = animatePlayer(playerSprite, ANIMATIONS.WALK);
                window.setPosition(Math.round(playerSprite.x), Math.round(playerSprite.y));
                console.log("pixi mudApp.myAvatar.position", mudApp.myAvatar.position);
            }
        }

        // D Key is 68
        // Right arrow is 39
        if (key.keyCode === 68 || key.keyCode === 39) {
            // If the D key or the Right arrow is pressed, move the player to the right.
            if (playerSprite.position.x != app.view.width - boxWidth) {
                // Don't move to the right if the player is at the right side of the stage
                playerSprite.position.x += boxWidth
                if (!isAvatarFacingRight) {
                    playerSprite.scale.x *= -1; // Flip the avatar image horizontally
                    isAvatarFacingRight = true;
                }
                playerSprite = animatePlayer(playerSprite, ANIMATIONS.WALK);
                window.setPosition(Math.round(playerSprite.x), Math.round(playerSprite.y));
                console.log("pixi mudApp.myAvatar.position", mudApp.myAvatar.position);
            }
        }

        // action buttons

        // Y Key is 89
        if (key.keyCode === 89) {
            alert("soft Fight call hurt 20 (addintent + wait 5 sec + removeintent)");
            window.addIntent(1);
            window.hurt(20);
            playerSprite = animatePlayer(playerSprite, mudApp.myAvatar, ANIMATIONS.ATTACK_01);
            setTimeout(() => {
                window.removeIntent(true);
                 }, 5000);
        }
        // X key is 88
        if (key.keyCode === 88) {
            alert("hard Fight call hurt 50 (addintent + wait 5 sec + removeintent)");
            window.addIntent(2)
            window.hurt(50);
            setTimeout(() => {
                window.removeIntent(true);
            }, 5000);
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


        playerSprite.emit('onStatsChanged');

    }
    // Add the 'keydown' event listener to our document
    document.addEventListener("keydown", onKeyDown);
    //KEYBOARD END
}

function addStatsChangeHandler(app: PIXI.Application, playerSprite: PIXI.Sprite, mudApp, pixiObjRet) {



    const onStatsChanged = (event) => {
        console.log("onStatsChanged", event);
        const character = mudApp.myAvatar.character;
        const attributes = mudApp.myAvatar.attributes;
        pixiObjRet["Name"].text = `Name (Class): ${character.name} (${character.charClass})`;
        pixiObjRet["Attributes"].text = `Attributes (St, Dex, Mana, Armor, Speed): ${attributes.strength}, ${attributes.dexterity}, ${attributes.mana}, ${attributes.armor}, ${attributes.speed}`;
        pixiObjRet["Position"].text = `Position: ${mudApp.myAvatar.position.x}, ${mudApp.myAvatar.position.y}`;
        pixiObjRet["Stamina"].text = `Stamina: ${mudApp.myAvatar.stamina}`;
        pixiObjRet["Health"].text = `Health: ${mudApp.myAvatar.health}`;

    };
    playerSprite.on('onStatsChanged', onStatsChanged);


    //document.addEventListener("statsChanged", onStatsChanged);
}

function mouseAction(app: PIXI.Application, playerSprite: PIXI.Sprite, mouseCoords: any, delta: number) {
    // Options for how objects interact
    // How fast the red square moves
    const movementSpeed = 0.05;

    // Applied deacceleration for both squares, done by reducing the
    // acceleration by 0.01% of the acceleration every loop
    playerSprite.acceleration.set(
        playerSprite.acceleration.x * 0.99,
        playerSprite.acceleration.y * 0.99
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
            playerSprite.x + playerSprite.width * 0.5,
            playerSprite.y + playerSprite.height * 0.5
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
        playerSprite.acceleration.set(
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
    let oldCoords = { x: playerSprite.x, y: playerSprite.y };

    playerSprite.x += playerSprite.acceleration.x * delta;
    playerSprite.y += playerSprite.acceleration.y * delta;

    // Add grantlhuber
    if (
        Math.round(oldCoords.x) != Math.round(playerSprite.x) ||
        Math.round(oldCoords.y) != Math.round(playerSprite.y)
    ) {
        window.setPosition(Math.round(playerSprite.x), Math.round(playerSprite.y));
    }
}
