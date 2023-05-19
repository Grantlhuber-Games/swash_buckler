import { mount as mountDevTools } from "@latticexyz/dev-tools";
import { setup } from "../mud/setup";

export default async function setupMud() {
    // abstract
    const {
        components,
        systemCalls: { increment, setPosition },
    } = await setup();

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

    (window as any).setPosition = async (x: number, y: number) => {
        console.log("new counter value:", await setPosition(x, y));
    };

    mountDevTools();
}