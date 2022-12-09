const { exec } = require("child_process");

function download(link, folder) {
    exec(`start cmd.exe @cmd /k "zippyshare-dl ${link} --folder ${folder}"`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
};

exports.download = download;
