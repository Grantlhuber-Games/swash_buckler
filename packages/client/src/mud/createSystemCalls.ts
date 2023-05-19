import { getComponentValue } from "@latticexyz/recs";
import { awaitStreamValue } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldSend, txReduced$, singletonEntity }: SetupNetworkResult,
  { Counter, Position }: ClientComponents
) {
  const increment = async () => {
    const tx = await worldSend("increment", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Counter, singletonEntity);
  };

  const setPosition = async (x: number, y: number) => {
    const tx = await worldSend("setPosition", [x, y]);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Position, singletonEntity);
  };


  return {
    increment,
    setPosition
  };
}
