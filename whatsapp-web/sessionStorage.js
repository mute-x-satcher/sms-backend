const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const stream = require('stream');

const AUTH_FOLDER = path.join(__dirname, '..', '.wwebjs_auth');

async function zipAuthFolderToBuffer() {
    return new Promise((resolve, reject) => {
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        const bufferStream = new stream.PassThrough();
        const chunks = [];

        bufferStream.on('data', chunk => chunks.push(chunk));
        bufferStream.on('end', () => resolve(Buffer.concat(chunks)));
        bufferStream.on('error', reject);

        archive.pipe(bufferStream);

        archive.glob('**/*', {
            cwd: AUTH_FOLDER,
            dot: true,
            ignore: ['**/LOCK', '**/*.lock', '**/~*', '**/*.tmp']
        });

        archive.finalize().catch(reject);
    });
}

module.exports = { zipAuthFolderToBuffer };
