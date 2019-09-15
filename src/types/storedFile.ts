import { Moment } from "moment";
import { ILocation } from "./location";

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
}
