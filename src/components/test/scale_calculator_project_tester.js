'use client'
import {ScaleCalculatorProject} from "@/datatypes/scale_calculator/scale_calculator_project";
import AlertStatic from "@/components/util/alert_static";
import log from "@/utilities/detailed_logger";
import ScaleCalculatorDisplay from "@/components/scale_calculator/scale_calculator_display";

export default function ScaleCalculatorProjectTester() {

    log("ScaleCalculatorProjectTester");

    const sc = new ScaleCalculatorProject();

    //add unit
    const uuidA = sc.addUnit("a")
    console.log("add unit a first time: ", uuidA)
    console.log("add unit a second time: ", sc.addUnit("a"))
    const uuidB = sc.addUnit("b")
    console.log("add unit b first time: ", uuidB)
    const uuidC = sc.addUnit("c")
    console.log("add unit b first time: ", uuidC)
    const uuidD = sc.addUnit("d")
    console.log("add unit b first time: ", uuidD)
    console.log("scp currently", sc);

    //add scaler
    console.log("add scaler a->1, b->2")
    sc.scaleDefinitionList.push(
        [
            {
                unitUuid: uuidA,
                value: 1,
            },
            {
                unitUuid: uuidB,
                value: 2,
            }
        ]
    );
    console.log("scp currently", sc);
    console.log("add scaler b->1, c->2, d->3")
    sc.scaleDefinitionList.push(
        [
            {
                unitUuid: uuidB,
                value: 1,
            },
            {
                unitUuid: uuidC,
                value: 2,
            },
            {
                unitUuid: uuidD,
                value: 3,
            },
        ]
    );
    console.log("scp currently", sc);
    const ableToCalculate = sc.canCalculateUnifiedScales()
    console.log("scp able to calculate", ableToCalculate);

    console.log("calculate unified scales")
    sc.unifiedTarget = uuidC;
    console.log("set unifiedTarget to Unit C")
    const calculateStatus = sc.calculateUnifiedScalers();
    console.log("calculate successful ", calculateStatus);
    console.log("scp currently", sc);
    sc.normalizeUnifiedScalesTo(uuidD);
    console.log("scp currently", sc);
    sc.normalizeUnifiedScalesTo(uuidA);
    console.log("scp currently", sc);
    return (
        <div>
            <ScaleCalculatorDisplay scProject={sc}/>
        </div>
    )
}