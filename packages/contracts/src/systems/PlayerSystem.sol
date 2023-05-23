// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { getUniqueEntity } from "@latticexyz/world/src/modules/uniqueentity/getUniqueEntity.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { Character, Attributes, Position, Health, Stamina, Intent, Avatar } from "../codegen/Tables.sol";
import { CharType } from "../codegen/Types.sol";
import { addressToEntityKey } from "../addressToEntityKey.sol";

contract PlayerSystem is System {

  /**
    * @dev create player
    * @param name player name
    */
  function createPlayer(string memory name, string memory charType) public {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    //bytes32 newEntity = getUniqueEntity();
    //addressToEntity(_msgSender()); // bytes32(uint256(uint160(_msgSender())));
    //bytes32 player = bytes32(uint256(uint160(_msgSender())));

    // let's cast the msg.sender
    // note: we use _msgSender() with systems to a bytes32 to use it as an entity ID
    //bytes32 playerEntity = bytes32(uint256(uint160(_msgSender())));

    // set Character, Position, Attributes, Health, Stamina, Intent components
    Character.set(player, true, name, "Best char ever", charType);
    Attributes.set(player, 10, 5, 0, 20, 2);
    Position.set(player, 0, 0);
    Health.set(player, 100);
    Stamina.set(player, 60);
    Intent.set(player, 0, [1, 2, 3, 4]);
    Avatar.set(player, false);
    //return Character.get();
  }


  function createOpponent(string memory name, string memory charType) public {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    bytes32 monster = keccak256(abi.encode(player,blockhash(block.number-1),block.difficulty));
    // set Character, Position, Attributes, Health, Stamina, Intent components
    Character.set(monster, false, name, "Best opponent ever", charType);
    Attributes.set(monster, 3, 2, 0, 20, 2);
    Position.set(monster, 300, 200);
    Health.set(monster, 70);
    Stamina.set(monster, 20);
    Intent.set(monster, 0, [1, 2, 3, 4]);
    Avatar.set(monster, true);
    //return Character.get();
  }

  function spawnPlayer(int32 x, int32 y) public {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    //bytes32 player = addressToEntity(_msgSender());
    Position.set(player, x, y);
    Avatar.set(player, true);
  }
}
