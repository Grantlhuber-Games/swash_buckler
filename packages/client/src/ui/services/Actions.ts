// TODO add characterSprite to avatar
import {animatePlayer} from "./Character";
import {ANIMATIONS, GLOBAL_VARS} from "../../global";

//TODO add enums

export function executeAction(app, characterSprite, avatar, actionEnum) {
    // check stamina
    // execute action
}

export function moveUp(app, characterSprite, avatar, boxHeight) {
    console.log("Actions: moveUp", characterSprite, avatar, boxHeight)
    if (characterSprite.position.y != 0) {
        // Don't move up if the player is at the top of the stage
        if(avatar.stamina > 0) {
            characterSprite.position.y -= boxHeight;
            characterSprite = moveAction(characterSprite, avatar);
        } else {
            characterSprite = idleAction(characterSprite, avatar);
        }
    }
    return characterSprite;
}

export function moveDown(app, characterSprite, avatar, boxHeight) {
    console.log("Actions: moveUp", characterSprite, avatar, boxHeight)
    if (characterSprite.position.y != app.view.height - boxHeight) {
        // Don't move up if the player is at the top of the stage
        if(avatar.stamina > 0) {
            characterSprite.position.y += boxHeight;
            characterSprite = moveAction(characterSprite, avatar);
        } else {
            characterSprite = idleAction(characterSprite, avatar);
        }
    }
    return characterSprite;
}

export function softAttack(app, characterSprite, avatar) {
    console.log("hard Fight call hurt 50 (addintent + wait 5 sec + removeintent)");
    window.addIntent(2);
    GLOBAL_VARS.scene.currentIntent.visible = true;
    window.hurt(10);

    setTimeout(() => {
        GLOBAL_VARS.scene.currentIntent.visible = false;
        characterSprite = animatePlayer(GLOBAL_VARS.scene.player, avatar, ANIMATIONS.ATTACK_01);
        window.removeIntent(true);
    }, 3000);
}

export function hardAttack(app, characterSprite, avatar) {
    console.log("hard Fight call hurt 50 (addintent + wait 5 sec + removeintent)");
    window.addIntent(2);
    GLOBAL_VARS.scene.currentIntent.visible = true;
    window.hurt(20);

    setTimeout(() => {
        GLOBAL_VARS.scene.currentIntent.visible = false;
        characterSprite = animatePlayer(GLOBAL_VARS.scene.player, avatar, ANIMATIONS.ATTACK_01);
        window.removeIntent(true);
    }, 3000);
}

function moveAction(characterSprite, avatar) {
    characterSprite = animatePlayer(characterSprite, avatar, ANIMATIONS.WALK);
    window.setPosition(Math.round(characterSprite.x), Math.round(characterSprite.y));
    console.log("Actions: moveAction avatar.position", avatar.position);
    return characterSprite;
}

function idleAction(characterSprite, avatar) {
    return animatePlayer(characterSprite, avatar, ANIMATIONS.IDLE);
}