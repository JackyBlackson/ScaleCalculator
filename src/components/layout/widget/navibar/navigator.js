'use client'
import {current_version, site_title} from "@/config/global"
import Link from "next/link"
import BiIcon from "@/components/util/bi_icon";
import {Badge, Alert, Button, Drawer, message, Space} from "antd";
import {useContext, useState} from "react";
import {SCProjectRegistryContext} from "@/components/providers/sc_project_registry_provider";
import {SCProjectContext} from "@/components/providers/sc_project_provider";
import {ScaleCalculatorProject} from "@/datatypes/scale_calculator/scale_calculator_project";

export default function Navigator({ title=site_title, items={} }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { scProjectRegistry, setSCProjectRegistry } = useContext(SCProjectRegistryContext)
  const { scProject, setSCProject } = useContext(SCProjectContext);

  const onProjectListClick = (e) => {
    setDrawerOpen(true);
  }

  const onProjectListDrawerClose = (e) => {
    setDrawerOpen(false);
  }

  const onCreateProjectClick = (e) => {
    setDrawerOpen(false);
    const projectName = prompt("新建工程：请输入工程名称", "新工程")
    if(!projectName) {
      message.error("您输入的工程名称为空，新建工程动作取消")
      return;
    }
    scProjectRegistry.projectList.push(scProject);
    const newProject = new ScaleCalculatorProject();
    newProject.name = projectName;
    setSCProject(newProject);
    setSCProjectRegistry(scProjectRegistry);
    message.success("成功新建工程")
  }

  const onLoadProject = (project) => {
    setDrawerOpen(false);
    scProjectRegistry.projectList.push(scProject);
    scProjectRegistry.projectList = scProjectRegistry.projectList.filter(item => {
      return item.uuid !== project.uuid;
    });
    setSCProject(project);
    setSCProjectRegistry(scProjectRegistry);
    message.success("成功加载工程，并保存原加载工程")
  }

  const onDeleteProject = (project) => {
    scProjectRegistry.projectList = scProjectRegistry.projectList.filter(item => {
      console.log("item === project? ", item.uuid === project.uuid)
      return item.uuid !== project.uuid;
    });
    message.success("成功删除工程")
    if(scProject.uuid === project.uuid) {
      if(scProjectRegistry.projectList.length <= 0) {
        let name = prompt("删除工程：当前无可用工程，请输入名称创建新的工程", "新工程")
        if(!name) {
          name = "新工程"
        }
        const newProject = new ScaleCalculatorProject();
        newProject.name = name;
        setSCProject(newProject);
        message.success("成功新建工程")
      } else {
        setSCProject(scProjectRegistry.projectList[0]);
        scProjectRegistry.projectList = scProjectRegistry.projectList.filter((item, index) => {return index > 0})
        message.info("当前加载项目被删除，自动切换到未加载项目中的第一个")
      }
    }

    setSCProjectRegistry(scProjectRegistry);
  }


  const onExportProject = (project) => {
    prompt("导出工程：复制下面文本框中的文字，发送给其他用户，即可在其他用户处导入该工程", JSON.stringify(project.getSerializableObject()));
  }

  const onImportProject = () => {
    const jsonString = prompt("导入工程：请将工程导出的文本复制到下面的输入框")
    try {
      const parsed = JSON.parse(jsonString);
      const projectObject = ScaleCalculatorProject.deserializeFromObject(jsonString)
      if(projectObject.uuid === scProject.uuid) {
        message.error("已经有相同的工程存在！导入失败")
        return;
      }
      for(let i = 0; i < scProjectRegistry.projectList.length; i++) {
        if(scProjectRegistry.projectList[i].uuid === scProject.uuid) {
          message.error("已经有相同的工程存在！导入失败")
          return;
        }
      }
      scProjectRegistry.projectList.push(projectObject);
      setSCProjectRegistry(scProjectRegistry)
      message.success(`导入工程 “${projectObject.name}” 成功！请查看工程列表`)
    } catch (_) {
      message.error("您输入的工程文本有误，无法导入工程")
    }
  }

  const onAboutAuthorClick = (e) => {
    alert("ScaleCalculatorPro 比例尺计算器")
    alert("作者：Jacky_Blackson")
    alert(`当前版本：${current_version}`)
  }

  return (
    <nav id="navigator" className="navbar navbar-expand-lg fixed-top bg-white box-shadow" style={{zIndex: 99}}>
      <div className="container-fluid">
        <div className="navbar-brand" >
          <i className="bi bi-rulers"></i>
          {site_title}
        </div>
        <button className="navbar-toggler bg-purple-700 rounded-3xl" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
          <i className="bi bi-list"></i>
        </button>
        <div className="collapse navbar-collapse" id="mynavbar">
          <ul className="navbar-nav me-auto">
            <li key={"工程列表"} className="nav-item m-2" onClick={onProjectListClick}>
              <Link href={""}>
                <BiIcon bicode={'card-list'}/>
                工程列表
              </Link>
            </li>
            <li key={"新建工程"} className="nav-item m-2" onClick={onCreateProjectClick}>
              <Link href={""}>
                <BiIcon bicode={'file-earmark-plus'}/>
                新建工程
              </Link>
            </li>
            <li key={"导出工程"} className="nav-item m-2" onClick={()=>onExportProject(scProject)}>
              <Link href={""}>
                <BiIcon bicode={'share'}/>
                导出工程
              </Link>
            </li>
            <li key={"导入工程"} className="nav-item m-2" onClick={onImportProject}>
              <Link href={""}>
                <BiIcon bicode={'box-arrow-in-down'}/>
                导入工程
              </Link>
            </li>
            <li key={"关于作者"} className="nav-item m-2" onClick={onAboutAuthorClick}>
              <Link href={""}>
                <BiIcon bicode={'info-circle'}/>
                关于作者
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <Drawer title="工程列表" onClose={onProjectListDrawerClose} open={drawerOpen} styles={{zIndex: 1919810}}>
        <Space direction="vertical" style={{width: '100%'}}>
          <Badge.Ribbon text="当前工程" color="green">
          <Alert
              message={scProject.name}
              description={<>
                uuid = <code>{scProject.uuid}</code>
              </>}
              type="success"
              action={
                <Space direction="vertical">
                  <Button size="small" type="primary" disabled={true}>
                    加载
                  </Button>
                  <Button size="small" onClick={()=>onExportProject(scProject)}>
                    分享
                  </Button>
                  <Button size="small" danger ghost onClick={() => onDeleteProject(scProject)}>
                    删除
                  </Button>
                </Space>
              }
              showIcon
          />
          </Badge.Ribbon>
          {
            scProjectRegistry && scProjectRegistry.projectList
                ? scProjectRegistry.projectList.map(item => {
                  return<Alert
                  key={`projectList-${item.name}`}
                  message={item.name}
                  description={<>
                    <p>uuid = <code>{item.uuid}</code></p>
                  </>}
                  type="info"
                  action={
                    <Space direction="vertical">
                      <Button size="small" type="primary" onClick={() => onLoadProject(item)}>
                        加载
                      </Button>
                      <Button size="small" onClick={()=>onExportProject(item)}>
                        分享
                      </Button>
                      <Button size="small" danger ghost onClick={() => onDeleteProject(item)}>
                        删除
                      </Button>
                    </Space>
                  }
                  showIcon
              />
            })
            : <></>
          }
        </Space>
        <p>
          <br/>
          到底辣！没有更多的内容了……
        </p>
        <Button block type="primary" onClick={onCreateProjectClick}>没有工程？点我创建工程</Button>
      </Drawer>
    </nav>
  )
}