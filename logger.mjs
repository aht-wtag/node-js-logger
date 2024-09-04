import path, { resolve } from 'path'
import chalk from 'chalk'
import moment from 'moment'
import { existsSync, mkdirSync, appendFileSync, createReadStream, write, ReadStream, fstat } from 'fs'
import config from './config.mjs'
import readLine from 'readline'
import { error } from 'console'

export const log = (options) => {
    const levelName = getLevelName(options.level);
    let message = options.message ?? 'Unidentified Error';
    const error = options.error ?? null;
    writeToConsole(levelName, message);

    if(config.levels[levelName].writeAccess) {
        writeToFile(levelName, message, error);
    }
}

const writeToConsole = (levelName, message, error= null) => {
    const level = config.levels[levelName];
    let chalkFunc = null;

    chalkFunc = chalk[level.color];

    message = error ? `${chalkFunc(`${error.message} \n ${error.stack}`)}` : message;

    const header = `[${levelName.toUpperCase()}] [${dateFormat()}]`;

    console.log(`[${chalkFunc(header)}] : [${message}]`);

}

const writeToFile = (level, message) => {
    const logDirectory = "./logs";

    const logData = `{"level" : "${level.toUpperCase()}", "message": "${message}", "time" : "${dateFormat()}"}\r\n`;
    if(!existsSync(logDirectory)) {
        mkdirSync(logDirectory);
    }

    const options = {
        encoding : 'utf8',
        mode: 438
    }

    appendFileSync(`./logs/${level}.log`,logData, options);
}


export const readLogs = async(fileName = null)=> {
    const logDirectory = "./logs";

    return new Promise((resolve, reject) => {
        const file = path.join(logDirectory, fileName.includes(".log")? fileName : `${fileName}.log`);

        const lineReader = readLine.createInterface({input: createReadStream(file)});
        const logs = [];

        lineReader.on('line', (line) => {

            logs.push(JSON.parse(line));

        })

        lineReader.on('close', ()=>{
            console.log(chalk.yellow(`${fileName} has been accessed`));
            console.table(logs);
            resolve(logs);
        })


        lineReader.on('error', (error) => {
            reject(error);
        })
    })
}

const getLevelName = (level) => {
    return level && config.levels.hasOwnProperty(level) ? level : 'info';
}

const dateFormat = () => {
    return new moment(new Date()).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
}