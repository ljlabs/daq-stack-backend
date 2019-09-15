import { Moment } from "moment";

export interface IMetadata {
    ExperimenterName: string;
    ExperimentDate: Moment;
    ExperimentName: string;
    ExperimentShortDescription: string;
    ExperimentLongDescription: string;
}

export interface IProcessExperiment {
    configurationFile: string;
    experimentFile: string;
    metadata: IMetadata;
}

export interface IHistory {
    id: number;
    ExperimenterName: string;
    ExperimentDate: Moment;
    ExperimentName: string;
    ExperimentShortDescription: string;
    Data: Array<Array<number>>;
}

export interface IDetail {
    id: number;
    ExperimenterName: string;
    ExperimentDate: Moment;
    ExperimentName: string;
    ExperimentLongDescription: string;
    Data: Array<Array<number>>;
}
