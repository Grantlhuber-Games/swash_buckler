// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

/* Autogenerated file. Do not edit manually. */

interface IIntentSystem {
  function addIntent(uint8 actionId) external returns (uint8);

  function removeIntent(bool used) external;

  function hasAction(uint8 actionId) external view returns (bool);
}
