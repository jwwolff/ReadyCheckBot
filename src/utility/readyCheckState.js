const readyStates = Object.freeze({
    Ready: 1,
    notReady: 0,
    NoVote: 2
});


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

function setReady(state, memberId){
    return changeStatus(state, memberId, true);
}

function setNotReady(state, memberId){
    return changeStatus(state, memberId, false);
}

function addMemberToState(state, id, name, ready = readyStates.NoVote){
    if(state.find(s => s.userId === id)) return;

    state.push({
        userId: id,
        memberName: name,
        ready
    })
}

function isReady(state, id){
    return state.find(s => s.userId === id).ready;
}

function getReadyCount(state){
    return state.filter(s => s.ready === 1).length;
}

function getNotReadyCount(state){
    return state.filter(s => s.ready === 0).length;
}

module.exports = {
    getPrintState,
    setReady,
    setNotReady,
    addMemberToState,
    isReady,
    getReadyCount,
    getNotReadyCount
};