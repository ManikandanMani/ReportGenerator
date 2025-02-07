import path = require('path');
import tl = require('azure-pipelines-task-lib/task');

async function executeReportGenerator(): Promise<number> {
    var tool = tl.tool('dotnet')
    .arg(path.join(__dirname, 'tools/netcoreapp3.1/ReportGenerator.dll'))
    .arg('-reports:' + (tl.getInput('reports') || ''))
    .arg('-targetdir:' + (tl.getInput('targetdir') || ''))
    .arg('-reporttypes:' + (tl.getInput('reporttypes') || ''))
    .arg('-sourcedirs:' + (tl.getInput('sourcedirs') || ''))
    .arg('-historydir:' + (tl.getInput('historydir') || ''))
    .arg('-plugins:' + (tl.getInput('plugins') || ''))
    .arg('-assemblyfilters:' + (tl.getInput('assemblyfilters') || ''))
    .arg('-classfilters:' + (tl.getInput('classfilters') || ''))
    .arg('-filefilters:' + (tl.getInput('filefilters') || ''))
    .arg('-verbosity:' + (tl.getInput('verbosity') || ''))
    .arg('-title:' + (tl.getInput('title') || ''))
    .arg('-tag:' + (tl.getInput('tag') || ''));

    const customSettings = (tl.getInput('customSettings') || '');

    if (customSettings.length > 0) {
        customSettings.split(';').forEach(setting => {
            tool = tool.arg(setting.trim());
        });
    }

    return await tool.exec();
}

async function run() {
    try {
        tl.setResourcePath(path.join( __dirname, 'task.json'));

        let code = await executeReportGenerator();

        if (code != 0) {
            tl.setResult(tl.TaskResult.Failed, tl.loc('FailedMsg'));
        }

        tl.setResult(tl.TaskResult.Succeeded, tl.loc('SucceedMsg'));
    } catch (e) {
        tl.debug(e.message);
        tl.setResult(tl.TaskResult.Failed, e.message);
    }
}

run();