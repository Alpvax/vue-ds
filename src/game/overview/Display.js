import ROT from "rot-js";
import gData from "../state/data";

ROT.Display.prototype.drawWorld = function() {
  let world = gData.world;
  let player = gData.player;

  this.clear();
  let curOpts = this.getOptions();
  let top = Math.ceil(player.pos.y - curOpts.height / 2);
  let bot = Math.ceil(player.pos.y + curOpts.height / 2);
  let left = Math.ceil(player.pos.x - curOpts.width / 2);
  let right = Math.ceil(player.pos.x + curOpts.width / 2);

  for (let i = 0, y = top; y < bot; y++) {
    for (let j = 0, x = left; x < right; x++) {
      let chunk = world.getChunkFromTile(x, y);
      let tile = chunk.getTileFromWorldCoords(x, y);

      let symbol, foreground, background;

      if (x === player.pos.x && y === player.pos.y) {
        foreground = "#fff";
        symbol = "«※»";
        // symbol = "🧙";
      } else if (tile.creatures.length) {
        let highestLvl = Math.max(...tile.creatures.map(creature => creature.level));
        let creature = tile.creatures.find(creature => creature.level === highestLvl);
        symbol = creature.symbol;
        let diff = highestLvl - player.level;
        if (diff > 10) {
          foreground = "hsl(0, 100%, 50%)";
        } else if (diff < -10) {
          foreground = "hsl(120, 100%, 50%)";
        } else {
          // converts numbers from 10 to -10 into a val from 120 to 0
          foreground = `hsl(${120 - (diff + 10) * 6}, 100%, 50%)`;
        }
      } else {
        foreground = tile.foreground;
        symbol = tile.display;
      }

      this.draw(j, i, symbol, foreground, background);
      j++;
    }
    i++;
  }
}

var display = new ROT.Display({
  fg: "#daddd8",
  bg: "#1e1e1e",
  // bg: "#9e9e9e", // For debugging
  forceSquareRatio: true
});

export default display;