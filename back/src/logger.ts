// 기본 winston 로그를 설정합니다.
// 초기 설정을 위해 index.ts에서 side effect로 import 필요
import winston from 'winston';

// TODO: better output
const consoleTransport = winston.createLogger({
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf((info) => {
      const {
        timestamp, level, message, ...args
      } = info;
      const dt = new Date(timestamp);
      const formatZero = (v: number) => (v<10?`0${v}`:v);
      const formatTZero = (v: number) => v<100?`0${formatZero(v)}`:v;
      const ts = `${dt.getFullYear()}-${formatZero(dt.getMonth()+1)}-${formatZero(dt.getDate())} ${formatZero(dt.getHours())}:${formatZero(dt.getMinutes())}:${formatZero(dt.getSeconds())}.${formatTZero(dt.getMilliseconds())}`;
      return `${ts} [${level}] ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
    }),
  ),
  transports: new winston.transports.Console({
    level: 'debug'
  })
});

winston.clear().add(consoleTransport);
