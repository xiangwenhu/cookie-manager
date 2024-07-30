import React from 'react';
import './Options.css';
import DomainGroupList from "./DomainGroupList"
import ExportDomainGroups from "./ExportDomainGroups";
import ImportDomainGroups from "./ImportDomainGroups";
import { Tabs, Divider } from "antd";

interface Props {
}

const styles: Record<"TabPane", React.CSSProperties> = {
  TabPane: {
    height: `calc(100vh - 60px)`,
    overflow: "auto",
    minHeight: '600px'
  }
}

const Options: React.FC<Props> = ({ }: Props) => {
  return (
    <Tabs tabPosition='left' className='OptionsContainer' defaultActiveKey='1'>
      <Tabs.TabPane tab="用户管理" key="1" style={styles.TabPane}>
        <DomainGroupList />
      </Tabs.TabPane>
      <Tabs.TabPane tab="导入导出" key="2" style={styles.TabPane}>
        <div style={{
          paddingTop: '60px'
        }}></div>
        <ExportDomainGroups />
        <Divider />
        <ImportDomainGroups />
      </Tabs.TabPane>
    </Tabs>
  )
};

export default Options;
