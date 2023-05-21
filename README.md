# swash_buckler
A multiplayer strategy game built for the EthGlobal Autonomous Worlds hackathon.

## Battle system concept
TRANSFER TO GDD
1. Player try to play intent of action (check if enough stamina, mana)
2. Action is in action queue
3. Action is executed or activity time is ehausted (Each Action has name, acitivity time, dmg dealt, stamina cost (used) and stamina cost (blocked)
   Action played criterion: e.g. Attack soft - player is in range.
   a. If action is executed or activity time ran out, it is removed from action queue
   b. If action can be played. Action is executed and stamina cost is subtracted from stamina (Issue what if player moves while in activity time - show potential costs or cannot move)
   c. If action cannot be played (activity timer ran out) Action (Blocked) Stamina cost is reduced from stamina

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


fsnotifier-wsl --selftest

temporary solution: 
wsl --shutdown
wsl


