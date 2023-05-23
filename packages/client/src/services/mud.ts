import { mount as mountDevTools } from "@latticexyz/dev-tools";
import { setup } from "../mud/setup";
import { runQuery, Has, HasValue, Not, getComponentValueStrict } from "@latticexyz/recs";




import CharacterComponent from "../models/Character";

export default async function setupMud(mudApp) {
    /*
    // abstract
    const {
        components,
        systemCalls: {
            increment,
            setPosition,
            hurt,
            heal,
            kill,
            revive,
            refill,
            getActionById,
            createPlayer
        },
    } = await setup();
    */
    const mudObj = await setup();
    const components = mudObj.components;
    const systemCalls = mudObj.systemCalls;

    subscribeToComponents(mudApp, components);

    registerWindowFunctions(mudApp, mudObj);

    mountDevTools();



}


/*
* All subscriptions
* @param mudApp
* @param mudObj
*/
function subscribeToComponents(mudApp, components: any) {
    /*
     components.Character.update$.subscribe((update: any) => {
         const [nextValue, prevValue] = update.value;
         console.log("Character updated", update, { nextValue, prevValue });
         let char = JSON.stringify(nextValue);
         document.getElementById("character")!.innerHTML = char;
     });
    */
    let charComp = new CharacterComponent(components.Character, (update: any) => {
        let char = JSON.stringify(update);
        document.getElementById("character")!.innerHTML = char;
        console.log("Character updated", update);
        mudApp.myAvatar.setCharacter(update[0]);
    });

    components.Attributes.update$.subscribe((update: any) => {
        const [nextValue, prevValue] = update.value;
        console.log("Attributes updated", update, { nextValue, prevValue });
        let attribs = JSON.stringify(nextValue);
        document.getElementById("attributes")!.innerHTML = attribs;
        mudApp.myAvatar.setAttributes(nextValue);

    });

    components.Position.update$.subscribe((update: any) => {
        const [nextValue, prevValue] = update.value;
        console.log("Position updated", update, { nextValue, prevValue });
        let coord = String(nextValue?.x ?? "unset") + ", " + String(nextValue?.y ?? "unset");
       document.getElementById("position")!.innerHTML = coord;
    });

    components.Health.update$.subscribe((update: any) => {
        const [nextValue, prevValue] = update.value;
        console.log("Health updated", update, { nextValue, prevValue });
        document.getElementById("health")!.innerHTML = String(nextValue?.health ?? "unset");
        mudApp.myAvatar.health = nextValue?.health;
        console.log("mudApp.myAvatar", mudApp.myAvatar)
    });

    components.Intent.update$.subscribe((update: any) => {
        const [nextValue, prevValue] = update.value;
        console.log("Intent updated", update, { nextValue, prevValue });
        let intent = JSON.stringify(nextValue);
        document.getElementById("intent")!.innerHTML = intent;
        mudApp.myAvatar.setIntent(nextValue);
    });

    components.Stamina.update$.subscribe((update: any) => {
        const [nextValue, prevValue] = update.value;
        console.log("Stamina updated", update, { nextValue, prevValue });
        let stamina = JSON.stringify(nextValue);
        document.getElementById("stamina")!.innerHTML = stamina;
        mudApp.myAvatar.stamina = nextValue?.stamina;
    });

    // alternative you can get
    //components.Action.get(bytes32(keccak256("some.key")));
    // Components expose a stream that triggers when the component is updated.
    components.Action.update$.subscribe((update: any) => {
        const [nextValue, prevValue] = update.value;
        let actions = JSON.stringify(nextValue);
        document.getElementById("actions")!.innerHTML = actions;
         console.log("Action updated", actions);
    });

    // Components expose a stream that triggers when the component is updated.
    components.Avatar.update$.subscribe((update: any) => {
        const [nextValue, prevValue] = update.value;
        let avatar = JSON.stringify(nextValue);
        document.getElementById("avatar")!.innerHTML = avatar;
        console.log("Avatar updated", update, { nextValue, prevValue });
        mudApp.myAvatar.setSpawned(nextValue?.spawned);
    });

    // Components expose a stream that triggers when the component is updated.
    components.Counter.update$.subscribe((update: any) => {
        const [nextValue, prevValue] = update.value;
        console.log("Counter updated", update, { nextValue, prevValue });
        document.getElementById("counter")!.innerHTML = String(nextValue?.value ?? "unset");
    });
}

/**
 * Register for windows functions
 * @param mudApp
 * @param mudObj
 */
