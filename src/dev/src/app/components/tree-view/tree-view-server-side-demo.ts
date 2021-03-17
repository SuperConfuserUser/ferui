import * as jsBeautify from 'js-beautify';

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import {
  FuiTreeViewComponent,
  NonRootTreeNode,
  PagedTreeNodeDataRetriever,
  PagingParams,
  TreeNode,
  TreeNodeData,
  TreeNodeDataRetriever,
  TreeViewAutoNodeSelector
} from '@ferui/components';

@Component({
  template: `
    <div class="container-fluid">
      <div class="row" style="max-width: 1200px">
        <div class="col col-12 p-0">
          <h2 class="mb-4">Server Side Tree View</h2>
          <div class="demo-tree-view">
            <h1>Server Side Tree View With Borders</h1>
            <h4>Select first node via Tree View auto selector interface</h4>
            <div class="demo-component">
              <fui-tree-view
                [autoNodeSelector]="treeViewAutoNodeSelector"
                [loading]="loading"
                [treeNodeData]="serverSideTreeNodeData"
                [dataRetriever]="serverDataRetriever"
                [config]="{ width: '250px', height: '300px', hasBorders: true }"
              ></fui-tree-view>
            </div>
            <div class="code-example">
              <fui-tabs>
                <fui-tab [label]="'HTML'">
                  <pre><code [languages]="['html']" [highlight]="dataExampleHtml2"></code></pre>
                </fui-tab>
                <fui-tab [label]="'TypeScript'">
                  <pre><code [languages]="['typescript']" [highlight]="dataExample2"></code></pre>
                </fui-tab>
              </fui-tabs>
            </div>
          </div>

          <div class="demo-tree-view">
            <h2>Server Side Non Root Tree View with adjustable width and adjustable padding</h2>
            <div class="demo-component expandable-width">
              <fui-tree-view
                [loading]="treeDataRetrieverNonRootLoading"
                [treeNodeData]="nonRootServerSideTreeNodeData"
                [dataRetriever]="treeDataRetrieverNonRoot"
                [config]="{ height: '300px', limit: 10 }"
              ></fui-tree-view>
            </div>
            <div class="code-example">
              <fui-tabs>
                <fui-tab [label]="'HTML'">
                  <pre><code [languages]="['html']" [highlight]="htmlExampleOneLevel"></code></pre>
                </fui-tab>
                <fui-tab [label]="'TypeScript'">
                  <pre><code [languages]="['typescript']" [highlight]="dataExampleOneLevel"></code></pre>
                </fui-tab>
              </fui-tabs>
            </div>
          </div>

          <div class="demo-tree-view">
            <h1>Tree View using public API to select, expand and collapse nodes</h1>
            <h4>Open Root Note at beginning</h4>
            <div class="demo-component">
              <fui-tree-view
                #publicApi
                [treeNodeData]="treeNodeData"
                [dataRetriever]="treeDataRetriever"
                [config]="{ width: '250px', height: '300px' }"
              ></fui-tree-view>
              <div class="public-buttons">
                <p>
                  <button class="btn btn-primary" (click)="expandVegetables()">Expand Vegetables Child</button>
                </p>
                <p>
                  <button class="btn btn-primary" (click)="closeVegetables()">Collapse Vegetables child</button>
                </p>
                <p>
                  <button class="btn btn-primary" (click)="selectFruits()">Select Fruits Child</button>
                </p>
              </div>
            </div>
            <div class="code-example">
              <fui-tabs>
                <fui-tab [label]="'HTML'">
                  <pre><code [languages]="['html']" [highlight]="dataExampleHtml4"></code></pre>
                </fui-tab>
                <fui-tab [label]="'TypeScript'">
                  <pre><code [languages]="['typescript']" [highlight]="dataExample4"></code></pre>
                </fui-tab>
              </fui-tabs>
            </div>
          </div>

          <div class="demo-tree-view">
            <h1>
              Non Root Server Side Tree View
              <button type="button" class="btn btn-primary" (click)="hiddenTreeview = !hiddenTreeview">
                {{ hiddenTreeview ? 'Display treeView' : 'Hide Treeview' }}
              </button>
            </h1>
            <div class="demo-component" [class.hidden-treeview]="hiddenTreeview">
              <fui-tree-view
                [loading]="loading"
                [treeNodeData]="nonRootServerSideTreeNodeData"
                [dataRetriever]="nonRootServerSideDataRetriever"
                [config]="{ height: '300px', width: '250px' }"
              ></fui-tree-view>
              <ng-template #treeViewTemplate let-node="node">
                <span class="directory-label">{{ node.data.nodeLabel }}</span>
              </ng-template>
            </div>
            <div class="code-example">
              <fui-tabs>
                <fui-tab [label]="'HTML'">
                  <pre><code [languages]="['html']" [highlight]="dataExampleHtml3"></code></pre>
                </fui-tab>
                <fui-tab [label]="'TypeScript'">
                  <pre><code [languages]="['typescript']" [highlight]="dataExample3"></code></pre>
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
        padding: 20px 0 20px 20px;
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
      .public-buttons {
        padding-top: 20px;
      }
      .hidden-treeview {
        display: none;
      }
      .expandable-width {
        width: 20%;
        border: 1px solid;
      }
    `
  ]
})
export class TreeViewServerSideDemoComponent implements OnInit {
  @ViewChild('publicApi') publicTreeView: FuiTreeViewComponent<any>;
  @ViewChild('treeViewTemplate') nodeTemplate: TemplateRef<TreeNode<FoodNode>>;

