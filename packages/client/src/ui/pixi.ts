import * as PIXI from "pixi.js";
import {GLOBAL_VARS, ANIMATIONS} from "../global";
import attributes from "contracts/src/models/Attributes.mjs";
import {addKeyboardHandler, addStatsChangeHandler} from "./services/Handlers";
import {createPlayer, createPlayerAnimated, animatePlayer, createOpponents} from "./services/Character";
import {generateAssetArray} from "./services/Assets";
// PIXI_APP
let app = null;




// This is the game loop
export default function initPixi(mudApp: any) { // the name of this function is misleading, it should be called startGame
    if(!mudApp) {
        alert("mudApp / avatar is null");
    }

    const disableMouse = true; // disable mouse movement so that the game can be played with keyboard only
    app = new PIXI.Application({ width: 1920, height: 1080 }); // this is the game window
    // console.log("app", app.view.width);
    document.body.appendChild(app.view); // app.view is the canvas element currently being used. It contains the game

    // generate with agent
    /*
        const PIXI_ASSETS = generateAssetArray(); //Without only lvl assets
    */

    mudApp.initAvatar("Horst Hrubesch", "bandit");
    const PIXI_ASSETS = generateAssetArray(); //Without only lvl assets
    //const PIXI_ASSETS = generateAssetArray(mudApp.getAvatar().character.charClass);
    /**/

    PIXI.Assets.load(PIXI_ASSETS).then(() => {
        console.log("loaded PIXI_ASSETS", PIXI_ASSETS);

        const mainContainer = new PIXI.Container();

        const lvlContainer = new PIXI.Container();
        const playerContainer = new PIXI.Container();
        const hudContainer = new PIXI.Container();

        const opponentContainer = new PIXI.Container();

        mainContainer.addChild(playerContainer);
        mainContainer.addChild(opponentContainer);
        mainContainer.addChild(hudContainer);
        mainContainer.addChild(lvlContainer);

        GLOBAL_VARS.scene.playerContainer = playerContainer;

        // add lvl
        createLevel(app, lvlContainer);
        app.stage.addChild(lvlContainer); // FIXME if I drop this no avatar is show, I assume because of the order of the containers

        // add huds
        const globalHud = createHUD(app, hudContainer);
        // createPlayerStats
        //const statsTable = createPlayerStats(hudContainer);
        const hud = createPlayerHud(hudContainer); // as of here updateHUD is available
        GLOBAL_VARS.scene.hud = hud; // FIXME this is a hack, we should not need to do this

        // add player
        const playerSprite = createPlayerAnimated(app, mudApp.myAvatar);
        if(playerSprite) {
            playerContainer.addChild(playerSprite);
        }


        app.stage.hitArea = app.screen;


        addKeyboardHandler(app, playerSprite, mudApp, GLOBAL_VARS.pixiStats);
        addStatsChangeHandler(app, playerSprite, mudApp, GLOBAL_VARS.pixiStats);

        // mouse events
        const mouseCoords = { x: 0, y: 0 };
        app.stage.on("mousemove", (event) => {
            mouseCoords.x = event.global.x;
            mouseCoords.y = event.global.y;
        });
        // mouse events end

        //add filter
        const blurFilter1 = new PIXI.BlurFilter();
        const colorMatrix = new PIXI.ColorMatrixFilter();
        if(playerSprite) {
            playerSprite.filters= [blurFilter1, colorMatrix];
        }


        // Listen for animate update
        app.ticker.add((delta) => {
            if (!disableMouse) {
                mouseAction(app, playerSprite, mouseCoords, delta);
            }
            if(mudApp.myAvatar) {
                adjustBlurToStamina(mudApp.myAvatar.stamina);
                adjustBrightnessToHealth(mudApp.myAvatar.health);
            }
        });

        function adjustBlurToStamina(stamina) {
            if(stamina < 25) {
                blurFilter1.blur = 3;
            } else if(stamina < 50) {
                blurFilter1.blur = 2;
            } else if(stamina < 75) {
                blurFilter1.blur = 1;
            } else {
                blurFilter1.blur = 0;
            }
        }
        function adjustBrightnessToHealth(health) {
              //  .blackAndWhite (true);
            if(health < 25) {
                //colorMatrix.blackAndWhite (true);
                colorMatrix.brightness(0.3, false)
            } else if(health < 50) {
                colorMatrix.brightness(0.6, false)
            } else if(health < 75) {
                colorMatrix.brightness(0.7, false)
            } else {
                colorMatrix.brightness(1, false)
            }
        }

        // to add the mainContainer to screen, with everything
        app.stage.addChild(mainContainer);
    });
}


function createLevel(app: PIXI.Application, parentContainer: PIXI.Container) {
    // Create a sprite for the background image
    const randomNumber = Math.floor(Math.random() * 4) + 1;
    const background = PIXI.Sprite.from(`assets/background/background_0${randomNumber}.png`);
    background.width = app.view.width;
    background.height = app.view.height;
    parentContainer.addChild(background);
}

