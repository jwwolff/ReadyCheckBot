const readyStates = Object.freeze({
    isReady: 1,
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

function changeStatus(state, memberId, readyState){
    state.find(s => s.userId === memberId).ready = readyState;
    return state;
}

function setReady(state, memberId){
    return changeStatus(state, memberId, readyStates.isReady);
}

function setNotReady(state, memberId){
    return changeStatus(state, memberId, readyStates.notReady);
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
    return state.find(s => s.userId === id).ready === readyStates.Ready;
}

function hasVoted(state, id){
    return state.find(s => s.userId === id).ready !== readyStates.NoVote
}

function getReadyCount(state){
    return state.filter(s => s.ready === readyStates.isReady).length;
}

function getNotReadyCount(state){
    return state.filter(s => s.ready === readyStates.notReady).length;
}

function getNoVoteCount(state){
    return state.filter(s => s.NoVote === readyStates.NoVote).length;
}

module.exports = {
    getPrintState,
    setReady,
    setNotReady,
    addMemberToState,
    isReady,
    getReadyCount,
    getNotReadyCount,
    readyStates,
    hasVoted,
    getNoVoteCount
};