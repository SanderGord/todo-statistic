const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    const todos = getALLTODO(getFiles());
    switch (command.split(' ')[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(todos);
            break;
        case 'important':
            for (let str of todos){
                if (str.includes('!')){
                    console.log(str);
                }
            }
            break;
        case 'user':
            let username = command.split(' ')[1].toLowerCase();
            for (str of todos){
                if (str.includes(';') && str.split(';')[0].split(' ')[2].toLowerCase() === username){
                    console.log(str);
                }
            }
            break;
        case 'sort':
            processSortCommand(command, todos);
            break;
        case 'date':
            let getDate = str => str.split(';')[1].trim();
            let date = completeDate(command.split(" ")[1]);
            console.log(todos.filter(a => (a.includes(";") && getDate(a) > date)));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function completeDate(baseDate){
    let dateStandart = '9999-99-99';
    return baseDate + dateStandart.slice(baseDate.length);
}

function getALLTODO(strFiles){
    const todo = [];
    const todoRegex = /\/\/ TODO .*/g;
    for (let i = 0; i < strFiles.length; i++){
        if (strFiles[i].match(todoRegex)){
            todo.push(...strFiles[i].match(todoRegex));
        }
    }
    return todo;
}

function sortByCommentMode(arr, func, flagRevers){
    arr.sort((a, b) => {
        if (a.includes(";")){
            if (b.includes(";")){
                if (!flagRevers){
                    return func(a).localeCompare(func(b));
                }
                return func(b).localeCompare(func(a));
            } else {
                return 1;
            }
        } else {
            return 1;
        }
    });
    return arr;
}

function processSortCommand(command, todos){
    switch (command.split(' ')[1]){
        case 'importance':
            let impCount = a => (a.match(/!/g) || []).length;
            todos.sort((a, b) => impCount(b) - impCount(a));
            console.log(todos);
            break;
        case 'user':
            let getName = str => str.split(';')[0].split(' ')[2].toLowerCase();
            console.log(sortByCommentMode(todos, getName, false));
            break;
        case 'date':
            let getDate = str => str.split(';')[1].trim();
            console.log(sortByCommentMode(todos, getDate, true));
            break;
        default:
            console.log("incorrect sort parameter");
            break;
    }
}
// TODO you can do it!
