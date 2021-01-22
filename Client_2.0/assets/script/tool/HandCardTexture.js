/*jshint esversion:6 */
//纹理类型
var HAND        = 0; //手牌 可见|不可见
var HANDDATA    = 1; //手牌数据 可见|不可见
var BACK        = 2; //牌背 不可见  
var OUT         = 3; //出牌 可见
var END         = 4; //结束类型

var ATLAS_TEX = cc.Class
({
    extends: cc.Component,

    statics:
        {
            instance:null,
        },

    properties:
        {
            //纹理模板
            handcardAtlas:  cc.SpriteAtlas,         //手牌合集
            spCardHand:     [cc.SpriteFrame],       //手牌默认
            spCardHandData: [cc.SpriteFrame],       //手牌可见
            spCardHandBack: [cc.SpriteFrame],       //手牌胡牌 node
            spCardOut:      [cc.SpriteFrame],       //出牌组件
            spEndCard:      [cc.SpriteFrame],       //结束扑克
        },

    //
    onLoad()
    {
        ATLAS_TEX.instance = this;
    },

    //getmjframe
    GetMJFrame(strTemplate,wViewID,cbData)
    {
        let cbColor = MJ_GetColor(cbData);
        let cbValue = MJ_GetValue(cbData)+1;

        let index = cbColor*9 + cbValue;
        let strIndex = parseInt(index/10) + "" + parseInt(index%10);

        let nameTemplate = "";
        if( strTemplate=="CardHand" || strTemplate==HAND )
        {
            //永远可见
            if( wViewID==0 )
            {
                if( cbData==255 )
                {
                    nameTemplate = this.spCardHandBack[wViewID].name;
                }
                else
                {
                    nameTemplate = this.spCardHand[wViewID].name.split("_")[0];
                    nameTemplate = nameTemplate + "_" + strIndex;
                }
            }
            else
            {
                //不可见
                if( cbData==255 )
                {
                    nameTemplate = this.spCardHandData[wViewID].name;
                }
                //可见
                else
                {
                    nameTemplate = this.spCardHand[wViewID].name;
                }
            }
        }
        else if(strTemplate=="CardHandData" || strTemplate==HANDDATA )
        {
            if(cbData==255)
            {
                nameTemplate = this.spCardHand[wViewID].name;
            }
            else
            {
                nameTemplate = this.spCardHandData[wViewID].name.split("_")[0];
                nameTemplate = nameTemplate + "_" + strIndex;
            }
        }
        else if(strTemplate=="CardHandBack" || strTemplate==BACK )
        {
            nameTemplate = this.spCardHandBack[wViewID].name;
        }
        else if(strTemplate=="CardOut" || strTemplate==OUT )
        {
            if( cbData==255 )
            {
                nameTemplate = this.spCardHandBack[wViewID].name;
            }
            else
            {
                nameTemplate = this.spCardOut[wViewID].name.split("_")[0];
                nameTemplate = nameTemplate + "_" + strIndex;
            }
        }
        else if(strTemplate=="CardEnd" || strTemplate==END )
        {
            if( cbData==255 )
            {
                nameTemplate = this.spEndCard[0].name;
            }
            else
            {
                nameTemplate = this.spEndCard[1].name.split("_")[0];
                nameTemplate = nameTemplate + "_" + strIndex;
            }
        }

        let spCardFrame = this.handcardAtlas.getSpriteFrame(nameTemplate);
        cc.assert(spCardFrame,"not find spCardFrame");
        return spCardFrame;
    },

    //getpkframe
    GetPkFrame(cbData)
    {
        let strCardName = "pk_" + parseInt(cbData/10) +""+ cbData%10;
        let spCardFrame = this.handcardAtlas.getSpriteFrame(strCardName);
        return spCardFrame;
    },
});

//get mj spriteframe
ATLAS_TEX.GetMJFrame=function(cbType,wViewID=0,cbData=255)
{
    if( ATLAS_TEX.instance )
        return ATLAS_TEX.instance.GetMJFrame(cbType, wViewID, cbData);
    cc.assert(false,"error");
};

//get pk spriteframe
ATLAS_TEX.GetPkFrame=function(cbData=0x51)
{
    if( ATLAS_TEX.instance )
        return ATLAS_TEX.instance.GetPkFrame(cbData);
};

ATLAS_TEX.HAND = HAND;
ATLAS_TEX.HANDDATA = HANDDATA;
ATLAS_TEX.BACK = BACK;
ATLAS_TEX.OUT = OUT;
ATLAS_TEX.END = END;

module.exports = ATLAS_TEX;