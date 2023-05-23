// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Health, Position, Action, Intent } from "../codegen/Tables.sol";
import { ActionData } from "../codegen/tables/Action.sol";
import { addressToEntityKey } from "../addressToEntityKey.sol";

contract BattleSystem is System {

  // check if other players are in range and if intent loaded
  // if both loaded speed higher strikes first

  function getActionById(uint8 actionId) public view returns (ActionData memory _table) {
    //bytes32 actionId = bytes32(keccak256("attack"));
    ActionData memory actionData = Action.get(actionId);
    return actionData;
  }
  /*
  function getActions() public view returns (string memory) {
    //bytes32 actionId = bytes32(keccak256("attack"));
    uint8 actionId = 1;
    string memory jo = Action.get(actionId);
    return jo;
  }
*/


  function intend() public {

  }

  function attack(bytes32 target) public {
    //bytes32 player = addressToEntity(_msgSender());
    //Avatar.set(target);
  }

  function counterAttack(bytes32 target) public {
    //bytes32 player = addressToEntity(_msgSender());

    //Avatar.set(target);
  }
}