function createHUD(app: PIXI.Application, parentContainer: PIXI.Container) {
    // Create a text element for the title
    const logo = PIXI.Sprite.from('assets/ui/sb_logo.png'); // this is the background image for the hud
    logo.scale.set(0.2); // scale the logo
    // logo.anchor.set(0.5); // Set the anchor to the center of the image
    logo.position.set(-25, 0); // Position the logo top left would be
    parentContainer.addChild(logo); // Put the logo straight into the parentContainer
    return logo;
}



function createPlayerHud(parentContainer: PIXI.Container) {

    const hudContainer = new PIXI.Container(); // this is the container for the hud
    parentContainer.addChild(hudContainer); // add the hudContainer to the parentContainer


    const hudBackground = PIXI.Sprite.from('assets/ui/hud_background.png'); // this is the background image for the hud
    hudBackground.anchor.set(0.5); // Set the anchor to the center of the image
    hudContainer.addChild(hudBackground); // Add the background image to the hudContainer

    const spritesArray = []; // Array to hold the sprites

    const intentIcons = [
        "assets/icons/dagger.png",
        "assets/icons/axe.png",
        "assets/icons/bow.png",
        "assets/icons/shield_heavy.png",
        "assets/icons/bomb.png"
    ]

    // Create and add sprites to the array
    let counter = 1;
    for(let intentEntry of intentIcons) {
        //`assets/icons/intent_0${i}.png`
        const sprite = PIXI.Sprite.from(intentEntry); // assets/icons/intent_1.png
        sprite.x = counter * 100;
        sprite.y = -3;
        sprite.scale.set(0.8);
        spritesArray.push(sprite);
        hudContainer.addChild(sprite);
        counter++;
    }

    const spriteCurrentIntent = PIXI.Sprite.from(intentIcons[0]); // assets/icons/intent_1.png
    spriteCurrentIntent.x = -100;
    spriteCurrentIntent.y = -100;
    spriteCurrentIntent.scale.set(1.3);
    spriteCurrentIntent.visible = false
    GLOBAL_VARS.scene.currentIntent = spriteCurrentIntent;
    hudContainer.addChild(spriteCurrentIntent);



    // Center the hudContainer
    hudContainer.position.set(parentContainer.width / 2 + 1230, 980);

    // Health Bar
    const healthBar = new PIXI.Graphics();
    healthBar.beginFill(0xcb2f2c); // Red
    healthBar.drawRect(0, 0, 380, 21); // position, width, height
    healthBar.endFill(); // Close the fill
    healthBar.x = -532; // Position the bar
    healthBar.y =3; // Position the bar 
    hudContainer.addChild(healthBar);

    // Dexterity Bar
    const staminaBar = new PIXI.Graphics();
    staminaBar.beginFill(0x52a9fb); // Blue
    staminaBar.drawRect(0, 0, 420, 22); // position, width, height
    staminaBar.endFill(); // Close the fill
    staminaBar.x = -572; // Position the bar
    staminaBar.y = 51; // Position the bar
    hudContainer.addChild(staminaBar);

    // Calculate the bounds of the hudContainer's children
    const bounds = hudContainer.getBounds();

    // Center the pivot of the hudContainer
    hudContainer.pivot.x = bounds.width / 2;
    hudContainer.pivot.y = bounds.height / 2;

    // Scale the hudContainer to contain all its children
    const scale = Math.max(bounds.width / hudContainer.width, bounds.height / hudContainer.height);
    hudContainer.scale.set(scale);

    // Update the HUD elements as needed
    function updateHUD(health: number, stamina: number) {
        // Update the health bar
        healthBar.width = health;
        staminaBar.width = stamina;
    }

    if (parentContainer) {
        parentContainer.addChild(hudContainer)
    }
    // Return the hudContainer and the updateHUD function
    return { hudContainer, updateHUD };
}


/**
 *
 * @param playerSprite
 */
function createPlayerStats(parentContainer: PIXI.Container) {

    // table to debug print the stats of an avatar
    const table = new PIXI.Container();
    //container.addChild(table);
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
        let statText = new PIXI.Text(`${stat.name}: ${stat.value}`, GLOBAL_VARS.textStyle);
        statText.position.y = statText.position.y + counterYDist * DISTANCE_BETWEEN_Y;
        table.addChild(statText);
        GLOBAL_VARS.pixiStats[stat.name] = statText;
        pixiRetElement.push(statText);
        counterYDist++;
    }
    let widthElements = pixiRetElement.map((x) => x.width)

    const tableWidth = Math.max(...widthElements);

    const tableHeight = 450;
    table.pivot.set(tableWidth / 2, tableHeight / 2); // set the pivot to the center of the table
    table.scale.set(0.5);

    table.position.x = app.screen.width - table.width-100;
    table.position.y = app.screen.height;
    /*
    playerSprite.on("click", () => {
        console.log("table", table)
        table.visible = !table.visible;
    });
    */

    if (parentContainer) {
        parentContainer.addChild(table)
    }

    // return mapping easy key value access to update
    return table;
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



// FIXME if function has app param it does not work, because view is empty
window.toggleFullscreen = toggleFullscreen;
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



