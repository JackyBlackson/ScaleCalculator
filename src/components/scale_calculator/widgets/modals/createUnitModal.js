import {Button, Input, Modal} from "antd";
import {useContext, useState} from "react";
import {SCProjectContext} from "@/components/providers/sc_project_provider";

export default function CreateUnitModal(isOpen = false) {
    const [isModalOpen, setIsModalOpen] = useState(isOpen);
    const [inputValue, setInputValue] = useState("");
    const [inputStatus, setInputStatus] = useState("")
    const { scProject, setSCProject } = useContext(SCProjectContext);
    const [isCreatable, setIsCreatable] = useState(false)

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onInputChange = (e) => {
        const name = e.target.value;
        if(scProject.containsUnit(name)) {
            setInputStatus("error")
            setIsCreatable(false)
        } else {
            setInputStatus("")
            setIsCreatable(true)
        }
        setInputValue(e.target.value);
        e.stopPropagation();
    }

    return (
        <>
            <Button type="primary" onClick={showModal}>

            </Button>
            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <h5>新建单位</h5>
                <p>请在下面输入单位名称</p>
                <Input
                    placeholder="Basic usage"
                    defaultValue={inputValue}
                    onChange={onInputChange}
                    status={inputStatus}
                />
            </Modal>
        </>
    );
}