import { mudConfig } from "@latticexyz/world/register";

import CharacterModel from "./src/models/Character.mjs";
import AttributesModel from "./src/models/Attributes.mjs";
import PositionModel from "./src/models/Position.mjs";
import HealthModel from "./src/models/Health.mjs";
import StaminaModel from "./src/models/Stamina.mjs";
import IntentModel from "./src/models/Intent.mjs";

import ActionModel from "./src/models/Action.mjs";

import CounterModel from "./src/models/Counter.mjs";

export default mudConfig({
  tables: {
    Character: CharacterModel.modelSchema,
    Attributes: AttributesModel.modelSchema,
    Position: PositionModel.modelSchema,
    Health: HealthModel.modelSchema,
    Stamina: StaminaModel.modelSchema,
    Intent: IntentModel.modelSchema,

    Action: ActionModel.modelSchema,



    Counter: CounterModel.modelSchema
  }
});
