import React from 'react';
import './index.scss';
import * as util from "../util";
import { downloadFile } from '../../../util';

interface Props {
}

const ExportConfig: React.FC<Props> = ({ }: Props) => {
    const onExport = async function () {
        try {
            const list = await util.groupCookies();

            downloadFile(JSON.stringify(list), "config.json");

        } catch (err: any) {
            alert("导出失败:" + err.message);
        }
    }
    return <button type="button" onClick={onExport}>导出配置</button>

};

export default ExportConfig;
