import React, {useContext} from 'react';
import {Button, FloatButton, message} from 'antd';
import BiIcon from "@/components/util/bi_icon";
import { ReloadOutlined } from '@ant-design/icons';
import {site_title} from "@/config/global";
import {SCProjectContext} from "@/components/providers/sc_project_provider";

const ClearLocalStorageButton = () => {
    const { scProject, setSCProject } = useContext(SCProjectContext);
    const handleClearLocalStorage = () => {
        const targetMessage = `${site_title}-${scProject.name}`
        const input = prompt(`小心！你正在试图清空本地的所有项目！请在下面输入“${targetMessage}” 来确认删除：`)
        if(input!==targetMessage) {
            message.info("万幸~ 您取消了清空本地存储！本地存储的项目逃过一劫~")
            return;
        }
        localStorage.clear();
        message.success('成功清空本地存储');
        alert('成功清空本地存储，点击确定以重新刷新页面');
        window.location.reload(); // 强制重新加载页面
    };

    return (
        <FloatButton
            icon={<BiIcon bicode={"radioactive"}/> }
            description="清空本地存储"
            shape="square"
            onClick={handleClearLocalStorage}
            tooltip={"小心！清空所有项目！你会丢失全部的项目！"}
        />
    );
};

export default ClearLocalStorageButton;
