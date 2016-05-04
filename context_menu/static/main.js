var UICollection;
(function (UICollection) {
    var MenuState;
    (function (MenuState) {
        MenuState[MenuState["INACTIVE"] = 0] = "INACTIVE";
        MenuState[MenuState["ACTIVE"] = 1] = "ACTIVE";
    })(MenuState || (MenuState = {}));
    var MouseButtonCode;
    (function (MouseButtonCode) {
        MouseButtonCode[MouseButtonCode["LEFT"] = 0] = "LEFT";
        MouseButtonCode[MouseButtonCode["MIDDLE"] = 1] = "MIDDLE";
        MouseButtonCode[MouseButtonCode["RIGHT"] = 2] = "RIGHT";
    })(MouseButtonCode || (MouseButtonCode = {}));
    var Mouse = (function () {
        function Mouse() {
        }
        Mouse.getPosition = function (event) {
            return {
                x: event.pageX,
                y: event.pageY
            };
        };
        return Mouse;
    }());
    UICollection.Mouse = Mouse;
    var ContextMenu = (function () {
        function ContextMenu(context_menu_selector, target_selector) {
            this.menu_state = MenuState.INACTIVE;
            this.menu = $("." + context_menu_selector);
            this.target_class_name = target_selector;
            this.target = $("." + target_selector);
            this.addContextMenuListener_();
            this.addClickListener_();
            this.addResizeListener_();
        }
        ContextMenu.prototype.SetMenuItemListener = function (menu_item_listener) {
            this.menu_item_listener = menu_item_listener;
        };
        ContextMenu.prototype.clickInsideTarget_ = function (event, class_name) {
            var element = event.srcElement || event.target;
            if (element.classList.contains(class_name)) {
                return element;
            }
            else {
                while (element = element.parentElement) {
                    if (element.classList &&
                        element.classList.contains(class_name)) {
                        return element;
                    }
                }
            }
            return null;
        };
        ContextMenu.prototype.toggleMenuOn_ = function () {
            if (this.menu_state != MenuState.ACTIVE) {
                this.menu_state = MenuState.ACTIVE;
                this.menu.addClass("active");
            }
        };
        ContextMenu.prototype.toggleMenuOff_ = function () {
            if (this.menu_state != MenuState.INACTIVE) {
                this.menu_state = MenuState.INACTIVE;
                this.menu.removeClass("active");
            }
        };
        ContextMenu.prototype.addContextMenuListener_ = function () {
            var _this = this;
            $(document).on("contextmenu", function (event) {
                if (_this.clickInsideTarget_(event, _this.target_class_name)) {
                    event.preventDefault();
                    _this.toggleMenuOn_();
                    _this.positionMenu_(event);
                }
                else {
                    _this.toggleMenuOff_();
                }
            });
        };
        ContextMenu.prototype.addClickListener_ = function () {
            var _this = this;
            $(document).on("click", function (event) {
                var clicked_item = _this.clickInsideTarget_(event, "item");
                if (clicked_item) {
                    event.preventDefault();
                    if (_this.menu_item_listener) {
                        _this.menu_item_listener(event);
                    }
                    _this.toggleMenuOff_();
                }
                else {
                    var button_code = event.button;
                    if (button_code == MouseButtonCode.LEFT) {
                        _this.toggleMenuOff_();
                    }
                }
            });
        };
        ContextMenu.prototype.addResizeListener_ = function () {
            var _this = this;
            $(window).on("resize", function (event) {
                _this.toggleMenuOff_();
            });
        };
        ContextMenu.prototype.positionMenu_ = function (event) {
            this.menu_position = Mouse.getPosition(event);
            var menu_width = this.menu.outerWidth(true);
            var menu_height = this.menu.outerHeight(true);
            var window_width = window.innerWidth;
            var window_height = window.innerHeight;
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
        };
        return ContextMenu;
    }());
    UICollection.ContextMenu = ContextMenu;
})(UICollection || (UICollection = {}));
$(function () {
    var ctx_menu = new UICollection.ContextMenu("context-menu", "task");
    ctx_menu.SetMenuItemListener(function (event) {
        console.log(event.target.getAttribute("data-action"));
    });
});
//# sourceMappingURL=main.js.map