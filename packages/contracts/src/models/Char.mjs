/** mongoose like model definition **/

const
  model = {
    name: "Char",
    modelSchema: {
        keySchema: {},
        schema: {
            name: "string",
            description: "string",
            human: "bool",
            charClass: "string"
        }
    }
}

export default model;