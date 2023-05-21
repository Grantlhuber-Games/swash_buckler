/* Autogenerated file. Do not edit manually. */

import { TableId } from "@latticexyz/utils";
import { defineComponent, Type as RecsType, World } from "@latticexyz/recs";

export function defineContractComponents(world: World) {
  return {
    Character: (() => {
      const tableId = new TableId("", "Character");
      return defineComponent(
        world,
        {
          human: RecsType.Boolean,
          name: RecsType.String,
          description: RecsType.String,
          charClass: RecsType.String,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    Attributes: (() => {
      const tableId = new TableId("", "Attributes");
      return defineComponent(
        world,
        {
          strength: RecsType.Number,
          dexterity: RecsType.Number,
          mana: RecsType.Number,
          armor: RecsType.Number,
          speed: RecsType.Number,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    Position: (() => {
      const tableId = new TableId("", "Position");
      return defineComponent(
        world,
        {
          x: RecsType.Number,
          y: RecsType.Number,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    Health: (() => {
      const tableId = new TableId("", "Health");
      return defineComponent(
        world,
        {
          health: RecsType.Number,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    Stamina: (() => {
      const tableId = new TableId("", "Stamina");
      return defineComponent(
        world,
        {
          stamina: RecsType.Number,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    Intent: (() => {
      const tableId = new TableId("", "Intent");
      return defineComponent(
        world,
        {
          intents: RecsType.Number,
          actions: RecsType.StringArray,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    Action: (() => {
      const tableId = new TableId("", "Action");
      return defineComponent(
        world,
        {
          minLvl: RecsType.Number,
          baseDamage: RecsType.Number,
          costsStaminaUsed: RecsType.Number,
          costsStaminaExpired: RecsType.Number,
          usages: RecsType.Number,
          activityLength: RecsType.Number,
          name: RecsType.String,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    Counter: (() => {
      const tableId = new TableId("", "Counter");
      return defineComponent(
        world,
        {
          value: RecsType.Number,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
  };
}
