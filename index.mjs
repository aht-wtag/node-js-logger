import {log, readLogs} from './logger.mjs'

// log({level: 'info', message: "hello world"});
readLogs("info.log").then(result => {
    console.log(result);
})