import * as jsBeautify from 'js-beautify';

import { Component, OnInit, ViewChild } from '@angular/core';

import {
  FuiTreeViewComponent,
  NonRootTreeNode,
  PagedTreeNodeDataRetriever,
  PagingParams,
  TreeNodeData,
  TreeNodeDataRetriever
} from '@ferui/components';

@Component({
  template: `
    <div class="container-fluid">
      <div class="row" style="max-width: 1200px">
        <div class="col col-12 p-0">
          <div class="demo-tree-view">
            <h2>Client Side Tree View Selection Feature (Checkboxes)</h2>
            <div class="demo-component">
              <fui-tree-view
                #treeViewClientSideComponent
                [treeNodeData]="treeNodeData"
                [dataRetriever]="treeDataRetriever"
                [config]="{ width: '250px', height: '300px', nodeSelection: 'MULTIPLE' }"
              ></fui-tree-view>
            </div>
            <div class="code-example">
              <fui-tabs>
                <fui-tab [label]="'HTML'">
                  <pre><code [languages]="['html']" [highlight]="htmlExample1"></code></pre>
                </fui-tab>
                <fui-tab [label]="'TypeScript'">
                  <pre><code [languages]="['typescript']" [highlight]="dataExample1"></code></pre>
                </fui-tab>
                <fui-tab [label]="'Checked Nodes List'">
                  <pre><code [languages]="['typescript']" [highlight]="checkedNodesPublicApiUsage"></code></pre>
                  <button class="btn btn-success" (click)="logCheckedNodesClientSide()">Log checked nodes</button>
                  <pre><code [languages]="['typescript']" [highlight]="checkedNodesExample1"></code></pre>
                  <button class="btn btn-success" (click)="logPartiallyCheckedNodesClientSide()">
                    Log partially checked nodes
                  </button>
                  <pre><code [languages]="['typescript']" [highlight]="partiallyCheckedNodesExample1"></code></pre>
                </fui-tab>
              </fui-tabs>
            </div>
          </div>

          <div class="demo-tree-view">
            <h1>Server Side Tree View Selection Feature (Checkboxes)</h1>
            <p>
              On Server-Side we disable children when parent node is checked by default to show the upper most node in the
              hierarchy has already been selected, to overwrite this developer may use the
              <b>serverSideDisableChildren</b> configuration value
            </p>
            <p>
              For Server-Side selection the user will need to select each node manually. We may not have access to the entire node
              hierarchy at the time of it being checked and therefore will only select the checked-on node and will not include
              its child nodes or any descendants. This also means partial selection will not work on Server-Side and a parent node
              won't reflect this state via its child selection.
            </p>
            <div class="demo-component">
              <fui-tree-view
                #treeViewServerSideComponent
                [loading]="loading"
                [treeNodeData]="serverSideTreeNodeData"
                [dataRetriever]="serverDataRetriever"
                [config]="{ width: '250px', height: '300px', nodeSelection: 'MULTIPLE' }"
              ></fui-tree-view>
            </div>
            <div class="code-example">
              <fui-tabs>
                <fui-tab [label]="'HTML'">
                  <pre><code [languages]="['html']" [highlight]="htmlExample2"></code></pre>
                </fui-tab>
                <fui-tab [label]="'TypeScript'">
                  <pre><code [languages]="['typescript']" [highlight]="dataExample2"></code></pre>
                </fui-tab>
                <fui-tab [label]="'Checked Nodes List'">
                  <pre><code [languages]="['typescript']" [highlight]="checkedNodesPublicApiUsage"></code></pre>
                  <button class="btn btn-success" (click)="logCheckedNodesServerSide()">Log checked nodes</button>
                  <pre><code [languages]="['typescript']" [highlight]="checkedNodesExample2"></code></pre>
                </fui-tab>
              </fui-tabs>
            </div>
          </div>

          <div class="demo-tree-view">
            <h2>Client Side NonRoot Tree View Single Selection Feature (Checkboxes)</h2>
            <p>
              Using the <b>'SINGLE'</b> option of <i>nodeSelection</i> feature to only ever check one node and using
              <b>isNodeUnselectable</b> in data retriever to make a specific node unselectable
            </p>
            <div class="demo-component">
              <fui-tree-view
                #treeViewClientSideNonRootComponent
                [treeNodeData]="nonRootTreeNodeData"
                [dataRetriever]="nonRootTreeDataRetriever"
                [config]="{ width: '250px', height: '300px', nodeSelection: 'SINGLE' }"
              ></fui-tree-view>
            </div>
            <div class="code-example">
              <fui-tabs>
                <fui-tab [label]="'HTML'">
                  <pre><code [languages]="['html']" [highlight]="htmlExample3"></code></pre>
                </fui-tab>
                <fui-tab [label]="'TypeScript'">
                  <pre><code [languages]="['typescript']" [highlight]="dataExample3"></code></pre>
                </fui-tab>
                <fui-tab [label]="'Checked Nodes List'">
                  <pre><code [languages]="['typescript']" [highlight]="checkedNodesPublicApiUsage"></code></pre>
                  <button class="btn btn-success" (click)="logCheckedNodesNonRootClientSide()">Log checked node</button>
                  <pre><code [languages]="['typescript']" [highlight]="checkedNodesExample3"></code></pre>
                </fui-tab>
              </fui-tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .demo-tree-view {
        background-color: #f5f8f9;
        padding-top: 20px;
        padding-left: 10px;
      }
      .demo-tree-view:last-child {
        padding-bottom: 20px;
      }
      .demo-component {
        display: inline-block;
        vertical-align: top;
      }
      .code-example {
        display: inline-block;
        height: auto;
        margin-left: 20px;
        max-width: 550px;
      }
      .btn-success {
        margin-bottom: 10px;
      }
    `
  ]
})
export class TreeViewCheckboxDemoComponent implements OnInit {
  @ViewChild('treeViewClientSideComponent') treeViewClientSideComponent: FuiTreeViewComponent<any>;
  @ViewChild('treeViewServerSideComponent') treeViewServerSideComponent: FuiTreeViewComponent<any>;
  @ViewChild('treeViewClientSideNonRootComponent') treeViewClientSideNonRootComponent: FuiTreeViewComponent<any>;

