/** mongoose like model definition **/
const
  model = {
    name: "Intent",
    modelSchema: {
        // keySchema: { },
        schema: {
            // FIXME eventually split up player (general stats and attributes) and avatar (battle instance)
            intents: "uint8", // could be the index of the specified action
            actions: "uint8[4]" // available/selected actions (default soft and hard attack, counter, special)
        }
    }
}

export default model;