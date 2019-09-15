import { Request, Response } from "express";
import fs from "fs-extra";
import path from "path";
import { filePaths } from "./constants/filePaths";
import { storage } from "./storage/storage";

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

export const fileManagement = {
    uploadConfigFile: (configFileData: string, configFileName: string, id: number): number => uploadConfigFile(configFileData, configFileName, id),
    uploadLdf : (req: Request, res: Response, filePath: string) => uploadLdf(req, res, filePath),
};
