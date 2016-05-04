namespace UICollection {
    enum MenuState {
        INACTIVE = 0,
        ACTIVE = 1
    }

    enum MouseButtonCode {
        LEFT = 0,
        MIDDLE = 1,
        RIGHT = 2
    }

    interface MousePosition {
        x: number;
        y: number;
    }

    export class Mouse {
        static getPosition(event: JQueryMouseEventObject): MousePosition {
            return {
                x: event.pageX,
                y: event.pageY
            }
        }
    }

    interface MenuItemListener { (event: JQueryEventObject): any }

    export class ContextMenu {
        private menu: JQuery;
        private menu_state = MenuState.INACTIVE;
        private target: JQuery;
        private target_class_name: string;
        private menu_position: MousePosition;
        private menu_item_listener: MenuItemListener;

        constructor(context_menu_selector: string, target_selector: string) {
            this.menu = $("." + context_menu_selector);
            this.target_class_name = target_selector;
            this.target = $("." + target_selector);
            this.addContextMenuListener_();
            this.addClickListener_();
            this.addResizeListener_();
        }

        public SetMenuItemListener(menu_item_listener: MenuItemListener) {
            this.menu_item_listener = menu_item_listener;
        }

        private clickInsideTarget_(event: JQueryMouseEventObject, class_name: string): Element {
            let element: Element = event.srcElement || event.target;
            if (element.classList.contains(class_name)) {
                return element;
            } else {
                while (element = element.parentElement) {
                    if (element.classList &&
                        element.classList.contains(class_name)) {
                        return element;
                    }
                }
            }
            return null;
        }

        private toggleMenuOn_(): void {
            if (this.menu_state != MenuState.ACTIVE) {
                this.menu_state = MenuState.ACTIVE;
                this.menu.addClass("active");
            }
        }

        private toggleMenuOff_(): void {
            if (this.menu_state != MenuState.INACTIVE) {
                this.menu_state = MenuState.INACTIVE;
                this.menu.removeClass("active");
            }
        }


        private addContextMenuListener_(): void {
            $(document).on("contextmenu", (event: JQueryMouseEventObject) => {
                if (this.clickInsideTarget_(event, this.target_class_name)) {
                    event.preventDefault();
                    this.toggleMenuOn_();
                    this.positionMenu_(event);
                } else {
                    this.toggleMenuOff_();
                }
            });
        }

        private addClickListener_(): void {
            $(document).on("click", (event) => {
                let clicked_item = this.clickInsideTarget_(event, "item");
                if (clicked_item) {
                    event.preventDefault();
                    if (this.menu_item_listener) {
                        this.menu_item_listener(event);
                    }
                    this.toggleMenuOff_();
                } else {
                    let button_code = event.button;
                    if (button_code == MouseButtonCode.LEFT) {
                        this.toggleMenuOff_();
                    }
                }
            });
        }

        private addResizeListener_(): void {
            $(window).on("resize", (event: JQueryEventObject) => {
                this.toggleMenuOff_();
            });
        }

        private positionMenu_(event: JQueryMouseEventObject): void {
            this.menu_position = Mouse.getPosition(event);

            let menu_width = this.menu.outerWidth(true);
            let menu_height = this.menu.outerHeight(true);

            let window_width = window.innerWidth;
            let window_height = window.innerHeight;

            if ((window_width - this.menu_position.x) < menu_width) {
                this.menu_position.x = window_width - menu_width;
            }

            if ((window_height - this.menu_position.y) < menu_height) {
                this.menu_position.y = window_height - menu_height;
            }

            this.menu.offset({
                top: this.menu_position.y,
                left: this.menu_position.x
            });
        }
    }
}

$(function () {
    var ctx_menu = new UICollection.ContextMenu("context-menu", "task");
    ctx_menu.SetMenuItemListener((event: JQueryEventObject) => {
        console.log(event.target.getAttribute("data-action"));
    });
});
