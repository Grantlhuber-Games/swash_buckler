// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Health } from "../codegen/Tables.sol";
import { addressToEntityKey } from "../addressToEntityKey.sol";

contract HealthSystem is System {

  uint32 internal constant MAX_HEALTH = 100;
  uint32 internal constant MIN_HEALTH = 0; //FIXME 0 is null in solidity
  uint32 internal constant REVIVE_HEALTH_PERCENTAGE = 20; // 20%

  /**
    * @dev refill entity
    * @return new health value
    */
  function refill() public requireIsAlive returns (uint32) {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    Health.set(player, MAX_HEALTH);
    return MAX_HEALTH;
  }

  /**
    * @dev revive entity
    * @return new health value
    */
  function revive() public requirePlayer requireIsDead returns (uint32) {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    uint32 newValue = (MAX_HEALTH * REVIVE_HEALTH_PERCENTAGE / 100);
    Health.set(player, newValue);
    return newValue;
  }

  /**
    * @dev kill entity
    * @return new health value
    */
  function kill() public requireIsAlive returns (uint32) {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    Health.set(player, MIN_HEALTH);
    return MIN_HEALTH;
  }

  /**
    * @dev increment health
    * @param addVal amount to increment
    * @return new health value
    */
  function heal(uint32 addVal) public requireIsAlive returns (uint32){
    bytes32 player = addressToEntityKey(address(_msgSender()));

    uint32 health = Health.get(player);
    uint32 newValue = health + addVal;
    if(newValue > MAX_HEALTH) {
      newValue = MAX_HEALTH;
    }
    Health.set(player, newValue);
    return newValue;
  }

  /**
    * @dev decrement health
    * @param redVal amount to decrement
    * @return new health value
    */
  function hurt(uint32 redVal) public requireIsAlive returns (uint32){
    bytes32 player = addressToEntityKey(address(_msgSender()));

    uint32 health = Health.get(player);
    uint32 newValue = 0;
    // uint so no underflow
    if(redVal < health) {
      newValue = health - redVal;
    }
    // FIXME 0 is null in solidity
    if(newValue < MIN_HEALTH) {
      newValue = MIN_HEALTH;
    }
    Health.set(player, newValue);
    return newValue;
  }

  /********************************************************************************************/
  /*                                       UTILITY FUNCTIONS                                  */
  /********************************************************************************************/
  // TODO add entity id bytes32 playerKey
  function isDead() public view returns (bool) {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    return Health.get(player) == MIN_HEALTH;
  }
  function isAlive() public view returns (bool) {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    return Health.get(player) > MIN_HEALTH;
  }

  /********************************************************************************************/
  /*                                       FUNCTION MODIFIERS                                 */
  /********************************************************************************************/
  // TODO add entity id bytes32 playerKey
  modifier requireIsDead()
  {
    require(isDead(), "Player is not dead... yet.");
    _;
  }
  modifier requireIsAlive()
  {
    require(isAlive(), "Player is dead. You can only revive.");
    _;
  }
  // TODO why is this not working ...
  modifier requirePlayer
  {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    _;
  }


}
