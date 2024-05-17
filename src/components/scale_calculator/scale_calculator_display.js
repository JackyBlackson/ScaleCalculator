import ScaleCalculatorFormArea from "@/components/scale_calculator/widgets/sc_form_area";
import {Typography, Alert, Button, Collapse, InputNumber, message, Space, Table, Divider, Tag, Tooltip} from "antd";
const { Title, Paragraph, Text, Link } = Typography;
import SCFormTitle from "@/components/scale_calculator/widgets/form_title/sc_form_title";
import BiIcon from "@/components/util/bi_icon";
import SCFormTitleItem from "@/components/scale_calculator/widgets/form_title/sc_form_title";
import {Fragment, useContext, useState} from "react";
import {SCProjectContext} from "@/components/providers/sc_project_provider";
import SCMainInput from "@/components/scale_calculator/widgets/form_input/sc_main_input";
import {generateUUID} from "@/utilities/uuid_utilities";
import SCDeleteScaleButton from "@/components/scale_calculator/widgets/form_scale/sc_delete_scale_button";
import SCFormScaleItem from "@/components/scale_calculator/widgets/form_scale/sc_form_scale_item";
import SCFormResultItem from "@/components/scale_calculator/widgets/form_result/sc_form_result_item";
import SCFormRecordItem from "@/components/scale_calculator/widgets/form_record/sc_form_record_item";
import SCFormUnifiedScaleItem from "@/components/scale_calculator/widgets/form_scale/sc_form_unified_scale_item";
import SCDeleteRecordButton from "@/components/scale_calculator/widgets/form_record/sc_delete_record_button";
import {uuid} from "uuidv4";

function Panel(props) {
    return null;
}

