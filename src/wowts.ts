import * as fs from 'fs';
import * as path from 'path';
import * as child_process from 'child_process';

// The main file to compile wowts.
// process.chdir fucked up if I did it inside the transpiler so I just start it from here instead.

const CONFIG = {
    'compilerOptions': {
    'target': 'es5',
    'module': 'commonjs',
    'outDir': './scripts/build/cpp',
    'rootDir': './scripts',
    'strict': true,
    'esModuleInterop': true,
    'skipLibCheck': true,
    'forceConsistentCasingInFileNames': true
},
'include': ['./'],
'exclude': ['./data', './data_lib']
};

const startTime = Date.now();

const buildModule = process.argv[2];
const modulePath = `./modules/${buildModule}`;
if (buildModule === undefined) {
    throw new Error('No build module provided!');
}

if (!fs.existsSync(modulePath)) {
    throw new Error(`No module named ${buildModule}`);
}

if (!fs.lstatSync(modulePath).isDirectory()) {
    throw new Error(`Module ${buildModule} is not a directory`);
}

const olddir = process.cwd();
process.chdir(path.join(modulePath));
fs.writeFileSync('./tsconfig.json', JSON.stringify(CONFIG));

child_process.execSync('node ../../bin/scripts/transpiler/main.js tsconfig.json', {stdio: 'inherit'});
fs.unlinkSync('./tsconfig.json');
process.chdir(olddir);

function join(...args: string[]) {
    return args.filter(x => x.length > 0).join('/');
}

function findCpp(rootDir: string, dir: string) {
    const cdir = path.join(rootDir, dir);
    const items = fs.readdirSync(cdir);
    let cpps = items.filter(x => x.endsWith('.cpp')).map(x => join(dir, x));
    const folders = items.filter(x => fs.lstatSync(path.join(cdir, x)).isDirectory());

    for (const folder of folders) {
        cpps = cpps.concat(findCpp(rootDir, join(dir, folder)));
    }

    return cpps;
}

const itms = findCpp(path.join(modulePath, './scripts/build/cpp'), '');

fs.writeFileSync(path.join(modulePath, 'scripts/build/cpp/CMakeLists.txt'),
`cmake_minimum_required(VERSION 3.18)
project(${buildModule})
include_directories(../../../../../bin/include)
add_library(${buildModule} SHARED ${itms.join(' ')})
target_precompile_headers(${buildModule}
    PUBLIC
        ../../../../../bin/include/TSCore.h
        ../../../../../bin/include/TSClasses.h
        ../../../../../bin/include/TSEvents.h
        ../../../../../bin/include/TSIds.h
        ../../../../../bin/include/TSAll.h
)`
);

const cmake_generate = `"bin/cmake/bin/cmake.exe" -S modules/${buildModule}/scripts/build/cpp -B modules/${buildModule}/scripts/build/lib`;
child_process.execSync(cmake_generate, {stdio: 'inherit'});
const cmake_build = `"bin/cmake/bin/cmake.exe" --build modules/${buildModule}/scripts/build/lib --config Release`;
child_process.execSync(cmake_build, {stdio: 'inherit'});

const tsmodulesSubdir = './bin/azerothcore/tsmodules';
if (!fs.existsSync(tsmodulesSubdir)) {
    fs.mkdirSync(tsmodulesSubdir, {recursive: true});
}

const goalDll = path.join(tsmodulesSubdir, `${buildModule}.dll`);
if (fs.existsSync(goalDll)) {
    fs.unlinkSync(goalDll);
}

fs.copyFileSync(`./modules/${buildModule}/scripts/build/lib/Release/${buildModule}.dll`, goalDll);

const finTime = Date.now() - startTime;
console.log(`Finished compilation in ${(finTime / 1000).toFixed(1)} seconds.`);