  hiddenTreeview: boolean = true;

  dataExampleHtml2 = jsBeautify.html(`
    <fui-tree-view
          [autoNodeSelector]="treeViewAutoSelector"
          [loading]="loading"
          [treeNodeData]="serverSideTreeNodeData"
          [dataRetriever]="serverDataRetriever"
          [config]="treeViewConfiguration"
        ></fui-tree-view>
    `);

  dataExample2 = jsBeautify.js(`
    // Developer can pass optional parameters for TreeView configuration
    // Otherwise default ones are issued
    treeViewConfiguration: TreeViewConfiguration = {
      width: '250px',
      height: '300px',
      hasBorders: true,
      bufferAmount: 30
    }

    serverDataRetriever: PagedTreeNodeDataRetriever<FoodNode> = {
      hasChildNodes: (node: TreeNodeData<FoodNode>) => {
        return Promise.resolve(node.hasChildren());
      },
      // not used on Server Side rendering
      getChildNodeData: (node: TreeNodeData<FoodNode>) => {
        return Promise.resolve();
      },
      getPagedChildNodeData: (node: TreeNodeData<FoodNode>, pagingParams: PagingParams) => {
        const url = 'https://back-end-server/' + node.data.id + '?start=' +
                    pagingParams.offset + '&limit=' + pagingParams.limit;
        return this.http.get(url).subscribe((results: TreeNodeData[]) => {
          return results;
        });
      },
    };

    // auto selector if developer wishes to select a node on initialization of tree view from the first level
    // layer of the Node Trees
    treeViewAutoSelector: TreeViewAutoNodeSelector<FoodNode> = {
        autoSelectNode(nodesArray: Array<TreeNodeData<FoodNode>>): TreeNodeData<FoodNode> {
            // select the first node
            return nodesArray[0];
        }
    }
  `);

  dataExampleHtml4 = jsBeautify.html(`
    <fui-tree-view
          #myTreeView
          [treeNodeData]="treeNodeData"
          [dataRetriever]="dataRetriever"
          [config]="config"
        ></fui-tree-view>
    `);

  dataExample4 = jsBeautify.js(`
    // Using Angular's ViewChild (or similar) you can gain access to your Tree View's public api
    @ViewChild('myTreeView') treeView: FuiTreeViewComponent<FoodNode>;

    // The FuiTreeViewComponent will give you access to 3 public API methods that all take in a TreeNodeData<T>
    // selectNode
    // expandNode
    // collapseNode

    closeVegetables(): void {
      const treeNodeData: TreeNodeData<FoodNode> = {
        data: this.treeNodeData.data.children[1],
        nodeLabel: this.treeNodeData.data.children[1].name,
      };
      this.treeView.collapseNode(treeNodeData);
    }

    expandVegetables(): void {
      const treeNodeData: TreeNodeData<FoodNode> = {
        data: this.treeNodeData.data.children[1],
        nodeLabel: this.treeNodeData.data.children[1].name,
      };
      this.treeView.expandNode(treeNodeData);
    }

    selectFruits(): void {
      const treeNodeData: TreeNodeData<FoodNode> = {
        data: this.treeNodeData.data.children[0],
        nodeLabel: this.treeNodeData.data.children[0].name
      };
      this.treeView.selectNode(treeNodeData);
    }
  `);

  dataExampleHtml3 = jsBeautify.html(`<fui-tree-view
          [loading]="loading"
          [treeNodeData]="nonRootServerSideTreeNodeData"
          [dataRetriever]="nonRootServerSideDataRetriever"
          [config]="{ width: '250px', height: '300px' }"></fui-tree-view>`);

