import path from 'path'
import chalk from 'chalk'
import moment from 'moment'
import { existsSync, mkdirSync, appendFileSync, createReadStream } from 'fs'
import config from './config.mjs'
import readLine from 'readline'

export const log = (options) => {
    const levelName = getLevelName(options.level);
    let message = options.message ?? 'Unidentified Error';
    const error = options.error ?? null ;

    writeToConsole(levelName, message, error)
}

const writeToConsole = (levelName, message, error= null) => {
    const level = config.levels[levelName];
    let chalkFunc = null;

    chalkFunc = chalk[level.color];

    message = error ? `${chalkFunc(`${error.message} \n ${error.stack}`)}` : message;

    const header = `[${levelName.toUpperCase()}] [${dateFormat()}]`;

    console.log(`[${chalkFunc(header)}] : [${message}]`);

}

const getLevelName = (level) => {
    return level && config.levels.hasOwnProperty(level) ? level : 'info';
}

const dateFormat = () => {
    return new moment(new Date()).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
}