import * as PIXI from "pixi.js";
import attributes from "contracts/src/models/Attributes.mjs";

// PIXI_APP
let app = null;

const GLOBAL_VARS = {
    scene: {
        playerContainer: null,
        player: null,
    },

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
    ATTACK_01: { name: "Attack01", file: "attack_01", loop: false },
    DIE: { name: "Die", loop: false },
    IDLE: { name: "Idle", loop: true },
    RISE: { name: "Rise", loop: false },
    WALK: { name: "Walk", loop: true },
    //RESURRECT:   { name: "Resurrect" },
});


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

function createOpponents(app: PIXI.Application) {
    /*
    document.addEventListener("onOpponentsSpawned", myfunction(obj) {
        const playerSprite = PIXI.Sprite.from("assets/goblin-gaylord.png");
        playerSprite.position.set(app.view.width / 2 - playerSprite.width / 2, app.view.height / 2 - playerSprite.height / 2); // center the avatar
        playerSprite.scale.set(1); // scale the avatar
        playerSprite.anchor.set(0.5); // set the anchor to the center of the avatar
        playerSprite.position.set(app.view.width / 2, app.view.height / 2); // make sure that the avatar can't move outside of the screen

        // Toggle the visibility of the table on click
        playerSprite.interactive = true;
        return playerSprite;

    });
*/
    let jo = window.queryTest();
    console.log("createOpponents", jo)
    // Load the avatar image into a sprite

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
    console.log("createPlayerAnimated", avatar);
    if(!avatar || !avatar.isSpawned()) {
        return null;
    }

    const playerSprite = animatePlayer(null, avatar, ANIMATIONS.IDLE);
    //playerSprite.visible = false;
    GLOBAL_VARS.scene.player = playerSprite;

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
    const currentAction = avatar.getAction();

    if (currentAction === animationType.name && playerSprite) {
        return playerSprite;
    }


    const CHAR_CLASS = avatar.character.charClass || "archer";

    const PIXI_ASSETS = generateAssetArray(CHAR_CLASS); //Without only lvl assets
    //const PIXI_ASSETS = generateAssetArray(mudApp.getAvatar().character.charClass);
    /**/


    avatar.setAction(animationType.name);

    const animFile = animationType.file ? animationType.file : animationType.name.toLowerCase();
    const animations = PIXI.Assets.cache.get('assets/sprites/' + CHAR_CLASS + "/" + animFile + '.json').data.animations;
    console.log("playerSprite", playerSprite)

    let playerSpriteNew = PIXI.AnimatedSprite.fromFrames(animations[animationType.name]);
    // if playerSprit is set - change textures
    if (playerSprite) {
        playerSprite.textures = playerSpriteNew.textures;
    } else { // if it is not set instantiate it
        playerSprite = playerSpriteNew;
    }
    playerSprite.animationSpeed = 1 / 4                      // 6 fps
    console.log("playerSprite.loop", animationType.loop)
    //playerSprite.stop();
    playerSprite.loop = animationType.loop;
    playerSprite.play();
    //playerSprite.play();
    playerSprite.zIndex = 1000;
    return playerSprite;
}


