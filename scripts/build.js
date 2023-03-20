#!/usr/bin/env node

import Path from 'node:path';
import Fs from 'node:fs/promises';
import glob from 'glob';
import swc from '@swc/core';

const setExtension = (node, extenstion) => {
  node.source.value = `${node.source.value}.${extenstion}`;
  node.source.raw = JSON.stringify(node.source.value);
};

const cjsConfig = {
  module: {
    type: 'commonjs'
  },
  jsc: {
    target: 'es5',
    parser: {
      syntax: 'typescript'
    }
  },
  sourceMaps: true,
  plugin: (module) => {
    for(const node of module.body) {
      if (node.type === 'ImportDeclaration' && /^[.\\\/]/.test(node.source.value)) {
        setExtension(node, 'cjs');
      }
      if (node.type === 'ExportNamedDeclaration' && /^[.\\\/]/.test(node.source.value)) {
        setExtension(node, 'cjs');
      }
    }
    return module;
  },
};

const mjsConfig = {
  module: {
    type: 'es6'
  },
  jsc: {
    target: 'es2022',
    parser: {
      syntax: 'typescript'
    }
  },
  sourceMaps: true,
  plugin: (module) => {
    for(const node of module.body) {
      if (node.type === 'ImportDeclaration' && /^[.\\\/]/.test(node.source.value)) {
        setExtension(node, 'js');
      }
      if (node.type === 'ExportNamedDeclaration' && /^[.\\\/]/.test(node.source.value)) {
        setExtension(node, 'js');
      }
    }
    return module;
  },
};

const compile = async (sourceFile, destinationFile, config) => {
  const destinationMapFile = `${destinationFile}.map`;
  const output = await swc.transformFile(sourceFile, {
    ...config,
    filename: sourceFile,
    isModule: true,
  });

  await Fs.mkdir(Path.dirname(destinationFile), { recursive: true });
  await Fs.writeFile(destinationFile, `${output.code}\n//# sourceMappingURL=${Path.basename(destinationMapFile)}\n`);
  await Fs.writeFile(destinationMapFile, output.map);
}

(async () => {
  const sourceFiles = await glob('**/*.ts', { ignore: '**/__tests__/**/*.ts', cwd: 'src' });
  for (const filename of sourceFiles) {
    const sourceFile = `src/${filename}`;
    const destinationFileCjs = `build/${Path.basename(filename, '.ts')}.cjs`;
    const destinationFileMjs = `build/${Path.basename(filename, '.ts')}.js`;
    await compile(sourceFile, destinationFileCjs, cjsConfig);
    await compile(sourceFile, destinationFileMjs, mjsConfig);
  }
})().catch(e => console.error(e));

