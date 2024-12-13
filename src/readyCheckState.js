const readystate = [
  {
    Label: "ready",
    ButtonStyle: ButtonStyle.Success,
    id: "1",
  },
  {
    Label: "not ready",
    ButtonStyle: ButtonStyle.Danger,
    id: "0",
  },
];

function getPrintState(state){
    var outText = 'Ready check bot results: \r\n \r\n';
    state.forEach((s) => {
        outText += `${s.memberName} - ${s.ready ? ':white_check_mark:' : ':broken_heart:'}\r\n`;
    });

    return outText;
}

function changeStatus(state, memberId, isReady){
    state.find(s => s.userId === memberId).ready = isReady;
    return state;
}

function addMemberToState(state, id, name){
    if(state.find(s => s.userId === id)) throw new Error(`error: user ${name} already exists in state`);

    state.push({
        userId: id,
        memberName: name,
        ready: false
    })
}

module.exports = {
    getPrintState,
    changeStatus,
    addMemberToState
};