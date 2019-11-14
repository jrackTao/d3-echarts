import * as pm2 from 'pm2';

export const connect = () => {
  return new Promise((resolve, reject) => {
    pm2.connect(err => {
      if (err) reject(err);
      resolve();
    })
  })
}

export const start = args => {
  return new Promise((resolve, reject) => {
    pm2.start(args, (err, proc) => {
      if (err) reject(err)
      resolve(proc)
    });
  })
}

export const stop = pid => {
  return new Promise((resolve, reject) => {
    pm2.stop(pid, err => {
      if (err) reject(err);
      resolve();
    })
  })
}

export const restart = pid => {
  return new Promise((resolve, reject) => {
    pm2.restart(pid, err => {
      if (err) reject(err);
      resolve();
    })
  })
}

export const list = () => {
  return new Promise((resolve, reject) => {
    pm2.list((err, result) => {
      if (err) reject(err);
      resolve(result);
    })
  })
}

export const disconnect = () => { pm2.disconnect() };
