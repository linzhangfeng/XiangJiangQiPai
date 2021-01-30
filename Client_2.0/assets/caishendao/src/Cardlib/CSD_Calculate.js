//有财神数据
let TextData = [
    [1, 2, 3], [2, 3, 4], [2, 4, 3], [7, 2, 9], [6, 7, 9]
];

//有金锣数据
// let TextData = [
//     [1, 2, 3], [2, 3, 10], [2, 4, 10], [7, 2, 10], [6, 7, 9]
// ];
module.exports.TextData = TextData;

let GameCSDDef = {
    ELE_CT_HULU: 0x00,					    //葫芦
    ELE_CT_BAOZI: 0x01,					    //包子
    ELE_CT_TAOZI: 0x02,					    //桃子
    ELE_CT_CUIYU: 0x03,				        //翠玉
    ELE_CT_FUDAI: 0x04,					    //福袋
    ELE_CT_JINYU: 0x05,					    //金鱼
    ELE_CT_LAOTOU: 0x06,					//老头
    ELE_CT_HESHANG: 0x07,					//和尚
    ELE_CT_GUANYUAN: 0x08,					//官员
    ELE_CT_CAISHENDAO: 0x09,			    //财神
    ELE_CT_JINLUO: 0x0a,
}
module.exports.GameCSDDef = GameCSDDef;
let PeiLv = {};
PeiLv[GameCSDDef.ELE_CT_HULU] = {3: 0.2, 4: 0.6, 5: 3};
PeiLv[GameCSDDef.ELE_CT_BAOZI] = {3: 0.2, 4: 0.6, 5: 3};
PeiLv[GameCSDDef.ELE_CT_TAOZI] = {3: 0.2, 4: 0.8, 5: 4};
PeiLv[GameCSDDef.ELE_CT_CUIYU] = {3: 0.2, 4: 1.2, 5: 4};
PeiLv[GameCSDDef.ELE_CT_FUDAI] = {3: 0.2, 4: 1.2, 5: 4};
PeiLv[GameCSDDef.ELE_CT_JINYU] = {3: 0.6, 4: 2, 5: 8};
PeiLv[GameCSDDef.ELE_CT_LAOTOU] = {3: 0.6, 4: 4, 5: 10};
PeiLv[GameCSDDef.ELE_CT_HESHANG] = {3: 0.6, 4: 4, 5: 10};
PeiLv[GameCSDDef.ELE_CT_GUANYUAN] = {3: 1, 4: 6, 5: 12};
PeiLv[GameCSDDef.ELE_CT_CAISHENDAO] = {3: 0, 4: 0, 5: 0};
PeiLv[GameCSDDef.ELE_CT_JINLUO] = {3: 0, 4: 0, 5: 0};
module.exports.PeiLv = PeiLv;

let GameLogic = {

    _calculateGlow(kaijiangData) {
        let cellLines = [
            {cellIdx: kaijiangData[0][0], lineArray: [[{x: 0, y: 0}]]},
            {cellIdx: kaijiangData[0][1], lineArray: [[{x: 0, y: 1}]]},
            {cellIdx: kaijiangData[0][2], lineArray: [[{x: 0, y: 2}]]}
        ];
        for (let colIdx = 1; colIdx < kaijiangData.length; colIdx++) {
            for (let rowIdx = 0; rowIdx < 3; rowIdx++) {
                let cellIdx = kaijiangData[colIdx][rowIdx];
                for (let i = 0; i < 3; i++) {
                    let cell = cellLines[i];
                    if (cell.cellIdx == null || cell.cellIdx == 0) {
                        console.log("==> error ..........");
                    }
                    // 如果图案一样
                    if (cell.cellIdx == cellIdx || (cell.cellIdx != GameCSDDef.ELE_CT_JINLUO && cellIdx == GameCSDDef.ELE_CT_CAISHENDAO)) {
                        let linesOfCell = cell.lineArray;
                        let extraLineArray = [];
                        for (let j = 0; j < linesOfCell.length; j++) {
                            let subLine = linesOfCell[j];
                            //
                            if (subLine.length == colIdx) {
                                let lineArrayCpy = JSON.parse(JSON.stringify(subLine));
                                lineArrayCpy.push({x: colIdx, y: rowIdx});
                                extraLineArray.push(lineArrayCpy);
                            }
                        }
                        for (let j = 0; j < extraLineArray.length; j++) {
                            linesOfCell.push(extraLineArray[j]);
                        }
                    }
                }

            }
        }
        let allLinesArray = []
        //整理得到的线
        for (let idx = 0; idx < cellLines.length; idx++) {
            let lineArray = cellLines[idx].lineArray;
            let maxLen = 0;
            for (let i = 0; i < lineArray.length; i++) {
                let line = lineArray[i];
                if (line.length >= 3) maxLen = Math.max(maxLen, line.length);
            }
            for (let i = 0; i < lineArray.length; i++) {
                let line = lineArray[i];
                if (line.length >= 3 && line.length >= maxLen) allLinesArray.push(line);
            }
        }

        console.log("cellIdx " + cellLines[0].cellIdx + " line count:" + cellLines[0].lineArray.length);
        console.log("cellIdx " + cellLines[1].cellIdx + " line count:" + cellLines[1].lineArray.length);
        console.log("cellIdx " + cellLines[2].cellIdx + " line count:" + cellLines[2].lineArray.length);
        console.log("all lines: " + allLinesArray.length);
        console.log("站");
        return allLinesArray;
    }
}

module.exports.GameLogic = GameLogic;

function main() {
    let allLinesArray = GameLogic._calculateGlow(TextData);
    console.log("lin=allLinesArray:" + JSON.stringify(allLinesArray));
}

main();
