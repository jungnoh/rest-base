import mongoose from 'mongoose';
import gitCommit from 'git-last-commit';
import * as ConfigService from './config';

export async function gitInfo(): Promise<gitCommit.Commit> { 
  const pr: Promise<gitCommit.Commit> = new Promise((res, rej) => {
    gitCommit.getLastCommit((err, commit) => {
      if (err) rej(err);
      else res(commit);
    });
  });
  return await pr;
}

export async function allConfig() {
  return (await ConfigService.getAll()).map(x => ({key: x.key, value: x.value, createdAt: x.createdAt}));
}

export async function mongo(command: string) {
  return await mongoose.connection.db.command(JSON.parse(command));
}