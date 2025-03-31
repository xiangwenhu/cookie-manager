import React from 'react';
import { SameSiteList } from '../const';
import { Select } from 'antd';
import { DefaultOptionType } from 'antd/es/select';

interface Props {
  onChange?(value: DefaultOptionType): any;
  // defaultValue?: string;
  value?: DefaultOptionType;
}

const SameSiteSelect: React.FC<Props> = ({ onChange, value }) => {
  return (
    <Select
      options={SameSiteList}
      onChange={onChange}
      defaultValue={value}
      value={value}
      // defaultValue={defaultValue}
    ></Select>
  );
};

export default SameSiteSelect;
