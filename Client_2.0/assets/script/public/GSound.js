window.GSound =
{
    playEffect:function(file,loop)
    {
        if (loop == null) loop = false;
        return cc.audioEngine.play(cc.url.raw('resources/'+file), loop, 1);
    },
    stopEffect:function(id)
    {
        cc.audioEngine.stop(id)
    },
};