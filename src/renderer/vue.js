const setting_data = await qqpromote.getSettings()

function watchComponentMount(component) {
    if (component.vnode.props?.['msg-record']) {
        component.vnode = new Proxy(component.vnode, {
            get(target, prop) {
                if (prop === "el" && setting_data?.setting.message_merging) {
                    /**
                     * @type {HTMLElement}
                     */
                    const node = target[prop]
                    const msgRecord = target.props['msg-record']
                    const userName = node?.querySelector(".user-name .text-ellipsis")
                    if (userName) {
                        if (msgRecord?.qqpromote?.chatType == "child") {
                            node.classList.remove('main')
                            node.classList.add('child')
                        } else {
                            node.classList.remove('child')
                            node.classList.add('main')
                        }
                    }
                }
                return target[prop];
            }
        });
    }
}

export function hookVue3() {
    window.Proxy = new Proxy(window.Proxy, {
        construct(target, [proxyTarget, proxyHandler]) {
            const component = proxyTarget?._;
            if (component?.uid >= 0) {
                const element = component.vnode.el;
                element ?? watchComponentMount(component)
            }
            return new target(proxyTarget, proxyHandler);
        },
    });
}