function createPlayerHud(parentContainer: PIXI.Container) {

    const hudContainer = new PIXI.Container(); // this is the container for the hud
    parentContainer.addChild(hudContainer); // add the hudContainer to the parentContainer


    const hudBackground = PIXI.Sprite.from('assets/ui/hud_background.png'); // this is the background image for the hud
    hudBackground.anchor.set(0.5); // Set the anchor to the center of the image
    hudContainer.addChild(hudBackground); // Add the background image to the hudContainer

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

function addKeyboardHandler(app: PIXI.Application, playerSprite2: PIXI.Sprite, mudApp, pixiObjRet) {
    document.dispatchEvent(new Event("onRemoveKeyboardListener"));
    // KEYBOARD START
    // Set the width and height of our boxes
    const boxWidth = app.view.width / 100;
    const boxHeight = app.view.height / 100;
    let isAvatarFacingRight = true;

    // TODO add delegates
    function onKeyDown(key) {
        console.log("keydown", key);
        // W Key is 87
        // Up arrow is 87
        let playerSprite = GLOBAL_VARS.scene.player;

        if (key.keyCode === 87 || key.keyCode === 38) {
            // If the W key or the Up arrow is pressed, move the player up.
            if (playerSprite.position.y != 0) {
                // Don't move up if the player is at the top of the stage
                if(mudApp.myAvatar.stamina > 0) {
                    playerSprite.position.y -= boxHeight;
                    playerSprite = animatePlayer(playerSprite, mudApp.myAvatar, ANIMATIONS.WALK);
                    window.setPosition(Math.round(playerSprite.x), Math.round(playerSprite.y));
                    console.log("pixi mudApp.myAvatar.position", mudApp.myAvatar.position);
                } else {
                    playerSprite = animatePlayer(playerSprite, mudApp.myAvatar, ANIMATIONS.IDLE);
                }
            }
        }
        // S Key is 83
        // Down arrow is 40
        if (key.keyCode === 83 || key.keyCode === 40) {
            // If the S key or the Down arrow is pressed, move the player down.
            if (playerSprite.position.y != app.view.height - boxHeight) {
                if(mudApp.myAvatar.stamina > 0) {
                    // Don't move down if the player is at the bottom of the stage
                    playerSprite.position.y += boxHeight;
                    playerSprite = animatePlayer(playerSprite, mudApp.myAvatar, ANIMATIONS.WALK);
                    window.setPosition(Math.round(playerSprite.x), Math.round(playerSprite.y));
                    console.log("pixi mudApp.myAvatar.position", mudApp.myAvatar.position);
                } else {
                    playerSprite = animatePlayer(playerSprite, mudApp.myAvatar, ANIMATIONS.IDLE);
                }
            }

        }

        // A Key is 65
        // Left arrow is 37
        if (key.keyCode === 65 || key.keyCode === 37) {
            // If the A key or the Left arrow is pressed, move the player to the left.
            if (playerSprite.position.x != 0) {

                if(mudApp.myAvatar.stamina > 0) {
                    // Don't move to the left if the player is at the left side of the stage
                    playerSprite.position.x -= boxWidth
                    if (isAvatarFacingRight) {
                        playerSprite.scale.x *= -1; // Flip the avatar image horizontally
                        isAvatarFacingRight = false;
                    }
                    playerSprite = animatePlayer(playerSprite, mudApp.myAvatar, ANIMATIONS.WALK);
                    window.setPosition(Math.round(playerSprite.x), Math.round(playerSprite.y));
                    console.log("pixi mudApp.myAvatar.position", mudApp.myAvatar.position);
                } else {
                    playerSprite = animatePlayer(playerSprite, mudApp.myAvatar, ANIMATIONS.IDLE);
                }
            }
        }

        // D Key is 68
        // Right arrow is 39
        if (key.keyCode === 68 || key.keyCode === 39) {
            // If the D key or the Right arrow is pressed, move the player to the right.
            if (playerSprite.position.x != app.view.width - boxWidth) {
                // Don't move to the right if the player is at the right side of the stage
                /*
                let newPositionX = playerSprite.position.x
                newPositionX += boxWidth
                */
                if(mudApp.myAvatar.stamina > 0) {
                    playerSprite.position.x += boxWidth
                    if (!isAvatarFacingRight) {
                        playerSprite.scale.x *= -1; // Flip the avatar image horizontally
                        isAvatarFacingRight = true;
                    }
                    playerSprite = animatePlayer(playerSprite, mudApp.myAvatar, ANIMATIONS.WALK);
                    window.setPosition(Math.round(playerSprite.x), Math.round(playerSprite.y));
                    console.log("pixi mudApp.myAvatar.position", mudApp.myAvatar.position);
                    //playerSprite.position.x = newPositionX;
                } else {
                    playerSprite = animatePlayer(playerSprite, mudApp.myAvatar, ANIMATIONS.IDLE);
                }
            }
        }

        // action buttons

        // Y Key is 89
        if (key.keyCode === 89) {
            console.warn("soft Fight call hurt 20 (addintent + wait 5 sec + removeintent)");
            window.addIntent(1);
            window.hurt(20);
            playerSprite = animatePlayer(playerSprite, mudApp.myAvatar, ANIMATIONS.ATTACK_01);
            setTimeout(() => {

                window.removeIntent(true);
            }, 5000);

        }
        // X key is 88
        if (key.keyCode === 88) {
            console.warn("hard Fight call hurt 50 (addintent + wait 5 sec + removeintent)");
            window.addIntent(2)
            window.hurt(50);
            playerSprite = animatePlayer(playerSprite, mudApp.myAvatar, ANIMATIONS.ATTACK_01);
            setTimeout(() => {

                window.removeIntent(true);
            }, 5000);
        }
        // C key is 67
        if (key.keyCode === 67) {
            console.log("counter attack with c");
        }
        // V key is 86
        if (key.keyCode === 86) {
            console.log("special ability with V");
        }

        // move to gameloop

        document.dispatchEvent(new Event("onStatsChanged"));

    }
    // Add the 'keydown' event listener to our document
    document.addEventListener("keydown", onKeyDown);

    document.addEventListener("onRemoveKeyboardListener", () => {
        document.removeEventListener("keydown", onKeyDown)

    }, { once: true});

    //KEYBOARD END
}

function addStatsChangeHandler(app: PIXI.Application, playerSprite: PIXI.Sprite, mudApp, pixiObjRet) {

    const onStatsChanged = (event) => {
        console.log("onStatsChanged", event);
        const character = mudApp.myAvatar.character;
        const attributes = mudApp.myAvatar.attributes;

        // hud.updateHUD(mudApp.myAvatar.health, mudApp.myAvatar.stamina); // here we update the HUD with the current values
        GLOBAL_VARS.scene.hud.updateHUD(mudApp.myAvatar.health, mudApp.myAvatar.stamina); // here we update the HUD with 100 health and 50 stamina
        // console.log("hud", hud); // here we can see the hudContainer and the updateHUD function

/*
        pixiObjRet["Name"].text = `Name (Class): ${character.name} (${character.charClass})`;
        pixiObjRet["Attributes"].text = `Attributes (St, Dex, Mana, Armor, Speed): ${attributes.strength}, ${attributes.dexterity}, ${attributes.mana}, ${attributes.armor}, ${attributes.speed}`;
        pixiObjRet["Position"].text = `Position: ${mudApp.myAvatar.position.x}, ${mudApp.myAvatar.position.y}`;
        pixiObjRet["Stamina"].text = `Stamina: ${mudApp.myAvatar.stamina}`;
        pixiObjRet["Health"].text = `Health: ${mudApp.myAvatar.health}`;
*/
        if (mudApp.myAvatar.health <= 0) {
            playerSprite = createPlayerAnimated(playerSprite, mudApp.myAvatar, ANIMATIONS.DIE);
        }

    };
    //playerSprite.on('onStatsChanged', onStatsChanged);

    document.addEventListener("onStatsChanged", onStatsChanged);


    document.addEventListener("onPlayerCreated", (event)=> {
        console.warn("onPlayerCreated");

    });

    document.addEventListener("onPlayerSpawned", (event)=> {
        const PIXI_ASSETS = generateAssetArray(mudApp.getAvatar().character.charClass);
        PIXI.Assets.load(PIXI_ASSETS).then(() => {
            let playerSprite = createPlayerAnimated(app, mudApp.myAvatar);
            GLOBAL_VARS.scene.playerContainer.addChild(playerSprite);

            addKeyboardHandler(app, playerSprite, mudApp, GLOBAL_VARS.pixiStats);
        })

    });

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



/**
 *
 * @param charClass
 */
function generateAssetArray(charClass?: string) {
    console.log("generateAssetArray", charClass)
    const assets = [
        "assets/background/background_01.png",
        "assets/background/background_02.png",
        "assets/background/background_03.png",
        "assets/background/background_04.png"
    ];
    if(charClass) {
        /*
                this will be added automatically
                "assets/sprites/archer/idle.json",
                "assets/sprites/archer/die.json",
                "assets/sprites/archer/rise.json",
                "assets/sprites/archer/walk.json",
                "assets/sprites/archer/attack_01.json",
        */

        const classesAll = [
            "archer",
            "bandit",
            "death_knight",
            "necromancer",
            "warlock",
            "warrior"
        ];

        if(!classesAll.includes(charClass)) {
            console.error("charClass=" + charClass + " is not support atm.");
            throw Error("charClass=" + charClass + " is not support atm.");
        }

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
    }

    console.warn("generateAssets", assets)
    return assets;
}

