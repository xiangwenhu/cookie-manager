import React from 'react';
import './Options.css';
import DomainGroupList from "./DomainGroupList"
import ExportConfig from "./ExportConfig";
import ImportConfig from "./ImportConfig";
import { Tabs, Divider } from "antd";

interface Props {
}

const Options: React.FC<Props> = ({ }: Props) => {
  return (
    <Tabs tabPosition='left' className='OptionsContainer' defaultActiveKey='1'>
      <Tabs.TabPane tab="用户管理" key="1">
        <DomainGroupList />
      </Tabs.TabPane>
      <Tabs.TabPane tab="导入导出" key="2">
        <ExportConfig />
        <Divider />
        <ImportConfig />
      </Tabs.TabPane>
    </Tabs>
  )
};

export default Options;