  dataExample3 = jsBeautify.js(`
      // Non Root Server Side
      nonRootServerSideTreeNodeData: NonRootTreeNode = NonRootTreeNode.instance;

      nonRootServerSideDataRetriever: PagedTreeNodeDataRetriever<FoodNode> = {
        hasChildNodes: (node: TreeNodeData<FoodNode>) => Promise.resolve(!!node.data.children && node.data.children.length > 0),
        getChildNodeData: (node: TreeNodeData<FoodNode>) => {
          // not used on Server Side
        },
        getPagedChildNodeData: (node: TreeNodeData<FoodNode>, pagingParams: PagingParams) => {
          // On first load the initial node will be the non root tree node, dev must handle appropriately
          if (node instanceof NonRootTreeNode) {
            // mocking the promises
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                const children = serverData.children[0].children.slice(pagingParams.offset, pagingParams.offset + pagingParams.limit);
                resolve(
                  children.map(it => {
                    return { data: it, nodeLabel: it.name };
                  })
                );
              }, 100);
            });
          }
          return new Promise((resolve, reject) => {
              setTimeout(() => {
                const children = node.data.children.slice(pagingParams.offset, pagingParams.offset + pagingParams.limit);
                resolve(
                  children.map(it => {
                    return { data: it, nodeLabel: it.name };
                  })
                );
              }, 500);
          });
        }
      };
   `);

  htmlExampleOneLevel = jsBeautify.html(`
        <fui-tree-view
          [treeNodeData]="noRoot"
          [dataRetriever]="treeDataRetrieverNonRoot"
          [config]="{ height: '300px', limit: 10 }"></fui-tree-view>
    `);

  dataExampleOneLevel = jsBeautify.js(`
    noRoot = NonRootTreeNode.instance;

    treeDataRetrieverNonRoot = {
        hasChildNodes: (node: TreeNodeData<FoodNode>) => {
            return Promise.resolve(!!node.data.children && node.data.children.length > 0);
        },
        getPagedChildNodeData: (parent, params) => {
            return getPagedDate(params.offset, params.limit).then((dataArray) => {
                return dataArray.map(it => {
                    return { data: it, nodeLabel: it.name };
                });
            });
       }
  `);

  // Public api
  treeNodeData: TreeNodeData<FoodNode> = {
    data: treeData,
    nodeLabel: treeData.name
  };
  treeDataRetriever: TreeNodeDataRetriever<FoodNode> = {
    hasChildNodes: (node: TreeNodeData<FoodNode>) => {
      return Promise.resolve(!!node.data.children && node.data.children.length > 0);
    },
    getChildNodeData: (node: TreeNodeData<FoodNode>) => {
      return Promise.resolve(
        node.data.children.map(it => {
          return { data: it, nodeLabel: it.name };
        })
      );
    }
  };

  // Server side
  loading = true;
  serverSideTreeNodeData: TreeNodeData<FoodNode> = {
    data: serverData,
    nodeLabel: serverData.name
  };
  treeViewAutoNodeSelector: TreeViewAutoNodeSelector<FoodNode> = {
    autoSelectNode(nodesArray: Array<TreeNodeData<FoodNode>>): TreeNodeData<FoodNode> {
      return nodesArray.length > 1 ? nodesArray[1] : nodesArray[0];
    }
  };
  serverDataRetriever: PagedTreeNodeDataRetriever<FoodNode> = {
    hasChildNodes: (node: TreeNodeData<FoodNode>) => {
      return Promise.resolve(!!node.data.children && node.data.children.length > 0);
    },
    getChildNodeData: (node: TreeNodeData<FoodNode>) => {
      return Promise.resolve(
        node.data.children.map(i => {
          return { data: it, nodeLabel: it.name };
        })
      );
    },
    getPagedChildNodeData: (node: TreeNodeData<FoodNode>, pagingParams: PagingParams) => {
      return new Promise((resolve, reject) => {
        // Will mock an error if data is Orange
        if (node.data.name === 'Orange') {
          setTimeout(() => reject({ message: 'Error: Could not retrieve child node data' }), 1000);
        } else {
          setTimeout(() => {
            const children = node.data.children.slice(pagingParams.offset, pagingParams.offset + pagingParams.limit);
            resolve(
              children.map(it => {
                return { data: it, nodeLabel: it.name };
              })
            );
          }, 500);
        }
      });
    }
  };

  // Non Root Server Side
  nonRootServerSideTreeNodeData: NonRootTreeNode;
  nonRootServerSideDataRetriever: PagedTreeNodeDataRetriever<FoodNode>;
  treeDataRetrieverNonRootLoading: boolean = true;
  treeDataRetrieverNonRoot = {
    hasChildNodes: (node: TreeNodeData<FoodNode>) => {
      return Promise.resolve(!!node.data.children && node.data.children.length > 0);
    },
    getPagedChildNodeData: (parent, params) => {
      if (parent instanceof NonRootTreeNode) {
        return new Promise(resolve => {
          setTimeout(() => {
            this.treeDataRetrieverNonRootLoading = false;
            resolve(
              dataArrayExpandWidth.slice(params.offset, params.limit).map(it => {
                return { data: it, nodeLabel: it.name };
              })
            );
          }, 3000);
        });
      }
      return Promise.resolve(
        dataArrayExpandWidth.slice(params.offset, params.limit).map(it => {
          return { data: it, nodeLabel: it.name };
        })
      );
    }
  };

