import fs from "fs";
import moment from "moment";
import { filePaths } from "../constants/filePaths";
import { IFileElm } from "../types/storedFile";

export const addNewExperiment = (shortDescription: string, longDescription: string, experimentName: string, experimenterName: string, experimentXAxis: string): number => {
    const db = getFileDb();
    db.push({
        createdTime: moment(),
        id: db.length,
        shortDescription,
        // tslint:disable-next-line: object-literal-sort-keys
        longDescription,
        experimentName,
        experimenterName,
        experimentXAxis,
    });
    storeFileDb(JSON.stringify(db));
    return db.length - 1;
};

export const storeConfig = (filePath: string, id: number) => {
    const db = getFileDb();
    let found: boolean = false;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < db.length; i++) {
        if (db[i].id === id) {
            db[i].configFilePath = filePath;
            found = true;
        }
    }
    if (!found) {
        db.push({
            configFilePath: filePath,
            createdTime: moment(),
            id: db.length,
            shortDescription: "",
            // tslint:disable-next-line: object-literal-sort-keys
            longDescription: "",
            experimentName: "",
            experimenterName: "",
            experimentXAxis: "",
        });
    }
    storeFileDb(JSON.stringify(db));
};
export const storeLdf = (filePath: string, id: number) => {
    const db = getFileDb();
    let found: boolean = false;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < db.length; i++) {
        if (db[i].id === id) {
            db[i].experimentFilePath = filePath;
            found = true;
        }
    }
    if (!found) {
        db.push({
            createdTime: moment(),
            experimentFilePath: filePath,
            id: db.length,
            shortDescription: "",
            // tslint:disable-next-line: object-literal-sort-keys
            longDescription: "",
            experimentName: "",
            experimenterName: "",
            experimentXAxis: "",
        });
    }
    storeFileDb(JSON.stringify(db));
};

export const storeProcessed = (filePath: string, id: number) => {
    const db = getFileDb();
    let found: boolean = false;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < db.length; i++) {
        if (db[i].id === id) {
            db[i].processedFilePath = filePath;
            found = true;
        }
    }
    if (!found) {
        db.push({
            createdTime: moment(),
            id: db.length,
            processedFilePath: filePath,
            shortDescription: "",
            // tslint:disable-next-line: object-literal-sort-keys
            longDescription: "",
            experimentName: "",
            experimenterName: "",
            experimentXAxis: "",
        });
    }
    storeFileDb(JSON.stringify(db));
};

// read the list of image metadata and convert it to a JSON object
const getFileDb = (): IFileElm[] => {
    const obj = JSON.parse(fs.readFileSync(filePaths.storageRoot + "/db.json", "utf8"));
    return (obj);
};

// store the list of image metadata
const storeFileDb = (db: string) => {
    fs.writeFileSync(filePaths.storageRoot + "/db.json", db);
};

export const storage = {
    addNewExperiment: (shortDescription: string, longDescription: string, experimentName: string, experimenterName: string, experimentXAxis: string): number => addNewExperiment(shortDescription, longDescription, experimentName, experimenterName, experimentXAxis),
    getDb: (): IFileElm[] => getFileDb(),
    storeConfig: (filePath: string, id: number) => storeConfig(filePath, id),
    storeDb: (db: string) => storeFileDb(db),
    storeLdf: (filePath: string, id: number) => storeLdf(filePath, id),
    storeProcessed: (filePath: string, id: number) => storeProcessed(filePath, id),
};
