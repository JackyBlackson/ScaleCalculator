import {useContext} from "react";
import {SCProjectContext} from "@/components/providers/sc_project_provider";
import {Button, message, Popover, Space, Tooltip} from "antd";
import BiIcon from "@/components/util/bi_icon";

export default function SCFormUnifiedScaleItem({name, unitUuid, isOrigin}) {
    const { scProject, setSCProject } = useContext(SCProjectContext);

    const onAddRecordClick = (e) => {
        const value = Number.parseFloat(name)
        if (!value) {
            message.error(`无法创建记录：“${name}”不可被用于创建记录`)
            return;
        }
        const recordName = prompt("创建记录：请填写记录名称");
        if(value && recordName){
            scProject.createRecord(unitUuid, Number.parseFloat(name), recordName)
            setSCProject(scProject);
            message.success(`成功创建名为“${recordName}”的记录`)
        } else {
            message.error("无法创建记录：记录名称为空")
        }
    }

    const content = <>
        <Tooltip title="将当前数值添加为记录" >
        <Button default shape="circle" className={"m-1"} onClick={onAddRecordClick}><BiIcon bicode={"bookmark-plus-fill"} /></Button>
        </Tooltip>
    </>

    return (
        <Space>
        <Popover content={content}>
            <div className={"m-1 SCFormScaleItem"} style={{ background: isOrigin?"#ff5454": name==="---" ? "#ffe2e2" : "#ff9696"}}>
                <a>{name}</a>
            </div>
        </Popover>
        </Space>
    )
}