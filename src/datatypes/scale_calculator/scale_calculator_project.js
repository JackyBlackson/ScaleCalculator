import {generateUUID} from "@/utilities/uuid_utilities";
import {mapToObj, objToMap} from "@/utilities/map_util";
import {message} from "antd";

export class ScaleCalculatorProject {
    /**
     *
     * @param unitMap : Map
     * @param scaleDefinitionList : Array
     * @param recordList : Array
     * @param color : String
     */
    constructor() {
        /**
         * uuid -> name map of the units
         * @type {Map<String, String>}
         */
        this.unitMap = new Map();
        /**
         * Array of [
         *     {
         *         unitUuid,
         *         value
         *     },
         *     ...
         * ]
         * @type {Array<Object>}
         */
        this.scaleDefinitionList = [];
        /**
         * Array of [
         *     {
         *         unitUuid,
         *         value
         *     },
         *     ...
         * ]
         * @type {Array}
         */
        this.recordList = [];
        /**
         * unit uuid -> scale number of the units
         * @type {Map<String, Number>}
         */
        this.unifiedScaleMap = new Map();
        /**
         * unit uuid of the unify target when calculating unified scales
         * @type {String | null}
         */
        this.unifiedTarget = null;
        this.color = "4b0082"
        this.uuid = generateUUID();
        this.calculateResult = [];
        this.name = "默认创建的第一个工程";
    }

    static from(object) {
        const newInstance = new ScaleCalculatorProject();

        newInstance.unitMap = new Map(Array.from(object.unitMap));
        newInstance.scaleDefinitionList = Array.from(object.scaleDefinitionList);
        newInstance.recordList = object.recordList.map(record => record);
        newInstance.unifiedScaleMap = new Map(Array.from(object.unifiedScaleMap));
        newInstance.unifiedTarget = object.unifiedTarget;
        newInstance.color = object.color || "4b0082";
        newInstance.calculateResult = object.calculateResult?Array.from(object.calculateResult):[]
        if (object.uuid) {
            newInstance.uuid = object.uuid;
        } else {
            newInstance.uuid = generateUUID();
        }
        newInstance.name = object.name ? object.name : "ScaleCalculatorPro工程";

        return newInstance;
    }

    static deserializeFromObject(object) {
        object.unitMap = objToMap(object.unitMap);
        object.unifiedScaleMap = objToMap(object.unifiedScaleMap);
        return ScaleCalculatorProject.from(object);
    }

    getSerializableObject() {
        const newInstance = ScaleCalculatorProject.from(this);
        newInstance.unitMap = mapToObj(this.unitMap);
        newInstance.unifiedScaleMap = mapToObj(this.unifiedScaleMap);
        return newInstance;
    }

    canCalculateUnifiedScales() {

        if (!this.scaleDefinitionList || this.scaleDefinitionList.length === 0) {
            return false;
        }
        /**
         *
         * @type Set<String>[]
         */
        let trees = [];

        console.log("this.scaleDefinitionList", this.scaleDefinitionList)
        //收集比例尺信息
        //对每一个比例尺
        this.scaleDefinitionList.forEach((scaleDefinition, index, array) => {
            console.log("scaleDefinition", scaleDefinition)
            let connectTrees = []
            //对每一个树
            trees.forEach((tree, index, array) => {
                console.log("tree", tree)
                let unitCount = 0;
                scaleDefinition.scales.forEach((scale, index, array) => {
                    if (tree.has(scale.unitUuid)) {
                        unitCount++;
                    }
                })
                if (unitCount > 1) {
                    console.log("CAN'T CALCULATE: SCALE DUPLICATED")
                    message.error("计算失败：比例尺重叠，请编辑比例尺后重试")
                    return false;
                } else if (unitCount === 1) {
                    //如果是和这个树连接的
                    //那么合并比例尺
                    scaleDefinition.scales.forEach((scale, index, array) => {
                        tree.add(scale.unitUuid);
                    })
                    connectTrees.push(tree);
                }
            })
            if (connectTrees.length > 1) {
                let combinedTree = new Set();
                connectTrees.forEach(tree => {
                    // move it to new tree
                    tree.forEach(value => {
                        combinedTree.add(value);
                    });

                    // remove original tree from trees
                    trees = trees.filter(t => t !== tree);
                });
            } else if (connectTrees.length < 1) {
                console.log("no match tree, add one")
                const newTree = new Set();
                scaleDefinition.scales.forEach((scale, index, array) => {
                    newTree.add(scale.unitUuid);
                })
                trees.push(newTree)
                console.log("new Tree: ", newTree)
            }
        })

        // 如果有多颗树，也不能计算
        if (trees.length > 1) {
            console.log("CAN'T CALCULATE: MORE THAN ONE SCALE TREE")
            message.error("计算失败：比例尺不连通，具有多个独立的部分")
            return false;
        }

        return true;
    }

    calculate(unitUuid, value) {
        if(this.unifiedScaleMap.has(unitUuid)) {
            const result = [];
            const fixValue = this.unifiedScaleMap.get(unitUuid);
            this.unifiedScaleMap.forEach((scale, uuid) => {
                result.push({
                    unitUuid: uuid,
                    value: scale * value / fixValue,
                    isOrigin: unitUuid === uuid
                })
            })
            return result;
        } else {
            return [];
        }
    }

