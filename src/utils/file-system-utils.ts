import fs from 'fs';
import path from 'path';
import os from 'os';

export class FileSystemUtils {
    /**
     * Accepts a path to a file and tries to look for the nearest corresponding package.json
     * by searching the directory tree upwards.
     * 
     * @param filePath
     * @returns An untyped package.json or null if no package.json could be found. 
     */
    static findPackageJsonForFile(filePath: string): any | null {
        let currentDir = path.dirname(filePath).toLowerCase();
        var fsRoot = (os.platform() === "win32") ? process.cwd().split(path.sep)[0] + '/' : "/"

        while (currentDir !== fsRoot) {
            const directoryContents = fs.readdirSync(currentDir);

            if (directoryContents.includes('package.json')) {
                return JSON.parse(fs.readFileSync(path.join(currentDir, 'package.json'), { encoding: 'utf8' }));
            }

            currentDir = path.join(currentDir, '..');
        }

        return null;
    }
}
