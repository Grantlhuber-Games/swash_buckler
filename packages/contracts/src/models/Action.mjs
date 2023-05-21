/** mongoose like model definition **/

const
  model = {
    name: "Action",
    modelSchema: {
        // explicitly define an avatar
        keySchema: {
            id: "uint8" // explicitly no avatar msg.sender
        },
        schema: {
            //TODO effects such as counter attack
            minLvl: "uint32",
            baseDamage: "uint32", //
            costsStaminaUsed: "uint32", // stamina costs
            costsStaminaExpired: "uint32", // stamina costs
            name: "string"
            /*
            usages: "int8", // negative value means infinite
            activityLength: "uint32" // how long an intent is active currently in blocks due to time blockchain issue
            */
        }
    }
}

export default model;