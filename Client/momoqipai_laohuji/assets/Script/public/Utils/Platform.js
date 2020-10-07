window.Platform = {
    toHall: function () {
        window.require(Utils.getSavePath() + Model.packageName + '/src/hall.js');
    },
};