export default function ScaleCalculatorDisplay () {
    const { scProject, setSCProject } = useContext(SCProjectContext);
    const [scaleInputMap, setScaleInputMap] = useState(new Map());
    const [calculateResult, setCalculatorResult] = useState([]);

    const onRecalculateUnifiedScales = () => {
        const success = scProject.calculateUnifiedScalers();
        if(!success) {
            message.error("当前比例尺无法计算，请检查是否重叠或不连通")
        } else {
            setSCProject(scProject);
            message.success("成功重新计算统一比例尺")
        }

    }

    const onClearScaleInputClick = (e) => {
        setScaleInputMap(new Map());
        setCalculatorResult([])
    }

    const onClearResultClick = (e) => {
        setScaleInputMap(new Map());
        setCalculatorResult([])
    }

    const onAddUnitClick = (e) => {
        const name = prompt("添加单位：请输入单位名称")
        if(!name) {
            return;
        }
        if(scProject.containsUnit(name)) {
            message.warning(`名为${name}的单位已经存在，请换一个名字`)
            return;
        }
        const success = scProject.addUnit(name);
        if(success) {
            setSCProject(scProject);
        } else {
            message.error(`以${name}为名称创建单位失败，发生了未知错误`)
        }
    }

    const onInputChange = (uuid, name, value) => {
        scaleInputMap.set(uuid, Number.parseFloat(value))
        setCalculatorResult(scProject.calculate(uuid, value))
        //console.log("scaleInputMap", scaleInputMap)
        setScaleInputMap(new Map(scaleInputMap))
    }

    const onAddScaleClick = () => {
        const scale = {
            uuid: generateUUID(),
            scales: []
        }
        scaleInputMap.forEach((value, key, map) => {
            if(value) {
                scale.scales.push({
                    unitUuid: key,
                    value: value,
                })
            }
        })
        if(scale.scales.length <= 1) {
            message.warning(`您当前输入的比例尺只有${scale.scales.length}个单位，应包含至少2个单位`)
            return;
        }
        scProject.scaleDefinitionList.push(scale);
        const success = scProject.calculateUnifiedScalers();
        if(!success) {
            message.error("当前比例尺无法计算，请检查是否重叠或不连通")
        }
        setSCProject(scProject);
        setScaleInputMap(new Map())
        message.success("成功添加比例尺")
    }

    const columns = [
        {
            title: '项目',
            dataIndex: 'item',
            key: 'item',
            render: (text) => <strong>{text}</strong>,
            fixed: true,
            align: "center",
            width: 100
        },
    ];
    const data = []
    const unitInfoRow = {
        key: "unitInfoRow",
        item: "单位名称",
        controls: <Tooltip title="新建单位" ><Button onClick={onAddUnitClick} shape="circle"><BiIcon bicode={"plus-circle-fill"} /></Button></Tooltip>
    }
    const unifiedScaleRow = {
        key: "unifiedScaleRow",
        item: "统一比例尺",
        controls: <>
        <Tooltip title="重新计算统一比例尺" >
            <Button shape="circle" onClick={onRecalculateUnifiedScales}><BiIcon bicode={"calculator-fill"} /></Button>
        </Tooltip>
            </>
    }
    const inputRow = {
        key: "scaleInputRow",
        item: "输入栏",
        controls: <>
        <Tooltip title="将左侧值创建为新比例尺" >
            <Button shape="circle" onClick={onAddScaleClick}><BiIcon bicode={"arrow-up-square-fill"} /></Button>
        </Tooltip>
        </>
    }
    const resultRow = {
        key: "resultRow",
        item: "计算结果",
        controls: <>
            <Tooltip title="清空输入及计算结果" >
            <Button shape="circle" onClick={onClearResultClick}><BiIcon bicode={"x-circle"} /></Button>
            </Tooltip>
        </>
    }
    scProject.unitMap.forEach((name, uuid, map) => {
        columns.push({
            title: name,
            dataIndex: uuid,
            key: uuid,
            align: "center",
            width: 100,
        })
        unitInfoRow[uuid] = <SCFormTitleItem uuid={uuid} name={name} />
        const value = scProject.unifiedScaleMap.get(uuid)
        unifiedScaleRow[uuid] = <a>{value ? parseFloat(value.toFixed(4)) : "---"}</a>
        unifiedScaleRow[uuid] = <SCFormUnifiedScaleItem unitUuid={uuid} name={value ? parseFloat(value.toFixed(4)) : "---"} isOrigin={false} />
        resultRow[uuid] = <SCFormResultItem unitUuid={uuid} name={"---"} isOrigin={false} />
        inputRow[uuid] = <SCMainInput
            uuid={uuid}
            name={name}
            onChange={onInputChange}
            defaultValue={scaleInputMap.get(uuid)}
            value={scaleInputMap.get(uuid)}
        />
    })
    columns.push({
        title: '操作',
        dataIndex: 'controls',
        key: 'controls',
        fixed: true,
        align: "left",
        width: 100
    })
    data.push(
        unitInfoRow,
        unifiedScaleRow,
    )
    scProject.scaleDefinitionList.forEach((scaler, index, array) => {
        const row = {
            key: `scaleRow${index}`,
            item: `比例尺${index+1}`,
            controls: <>
                <SCDeleteScaleButton uuid={scaler.uuid} />
            </>
        }
        scProject.unitMap.forEach((name, uuid, map) => {
            row[uuid] = <SCFormScaleItem name={"---"} scaleUuid={scaler.uuid} unitUuid={uuid} /> ;
        })
        scaler.scales.forEach((item, index, array) => {
            row[item.unitUuid] = <SCFormScaleItem name={item.value} scaleUuid={scaler.uuid} unitUuid={item.unitUuid} /> ;
        })
        data.push(row)
    })

    calculateResult.forEach((item, index, array) => {
        const value = item.value
        resultRow[item.unitUuid] = <SCFormResultItem
            unitUuid={item.unitUuid}
            name={value ? parseFloat(value.toFixed(4)) : "---"}
            isOrigin={item.isOrigin} />
    })
    data.push(
        inputRow,
        resultRow
    )

    scProject.recordList.forEach((record, index, array) => {
        const row = {
            key: `recordRow${index}`,
            item: `“${record.name}”`,
            controls: <>
                <SCDeleteRecordButton uuid={record.uuid} />
            </>
        }
        scProject.unitMap.forEach((name, uuid, map) => {
            row[uuid] = <SCFormRecordItem name={"---"} isOrigin={false} unitUuid={uuid} /> ;
        })
        row[record.unitUuid] = <SCFormRecordItem
            unitUuid={record.unitUuid}
            name={record.value ? parseFloat(record.value.toFixed(4)) : "---"}
            isOrigin={true} />
        const recordCalculateResult = scProject.calculate(record.unitUuid, record.value);
        recordCalculateResult.forEach((item, index, array) => {
            const value = item.value
            row[item.unitUuid] = <SCFormRecordItem
                unitUuid={item.unitUuid}
                name={value ? parseFloat(value.toFixed(4)) : "---"}
                isOrigin={item.isOrigin} />
        })
        data.push(row)
    })


    const onModifyName = (e) => {
        const updateName = prompt("修改工程名称：请输入新的工程名称", scProject.name)
        if(!updateName) {
            message.error("您输入的名称为空，或已经取消，操作失败")
            return;
        }
        scProject.name = updateName;
        setSCProject(scProject);
        message.success(`成功修改工程标题为 “${updateName}”`)
    }


    return (
        <>
            <Space direction="vertical" align={"center"}>
                <h4 style={{ textAlign: "center", marginBottom: "10px", color: "#666666" }}>
                    工程名称：
                    <strong style={{color: "#333333"}}>{scProject.name}</strong>
                    <Tooltip title="修改工程名称" >
                        <Button shape="circle" icon={<BiIcon bicode={"pencil-square"}/> }  style={{marginLeft: "15px"}} onClick={onModifyName}/>
                    </Tooltip>
                </h4>
            </Space>
            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                bordered
                showHeader={false}
                sticky={true}
                size={"small"}
                scroll={{
                    scrollToFirstRowOnChange: false,
                    x:true
                }}
            />


        </>
    )
}