// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { getUniqueEntity } from "@latticexyz/world/src/modules/uniqueentity/getUniqueEntity.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { Position } from "../codegen/Tables.sol";

contract PlayerSystem is System {

  /**
    * @dev create player
    * @param name player name
    */
  function createPlayer(string memory name) public {
    //bytes32 newEntity = getUniqueEntity();
    //addressToEntity(_msgSender()); // bytes32(uint256(uint160(_msgSender())));
    //bytes32 player = bytes32(uint256(uint160(_msgSender())));
    //Position.set(x, y);
    // creates new Avatar
    //Avatar.set(player, name, true, "knight", 3, 2, 3, 0, 0);
  }

  function spawn(int32 x, int32 y) public {
    //bytes32 player = addressToEntity(_msgSender());

    Position.set(x, y);
  }
}
