import { storage } from "./storage/storage";
import { Request, Response } from "express";
import { filePaths } from "./constants/filePaths";
import util from "util";
import fs from "fs";

const exec = util.promisify(require('child_process').exec);

export const processExperiment = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const db = storage.getDb();
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < db.length; i++) {
        if (db[i].id === id) {
            // cleanup any example files not moved
            let out = "";
            try {
                out = await exec("rm example");
                console.log(out);
            } catch (error) {
                console.log(error);
            }
            // execute processor code
            console.log(
                filePaths.utkScan +
                " -c '" + db[i].configFilePath +
                "' -i '" + db[i].experimentFilePath +
                "' -o '" + filePaths.processed + "/" + db[i].experimentName + id.toString() +
                "' -b");
            console.log('processing experiment')
            out = await exec(
                filePaths.utkScan +
                " -c '" + db[i].configFilePath +
                "' -i '" + db[i].experimentFilePath +
                "' -o '" + filePaths.processed + "/" + db[i].experimentName + id.toString() +
                "' -b");
            console.log(out);
            // time to process example file <== this is the viewing data
            const data = getDataForGraph();
            const graph: Map<number, number> = new Map<number, number>();
            data.split("\n").forEach((time) => {
                let cur = graph.get(parseInt(time));
                if (cur === undefined) {
                    cur = 0;
                }
                cur += 1;
                graph.set(parseInt(time), cur);
            });
            const xData : Array<number> = [];
            const yData : Array<number> = [];
            graph.forEach((value, key) => {
                xData.push(key);
                yData.push(value);
            });
             db[i].processedData = [xData, yData];
            break;
        }
    }
    storage.storeDb(JSON.stringify(db));
};

const readExample = (req: Request, res: Response) => {
    const data = getDataForGraph();
    const graph: Map<number, number> = new Map<number, number>();
    data.split("\n").forEach((time) => {
        let cur = graph.get(parseInt(time));
        if (cur === undefined) {
            cur = 0;
        }
        cur += 1;
        graph.set(parseInt(time), cur);
    });
    console.log(graph);
}

// read the list of image metadata and convert it to a JSON object
const getDataForGraph = (): string => {
    const obj = fs.readFileSync("./example.txt", "utf8");
    return (obj);
};

export const process = {
    experiment: async (req: Request, res: Response) => await processExperiment(req, res),
    readExample: async (req: Request, res: Response) => await readExample(req, res),
};
