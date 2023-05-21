/** mongoose like model definition **/

const model = {
    name: "Avatar",
    modelSchema: {
        // explicitly define an avatar
        //keySchema: {}, // defaults to a single bytes32 key if no keySchema is provided.
        schema: {
            human: "bool",
            charClass: "string",
            /*
            // FIXME eventually split up player (general stats and attributes) and avatar (battle instance)
            intents: "uint8", // could be the index of the specified action
            actions: "bytes32[2]" // available/selected actions (default soft and hard attack, counter, special)
            */
        }
    }
}

export default model;