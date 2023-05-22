// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Stamina } from "../codegen/Tables.sol";

contract StaminaSystem is System {

  uint32 internal constant MAX_STAMINA = 100; // MAX_STAMINA will be dependent on player
  uint32 internal constant MIN_STAMINA = 0; // FIXME 0 is null in solidity

  /**
    * @dev refill stamina
    * @return new stamina value
    */
  function refillStamina() public returns (uint32) {
    Stamina.set(MAX_STAMINA);
    return MAX_STAMINA;
  }

  /**
    * @dev drain stamina
    * @return new stamina value
    */
  function drain() public returns (uint32) {
    Stamina.set(MIN_STAMINA);
    return MIN_STAMINA;
  }

  /**
    * @dev increment stamina
    * @param addVal amount to increment
    * @return new stamina value
    */
  function rest(uint32 addVal) public returns (uint32){
    uint32 stamina = Stamina.get();
    uint32 newValue = stamina + addVal;
    if(newValue > MAX_STAMINA) {
      newValue = MAX_STAMINA;
    }
    Stamina.set(newValue);
    return newValue;
  }

  /**
    * @dev decrement stamina
    * @param redVal amount to decrement
    * @return new stamina value
    */
  function exhaust(uint32 redVal) public requireIsAbleToExecuteIntent(redVal) returns (uint32) {

    uint32 stamina = Stamina.get();
    uint32 newValue = 0;
    // uint so no underflow
    if(redVal < stamina) {
      newValue = stamina - redVal;
    }
    // FIXME 0 is null in solidity
    if(newValue < MIN_STAMINA) {
      newValue = MIN_STAMINA;
    }
    Stamina.set(newValue);
    return newValue;
  }



  /********************************************************************************************/
  /*                                       UTILITY FUNCTIONS                                  */
  /********************************************************************************************/
  // TODO add entity id bytes32 playerKey
  function isExhausted() public view returns (bool) {
      return Stamina.get() == MIN_STAMINA;
  }
  function isFresh() public view returns (bool) {
    return Stamina.get() == MAX_STAMINA;
  }

  function hasSufficientStamina(uint32 intentStaminaCost) public requireIsNotExhausted returns (bool) {
    bool isAbleTo = false;
    uint32 stamina = Stamina.get();
    if(intentStaminaCost <= stamina) {
      isAbleTo = true;
    }
    return isAbleTo;
  }

  /********************************************************************************************/
  /*                                       FUNCTION MODIFIERS                                 */
  /********************************************************************************************/
  // TODO add entity id bytes32 playerKey
  modifier requireIsExhausted()
  {
    require(isExhausted(), "Player is not exhausted... yet.");
    _;
  }
  modifier requireIsNotExhausted()
  {
    require(!isExhausted(), "Player is exhausted... yet.");
    _;
  }
  modifier requireIsFresh()
  {
    require(isFresh(), "Player is not fresh.");
    _;
  }

  modifier requireIsAbleToExecuteIntent(uint32 intentStaminaCost)
  {
    require(hasSufficientStamina(intentStaminaCost), "Player is not able to execute intent.");
    _;
  }


}
