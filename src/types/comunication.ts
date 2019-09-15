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
