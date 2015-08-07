declare var require: any;
declare var global: any;
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
    failToGetParent: boolean;
    parent: ITreeNode;
    nodes: ITreeNode[];
}
