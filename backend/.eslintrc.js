module.exports = {
    env: {
        node: true,
        es6: true,
        commonjs: true
    },
    extends: [
        'eslint:recommended'
    ],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'script'
    },
    rules: {
        'no-console': 'off',
        'no-undef': 'warn'
    },
    globals: {
        process: true,
        require: true,
        module: true,
        exports: true,
        __dirname: true,
        __filename: true
    }
}; 