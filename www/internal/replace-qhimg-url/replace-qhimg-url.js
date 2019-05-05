// 1. 静态扫描src目录下的所有的qhimg，保存到数组。
// 根目录执行 grep -rn -E 'qhimg|qhres' src/*
// -E 表示正则匹配。-r 表示递归查找。-n 显示行号。
// 2. 下载图片到public/image/replace-qhimg/目录下。建立url-文件名映射
// 3. 批量替换url。（写文件）。
const https = require('https');
const fs = require('fs');
const path = require('path');

const exec = require('child_process').exec;
const urlRegString = 'https://.*?qhimg.com.*?\/(?<imageName>[a-z0-9]+\.(?:png|jpg|gif|jpeg))'
const pathExp = RegExp(`^(?<filePath>[^:]+):(?<lineNumber>[0-9]+):.*?(?<matchUrl>${urlRegString})`);
const outputImageDir = 'public/image/replace-qhimg/';
const writeImageDir = '/image/replace-qhimg/';
const util = require('util');

// console.log(pathExp.exec(string));
exec("grep -rn -E 'qhimg|qhres' src/*", (error, stdout, stderr) => {
  if (error) return;
  parsestdout(stdout)
})

async function parsestdout(stdout) {
  const items = stdout.split('\n');
  for (const item of items) {
    const matchObj = pathExp.exec(item)
    if (!matchObj) continue;
    const {matchUrl, filePath, imageName} = matchObj.groups
    await download(matchUrl, imageName);
    await writeBackToFile({filePath, matchUrl, localUrl: writeImageDir + imageName});
  }
}
async function download(url, name) {
  const localPath = outputImageDir + name;
  const file = fs.createWriteStream(localPath);
  await https.get(url, async function(response) {
    await response.pipe(file);
  });
}
// 写回文件
async function writeBackToFile({filePath, matchUrl, localUrl}) {
  try {
    const readFile = util.promisify(fs.readFile);
    const writeFile = util.promisify(fs.writeFile);
    let str = await readFile(path.join(__dirname, '../../' , filePath), 'utf-8');
    str = str.replace(new RegExp(matchUrl, 'mgi'), localUrl);
    await writeFile(path.join(__dirname, '../../' , filePath), str);
  } catch(e) {
    console.log('---', e);
  }
}