function registerWindowFunctions(mudApp, mudObj: any) {
    const {
        components,
        systemCalls: {
            increment,
            //position system
            setPosition,
            //health system
            hurt,
            heal,
            kill,
            revive,
            refill,

            // stamina system
            exhaust,
            rest,
            drain,
            refillStamina,
            hasSufficientStamina,
            isExhausted,
            isFresh,

            //intent system
            addIntent,
            removeIntent,

            //action system
            getActionById,

            //player system
            createPlayer,
            spawnPlayer
        },
    } = mudObj;

    (window as any).queryTest = () => {
        /*
 //const { PlayerComponent, PositionComponent, NameComponent } = components
// query for all named players at the center of the universe
 const matchingEntities = runQuery([
     Has(components.Counter)
 ])
// now you can map these to their name as an example
console.log("matchingEntities", matchingEntities)
// -> ["Bob", "Alice", "Eve"]
*/
        const { Character, Attributes, Position } = components
        const matchingEntities = runQuery([
            Has(Character) /** All entities with a Player component */,
            Has(Attributes) /** All entities with a Player component */,
            Has(Position) /** All entities with a Player component */,
        ]);
        console.log("matchingEntities", matchingEntities)
        const matchArray = Array.from(matchingEntities);
        const characterArray = matchArray.map(playerEntity => getComponentValueStrict(Character, playerEntity ));
        console.log("characterArray", characterArray)


        const posArray = matchArray.map(playerEntity => getComponentValueStrict(Position, playerEntity ));
        console.log("posArray", posArray)
        /*
        const attribs = matchArray.map(playerEntity => getComponentValueStrict(Attributes, playerEntity ));
        console.log("attribs", attribs)

         */
        return {
            characterArray,
            posArray
        }
    }


    (window as any).increment = async () => {
        console.log("new counter value:", await increment());
    };
    window.mud =  window.mud || {};
    // Just for demonstration purposes: we create a global function that can be
    // called to invoke the Increment system contract via the world. (See IncrementSystem.sol.)


    (window as any).getActionById = async (actionId: number) => {
        console.log("getActionById:", await getActionById(actionId));
    };

    (window as any).createPlayer = async (name: string, charType: string) => {
        //let sign = prompt("What's your name?");

        console.log("new player:", await createPlayer(name, charType));
        document.dispatchEvent(new CustomEvent("onPlayerCreated",
            {
                detail:
                    {
                        name: name,
                        charType: name
                    }
            }));
    };

    (window as any).spawnPlayer = async (x: number, y: number) => {
        let retSpawn = await spawnPlayer(x, y);
        console.log("spawnPlayer:", retSpawn);
        document.dispatchEvent(new Event("onPlayerSpawned"));
    };


    (window as any).setPosition = async (x: number, y: number) => {
        if(mudApp.myAvatar.stamina > 0) {
            mudApp.myAvatar.position = { x, y };
            console.log("mudApp.myAvatar.position", mudApp.myAvatar.position);
            console.log("new position:", await setPosition(x, y));
        }
    };

    window.mud.healthSystem = window.mud.healthSystem || {};
    window.mud.healthSystem = {};

    window.mud.healthSystem.heal = async (x: number) => {
        console.log("heal:", await heal(x));
    }
    // health system
    (window as any).heal = async (x: number) => {
        console.log("heal:", await heal(x));
    };

    (window as any).hurt = async (x: number) => {
        console.log("heal:", await hurt(x));
    };

    (window as any).kill = async () => {
        console.log("heal:", await kill());
    };

    (window as any).refill = async () => {
        console.log("heal:", await refill());
    };

    (window as any).revive = async () => {
        console.log("heal:", await revive());
    };

    (window as any).getHealth = async () => {
        console.log("getHealth:", await components.Health);
    };

    // stamina system

    (window as any).exhaust = async (x: number) => {
        console.log("exhaust:", await exhaust(x));
    };

    (window as any).rest = async (x: number) => {
        console.log("rest:", await rest(x));
    };
    (window as any).refillStamina = async () => {
        console.log("refillStamina:", await refillStamina());
    };

    (window as any).drain = async () => {
        console.log("drain:", await drain());
    };

    (window as any).hasSufficientStamina = async (x: number) => {
        console.log("drain:", await hasSufficientStamina(x));
    };

    (window as any).isExhausted = async () => {
        console.log("drain:", await isExhausted());
    };

    (window as any).isFresh = async () => {
        console.log("drain:", await isFresh());
    };

    //intent system
    (window as any).addIntent = async (actionId: number) => {
        console.log("drain:", await addIntent(actionId));
    };
    (window as any).removeIntent = async (used: boolean) => {
        console.log("drain:", await removeIntent(used));
    };

}
