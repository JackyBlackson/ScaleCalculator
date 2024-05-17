import {Button, message, Tooltip} from "antd";
import BiIcon from "@/components/util/bi_icon";
import {useContext} from "react";
import {SCProjectContext} from "@/components/providers/sc_project_provider";

export default function SCDeleteRecordButton({uuid}) {
    const { scProject, setSCProject } = useContext(SCProjectContext);
    //console.log("scale uuid: ", uuid)
    const onClick = (e) => {
        scProject.recordList = scProject.recordList.filter(
            item => item.uuid !== uuid
        );
        setSCProject(scProject);
        message.success(`成功删除记录`);
    }

    return (
        <>
            <Tooltip title="删除该记录" >
            <Button type={"dashed"} shape="circle" onClick={onClick}><BiIcon bicode={"trash-fill"} /></Button>
            </Tooltip>
        </>
    )

}