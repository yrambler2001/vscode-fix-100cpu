const { exec } = require('child_process');
const obj = {}
setInterval(() => {
  var cmd = 'ps -A -o pid,rss,vsz,pcpu,comm';

  exec(cmd, function (err, stdout) {
    if (err) {
      cb('Command `ps` returned an error!');
    } else {
      const e = stdout.split('\n').map(e => e.split(' ').reduce((prev, curr) => {
        if (prev.length === 5) {
          prev[4] = prev[4] + ' ' + curr;
          return prev;
        }
        else return [...prev, ...curr === '' ? [] : [curr]]
      }, []))
      const eeee = {}
      e.filter(e => +e[3] > 90).forEach(e => eeee[e[0]] = e)
      Object.keys(eeee).forEach(key => {
        if (eeee[key][4].includes('Electron')) {
          // console.log('added', eeee[key][4], eeee[key][0])
          obj[key] = obj[key] || 0;
        }
      })

      Object.keys(obj).forEach(key => {
        if (eeee[key]) { obj[key] += 1 }
        else {
          return delete obj[key];
        }
        if (obj[key] > 60) {
          exec('kill -9 ' + key)
          console.log('kill', key)
          return delete obj[key]
        }
      })
    }
  });
}, 1000)