export const GLOBAL_VARS = {
    scene: {
        playerContainer: null,
        player: null,
    },

    // for styling the texts
    textStyle: {
        fontSize: "30px",
        fontWeight: "bold",
        fontFamily: "Arial",
        fill: "white",
    },
    pixiStats: {},
};

/**
 * Enum for common colors.
 * @readonly
 * @enum {{name: string, hex: string}}
 */
export  const ANIMATIONS = Object.freeze({
    ATTACK_01: { name: "Attack01", file: "attack_01", loop: false },
    DIE: { name: "Die", loop: false },
    IDLE: { name: "Idle", loop: true },
    RISE: { name: "Rise", loop: false },
    WALK: { name: "Walk", loop: true },
    //RESURRECT:   { name: "Resurrect" },
});