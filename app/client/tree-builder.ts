import $ = require("jquery");

function createTreeNode(index: number, log: ILog, failToGetParent: boolean, parent: ITreeNode): ITreeNode {
    var node: ITreeNode = {
        index: index,
        log: log,
        actions: [{
            action: log.action_id.trim(),
            databases: [log.database_name],
            number: 1,
            objectNames: [log.object_name]
        }],
        actionNumber: 1,
        getParent: failToGetParent,
        parent: parent,
        nodes: []
    };

    return node;
}

function getParent(log: ILog, currentParent: ITreeNode): ITreeNode {
    if (currentParent.index === -1) return null;

    if (log.info.objectName.toLowerCase() === currentParent.log.object_name.toLowerCase()) {
        return currentParent;
    }
    for (var i = 0; i < currentParent.parent.nodes.length; i++) {
        var parent = currentParent.parent.nodes[i];
        if (log.info.objectName === parent.log.object_name) {
            return parent;
        }
    }

    return getParent(log, currentParent.parent);
}

function parseAdditionalInfo(information) {
    if (information) {
        var doc = $.parseXML(information),
            frame = $("frame", doc);
        return {
            nestLevel: Number(frame.attr("nest_level")),
            objectName: frame.attr("object_name")
        };
    }
    return {
        nestLevel: 0,
        objectName: ""
    };
}

function mergeLog(log: ILog, lastNode: ITreeNode): boolean {
    if (log.statement.replace(/\s+/g, "") === lastNode.log.statement.replace(/\s+/g, "")) {
        var action = log.action_id.trim();
        lastNode.actionNumber++;
        if (lastNode.actions[0].action === action) {
            lastNode.actions[0].databases.push(log.database_name);
            lastNode.actions[0].objectNames.push(log.object_name);
            lastNode.actions[0].number++;
        } else {
            lastNode.actions.unshift({
                action: action,
                databases: [log.database_name],
                objectNames: [log.object_name],
                number: 1
            });
        }
        return true;
    }

    return false;
}

export function build(logs: ILog[]): ITreeNode {
    if (!logs) return;

    var root: ITreeNode = {
        index: -1,
        log: null,
        actions: [],
        actionNumber: 0,
        getParent: true,
        parent: null,
        nodes: []
    },
        //previousNode: ITreeNode = null,
        lastNode: ITreeNode = null,
        currentNode: ITreeNode = null;

    logs.forEach((log, index) => {
        if (lastNode && mergeLog(log, lastNode)) {
            return;
        }

        log.info = parseAdditionalInfo(log.additional_information);

        if (currentNode) {
            if (log.info.objectName) {
                var parent: ITreeNode = getParent(log, currentNode);

                if (parent) {
                    lastNode = currentNode = createTreeNode(index, log, true, parent);
                    parent.nodes.push(currentNode);
                } else {
                    // throw "cannot find parent";
                    console.log("cannot find parent", index);
                    lastNode = createTreeNode(index, log, false, root)
                    root.nodes.push(lastNode);
                }
            } else {
                lastNode = createTreeNode(index, log, true, root);
                root.nodes.push(lastNode);
            }
        } else {
            lastNode = currentNode = createTreeNode(index, log, true, root);
            root.nodes.push(currentNode);
        }
    });

    return root;
}
