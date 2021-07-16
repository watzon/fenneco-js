import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import pkg from './package.json'

export default {
  input: 'index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
  ],
  plugins: [
    commonjs(),
    json(),
    typescript({
      typescript: require('typescript'),
      tsconfigOverride: {
        compilerOptions : {
            module: "es2015"
        }
      }
    }),
    nodeResolve({
        // Keep from trying to resove .tl imports from gramjs
        resolveOnly: [/^.*\.tl$/]
    }),
  ],
}
