import {useContext} from "react";
import {SCProjectContext} from "@/components/providers/sc_project_provider";
import {Button, message, Popover, Space, Tooltip} from "antd";
import BiIcon from "@/components/util/bi_icon";

export default function SCFormScaleItem({name, scaleUuid, unitUuid}) {
    const { scProject, setSCProject } = useContext(SCProjectContext);

    const onModifyValue = (e) => {
        const value = Number.parseFloat(prompt("重命名：请输入单位名称", name))
        if(!value) {
            return;
        }
        let success = false;
        scProject.scaleDefinitionList.forEach(item => {
            if(item.uuid === scaleUuid) {
                item.scales.forEach(unitItem => {
                    if(unitItem.unitUuid === unitUuid) {
                        unitItem.value = value;
                        success = true;
                        message.success("成功修改比例尺定义数值")
                        return;
                    }
                })
                item.scales.push({
                    unitUuid: unitUuid,
                    value: value,
                })
                const calculateSuccess = scProject.calculateUnifiedScalers();
                if(!calculateSuccess) {
                    message.error("当前比例尺无法计算，请检查是否重叠或不连通")
                }
                setSCProject(scProject)
                message.success("成功为比例尺新增数据")
            }
        })
    }

    const onRemoveValue = (e) => {
        let success = false;
        scProject.scaleDefinitionList.forEach(item => {
            if(item.uuid === scaleUuid) {
                item.scales = item.scales.filter(unitItem => unitItem.unitUuid !== unitUuid)
                const calculateSuccess = scProject.calculateUnifiedScalers();
                if(!calculateSuccess) {
                    message.error("当前比例尺无法计算，请检查是否重叠或不连通")
                }
                setSCProject(scProject)
                success = true;
                message.success("成功删除比例尺中的项")
            }
        })
        if(!success) {
            message.error("无法删除比例尺中的这条记录")
        }
    }

    const content = <>
        <Tooltip title="修改数据" >
        <Button default shape="circle" className={"m-1"} onClick={onModifyValue}><BiIcon bicode={"pencil-square"} /></Button>
        </Tooltip>
        <Tooltip title="清空此项" >
        <Button danger type={"dashed"} shape="circle" className={"m-1"} onClick={onRemoveValue}><BiIcon bicode={"trash"} /></Button>
        </Tooltip>
    </>

    return (
        <Space>
        <Popover content={content}>
            <div className={"m-1 SCFormScaleItem"} style={{ background: name!=="---"?"#73fc8a":"#e1fde6"}}>
                <a>{name}</a>
            </div>
        </Popover>
        </Space>
    )
}