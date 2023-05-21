import mudService from "./services/mud";
import Avatar from "./models/Avatar";
import startGame from "./services/pixi";

// Setup of the game withing the window
class App {
  constructor() {
    this.myAvatar = new Avatar("myAvatar", {x: 0, y: 0}, 100, 100);
  }

  async init() {

    await mudService(this);
    startGame(this);
  }
}

const app = new App(); // this is the game
await app.init(); // this makes the mudService run and then starts the game


