#!/usr/bin/env node

// 使用shelljs跨平台执行shell命令

const shell = require('shelljs');

// 复制文件到lib目录
shell.echo('Copy compiles files...');
shell.cp('react-pixel/build/static/js/*.js', 'eruda-pixel/src/core.txt');

shell.echo('Copy successfully.');
