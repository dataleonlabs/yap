#!/usr/bin/env node

import Mocha from 'mocha';
import path from 'path';

const args = process.argv.slice(2);

const apitest = async () => {
    const mocha = new Mocha();
    process.env.apiclass = args[0];
    process.env.testcases = args[1];
    mocha.addFile(
        path.join(__dirname, '../apitest.js'),
    );

    mocha.run();
};

// tslint:disable-next-line: no-console
apitest().catch(console.log);