  ngOnInit() {
    // Non Root Server Side
    this.nonRootServerSideTreeNodeData = NonRootTreeNode.instance;
    this.nonRootServerSideDataRetriever = {
      hasChildNodes: (node: TreeNodeData<FoodNode>) => Promise.resolve(!!node.data.children && node.data.children.length > 0),
      getChildNodeData: (parent: TreeNodeData<FoodNode>) => void 0,
      getPagedChildNodeData: (node: TreeNodeData<FoodNode>, pagingParams: PagingParams) => {
        if (node instanceof NonRootTreeNode) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              const children = serverData.children[0].children.slice(
                pagingParams.offset,
                pagingParams.offset + pagingParams.limit
              );
              resolve(
                children.map(it => {
                  return { data: it, nodeLabel: it.name };
                })
              );
            }, 100);
          });
        }
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const children = node.data.children.slice(pagingParams.offset, pagingParams.offset + pagingParams.limit);
            resolve(
              children.map(it => {
                return { data: it, nodeLabel: it.name };
              })
            );
          }, 500);
        });
      },
      getNodeTemplate: () => {
        return this.nodeTemplate;
      }
    };

    setTimeout(() => {
      this.loading = false;
    }, 2500);
    for (let i = 0; i <= 500; i++) {
      serverData.children[0].children.push({ name: 'Fruit Child ' + i });
    }
    for (let x = 0; x <= 1000; x++) {
      serverData.children[1].children.push({ name: 'Vegetable Child ' + x });
    }
    for (let y = 0; y <= 250; y++) {
      serverData.children[0].children[2].children.push({ name: 'Strawberry child ' + y });
    }
    setTimeout(() => {
      this.publicTreeView.expandNode(this.treeNodeData);
    }, 500);

    for (let i = 0; i <= 50; i++) {
      const folder: FoodNode = {
        name: `Folder ${Math.random()}`
      };
      if (i === 40) {
        folder.children = [
          {
            name: 'Folder child'
          }
        ];
      }
      dataArrayExpandWidth.push(folder);
    }
  }

  closeVegetables(): void {
    const treeNodeData: TreeNodeData<FoodNode> = {
      data: this.treeNodeData.data.children[1],
      nodeLabel: this.treeNodeData.data.children[1].name
    };
    this.publicTreeView.collapseNode(treeNodeData);
  }

  expandVegetables(): void {
    const treeNodeData: TreeNodeData<FoodNode> = {
      data: this.treeNodeData.data.children[1],
      nodeLabel: this.treeNodeData.data.children[1].name
    };
    this.publicTreeView.expandNode(treeNodeData);
  }

  selectFruits(): void {
    const treeNodeData: TreeNodeData<FoodNode> = {
      data: this.treeNodeData.data.children[0],
      nodeLabel: this.treeNodeData.data.children[0].name
    };
    this.publicTreeView.selectNode(treeNodeData);
  }
}

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const dataArrayExpandWidth = [];

const serverData: FoodNode = {
  name: 'Foods',
  children: [
    {
      name: 'Fruit',
      children: [
        { name: 'Apple' },
        {
          name: 'Banana',
          children: [
            {
              name: 'banana child',
              children: [{ name: 'banana with long name for grandchild', children: [{ name: 'banana great grandchild' }] }]
            }
          ]
        },
        {
          name: 'Strawberry',
          children: []
        },
        { name: 'Blackberry' },
        { name: 'Blueberries' },
        { name: 'Kiwi' },
        { name: 'Coconut' }
      ]
    },
    {
      name: 'Vegetables',
      children: [
        {
          name: 'Green',
          children: [{ name: 'Broccoli' }, { name: 'Brussel sprouts' }]
        },
        {
          name: 'Orange',
          children: [{ name: 'Pumpkins' }, { name: 'Carrots' }]
        }
      ]
    }
  ]
};

const treeData: FoodNode = {
  name: 'Foods',
  children: [
    {
      name: 'Fruit',
      children: [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Strawberry' }]
    },
    {
      name: 'Vegetables',
      children: [
        {
          name: 'Green',
          children: [{ name: 'Broccoli' }, { name: 'Brussel sprouts' }]
        },
        {
          name: 'Orange',
          children: [{ name: 'Pumpkins' }, { name: 'Carrots' }]
        }
      ]
    }
  ]
};
