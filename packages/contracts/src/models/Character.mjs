/** mongoose like model definition **/

const
  model = {
    name: "Char",
    modelSchema: {
        keySchema: {},
        schema: {
            human: "bool",
            name: "string",
            description: "string",
            charClass: "string"
        }
    }
}

export default model;