export class ComponentRegistry {
    static register(components) {
        components.forEach(component => {
            if (component.extends)
                customElements.define(component.tagName, component.component, { extends: component.extends });
            else
                customElements.define(component.tagName, component.component);
        });
    }
}
