import BaseComponent from "./BaseComponent";
export default class Health extends BaseComponent {
    constructor(_component: any, _hook: Function) {
        super(_component, _hook);
        console.log("Health created and subscribed", this.component, this._hook)
    }
/*
    subscribe() {
        //components.Character
        this.component.update$.subscribe((update: any) => {
            const [nextValue, prevValue] = update.value;
            console.log("Character updated", update, { nextValue, prevValue });
            //let char = JSON.stringify(nextValue);
            //document.getElementById("character")!.innerHTML = char;

        });
    }

 */

}