    createRecord(unitUuid, value, name) {
        this.recordList.push({
            uuid: generateUUID(),
            unitUuid: unitUuid,
            value: value,
            name: name,
        })
    }

    calculateUnifiedScalers() {
        /*
        A. 首先你需要调用canCalculateUnifiedScales方法来检查是否具有计算的条件。如果无法计算，那么请返回false；

        B. 然后，请你根据上面对比例尺的定义，将 this.unifiedTarget （uuid）对应的单位的统一比例尺值设为1，
        （如果unifiedTarget 则采用单位map中的第一个单位，并将unifiedTarget 设置为这个单位的uuid），并据此计算统一比例尺。

        例如我们有四个单位：a, b, c, d，我们的比例尺有两条：
            1. a -> 1, b->2（表示1个单位a对应2个单位b）
            2. b->1, c->2, d->3（表示一个单位b对应2个单位c对应3个单位d）
        假设设置b为unifiedTarget，那么计算过程应该类似：
            1）取第一个比例尺，现在 a->1, b->2
            2）取第二个比例尺，现在 已经计算的单位是a和b，而第二个比例尺有且仅有单位b和已计算单位集合重合
                （这一点在canCalculateUnifiedScales中已经确保），
                因此以单位b为中心计算现在统一比例尺中b的值为2，
                因此c对应值为 统一比例尺中b的值*比例尺2中c的值，也就是2*2=4；
                类似的d的值为 统一比例尺中b的值*比例尺2中d的值，也就是 2*3=6；
                因此当前统一比例尺是：a->1, b->2, c->4, d->6
            3）调整unifiedTarget对应值为1，因此需要把比例尺整体除以unifiedTarget在统一比例尺中的值。
                因此 a->a/b=0.5, b->b/b=1, c->c/b=2, d->d/b=3；
                因此最终得到的统一比例尺为a->0.5, b->1, c->2, d->3
         */
        this.unifiedScaleMap = new Map();
        if(!this.canCalculateUnifiedScales()) {
            return false;
        }

        let visitedUnits = new Set();
        let visitedScaleIndex = new Set()
        //先把第一个比例尺装进去，以此为起点
        this.scaleDefinitionList[0].scales.forEach((scale, index, array) => {
            this.unifiedScaleMap.set(scale.unitUuid, scale.value);
            visitedUnits.add(scale.unitUuid);
        })
        visitedScaleIndex.add(0)
        //然后逐步构建树
        while(visitedScaleIndex.size < this.scaleDefinitionList.length){
            this.scaleDefinitionList.forEach((scaleDefinition, index, array) => {
                console.log("index", index)
                if (!visitedScaleIndex.has(index)) {
                    console.log("is not visited", index)
                    //先收集，看和当前已访问的部分有无交集
                    let pivotUnit = null;
                    let pivotScaleValue = -1;
                    scaleDefinition.scales.forEach((scale, index, array) => {
                        if(visitedUnits.has(scale.unitUuid)) {
                            pivotUnit = scale.unitUuid;
                            pivotScaleValue = scale.value;
                        }
                    })
                    if(pivotUnit) {
                        console.log("have pivot point", index)
                        let unifiedPivotValue = this.unifiedScaleMap.get(pivotUnit);
                        scaleDefinition.scales.forEach((scale, index, array) => {
                            this.unifiedScaleMap.set(scale.unitUuid , unifiedPivotValue / pivotScaleValue * scale.value)
                            visitedUnits.add(scale.unitUuid)
                        })
                        visitedScaleIndex.add(index)
                    }
                }
            })
        }
        //最后归一化单位
        if(!this.unifiedTarget) {
            this.unifiedTarget = this.scaleDefinitionList[0].scales[0].unitUuid;
        }
        const unifyUnitValue = this.unifiedScaleMap.get(this.unifiedTarget);
        this.unifiedScaleMap.forEach((value, key, map) => {
            this.unifiedScaleMap.set(key, value/unifyUnitValue)
        })
        return true;
    }

    normalizeUnifiedScalesTo(unitUuid) {
        //最后归一化单位
        this.unifiedTarget = unitUuid;
        this.calculateUnifiedScalers();
        return true;
    }

    /**
     * Checks if the unit name is already in the project
     * @param name : String
     * @return {boolean}
     */
    containsUnit(name) {
        for (const unitName of this.unitMap.values()) {
            if (name === unitName) {
                return true;
            }
        }
        return false;
    }

    /**
     * Adds a new unit to the project
     * Will return false when the unit is already in the project
     * Check this.containsUnit's doc
     * @param name : String
     * @return {string | null}
     */
    addUnit(name) {
        if (this.containsUnit(name)) {
            return null;
        }
        const uuid = generateUUID()
        this.unitMap.set(uuid, name);
        return uuid;
    }

    /**
     *
     * @param name : String
     * @return {string}
     */
    getUnitUuid(name) {
        let result = ""
        this.unitMap.forEach((unitName, uuid, map) => {
            if(unitName === name) {
                result = uuid;
            }
        })
        return result;
    }
}

export const testScaleCalculatorProject = () => {

}
