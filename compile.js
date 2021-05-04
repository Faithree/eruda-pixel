#!/usr/bin/env node

// 使用shelljs跨平台执行shell命令

const shell = require('shelljs');

// 复制 react-pixel/build/static/js 文件到 eruda-pixel/src 目录
shell.echo('Copy compiles files...');
shell.cp('react-pixel/build/static/js/*.js', 'eruda-pixel/src/core.txt');
shell.cp('react-pixel/build/static/css/*.css', 'eruda-pixel/src/style.txt');

shell.echo('Copy successfully.');
