import ContextMenu from "./ContextMenu";

const defaultOptions = {
  defaultFuncName: "contextMenuItems"
};

export default {
  install(Vue, opts) {
    // Merge options argument into options defaults
    const options = {...defaultOptions, ...opts };

    Vue.mixin({
      methods: {
        hideContextMenu() {
          root.$data.items = [];
        }
      }
    });
    Vue.directive("contextmenu", {
      bind(el, binding, vnode) {
        let build = binding.value;
        if (build !== undefined) {
          if (typeof build !== "function") { // If not a function,
            if (typeof build[Symbol.iterator] === "function") { // Is it iterable?
              build = (vm, args) => [].concat(build);
            } else {
              Vue.util.warn(`v-${binding.name}="${binding.expression}" expects either a function value or an iterable value. Recieved: ${build}`);
            }
          }
        } else {
          build = (vm, args) => vm[options.defaultFuncName](vm, args)
        }
        let bubble = !binding.modifiers.stop;
        el.addEventListener("contextmenu", showMenuHandler(vnode, build, bubble), false);
      }
    });

    // Create plugin's root Vue instance
    const root = new Vue({
      data: {
        items: [],
        pos: {
          x: 0,
          y: 0
        }
      },
      components: {ContextMenu},
      template: `<ContextMenu
        :items="items"
        :pos="pos"
      />`
    });

    // Mount root Vue instance on new div element added to body
    root.$mount(document.body.appendChild(document.createElement("div")));

    let contextEvent;
    function showMenuHandler(vnode, buildFunc, bubble) {
      return function(event) {
        if (event !== contextEvent) {
          contextEvent = event;
          root.$data.pos = { x: event.x, y: event.y };
          root.$data.items = [];
          console.log(root.$data)
        }
        event.preventDefault()
        if (!bubble) {
          event.stopPropagation()
        }
        let items = buildFunc(vnode.context, {event, menuitems: root.$data.items});
        root.$data.items.push(...items);
      };
    }
  }
};
