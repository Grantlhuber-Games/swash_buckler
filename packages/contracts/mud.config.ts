import { mudConfig } from "@latticexyz/world/register";

import CharModel from "./src/models/Char.mjs";
import AttributesModel from "./src/models/Attributes.mjs";
import HealthModel from "./src/models/Health.mjs";
import StaminaModel from "./src/models/Stamina.mjs";
import PositionModel from "./src/models/Position.mjs";

//import AvatarModel from "./src/models/Avatar.mjs";

import ActionModel from "./src/models/Action.mjs";

import CounterModel from "./src/models/Counter.mjs";

export default mudConfig({
  tables: {
    Char: CharModel.modelSchema,
    Attributes: AttributesModel.modelSchema,
    //Avatar: AvatarModel.modelSchema,
    Position: PositionModel.modelSchema,
    Health: HealthModel.modelSchema,
    Stamina: StaminaModel.modelSchema,
    Action: ActionModel.modelSchema,

    Counter: CounterModel.modelSchema
  }
});
