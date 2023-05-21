/** mongoose like model definition **/

const
  model = {
    name: "Intent",
    modelSchema: {
        keySchema: { },
        schema: {
            // FIXME eventually split up player (general stats and attributes) and avatar (battle instance)
            intents: "uint8", // could be the index of the specified action
            actions: "bytes32[2]" // available/selected actions (default soft and hard attack, counter, special)
        }
    }
}

export default model;