declare var require: any;
declare var global: any;
declare var __dirname: string;
declare var download: any;

interface ISettings {
    databases: IDbConnection[]
}

interface IDbConnection {
    id?: string,
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
    nodes: ITreeNode[];
}
