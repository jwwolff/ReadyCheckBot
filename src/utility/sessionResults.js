const { readyStates } = require("./readyCheckState");

function printFailedSessionResult(state) {
  var content = "Ready check FAILED :x:. \r\n";
  state.forEach(s => {
      var readyOutput = ''
      switch(s.ready){
        case readyStates.isReady:
          readyOutput = 'Ready :white_check_mark:'
          break;
        case readyStates.notReady:
          readyOutput = 'Not Ready :x:'
          break;
        default:
          readyOutput = 'AFK :zzz:'
          break;
       }
      content += `${s.memberName}: ${readyOutput} \r\n`;
     });

    return content;
}

module.exports = {
  printFailedSessionResult,
};
