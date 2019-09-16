import { Request, request, Response } from "express";
import fs from "fs-extra";
import path from "path";
import { filePaths } from "./constants/filePaths";
import { storage } from "./storage/storage";
import { IDetail, IHistory } from "./types/comunication";

const uploadPath = path.join(__dirname, "fu/"); // Register the upload path
fs.ensureDir(uploadPath); // Make sure that he upload path exits

const uploadLdf = (req: Request, res: Response, filePath: string) => {
    req.pipe(req.busboy); // Pipe it trough busboy

    req.busboy.on("file", (fieldname, file, filename) => {
        console.log(`Upload of '${filename}' started`);

        // Create a write stream of the new file
        const fstream = fs.createWriteStream(path.join(filePath, req.params.id + filename));
        // Pipe it trough
        file.pipe(fstream);

        // On finish of the upload
        fstream.on("close", () => {
            storage.storeLdf(path.join(filePath, req.params.id + filename), parseInt(req.params.id, 10));
            console.log(`Upload of '${filename}' finished`);
            res.send(JSON.stringify({ id: req.params.id }));
        });
    });
};

const uploadConfigFile = (configFileData: string, configFileName: string, id: number): number => {
    const filePath = path.join(filePaths.config, configFileName);
    writeFile(configFileData, filePath);
    storage.storeConfig(filePath, id);
    return id;
};

const writeFile = (fileData: string, filePath: string) => {
    fs.writeFileSync(filePath, fileData);
};

const getHistory = (req: Request, res: Response) => {
    const db = storage.getDb();
    const history: IHistory[] = [];
    for (let i = 0; i < db.length; i++) {
        history.push({
            Data: db[i].processedData,
            ExperimentDate: db[i].createdTime,
            ExperimentName: db[i].experimentName,
            ExperimentShortDescription: db[i].shortDescription,
            ExperimenterName: db[i].experimenterName,
            id: i,
        });
    }
    res.send(JSON.stringify(history));
};

const getDetail = (req: Request, res: Response) => {
    const db = storage.getDb();
    let detail: IDetail;
    for (let i = 0; i < db.length; i++) {
        if (db[i].id === parseInt(req.params.id, 10)) {
            const configFileName : string = db[i].experimentName + i.toString() + ".xml";
            let ldfFileName : string | string[] = db[i].experimentFilePath.split('/');
            ldfFileName = (ldfFileName[ldfFileName.length - 1] as string);
            const processedRootHistFile = db[i].experimentName + i.toString() + "-hist.root";
            const processedRootTreeFile = db[i].experimentName + i.toString() + "-tree.root";
            detail = {
                Data: db[i].processedData,
                ExperimentDate: db[i].createdTime,
                ExperimentLongDescription: db[i].longDescription,
                ExperimentName: db[i].experimentName,
                ExperimenterName: db[i].experimenterName,
                id: i,
                ConfigFileUrl: filePaths.configUrl + "/" + configFileName,
                LdfFileUrl: filePaths.ldfUrl + "/" + ldfFileName,
                RootHistFile: filePaths.processedUrl + "/" + processedRootHistFile,
                RootTreeFile: filePaths.processedUrl + "/" + processedRootTreeFile 
            };
        }
    }
    res.send(JSON.stringify(detail));
};

export const fileManagement = {
    getDetail : (req: Request, res: Response) => getDetail(req, res),
    getHistory : (req: Request, res: Response) => getHistory(req, res),
    uploadConfigFile: (configFileData: string, configFileName: string, id: number): number => uploadConfigFile(configFileData, configFileName, id),
    uploadLdf : (req: Request, res: Response, filePath: string) => uploadLdf(req, res, filePath),
};
