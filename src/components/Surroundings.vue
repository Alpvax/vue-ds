<template>
  <div id="surroundings-output">
    <div v-if="worldExists" class="wrapper">
      {{surroundings.creatures.length}} Creature{{surroundings.creatures.length === 1 ? '' : 's'}}:
      <div class="table-wrapper">
        <table class="surrounds-categories">
          <tbody>
            <tr v-for="(entity, index) in surroundings.creatures"
                :key="`creature-${index}`"
                @mouseenter="highlight(entity)"
                @mouseleave="highlight()">
              <td :style="getStyle(entity.level)" class="symbol">{{entity.symbol}}</td>
              <td class="creature-name">{{entity.name}}</td>
              <td class="creature-level">Level</td>
              <td :style="getStyle(entity.level)">{{entity.level}}</td>
              <td class="direction">(<span :style="entity.dir === 'here' ? getStyle(entity.level) : ''">{{entity.dir}}</span>)</td>
            </tr>
          </tbody>
        </table>
      </div>
      {{surroundings.items.total}} Item{{surroundings.items.total === 1 ? '' : 's'}}:
      <div class="table-wrapper">
        <div class="surrounds-categories">
            <div v-for="(item, i) in surroundings.items.stacked"
                :key="`item-${i}`"
                @mouseenter="highlight(null, item.locations)"
                @mouseleave="highlight()"
                @click.left="toggleExpanded(item)">
              <span class="item-count">{{item.count}}</span>
              <span class="item-name">{{item.displayname}}</span>
                <div v-for="(expanded, i) in item.expanded"
                    :key="`expanded-${i}`"
                    @mouseenter="highlight(null, expanded.loc)"
                    @mouseleave="highlight()"
                    v-show="expandedItem === item.name"
                    class="expanded-items">
                  <span class="item-count">{{expanded.count}}</span>
                  <span class="expanded-name">{{expanded.name}}</span>
                  <span class="item-value">{{expanded.totalValue}}</span>
                  <span class="direction">({{expanded.dir}})</span>
                </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import { levelColour } from "../game/utils/colours";
import display from "../game/overview/Display";

export default {
  data() {
    return {
      expandedItem: "",
    }
  },
  computed: {
    worldExists() {
      return this.$store.getters.worldExists;
    },
    surroundings() {
      return this.$store.getters.surroundings(2);
    },
  },
  methods: {
    getStyle(lvl) {
      return "color: " + levelColour(lvl);
    },
    toggleExpanded(item) {
      if (item.name === this.expandedItem) {
        this.expandedItem = "";
      } else {
        this.expandedItem = item.name;
      }
    },
    highlight(entity, locations) {
      if (entity) {
        let highlit = {
          [entity.pos]: {
            symbol: entity.symbol,
            colour: levelColour(entity.level, 30),
          },
        };
        this.$store.dispatch("highlight", highlit)
      } else if (locations) {
        this.$store.dispatch("highlight", locations);
      } else {
        this.$store.dispatch("highlight");
      }
    },
  },
};
</script>

<style>
#surroundings-output {
  overflow-y: visible;
  color: var(--text-blur);
  background-color: var(--ui-darker);
  border-color: var(--ui-border);
  font-family: "Ubuntu Mono", monospace;
  font-size: 18px;
}

.table-wrapper::-webkit-scrollbar {
  width: 6px;
}

.table-wrapper::-webkit-scrollbar-track {
  background-color: #2b2b2b;
}

.table-wrapper::-webkit-scrollbar-thumb {
  background-color: #404040;
}

.surrounds-categories {
  table-layout: fixed;
  padding: 0px;
  width: 100%;
  font-size: 14px;
}

.surrounds-categories tr:hover {
  background-color: var(--ui-border);
}

.surrounds-categories td {
  padding: 3px 4px;
}

.direction {
  text-align: right;
  text-transform: capitalize;
  width: 110px;
  margin-left: auto;
}

.wrapper {
  height: 100%;
  padding: 20px 8px 20px 15px;
  overflow-y: hidden;
}

.table-wrapper {
  margin: 6px 0px 16px;
  height: 40%;
  overflow-y: scroll;
}

.symbol {
  font-size: 22px;
  width: 14px;
}

.creature-name {
  font-size: 1.2em;
  text-transform: capitalize;
  width: 100px;
}

.creature-level {
  text-align: right;
  width: 40px;
}

.item-name {
  font-size: 1.2em;
  width: 280px;
}

.item-count {
  color: white;
  flex: 0 0 25px;
}

.item-value {
  flex: 0 0 25px;
  color: yellow;
}

.expanded-items {
  background-color: #1e1e1e;
  padding-left: 10px;
  width: 95%;
  display: flex;
  flex-wrap: nowrap;
  align-items: baseline;
}

.expanded-name {
  margin-right: auto;
}
</style>
