/** mongoose like model definition **/
const model = {
    name: "Attributes",
    modelSchema: {
        //keySchema: {},
        schema: {
            strength: "uint32",
            dexterity: "uint32",
            mana: "uint32",
            armor: "uint32",
            speed: "uint32"
        }
    }
}

export default model;