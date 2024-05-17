import {Button, message, Tooltip} from "antd";
import BiIcon from "@/components/util/bi_icon";
import {useContext} from "react";
import {SCProjectContext} from "@/components/providers/sc_project_provider";

export default function SCDeleteScaleButton({uuid}) {
    const { scProject, setSCProject } = useContext(SCProjectContext);
    //console.log("scale uuid: ", uuid)
    const onClick = (e) => {
        scProject.scaleDefinitionList = scProject.scaleDefinitionList.filter(
            item => item.uuid !== uuid
        );
        const success = scProject.calculateUnifiedScalers();
        if(!success) {
            scProject.unifiedScaleMap = new Map();
            message.error("当前比例尺无法计算，请检查是否重叠或不连通")
        }
        setSCProject(scProject);
        message.success("成功删除比例尺");
    }

    return (
        <>
            <Tooltip title="删除该比例尺" >
            <Button type={"dashed"} shape="circle" onClick={onClick}><BiIcon bicode={"trash-fill"} /></Button>
            </Tooltip>
        </>
    )

}