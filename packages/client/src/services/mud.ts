import { mount as mountDevTools } from "@latticexyz/dev-tools";
import { setup } from "../mud/setup";
import { runQuery, Has, HasValue, getComponentValueStrict } from "@latticexyz/recs";

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
    });



    components.Attributes.update$.subscribe((update: any) => {
        const [nextValue, prevValue] = update.value;
        console.log("Attributes updated", update, { nextValue, prevValue });
        let attribs = JSON.stringify(nextValue);
        document.getElementById("attributes")!.innerHTML = attribs;
    });

    components.Stamina.update$.subscribe((update: any) => {
        const [nextValue, prevValue] = update.value;
        console.log("Stamina updated", update, { nextValue, prevValue });
        let stamina = JSON.stringify(nextValue);
        document.getElementById("stamina")!.innerHTML = stamina;
    });

    // alternative you can get
    //components.Action.get(bytes32(keccak256("some.key")));
    // Components expose a stream that triggers when the component is updated.
    components.Action.update$.subscribe((update: any) => {
        const [nextValue, prevValue] = update.value;
        console.log("Action updated", update, { nextValue, prevValue });
    });


    // Components expose a stream that triggers when the component is updated.
    components.Counter.update$.subscribe((update: any) => {
        const [nextValue, prevValue] = update.value;
        console.log("Counter updated", update, { nextValue, prevValue });
        document.getElementById("counter")!.innerHTML = String(nextValue?.value ?? "unset");
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
            setPosition,
            hurt,
            heal,
            kill,
            revive,
            refill,
            getActionById,
            createPlayer
        },
    } = mudObj;

    (window as any).increment = async () => {
        console.log("new counter value:", await increment());
    };
    window.mud =  window.mud || {};
    // Just for demonstration purposes: we create a global function that can be
    // called to invoke the Increment system contract via the world. (See IncrementSystem.sol.)


    (window as any).getActionById = async (actionId: number) => {
        console.log("getActionById:", await getActionById(actionId));
    };

    (window as any).createPlayer = async (name: string) => {
        console.log("new counter value:", await createPlayer(name));
    };

    (window as any).setPosition = async (x: number, y: number) => {
        mudApp.myAvatar.position = { x, y };
        console.log("mudApp.myAvatar.position", mudApp.myAvatar.position);
        console.log("new position:", await setPosition(x, y));
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
}
