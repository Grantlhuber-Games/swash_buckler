import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  tables: {
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
  },
});
