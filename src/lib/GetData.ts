import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const absPath = path.resolve();
const csvFilePath = path.join(absPath, 'Data.csv');

// Create a readable stream from the CSV file
const stream = fs.createReadStream(csvFilePath);

type Row = {
    number: string;
    firstName: string;
    lastName: string;
    email: string;
}

export const getData = ():Promise<Row[]> => {
    const data = [] as Row[];
    return new Promise((resolve, reject) => {
        stream.pipe(csv())
        .on('data', (row) => {
            data.push(row);
        })
        .on('end', () => {
            resolve(data);
        })
        .on('error', (err) => {
           reject(err);
        });
    });
}

