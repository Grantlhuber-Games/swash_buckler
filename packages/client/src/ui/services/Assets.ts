/**
 *
 * @param charClass
 */
export function generateAssetArray(charClass?: string) {
    console.log("generateAssetArray", charClass)
    const assets = [
        "assets/background/background_01.png",
        "assets/background/background_02.png",
        "assets/background/background_03.png",
        "assets/background/background_04.png",
        "assets/icons/axe.png",
        "assets/icons/beer.png",
        "assets/icons/bomb.png",
        "assets/icons/bow.png",
        "assets/icons/cannon.png",
        "assets/icons/club_nails.png",
        "assets/icons/club_spiked.png",
        "assets/icons/dagger.png",
        "assets/icons/flag_white.png",
        "assets/icons/helmet_heavy.png",
        "assets/icons/helmet_wood.png",
        "assets/icons/molotov.png",
        "assets/icons/shield_heavy.png",
        "assets/icons/shield_wood.png",
        "assets/icons/sword_basic.png",
        "assets/icons/sword_sabre.png"
    ];
    if(charClass) {
        /*
                this will be added automatically
                "assets/sprites/archer/idle.json",
                "assets/sprites/archer/die.json",
                "assets/sprites/archer/rise.json",
                "assets/sprites/archer/walk.json",
                "assets/sprites/archer/attack_01.json",
        */

        const classesAll = [
            "archer",
            "bandit",
            "death_knight",
            "necromancer",
            "warlock",
            "warrior"
        ];

        if(!classesAll.includes(charClass)) {
            console.error("charClass=" + charClass + " is not support atm.");
            throw Error("charClass=" + charClass + " is not support atm.");
        }

        const classes = [charClass];
        //FIXME use anim enums
        const animations = [
            "attack_01",
            "die",
            "idle",
            "rise",
            "walk"
        ];

        for(let classEntry of classes) {
            for(let animEntry of animations) {
                assets.push("assets/sprites/" + classEntry + "/" + animEntry + ".json")
            }
        }
    }

    console.warn("generateAssets", assets)
    return assets;
}

