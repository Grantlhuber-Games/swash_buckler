/** mongoose like model definition **/
const model = {
    name: "Health",
    modelSchema: {
        keySchema: {
           // id: "uint8" // explicitly no avatar msg.sender
        },
        schema: {
            health: "uint32"
        }
    }
}

export default model;