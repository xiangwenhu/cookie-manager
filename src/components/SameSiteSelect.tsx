import React from 'react';
import { SameSiteList } from '../const';
import { Select } from 'antd';

interface Props {
  onChange?(value: any): any;
  defaultValue?: string;
}

const SameSiteSelect: React.FC<Props> = ({ onChange, defaultValue }) => {
  return (
    <Select
      options={SameSiteList}
      onChange={onChange}
      defaultValue={defaultValue}
    ></Select>
  );
};

export default SameSiteSelect;
