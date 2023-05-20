// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Avatar, Position } from "../codegen/Tables.sol";

contract PlayerSystem is System {

  /**
    * @dev create player
    * @param name player name
    */
  function createPlayer(string memory name) public {
    //bytes32 player = addressToEntity(_msgSender());
    //Position.set(x, y);
  }

  function spawn(int32 x, int32 y) public {
    //bytes32 player = addressToEntity(_msgSender());

    Position.set(x, y);
  }
}
