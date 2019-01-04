<template>
  <div class="context-menu" v-show="show" ref="menu" :style="style">
    <div v-for="(item, i) in this.items" :key="i">
      <div @click.stop="handleAction(item)" class="context-item">
        {{item.text}}
      </div>
    </div>
  </div>
</template>

<script>
let data = {
  items: [],
  pos: {
    x: 0,
    y: 0
  }
};

export default {
  data() {
    return data;
  },
  methods: {
    handleAction(item) {
      if (item.isParent) {
        item.action();
      } else {
        item.action();
        this.hideContextMenu();
      }
    }
  },
  computed: {
    /*items() {
      return this.$root.items
    },
    pos() {
      return this.$root.pos
    },*/
    show() {
      return this.items.length > 0
    },
    style() {
      const { offsetWidth, offsetHeight } = document.getElementById(
        "context-menu"
      ) || { offsetWidth: 0, offsetHeight: 0 };
      const [posX, posY] = [this.pos.x, this.pos.y];
      return {
        left:
          posX + offsetWidth < window.innerWidth
            ? `${posX}px`
            : `${posX - offsetWidth}px`,
        top:
          posY + offsetHeight < window.innerHeight
            ? `${posY}px`
            : `${posY - offsetHeight}px`
      };
    }
  }
};
</script>

<style>
.context-menu {
  position: absolute;
  max-width: 160px;
  max-height: 90vh;
  /*color: var(--text-blur);
  background: var(--ui-border);*/
  padding: 10px 0px;
  z-index: 1;
  border-radius: 4px;
  box-shadow: 0px 2px 15px 0px #232323;
}

.context-item {
  padding: 10px;
  margin: 0;
  cursor: pointer;
}

.context-item:hover {
  background: var(--ui-dark);
}
</style>
