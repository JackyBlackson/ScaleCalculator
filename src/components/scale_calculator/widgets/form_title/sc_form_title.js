import {ScaleCalculatorProject} from "@/datatypes/scale_calculator/scale_calculator_project";
import {Button, InputNumber, message, Popover, Space} from "antd";
import BiIcon from "@/components/util/bi_icon";
import {useContext} from "react";
import {SCProjectContext} from "@/components/providers/sc_project_provider";

/**
 *
 * @param scProject : ScaleCalculatorProject
 * @return {JSX.Element}
 * @constructor
 */
export default function SCFormTitleItem({uuid, name}) {
    const { scProject, setSCProject } = useContext(SCProjectContext);

    const onRenameUnitClick = (e) => {
        const newName = prompt("重命名：请输入单位名称", name)
        if(!newName) {
            return;
        }
        if(scProject.containsUnit(newName)) {
            message.warning(`名为${newName}的单位已经存在，请换一个名字`)
            return;
        }
        const success = scProject.unitMap.set(uuid, newName);
        if(success) {
            setSCProject(scProject);
        } else {
            message.error(`以${newName}为名称创建单位失败，发生了未知错误`)
        }
    }

    const onNormalizeClick = (e) => {
        scProject.normalizeUnifiedScalesTo(uuid);
        setSCProject(scProject);
    }

    const onDeleteClick = (e) => {
        if(!confirm("删除单位：您是否要删除单位 “" + name + "”？这会【一并删除】包含此单位的比例尺以及记录！请确认：")) {
            message.info("您已取消删除单位")
            return;
        }
        //clears unit
        scProject.unitMap.delete(uuid);
        //clears unified scale
        scProject.unifiedScaleMap.delete(uuid);
        //clears unified target
        if(uuid === scProject.unifiedTarget) {
            scProject.unifiedTarget = null;
        }
        //clears scales list
        scProject.scaleDefinitionList = scProject.scaleDefinitionList.filter(scales => {
            for(let i = 0; i < scales.scales.length; i++) {
                if(scales.scales[i].unitUuid === uuid) {
                    console.log("delete scale: ", scales)
                    return false;
                }
            }
            return true;
        })
        //clears record list
        scProject.recordList = scProject.recordList.filter(record => {
            console.log("record.unitUuid", record.unitUuid)
            console.log("uuid", uuid)
            console.log("keep record? ", record.unitUuid !== uuid);
            return record.unitUuid !== uuid;
        })
        scProject.calculateUnifiedScalers();
        setSCProject(scProject);
    }

    const content = <>
        <Button type="primary" shape="circle"  className={"m-1"} onClick={onNormalizeClick}><BiIcon bicode={"1-square"} /></Button>
        <Button default shape="circle" className={"m-1"} onClick={onRenameUnitClick}><BiIcon bicode={"pencil-square"} /></Button>
        <Button danger type={"dashed"} shape="circle" className={"m-1"} onClick={onDeleteClick}><BiIcon bicode={"trash"} /></Button>
    </>

    const onClick = (e) => {

    }

    return (
        <Space>
        <Popover content={content}>
            <div className={"m-1 ScaleCalculatorFormArea"} onClick={onClick}>
                <strong>{name}</strong>
            </div>
        </Popover>
        </Space>
    )
}