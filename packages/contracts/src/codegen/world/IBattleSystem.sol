// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

/* Autogenerated file. Do not edit manually. */

import { ActionData } from "./../tables/Action.sol";

interface IBattleSystem {
  function getActionById(uint8 actionId) external view returns (ActionData memory _table);

  function intend() external;

  function attack(bytes32 target) external;

  function counterAttack(bytes32 target) external;
}
