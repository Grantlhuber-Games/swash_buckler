// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Avatar, Health, Position } from "../codegen/Tables.sol";

contract BattleSystem is System {


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
