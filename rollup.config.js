import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import multi from '@rollup/plugin-multi-entry'
import copy from 'rollup-plugin-copy'
import pkg from './package.json'

export default {
    input: ['./src/index.ts'],
    external: ['./src/index.html'],
    plugins: [
        multi(),
        copy({
            targets: [
                {src: 'src/index.html', dest: 'dist/'}
            ]
        }),
        resolve({
            extensions: ['.js', '.jsx', '.ts', '.tsx']
        }),
        commonjs(),
        babel({
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            babelHelpers: 'bundled',
            exclude: ['node_modules/**'],
            include: ['src/**/*'],
        }),
    ],
    output: [
        {
            file: `dist/${pkg.name}.cjs.js`,
            name: pkg.name
        }, {
            file: `dist/${pkg.name}.esm.js`,
            format: 'es',
        }, {
            file: `dist/${pkg.name}.iife.js`,
            format: 'iife',
            globals: {},
        }
    ],
}