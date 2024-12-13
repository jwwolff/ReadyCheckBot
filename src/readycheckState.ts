interface ReadyCheckState {
    userId: number;
    memberName: string;
    status: Status;
}


enum Status {
    NotReady,
    Ready
}