  htmlExample1 = jsBeautify.html(`
    <fui-tree-view
          [treeNodeData]="treeNodeData"
          [dataRetriever]="treeDataRetriever"
          [config]="treeViewConfiguration"
          (onNodeEvent)="handleNodeEvent($event)"></fui-tree-view>
  `);
  dataExample1 = jsBeautify.js(`
    interface Node {
      name: string;
      children?: Node[];
    }

    const treeData: Node = {
      name: 'John',
      children: [
        {
          name: 'Juliet',
          children: [{ name: 'Jerry' }, { name: 'Sara', children: [{ name: 'Alexa' }] }, { name: 'Tom' }]
        },
        { name: 'Jim' },
        {
          name: 'Calvin',
          children: [
            {
              name: 'Samantha',
              children: [{ name: 'Jordan' }, { name: 'Cory' }]
            },
            {
              name: 'Louis',
              children: [{ name: 'Geo' }, { name: 'Brandon' }]
            }
          ]
        }
      ]
    };

    // nodeLabel property will be used to display the tree node text label
    treeNodeData: TreeNodeData<Node> = {
      data: treeData,
      nodeLabel: treeData.name
    };

    treeDataRetriever: TreeNodeDataRetriever<Node> = {
      hasChildNodes: (node: TreeNodeData<Node>) => {
        return Promise.resolve(!!node.data.children && node.data.children.length > 0);
      },
      getChildNodeData: (node: TreeNodeData<Node>) => {
        return Promise.resolve(
          node.data.children.map(it => {
            return { data: it, nodeLabel: it.name };
          })
        );
      }
    };

    // Developer must pass in the multi-select field inside TreeView configuration to show tree node checkboxes and trigger multi-select feature
    treeViewConfiguration: TreeViewConfiguration = {
      width: '250px',
      height: '300px',
      nodeSelection: 'MULTIPLE'
    }

    // A developer may also bind to the onNodeEvent observable to listen to any node event happening in the Tree View
    // The event emitted will deliver a TreeViewEvent<T>
    handleNodeEvent(event) {
      const treeNodeDataFromEvent = event.getNode();
      const eventType = event.getType();
      /**
        do something when event type is TreeViewEventType.NODE_CHECKED or TreeViewEventType.NODE_UNCHECKED
      **/
    }
   `);
  checkedNodesPublicApiUsage = jsBeautify.js(`
    // Using the FerUI Tree View's public API developer can get the checked & partially checked lists of TreeNodeData
    // the user has been checking on in the UI

    @ViewChild('treeViewComponent') treeViewComponent: FuiTreeViewComponent<T>;

    // Using the publicly available getCheckedNodesList method from TreeViewComponent dev gets the checked nodes
    logCheckedNodesClientSide(): void {
     const checkedNodesList = this.treeViewComponent.getCheckedNodesList();
     console.log(checkedNodesList);
    }

    // Using the publicly available getPartiallyCheckedNodesList method from TreeViewComponent dev gets the partially checked nodes
    logPartiallyCheckedNodesClientSide(): void {
     const partiallyCheckedNodesList = this.treeViewComponent.getPartiallyCheckedNodesList();
     console.log(partiallyCheckedNodesList);
    }
  `);
  checkedNodesExample1 = jsBeautify.js(``);
  partiallyCheckedNodesExample1 = jsBeautify.js(``);

