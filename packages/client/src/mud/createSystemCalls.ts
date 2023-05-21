import { getComponentValue } from "@latticexyz/recs";
import { awaitStreamValue } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";



export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldSend, txReduced$, singletonEntity }: SetupNetworkResult,
  { Character, Attributes, Position, Health, Stamina, Intent, Action, Counter }: ClientComponents
) {
  const increment = async () => {
    const tx = await worldSend("increment", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Counter, singletonEntity);
  };

  const createPlayer = async () => {
    const tx = await worldSend("createPlayer", ["John"]);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Character, singletonEntity);
  };

  const setPosition = async (x: number, y: number) => {
    const tx = await worldSend("setPosition", [x, y]);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Position, singletonEntity);
  };

  // Health system calls
  const hurt = async (x: number) => {
    const tx = await worldSend("hurt", [x]);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Health, singletonEntity);
  };

  const heal = async (x: number) => {
    const tx = await worldSend("heal", [x]);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Health, singletonEntity);
  };

  const refill = async () => {
    const tx = await worldSend("refill", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Health, singletonEntity);
  };

  const revive = async () => {
    const tx = await worldSend("revive", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Health, singletonEntity);
  };

  const kill = async () => {
    const tx = await worldSend("kill", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Health, singletonEntity);
  };

  const getActionById = async (actionId: number) => {
    const tx = await worldSend("getActionById", [actionId]);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Action, singletonEntity);
  };


  return {
    createPlayer,
    increment,
    setPosition,
    hurt,
    heal,
    kill,
    revive,
    refill,
    getActionById
  };
}
