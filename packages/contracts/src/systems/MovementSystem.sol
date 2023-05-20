// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Position } from "../codegen/Tables.sol";

contract MovementSystem is System {

  function setPosition(int32 x, int32 y) public {
    //bytes32 player = addressToEntity(_msgSender());

    Position.set(x, y);
  }

  /**
    * @dev move player
    * @param x position
    * @param y position
    */
  function move(int32 x, int32 y) public {
    //bytes32 player = addressToEntity(_msgSender());
    // FIXME: check if move is valid

    // check stamina
    // check if move is valid


    Position.set(x, y);
  }

}
