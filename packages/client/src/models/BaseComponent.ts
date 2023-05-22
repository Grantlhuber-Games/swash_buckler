export default class BaseComponent {
    constructor(_component: any, _subscribeHook: Function) {
        this.component = _component;
        this.subscribeHook = _subscribeHook;
        console.log("BaseComponent created", this.component)
        this.subscribe();
    }

    subscribe(subscribeHook: Function) {
        //components.Character
        this.component.update$.subscribe((update: any) => {
            const [nextValue, prevValue] = update.value;
            console.log("BaseComponent updated", update, { nextValue, prevValue });
            if(typeof this.subscribeHook === "function") {
                this.subscribeHook(update.value)
            }
            /*
            let char = JSON.stringify(nextValue);
            document.getElementById("character")!.innerHTML = char;
            */
        });
    }

    expose() {

    }
}