import * as PIXI from "pixi.js";
import {GLOBAL_VARS, ANIMATIONS} from "../../global";
import {generateAssetArray} from "./Assets";
import {createPlayerAnimated, animatePlayer} from "./Character";
import {moveUp, moveDown, softAttack, hardAttack} from "./Actions";

export function addKeyboardHandler(app: PIXI.Application, playerSprite2: PIXI.Sprite, mudApp, pixiObjRet) {
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
      playerSprite = moveUp(app, playerSprite, mudApp.myAvatar, boxHeight );
    }
    // S Key is 83
    // Down arrow is 40
    if (key.keyCode === 83 || key.keyCode === 40) {
      // If the S key or the Down arrow is pressed, move the player down.
      playerSprite = moveDown(app, playerSprite, mudApp.myAvatar, boxHeight );
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
      playerSprite = softAttack(app, playerSprite, mudApp.myAvatar);

    }
    // X key is 88
    if (key.keyCode === 88) {
      playerSprite = hardAttack(app, playerSprite, mudApp.myAvatar);
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

export function addStatsChangeHandler(app: PIXI.Application, playerSprite: PIXI.Sprite, mudApp, pixiObjRet) {

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
      playerSprite = animatePlayer(GLOBAL_VARS.scene.player, mudApp.myAvatar, ANIMATIONS.DIE);
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

