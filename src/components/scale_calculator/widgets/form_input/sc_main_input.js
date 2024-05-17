import {Button, InputNumber, Popover, Tooltip} from "antd";
import BiIcon from "@/components/util/bi_icon";

export default function SCMainInput ({uuid, name, onChange, defaultValue = undefined, value = undefined}) {

    const onInputChange = (value) => {
        onChange(uuid, name, value);
    }

    return (
        <>
            <Tooltip title={"输入数字，下方显示计算结果"} >
            <InputNumber value={value} defaultValue={defaultValue} changeOnWheel onChange={onInputChange} block/>
            </Tooltip>
        </>
    )
}