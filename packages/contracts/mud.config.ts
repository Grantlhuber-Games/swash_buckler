import { mudConfig } from "@latticexyz/world/register";
import { model } from "./src/models/Health";
export default mudConfig({
  tables: {
    Health: {
      keySchema: {},
      schema: {
        health: "uint32"
      }
    },
    //model.modelSchema,
    Position: {
      keySchema: {},
      schema: {
        x: "int32",
        y: "int32"
      }
    },
    Counter: {
      keySchema: {},
      schema: "uint32",
    }
  }
});
