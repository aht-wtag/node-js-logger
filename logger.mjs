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
    if(config.levels[levelName].writeAccess) {
        writeToFile(levelName, message);
    }
}

const writeToConsole = (levelName, message, error= null) => {
    const level = config.levels[levelName];
    let chalkFunc = null;

    chalkFunc = chalk[level.color]

}

const getLevelName = (level) => {
    return level && config.levels.hasOwnProperty(level) ? level : 'info';
}