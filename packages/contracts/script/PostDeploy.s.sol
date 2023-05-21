// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";
import { Action, ActionData } from "../src/codegen/tables/Action.sol";
import { Health } from "../src/codegen/tables/Health.sol";

contract PostDeploy is Script {
  function run(address worldAddress) external {
    // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

    // Start broadcasting transactions from the deployer account
    vm.startBroadcast(deployerPrivateKey);

    // ------------------ EXAMPLES ------------------

    // Call increment on the world via the registered function selector
    uint32 newValue = IWorld(worldAddress).increment();
    console.log("Increment via IWorld:", newValue);

    uint32 newValue2 = IWorld(worldAddress).revive();
    //Health.set(170);
    console.log("Health revive via IWorld: ", newValue2);
//Static fields must come before dynamic fields in the schema
    /*
    Action.set( 1, ActionData({
      minLvl: 2,
      baseDamage: 3,
      costsStaminaUsed: 4,
      costsStaminaExpired: 5,
      usages: 6,
      activityLength: 7
    }));
    Action.set( 1, ActionData({
      minLvl: 2,
      baseDamage: 3
    }));
    console.log("Add action key=1");
*/
    vm.stopBroadcast();
  }
}
