'use strict';

const build = require('@microsoft/sp-build-web');
const switchEnv = require('./gulpfile-switch-environment');

build.rig.addPreBuildTask(switchEnv);

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

build.initialize(require('gulp'));
