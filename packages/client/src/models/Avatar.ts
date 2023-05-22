// TODO add enums for charType
export default class Avatar {
    constructor(_characterObj, _attributesObj, _position, _health, _stamina, _intentObj) {
        this.character = {
            name: _characterObj.name,
            human: _characterObj.human,
            description: _characterObj.description,
            charClass: _characterObj.charClass
        }

        this.attributes = {
            strength: _attributesObj.strength,
            dexterity: _attributesObj.dexterity,
            mana: _attributesObj.mana,
            armor: _attributesObj.armor,
            speed: _attributesObj.speed
        }
        this.position = _position;
        this.health = _health;
        this.stamina = _stamina;
        this.intent = {
            intents: _intentObj.intents,
            actions: _intentObj.actions,
        }
        this.spawned = false;

        // js only
        this.action = "Idle";

    }

    private setCharacterByField(_name, _human, _description, _charClass) {
        console.log("avatar: setCharacter", _name, _human, _description, _charClass)
        this.character = {
            name: _name,
            human: _human,
            description: _description,
            charClass: _charClass
        }
    }

    /**
     * Contains the current animation.name
     * @param newAction
     */
    public setAction(newAction: string) {
        this.action = newAction;
    }
    public getAction() {
        return this.action;
    }
    public setCharacter(obj: any) {
        console.log("avatar: setCharacterByObject", obj)
       this.character = JSON.parse(JSON.stringify(obj));
    }

    public setAttributes(obj: any) {
        console.log("avatar: setAttributes", obj)
        this.attributes = JSON.parse(JSON.stringify(obj));
    }

    public setIntent(obj: any) {
        console.log("avatar: setIntent", obj)
        this.intent = JSON.parse(JSON.stringify(obj));
    }

/*
    get name() {
        return this.name;
    }

    set name(_name) {
        this.name = _name;
    }

    get position() {
        return this.position;
    }

    set position(_position) {
        this.position = _position;
    }

    get health() {
        return this.health;
    }

    set health(_health) {
        this.health = _health;
    }

    get stamina() {
        return this.stamina;
    }

 */
}