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

function addMemberToState(state, id, name, ready = false){
    if(state.find(s => s.userId === id)) return;

    state.push({
        userId: id,
        memberName: name,
        ready
    })
}

module.exports = {
    getPrintState,
    changeStatus,
    addMemberToState
};