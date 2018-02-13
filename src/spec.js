import Jasmine from 'jasmine';
import JasmineConsoleReporter from 'jasmine-console-reporter';

const jasmine = new Jasmine();

jasmine.loadConfigFile('jasmine.json');
jasmine.addReporter(new JasmineConsoleReporter({
  colors: 1,
  cleanStack: 1,
  verbosity: 3,
  listStyle: 'indent',
  activity: false
}));

jasmine.execute();
