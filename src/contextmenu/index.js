import ContextMenu from "./ContextMenu";

export default {
  install(Vue, opts) {
    // Merge options argument into options defaults
    const options = opts; //TODO: {...optionsDefaults, ...opts };

    // Create plugin's root Vue instance
    const root = new Vue({
      data: {data: {
        items: [],
        pos: {
          x: 0,
          y: 0
        }
      }},
      render: createElement => createElement(ContextMenu)
    });

    // Mount root Vue instance on new div element added to body
    root.$mount(document.body.appendChild(document.createElement("div")));

    function showMenuHandler(vm, buildFunc, bubble) {
      return function(event) {
        event.preventDefault()
        let pos = { x: event.x, y: event.y };
        let items = buildFunc(vm, {event, menuitems: []});
        if (bubble) {
          let comp = vm.$parent;
          while (comp) {
            let directives = comp.data.directives.filter((d) => d.name === "contextmenu");
            if (directives.length) {
              items.concat(directives[0].value(vm, {event, menuitems: items}));
            }
            /*let e = comp.contextMenuItems(comp, items, event) || [];
            items = [].concat(items, e);*/
            console.log(comp); //XXX
            comp = comp.$parent;
          }
        }
        console.log(items)
        root.data = {items, pos};
        console.log(ContextMenu)
        root.$nextTick(() => root.data.pos = pos);
      };
    }

    Vue.mixin({
      methods: {
        contextMenuItems(vm, {menuitems, event}) {
          return menuitems.map((v) => v.text).includes("WhoAmI?") ? [] : [{text: "WhoAmI?", call(){console.log(vm);}}];
        },
        /*hideContextMenu() {
          root.data.items = [];
        }*/
      }
    });
    Vue.directive("contextmenu", {
      bind(el, binding, vnode) {
        let build = binding.value;
        console.log(build)
        if (build !== undefined) {
          if (typeof build !== "function") { // If not a function,
            if (typeof build[Symbol.iterator] === "function") { // Is it iterable?
              build = (vm, args) => [].concat(build);
            } else {
              Vue.util.warn(`v-${binding.name}="${binding.expression}" expects either a function value or an iterable value. Recieved: ${build}`);
            }
          }
        } else {
          build = (vm, args) => vm.context.contextMenuItems(vm, args)
        }
        let bubble = !binding.modifiers.stop;
        el.addEventListener("contextmenu", showMenuHandler(vnode, build, bubble), false);
      }
    });
  }
};
