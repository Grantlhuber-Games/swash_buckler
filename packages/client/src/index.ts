import mudService from "./services/mud";
import Avatar from "./models/Avatar";
import initPixi from "./services/pixi";

// Setup of the game within the window
class App {
  constructor() {
    //this.myAvatar = new Avatar({name: "myAvatar", charClass: "bandit"}, {"strength": 20}, {x: 0, y: 0}, 100, 100, {intents: 0, actions: []});
  }

  getAvatar() {
    return this.myAvatar;
  }

  isAvatarSet() {
    return this.myAvatar !== undefined;
  }

  initAvatar(name: string, charClass: string) {
    this.myAvatar = new Avatar({name: name, charClass: charClass}, {"strength": 20}, {x: 0, y: 0}, 100, 100, {intents: 0, actions: []});
    console.log("MudApp initAvatar myAvatar=", this.myAvatar)
  }

  async init() {
    await mudService(this);
    this.startGame();
  }

  startGame() {
    initPixi(this);
  }
}

const app = new App(); // this is the game
await app.init(); // this makes the mudService run and then starts the game


