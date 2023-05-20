// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Health } from "../codegen/Tables.sol";

contract HealthSystem is System {

  uint32 internal constant MAX_HEALTH = 100;
  uint32 internal constant MIN_HEALTH = 0; //FIXME 0 is null in solidity
  uint32 internal constant REVIVE_HEALTH_PERCENTAGE = 20; // 20%

  /**
    * @dev refill entity
    * @return new health value
    */
  function refill() public returns (uint32) {
    Health.set(MAX_HEALTH);
    return MAX_HEALTH;
  }

  /**
    * @dev revive entity
    * @return new health value
    */
  function revive() public returns (uint32) {
    uint32 newValue = (MAX_HEALTH * REVIVE_HEALTH_PERCENTAGE / 100);
    Health.set(newValue);
    return newValue;
  }

  /**
    * @dev kill entity
    * @return new health value
    */
  function kill() public returns (uint32) {
    Health.set(MIN_HEALTH);
    return MIN_HEALTH;
  }

  /**
    * @dev increment health
    * @param addVal amount to increment
    * @return new health value
    */
  function heal(uint32 addVal) public returns (uint32){
    uint32 health = Health.get();
    uint32 newValue = health + addVal;
    if(newValue > MAX_HEALTH) {
      newValue = MAX_HEALTH;
    }
    Health.set(newValue);
    return newValue;
  }

  /**
    * @dev decrement health
    * @param redVal amount to decrement
    * @return new health value
    */
  function hurt(uint32 redVal) public returns (uint32){
    uint32 health = Health.get();
    uint32 newValue = 0;
    // uint so no underflow
    if(redVal < health) {
      redVal = health - redVal;
    }
    // FIXME 0 is null in solidity
    if(redVal < MIN_HEALTH) {
      newValue = MIN_HEALTH;
    }
    Health.set(newValue);
    return newValue;
  }

  /********************************************************************************************/
  /*                                       FUNCTION MODIFIERS                                 */
  /********************************************************************************************/



}
