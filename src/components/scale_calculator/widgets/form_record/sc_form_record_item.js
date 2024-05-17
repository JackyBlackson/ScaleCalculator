import {useContext} from "react";
import {SCProjectContext} from "@/components/providers/sc_project_provider";
import {Button, message, Popover, Space} from "antd";
import BiIcon from "@/components/util/bi_icon";

export default function SCFormRecordItem({name, unitUuid, isOrigin}) {
    const { scProject, setSCProject } = useContext(SCProjectContext);


    return (
        <Space>
            <div className={"m-1 SCFormScaleItem align-self-center"} style={{background: isOrigin?"#338aff": name==="---" ? "#dcebff" : "#8cbcff"}}>
                <a>{name}</a>
            </div>
        </Space>
    )
}