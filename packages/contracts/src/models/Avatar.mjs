/** mongoose like model definition **/

const model = {
    name: "Avatar",
    modelSchema: {
        // explicitly define an avatar
        keySchema: {},
        schema: {
            name: "string",
            human: "bool",
            charClass: "string",
            strength: "uint32",
            dexterity: "uint32",
            armor: "uint32"
        }
    }
}

export default model;