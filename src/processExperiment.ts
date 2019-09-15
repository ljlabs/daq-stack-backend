import { storage } from "./storage/storage";

export const processExperiment = (id: number) => {
    const db = storage.getDb();
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < db.length; i++) {
        if (db[i].id === id) {
            console.log(db[i]);
        }
    }
};

export const process = {
    experiment: (id: number) => processExperiment(id)
};
