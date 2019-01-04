<template>
  <div class="context-menu" v-bind:id="getmenuid" v-show="show" ref="menu" :style="style">
    <div v-for="(item, i) in items" :key="i">
      <div @click.stop="handleAction(item)" class="context-item">
        {{item.text}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    "items": {type: Array, required: true},
    "pos": {type: Object, required: true},
    "menuid": {default: ""},
    "parent": {type: Object, required: false}
  },
  methods: {
    handleAction(item) {
      console.log("Executing:", item)
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
    getmenuid() {
      return "context-menu" + this.menuid;
    },
    show() {
      return this.items.length > 0;
    },
    style() {
      console.debug(this.menuid)
      const { offsetWidth, offsetHeight } = document.getElementById(
        "context-menu" + this.menuid
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
