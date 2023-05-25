import * as PIXI from "pixi.js";
import {ANIMATIONS, GLOBAL_VARS} from "../../global";
import {generateAssetArray} from "./Assets";

export function createOpponents(app: PIXI.Application) {
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

export function createCharacter(app: PIXI.Application, assetName?: string, pos?: { x: number, y: number}, isObjectInteractive?: boolean ) {
    console.log("createCharacter", assetName, pos, isObjectInteractive);
    // Load the avatar image into a sprite
    if(!assetName) {
        assetName = "assets/goblin-gaylord.png";
        console.warn("createCharacter: assetName not set - use default=" + assetName)
    }
    const characterSprite = PIXI.Sprite.from(assetName);
    characterSprite.position.set(app.view.width / 2 - characterSprite.width / 2, app.view.height / 2 - characterSprite.height / 2); // center the avatar
    characterSprite.scale.set(1); // scale the avatar
    characterSprite.anchor.set(0.5); // set the anchor to the center of the avatar
    if(!pos) {
        pos = {x: app.view.width / 2, y: app.view.height / 2};
        console.warn("createCharacter: pos not set - use default app.view.width / 2, y: app.view.height / 2 =" + pos.toString())
    }
    characterSprite.position.set(pos.x, pos.y); // make sure that the avatar can't move outside of the screen

    // Toggle the visibility of the table on click
    if(isObjectInteractive === undefined) {
        isObjectInteractive = true;
        console.warn("createCharacter: isObjectInteractive not set - use default=" + isObjectInteractive)
    }
    characterSprite.interactive = isObjectInteractive;
    return characterSprite;
}

export function createPlayer(app: PIXI.Application) {
    return createCharacter(app,"assets/goblin-gaylord.png")
}

export function createPlayerAnimated(app: PIXI.Application, avatar) {
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

export function animatePlayer(playerSprite: PIXI.AnimatedSprite, avatar, animationType) {
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
