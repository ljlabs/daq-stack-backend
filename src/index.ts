/**
 * Kyle Leon Jordaan
 * 3538638 Networking Practicle
 *
 * this router does no load balancing it simply sends commands to the corrosponding api services
 * everything is comunicated through a rest interface
 */

import axios from "axios";
import bodyParser from "body-parser";
import busboy from "connect-busboy";
import cors from "cors";
import crypto from "crypto";
import express from "express";
import { filePaths } from "./constants/filePaths";
import { fileManagement } from "./fileManagement";
import { storage } from "./storage/storage";
import { ILocation } from "./types/location";

const app = express();
const port = 8080; // default port to listen

// const corsOptions: cors.CorsOptions = {
//     optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
//     origin: "*",
// };

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use(bodyParser.json());

app.use(busboy({
    highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
})); // Insert the busboy middle-ware

// process experiment
app.get("/processExperiment", async (req, res) => {
    console.log("getting Log");
    // do a get request from the storage bucket to retrive the metadat log
    // const storageResponse: string = (await axios.get(`${storageBucketUrl}/getImageLog`)).data;
    // // return the metada log to the client
    res.send("JSON.stringify(storageResponse)");
});

// add new experiment to db
app.post("/newExperiment", async (req, res) => {
    console.log(req.body);
    const id = storage.addNewExperiment(
        req.body.shortDescription,
        req.body.longDescription,
        req.body.experimentName,
        req.body.experimenterName
    );
    res.send(JSON.stringify({ id }));
});

// uploads an ldf experiment file, and a xml configuration file
app.post("/upload/config", async (req, res) => {
    const id = fileManagement.uploadConfigFile(
        req.body.fileData,
        req.body.fileName,
        req.body.id
    );
    res.send(JSON.stringify({ id }));
});

// uploads an ldf experiment file, and a xml configuration file
app.post("/upload/ldf/:id", async (req, res) => {
    fileManagement.uploadLdf(req, res, filePaths.ldf);
});

/**
 * Serve the basic index.html with upload form
 */
app.get("/", async (req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("<form action='upload/ldf' method='post' enctype='multipart/form-data'>");
    res.write("<input type='file' name='fileToUpload'><br>");
    res.write("<input type='submit'>");
    res.write("</form>");
    return res.end();
});

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
