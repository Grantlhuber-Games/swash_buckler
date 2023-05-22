// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { IWorld } from "../codegen/world/IWorld.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { Position, Stamina } from "../codegen/Tables.sol";
//import { StaminaSystem } from "./StaminaSystem.sol";
contract MovementSystem is System {

  function setPosition(int32 x, int32 y) public {
    //bytes32 player = addressToEntity(_msgSender());
    //Position oldPos = Position.get();

    address worldAddress = _world();
    IWorld world = IWorld(worldAddress);

    world.exhaust(1);

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
    address worldAddress = _world();
    IWorld world = IWorld(worldAddress);

    world.exhaust(1);

    Position.set(x, y);
  }

}
