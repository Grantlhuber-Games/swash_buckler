import { mount as mountDevTools } from "@latticexyz/dev-tools";
import { setup } from "../mud/setup";
import { runQuery, Has, HasValue, getComponentValueStrict } from "@latticexyz/recs";

export default async function setupMud() {
    // abstract
    const {
        components,
        systemCalls: { increment, setPosition, hurt, heal, kill, revive, refill, getActions },
    } = await setup();

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




    // Just for demonstration purposes: we create a global function that can be
    // called to invoke the Increment system contract via the world. (See IncrementSystem.sol.)
    (window as any).increment = async () => {
        console.log("new counter value:", await increment());
    };

    components.Position.update$.subscribe((update: any) => {
        const [nextValue, prevValue] = update.value;
        console.log("Position updated", update, { nextValue, prevValue });
        let coord = String(nextValue?.x ?? "unset") + ", " + String(nextValue?.y ?? "unset");
        document.getElementById("position")!.innerHTML = coord;
    });

    (window as any).setPosition = async (x: number, y: number) => {
        console.log("new position:", await setPosition(x, y));
    };


    components.Health.update$.subscribe((update: any) => {
        const [nextValue, prevValue] = update.value;
        console.log("Health updated", update, { nextValue, prevValue });
        document.getElementById("health")!.innerHTML = String(nextValue?.health ?? "unset");
    });

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

    (window as any).getActions = async () => {
        console.log("getActions:", await getActions());
    };
    (window as any).getHealth = async () => {
        console.log("getHealth:", await components.Health);
    };


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