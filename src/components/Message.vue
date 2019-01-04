<template>
  <div class="messages" v-contextmenu>
    <div class="entity">{{entity}}</div>
    <div class="message">{{message}}</div>
  </div>
</template>

<script>
export default {
  props: ["entity", "message"],
  methods: {
    contextMenuItems(vm) {
      return [
        {
          text: "Resend message",
          action: () => {
            vm.$store.dispatch("addMessage", {
              entity: vm.$store.getters.playerName,
              message: vm.message
            });
            this.$game.parseCommand(vm.message);
          }
        },
        {
          text: `Reply to ${vm.entity}`,
          action: () => {
            let entityName;
            if (vm.entity.split(" ").length > 1) {
              entityName = `@'${vm.entity}' `;
            } else {
              entityName = `@${vm.entity} `;
            }
            vm.$store.dispatch("setInputText", entityName);
            console.log("TODO: Change input text value to `@entity`");
          }
        }
      ];
    }
  }
};
</script>

<style>
.messages {
  display: flex;
  flex-shrink: 0;
  overflow-x: hidden;
}

.messages:hover .entity {
  color: var(--text);
  background-color: var(--ui-darker);
}

.messages:hover .message {
  background-color: var(--ui-dark);
}

.entity {
  flex: 0 0 160px;
  padding: 3px 10px;
  color: var(--text-blur);
  background-color: var(--ui-dark);
  text-transform: capitalize;
}

@media (max-width: 500px) {
  .entity {
    display: none;
  }
}

.message {
  flex: 1 1;
  padding: 3px 10px;
  margin: none;
  color: var(--text);
  background-color: var(--ui);
}
</style>