  htmlExample2 = jsBeautify.html(`
    <fui-tree-view
          [loading]="loading"
          [treeNodeData]="serverSideTreeNodeData"
          [dataRetriever]="serverDataRetriever"
          [config]="treeViewConfiguration"
        ></fui-tree-view>
    `);
  dataExample2 = jsBeautify.js(`
    // Dev provides server side data TreeNode to start off their tree view
    serverSideTreeNodeData: TreeNodeData<Node> = {
      data: serverData,
      nodeLabel: serverData.name
    };

    // Developer must pass in the multi-select field inside TreeView configuration to show tree node checkboxes and trigger multi-select feature
    treeViewConfiguration: TreeViewConfiguration = {
      width: '250px',
      height: '300px',
      nodeSelection: 'MULTIPLE'
    }

    serverDataRetriever: PagedTreeNodeDataRetriever<Node> = {
      hasChildNodes: (node: TreeNodeData<Node>) => {
        return Promise.resolve(node.hasChildren());
      },
      getPagedChildNodeData: (node: TreeNodeData<Node>, pagingParams: PagingParams) => {
        const url = 'https://back-end-server/' + node.data.id + '?start=' +
                    pagingParams.offset + '&limit=' + pagingParams.limit;
        return this.http.get(url).subscribe((results: TreeNodeData[]) => { return results });
      },
    };
  `);
  checkedNodesExample2 = jsBeautify.js(``);

  htmlExample3 = jsBeautify.html(`
    <fui-tree-view
          [treeNodeData]="nonRootTreeNodeData"
          [dataRetriever]="nonRootTreeDataRetriever"
          [config]="{ width: '250px', height: '300px', nodeSelection: 'SINGLE' }"></fui-tree-view>
  `);
  dataExample3 = jsBeautify.js(`
    nonRootTreeNodeData = NonRootTreeNode.instance;
    nonRootTreeDataRetriever: TreeNodeDataRetriever<Node> = {
      hasChildNodes: (node: TreeNodeData<Node>) => {
        return Promise.resolve(!!node.data.children && node.data.children.length > 0);
      },
      getChildNodeData: (node: TreeNodeData<Node>) => {
        const isEmptyRoot = node instanceof NonRootTreeNode;
        if (isEmptyRoot) {
          return Promise.resolve(
            nonrootTreeData.map(it => {
              return { data: it, nodeLabel: it.name };
            })
          );
        }
        return Promise.resolve(
          node.data.children.map(it => {
            return { data: it, nodeLabel: it.name };
          })
        );
      },
      isNodeUnselectable(node: TreeNodeData<Node>): boolean {
        return node.nodeLabel === 'Jim';
      }
    };
  `);
  checkedNodesExample3 = jsBeautify.js(``);

  // Client side
  treeNodeData: TreeNodeData<Node> = {
    data: treeData,
    nodeLabel: treeData.name
  };
  treeDataRetriever: TreeNodeDataRetriever<Node> = {
    hasChildNodes: (node: TreeNodeData<Node>) => Promise.resolve(!!node.data.children && node.data.children.length > 0),
    getChildNodeData: (node: TreeNodeData<Node>) => {
      return Promise.resolve(
        node.data.children.map(it => {
          return { data: it, nodeLabel: it.name };
        })
      );
    }
  };

  // Server side
  loading = true;
  serverSideTreeNodeData: TreeNodeData<Node> = {
    data: serverData,
    nodeLabel: serverData.name
  };
  serverDataRetriever: PagedTreeNodeDataRetriever<Node> = {
    hasChildNodes: (node: TreeNodeData<Node>) => Promise.resolve(!!node.data.children && node.data.children.length > 0),
    getChildNodeData: (node: TreeNodeData<Node>) => {
      return Promise.resolve(
        node.data.children.map(i => {
          return { data: it, nodeLabel: it.name };
        })
      );
    },
    getPagedChildNodeData: (node: TreeNodeData<Node>, pagingParams: PagingParams) => {
      return new Promise(resolve => {
        setTimeout(() => {
          const children = node.data.children.slice(pagingParams.offset, pagingParams.offset + pagingParams.limit);
          resolve(
            children.map(it => {
              return { data: it, nodeLabel: it.name };
            })
          );
        }, 300);
      });
    }
  };

