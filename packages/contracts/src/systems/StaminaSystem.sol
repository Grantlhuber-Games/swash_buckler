// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Stamina } from "../codegen/Tables.sol";
import { addressToEntityKey } from "../addressToEntityKey.sol";

contract StaminaSystem is System {

  uint32 internal constant MAX_STAMINA = 100; // MAX_STAMINA will be dependent on player
  uint32 internal constant MIN_STAMINA = 0; // FIXME 0 is null in solidity

  /**
    * @dev refill stamina
    * @return new stamina value
    */
  function refillStamina() public returns (uint32) {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    Stamina.set(player, MAX_STAMINA);
    return MAX_STAMINA;
  }

  /**
    * @dev drain stamina
    * @return new stamina value
    */
  function drain() public returns (uint32) {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    Stamina.set(player, MIN_STAMINA);
    return MIN_STAMINA;
  }

  /**
    * @dev increment stamina
    * @param addVal amount to increment
    * @return new stamina value
    */
  function rest(uint32 addVal) public returns (uint32){
    bytes32 player = addressToEntityKey(address(_msgSender()));
    uint32 stamina = Stamina.get(player);
    uint32 newValue = stamina + addVal;
    if(newValue > MAX_STAMINA) {
      newValue = MAX_STAMINA;
    }
    Stamina.set(player, newValue);
    return newValue;
  }

  /**
    * @dev decrement stamina
    * @param redVal amount to decrement
    * @return new stamina value
    */
  //function exhaust(uint32 redVal) public requireIsAbleToExecuteIntent(redVal) returns (uint32) {
  function exhaust(uint32 redVal) public requireIsAbleToExecuteIntent(redVal) returns (uint32) {
    bytes32 player = addressToEntityKey(address(_msgSender()));

    uint32 stamina = Stamina.get(player);
    uint32 newValue = 0;
    // uint so no underflow
    if(redVal < stamina) {
      newValue = stamina - redVal;
    }
    // FIXME 0 is null in solidity
    if(newValue < MIN_STAMINA) {
      newValue = MIN_STAMINA;
    }
    Stamina.set(player, newValue);
    return newValue;
  }

  function exhaustWithOrigin(bytes32 origin, uint32 redVal) public returns (uint32) {
    //TODO also do this with a modifier  requireIsAbleToExecuteIntent(redVal) like the original fct.
    require(hasSufficientStaminaWithOrigin(origin, redVal), "Player has not sufficient stamina to fullfill the intended action.");

    uint32 stamina = Stamina.get(origin);
    uint32 newValue = 0;
    // uint so no underflow
    if(redVal < stamina) {
      newValue = stamina - redVal;
    }
    // FIXME 0 is null in solidity
    if(newValue < MIN_STAMINA) {
      newValue = MIN_STAMINA;
    }
    Stamina.set(origin, newValue);
    //uint32 newValue = 3;
    //Stamina.set(player, Stamina.get(adr));
    return newValue;
  }


  /********************************************************************************************/
  /*                                       UTILITY FUNCTIONS                                  */
  /********************************************************************************************/
  // TODO add entity id bytes32 playerKey
  function isExhausted() public view returns (bool) {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    return Stamina.get(player) == MIN_STAMINA;
  }
  function isFresh() public view returns (bool) {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    return Stamina.get(player) == MAX_STAMINA;
  }

  function hasSufficientStamina(uint32 intentStaminaCost) public requireIsNotExhausted returns (bool) {
    bytes32 player = addressToEntityKey(address(_msgSender()));

    bool isAbleTo = false;
    uint32 stamina = Stamina.get(player);
    if(intentStaminaCost <= stamina) {
      isAbleTo = true;
    }
    return isAbleTo;
  }

  function hasSufficientStaminaWithOrigin(bytes32 origin, uint32 intentStaminaCost) public returns (bool) {
    bool isAbleTo = false;
    uint32 stamina = Stamina.get(origin);
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
    require(!isExhausted(), "Player is exhausted... .");
    _;
  }
  modifier requireIsFresh()
  {
    require(isFresh(), "Player is not fresh.");
    _;
  }

  modifier requireIsAbleToExecuteIntent(uint32 intentStaminaCost)
  {
    require(hasSufficientStamina(intentStaminaCost), "Player has not sufficient stamina to fullfill the intended action.");
    _;
  }


}
