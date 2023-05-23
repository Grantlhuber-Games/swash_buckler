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
    IWorld world = IWorld(worldAddress);
    // Call increment on the world via the registered function selector
    uint32 newValue = world.increment();
    console.log("Increment via IWorld:", newValue);

    //uint32 newValue2 = world.revive();
    //console.log("Health revive via IWorld: ", newValue2);

    world.createOpponent("Lothar", "death_knight");

    //Static fields must come before dynamic fields in the schema
    Action.set(world, 1, ActionData({
      minLvl: 0,
      baseDamage: 3,
      costsStaminaUsed: 10,
      costsStaminaExpired: 2,
      usages: -1, // negative value means infinite
      activityLength: 6,
      name: "attack (soft)"
    }));
    Action.set(world, 2, ActionData({
      minLvl: 0,
      baseDamage: 6,
      costsStaminaUsed: 20,
      costsStaminaExpired: 4,
      usages: -1,
      activityLength: 3,
      name: "attack (hard)"
    }));
    Action.set(world, 3, ActionData({
      minLvl: 0,
      baseDamage: -10,
      costsStaminaUsed: 15,
      costsStaminaExpired: 3,
      usages: -1,
      activityLength: 3,
      name: "defend"
    }));
    Action.set(world, 4, ActionData({
      minLvl: 0,
      baseDamage: 10,
      costsStaminaUsed: 30,
      costsStaminaExpired: 10,
      usages: 3,
      activityLength: 3,
      name: "special"
    }));
    console.log("Actions added via IWorld ");

    vm.stopBroadcast();
  }
}
