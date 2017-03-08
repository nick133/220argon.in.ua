
/* -------- Node modules -------- */
const chalk = require('chalk');
const lk = require('stylus');

const argv = require('yargs')
  .alias({
    't': ['task', 'tasks'],
    'q': ['s', 'quiet', 'silent'],
    'd': ['g', 'v', 'debug', 'verbose'],
    'h': ['help'],
  })
  .usage('Usage: $0 [options]')
  .help('h')
  .describe('t', 'Run task(s)')
  .describe('d', 'Verbose output')
  .describe('q', 'Silent mode')
  .epilog('copyright 2017-present')
  .boolean(['d', 'q'])
  .argv;


const tasks = {
  __done__: [], // done tasks
};


const niceTime = () => {
  let date = new Date();

  let hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;

  let min = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;

  let sec = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;

  return '[' + chalk.grey(hour + ':' + min + ':' + sec) + ']';
}

const log = function() {
  if (argv.quiet) return;
  console.log(niceTime() + ' ' + Array.from(arguments).join(' '));
};

const error = (id, text) => {
  argv.quiet = false;
  log(chalk.red('ERROR:'), text, '[' + chalk.cyan(id) + ']');
}


//====> task.is()
const taskIs = (id, batch) => (tasks[id] = batch);

//====> task.do()
const taskDo = (id, params = {}) => {
  if (typeof(tasks[id]) === 'string') return taskDo(tasks[id], params); // Alias

  if (!taskReg(id)) return false; // Already done? Register or quit
  
  if (typeof(tasks[id]) !== 'function') {
    error(id, 'Invalid or undefined task');
    process.exit(1);
  }

  log('Begin ' + chalk.cyan(id));
  let ret = tasks[id](params);
  log('End ' + chalk.cyan(id));
  return ret;
}

//====> task.done()
const taskDone = id => (tasks.__done__.indexOf(id) > -1);

//====> task.reg()
const taskReg = id => {
  if (taskDone(id)) return false;

  tasks.__done__.push(id);
  return true;
}

//====> task.undo()
const taskUndo = id => {
  if (!taskDone(id)) return false;

  tasks.__done__[tasks.__done__.indexOf(id)] = undefined;
  return true;
}

//====> task.alias()
const taskAlias = function(id) {
  for (let i = 1; i < arguments.length; i++)
    taskIs(arguments[i], id);
}

//====> task.cli()
const taskCli = () => {
  if (argv.task === undefined)
    taskDo('default');
  else
    argv.task.split(',').forEach(taskDo);
};


module.exports = {
  argv: argv,

  do:    taskDo,
  is:    taskIs,
  alias: taskAlias,
  done:  taskDone,
  undo:  taskUndo,
  reg:   taskReg,

  cli: taskCli,
  log: log,
  error: error,
};

