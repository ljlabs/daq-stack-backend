import { Moment } from "moment";

export interface IFileElm {
    id: number;
    configFilePath?: string;
    createdTime: Moment;
    experimentFilePath?: string;
    processedFilePath?: string;
    shortDescription: string;
    longDescription: string;
    experimentName: string;
    experimenterName: string;
    experimentXAxis: string;
    processedData?: any[];
}
