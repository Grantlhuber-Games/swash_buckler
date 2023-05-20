# swash_buckler
A multiplayer strategy game built for the EthGlobal Autonomous Worlds hackathon.

## .env files
Make sure that the .env file within packages/contracts and packages/clients exist and have those variables set:

### packages/contracts/.env
```
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```
### packages/client/.env
```
VITE_CHAIN_ID=31337
```

# Whys

## Why pixi.js
- It's a 2D rendering engine i.e. for gaming. Phaser was in the selection process, but the site is down since 3 weeks.
  Additionally I found the overhead in the template project way too high for my taste as well that we have to stick to react as well.
- It's a low level library, which means that it's not opinionated and you can do whatever you want with it.
- It's a rendering engine, which means that it's not a game engine. This means that we have to implement the game logic ourselves.

# Resources
- pixi.js: https://www.pixijs.com/
  - https://github.com/pixijs/pixijs#readme
  - https://www.pixijselementals.com/
  

- Assets
  - https://pixabay.com/illustrations/troll-kobold-fantasy-ears-3331618/

# Issues Mud

## Different components, systems e.g. IncrementSystem has function increment and HealthSystem has function increments - not working

## Windows WSL system 
Hot reloading with Windows WSL is not working
Fix is here: https://www.youtube.com/watch?v=BUClW9wTqGQ&ab_channel=coder4life just for others, in order to get it working.