  // Non Root Client Side
  nonRootTreeNodeData = NonRootTreeNode.instance;
  nonRootTreeDataRetriever: TreeNodeDataRetriever<Node> = {
    hasChildNodes: (node: TreeNodeData<Node>) => Promise.resolve(!!node.data.children && node.data.children.length > 0),
    getChildNodeData: (node: TreeNodeData<Node>) => {
      const isEmptyRoot = node instanceof NonRootTreeNode;
      if (isEmptyRoot) {
        return Promise.resolve(
          nonrootTreeData.map(it => {
            return { data: it, nodeLabel: it.name };
          })
        );
      }
      return Promise.resolve(
        node.data.children.map(it => {
          return { data: it, nodeLabel: it.name };
        })
      );
    },
    isNodeUnselectable(node: TreeNodeData<Node>): boolean {
      return node.nodeLabel === 'Jim';
    }
  };

  /**
   * Will populate server side data with children
   */
  ngOnInit(): void {
    setTimeout(() => {
      this.loading = false;
    }, 1500);
    for (let i = 1; i <= 200; i++) {
      serverData.children[0].children.push({ name: 'Fruit Child ' + (i + 1), id: 'Fruit Child ' + (i + 1) });
      if (i === 60) {
        serverData.children[0].children[i].children = [];
        for (let y = 0; y <= 250; y++) {
          serverData.children[0].children[i].children.push({ name: 'Fruit Grandchild ' + y, id: 'Fruit Grandchild ' + y });
        }
      }
    }
    for (let x = 0; x <= 300; x++) {
      serverData.children[1].children.push({ name: 'Vegetable Child ' + x, id: 'Vegetable Child ' + x });
    }
  }

  /**
   * Log the checked nodes for user to see the list of nodes they have checked on
   */
  logCheckedNodesClientSide(): void {
    const filteredNodeLabels = this.treeViewClientSideComponent.getCheckedNodesList().map(it => it.nodeLabel);
    this.checkedNodesExample1 = jsBeautify.js(JSON.stringify(filteredNodeLabels));
    console.log(this.treeViewClientSideComponent.getCheckedNodesList());
  }

  /**
   * Log the checked nodes for user to see the list of nodes they have checked on
   * For demo purposes only we show just the checked nodes labels
   */
  logCheckedNodesServerSide(): void {
    const filteredNodeLabels = this.treeViewServerSideComponent.getCheckedNodesList().map(it => it.nodeLabel);
    this.checkedNodesExample2 = jsBeautify.js(JSON.stringify(filteredNodeLabels));
    console.log(this.treeViewServerSideComponent.getCheckedNodesList());
  }

  /**
   * Log the checked nodes for user to see the list of nodes they have checked on
   */
  logPartiallyCheckedNodesClientSide(): void {
    const filteredNodeLabels = this.treeViewClientSideComponent.getPartiallyCheckedNodesList().map(it => it.nodeLabel);
    this.partiallyCheckedNodesExample1 = jsBeautify.js(JSON.stringify(filteredNodeLabels));
    console.log(this.treeViewClientSideComponent.getPartiallyCheckedNodesList());
  }

  /**
   * Log the checked node for the Non Root Tree View single selection feature
   */
  logCheckedNodesNonRootClientSide(): void {
    const filteredNodeLabels = this.treeViewClientSideNonRootComponent.getCheckedNodesList().map(it => it.nodeLabel);
    this.checkedNodesExample3 = jsBeautify.js(JSON.stringify(filteredNodeLabels));
    console.log(this.treeViewClientSideNonRootComponent.getCheckedNodesList());
  }
}

/**
 * Node Interface
 */
interface Node {
  name: string;
  children?: Node[];
  id?: string;
}

const treeData: Node = {
  name: 'John',
  children: [
    {
      name: 'Juliet',
      children: [{ name: 'Jerry' }, { name: 'Sara', children: [{ name: 'Alexa' }] }, { name: 'Tom' }]
    },
    {
      name: 'Jim'
    },
    {
      name: 'Calvin',
      children: [
        {
          name: 'Samantha',
          children: [{ name: 'Jordan' }, { name: 'Cory' }]
        },
        {
          name: 'Louis',
          children: [{ name: 'Geo' }, { name: 'Brandon' }]
        }
      ]
    }
  ]
};

const serverData: Node = {
  name: 'Foods',
  id: 'Foods',
  children: [
    {
      name: 'Fruit',
      id: 'Fruit',
      children: [{ name: 'Fruit Child 1', id: 'Fruit Child 1' }]
    },
    {
      name: 'Vegetables',
      id: 'Vegetables',
      children: [
        {
          name: 'Green',
          id: 'Green',
          children: [
            { name: 'Broccoli', id: 'Broccoli' },
            { name: 'Brussels sprouts', id: 'Brussels sprouts' }
          ]
        },
        {
          name: 'Orange',
          id: 'Orange',
          children: [
            { name: 'Pumpkins', id: 'Pumpkins' },
            { name: 'Carrots', id: 'Carrots' }
          ]
        }
      ]
    }
  ]
};

const nonrootTreeData = treeData.children;
