import { getComponentValue } from "@latticexyz/recs";
import { awaitStreamValue } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";



export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldSend, txReduced$, singletonEntity }: SetupNetworkResult,
  { Character, Attributes, Position, Health, Stamina, Intent, Action, Counter }: ClientComponents
) {

  const setPosition = async (x: number, y: number) => {
    const tx = await worldSend("setPosition", [x, y]);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Position, singletonEntity);
  };

  const getActionById = async (actionId: number) => {
    const tx = await worldSend("getActionById", [actionId]);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Action, singletonEntity);
  };

  const healthSystemCalls = createCallsForHealthSystem({ worldSend, txReduced$, singletonEntity }, Health);
  console.log("healthSystemCalls", healthSystemCalls)

  const staminaSystemCalls = createCallsForStaminaSystem({ worldSend, txReduced$, singletonEntity }, Stamina);
  console.log("staminaSystemCalls", staminaSystemCalls)

  const playerSystemCalls = createCallsForPlayerSystem({ worldSend, txReduced$, singletonEntity }, Character);
  console.log("playerSystemCalls", playerSystemCalls)

  const intentSystemCalls = createCallsForIntentSystem({ worldSend, txReduced$, singletonEntity }, Intent);
  console.log("intentSystemCalls", intentSystemCalls)


  const increment = async () => {
    const tx = await worldSend("increment", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Counter, singletonEntity);
  };

  return {
    increment,
    setPosition,
    ...healthSystemCalls,
    ...staminaSystemCalls,
    ...playerSystemCalls,
    ...intentSystemCalls,
    getActionById
  };
}


function createCallsForHealthSystem(
    { worldSend, txReduced$, singletonEntity }: SetupNetworkResult,
     Health: ClientComponents
) {
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

  return {
    hurt,
    heal,
    kill,
    revive,
    refill,
  }
}

function createCallsForStaminaSystem(
    { worldSend, txReduced$, singletonEntity }: SetupNetworkResult,
    Stamina: ClientComponents
) {
  // Health system calls
  const exhaust = async (x: number) => {
    const tx = await worldSend("exhaust", [x]);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Stamina, singletonEntity);
  };

  const rest = async (x: number) => {
    const tx = await worldSend("rest", [x]);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Stamina, singletonEntity);
  };

  const refillStamina = async () => {
    const tx = await worldSend("refillStamina", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Stamina, singletonEntity);
  };

  const drain = async () => {
    const tx = await worldSend("drain", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Stamina, singletonEntity);
  };

  const hasSufficientStamina = async (x: number) => {
    const tx = await worldSend("hasSufficientStamina", [x]);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Stamina, singletonEntity);
  };
  const isExhausted = async () => {
    const tx = await worldSend("isExhausted", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Stamina, singletonEntity);
  };
  const isFresh = async () => {
    const tx = await worldSend("isFresh", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Stamina, singletonEntity);
  };

  return {
    exhaust,
    rest,
    drain,
    refillStamina,
    hasSufficientStamina,
    isExhausted,
    isFresh
  }
}

function createCallsForPlayerSystem(
    { worldSend, txReduced$, singletonEntity }: SetupNetworkResult,
    Character: ClientComponents
) {
  const createPlayer = async (name: string) => {
    const tx = await worldSend("createPlayer", [name]);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Character, singletonEntity);
  };

  return {
    createPlayer
  }
}

function createCallsForIntentSystem(
    { worldSend, txReduced$, singletonEntity }: SetupNetworkResult,
    Intent: ClientComponents
) {
  const addIntent = async (actionId: number) => {
    const tx = await worldSend("addIntent", [actionId]);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Intent, singletonEntity);
  };
  const removeIntent = async (used: boolean) => {
    const tx = await worldSend("removeIntent", [used]);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Intent, singletonEntity);
  };

  return {
    addIntent,
    removeIntent
  }
}

