// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { IWorld } from "../codegen/world/IWorld.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { Intent, Action, ActionData } from "../codegen/Tables.sol";

// TODO add other requirements such as usages, minLvl etc.
contract IntentSystem is System {

  /**
    * @dev add intent
    * @param actionId action id
    */
  function addIntent(uint8 actionId) public requireIntentIsEmpty requireHasAction(actionId)  returns (uint8) {
    address worldAddress = _world();
    IWorld world = IWorld(worldAddress);

    ActionData memory actionData = world.getActionById(actionId);
    require(world.hasSufficientStamina(actionData.costsStaminaUsed), "Not enough stamina.");

    Intent.setIntents(actionId);
    world.exhaust(actionData.costsStaminaExpired);
    return actionId;
  }

  /**
    * @dev remove intent
    * @param used if intent was used
    */
  function removeIntent( bool used) public {
    address worldAddress = _world();
    IWorld world = IWorld(worldAddress);

    uint8 actionId = Intent.getIntents();// get action to fetch costs

    ActionData memory actionData = world.getActionById(actionId);

    Intent.setIntents(0);
    if(used) {
      uint32 restCosts = actionData.costsStaminaUsed - actionData.costsStaminaExpired;
      world.exhaust(restCosts);
    }
  }

  /********************************************************************************************/
  /*                                       UTILITY FUNCTIONS                                  */
  /********************************************************************************************/
  // TODO add entity id bytes32 playerKey
  function hasAction(uint8 actionId) public view returns (bool) {
    bool doesListContainElement = false;
    uint8[2] memory actionList = Intent.getActions();
    for (uint i=0; i < actionList.length; i++) {
      if (actionId == actionList[i]) {
        return true;
      }
    }
    return false;
  }

  /********************************************************************************************/
  /*                                       FUNCTION MODIFIERS                                 */
  /********************************************************************************************/
  // TODO add entity id bytes32 playerKey
  modifier requireHasAction(uint8 actionId)
  {
    require(hasAction(actionId), "Action is not available.");
    _;
  }

  modifier requireIntentIsEmpty()
  {
    require(Intent.getIntents() == 0, "Intent is not empty.");
    _;
  }
}
