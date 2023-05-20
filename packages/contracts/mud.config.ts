import { mudConfig } from "@latticexyz/world/register";

import AvatarModel from "./src/models/Avatar.mjs";
import HealthModel from "./src/models/Health.mjs";
import StaminaModel from "./src/models/Stamina.mjs";
import PositionModel from "./src/models/Position.mjs";
import CounterModel from "./src/models/Counter.mjs";

export default mudConfig({
  tables: {
    // explicitly define an avatar
    Avatar: AvatarModel.modelSchema,
    Position: PositionModel.modelSchema,
    Health: HealthModel.modelSchema,
    Stamina: StaminaModel.modelSchema,
    Counter: CounterModel.modelSchema
  }
});
