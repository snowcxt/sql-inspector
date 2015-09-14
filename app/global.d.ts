declare var download: any;

interface ISettings {
    databases: IDbConnection[]
}

interface IDbConnection {
    user: string;
    password: string;
    server: string;
    database?: string;
}

interface ILog {
    event_time: string;
    action_id: string;
    database_name: string;
    object_name: string;
    statement: string;
    additional_information: string;
    info: {
        nestLevel: number;
        objectName: string;
    }
}

interface ITreeNode {
    index: number;
    log: ILog;
    getParent: boolean;
    parent: ITreeNode;
    actionNumber: number;
    actions: { action: string; database: string; objectName: string; number: number; }[];
    nodes: ITreeNode[];
}
