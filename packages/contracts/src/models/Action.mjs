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
            costsStaminaExpired: "uint32", // stamina costs
            /*
                        baseDamage: "uint32", //
                        costsStaminaUsed: "uint32", // stamina costs

                        usages: "int8", // negative value means infinite
                        activityLength: "uint32", // how long an intent is active currently in blocks due to time blockchain issue
                        name: "string"

             */
        }
    }
}

export default model;