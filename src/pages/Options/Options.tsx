import React from 'react';
import './Options.css';
import List from "./DomainGroupList"
import ExportConfig from "./ExportConfig";
import ImportConfig from "./ImportConfig";

interface Props {
}

const Options: React.FC<Props> = ({ }: Props) => {
  return <div className="OptionsContainer">
    <h3>
      导入导出
    </h3>
    <div>
      <ExportConfig />
      <ImportConfig />
    </div>
    <List />
  </div>;
};

export default Options;
