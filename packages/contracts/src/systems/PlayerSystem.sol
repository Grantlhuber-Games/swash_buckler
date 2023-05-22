// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { getUniqueEntity } from "@latticexyz/world/src/modules/uniqueentity/getUniqueEntity.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { Character, Attributes, Position, Health, Stamina, Intent } from "../codegen/Tables.sol";

contract PlayerSystem is System {

  /**
    * @dev create player
    * @param name player name
    */
  function createPlayer(string memory name) public {
    //bytes32 newEntity = getUniqueEntity();
    //addressToEntity(_msgSender()); // bytes32(uint256(uint160(_msgSender())));
    //bytes32 player = bytes32(uint256(uint160(_msgSender())));

    // let's cast the msg.sender
    // note: we use _msgSender() with systems to a bytes32 to use it as an entity ID
    bytes32 playerEntity = bytes32(uint256(uint160(_msgSender())));

    // set Character, Position, Attributes, Health, Stamina, Intent components
    Character.set(true, name, "Best ever", "knight");
    Attributes.set(10, 5, 0, 20, 2);
    Position.set(100, 100);
    Health.set(130);
    Stamina.set(30);
    Intent.set(0, [1, 2]);
    //return Character.get();
  }

  function spawn(int32 x, int32 y) public {
    //bytes32 player = addressToEntity(_msgSender());
    Position.set(x, y);
  }
}
