// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Position } from "../codegen/Tables.sol";

contract PlayerSystem is System {
  function setPosition(int32 x, int32 y) public {
    //bytes32 player = addressToEntity(_msgSender());

    Position.set(x, y);
  }
}
