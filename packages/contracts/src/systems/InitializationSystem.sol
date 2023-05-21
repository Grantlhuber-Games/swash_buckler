// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Action, ActionData } from "../codegen/Tables.sol";

contract InitializationSystem is System {


  // post deploy ....
  function initActions() public {
    //bytes32 actionId = bytes32(keccak256("attack"));


    Action.set( 1, ActionData({
      minLvl: 2,
      baseDamage: 3,
      costsStaminaUsed: 10,
      costsStaminaExpired: 2,
      usages: -1, // negative value means infinite
      activityLength: 6,
      name: "attack (soft)"
    }));
    Action.set( 2, ActionData({
      minLvl: 2,
      baseDamage: 6,
      costsStaminaUsed: 30,
      costsStaminaExpired: 10,
      usages: -1,
      activityLength: 3,
      name: "attack (hard)"
    }));
    // ActionData memory jo = Action.get(actionId);

  }
}
