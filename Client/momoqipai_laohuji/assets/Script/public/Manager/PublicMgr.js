window.PublicMgr = {
    rootNode: null,
    jsRootNode: null,
    init: function (rootNode) {
        this.rootNode = rootNode;
        this.jsRootNode = rootNode.getComponent("Help");

        this.show();
    },

    show: function () {
        Utils.setNodeVis(this.rootNode, true);
    },

    hide: function () {
        Utils.setNodeVis(this.rootNode, false);
    },
};