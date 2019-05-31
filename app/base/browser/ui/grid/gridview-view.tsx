import * as React from 'react'
import { SplitViewView } from 'base/browser/ui/splitview/splitview-view';
import { IBranchNode, ILeafNode } from 'base/browser/ui/grid/gridview';

export class BranchNodeView extends React.Component<{node: IBranchNode}> {

  render() {
    return <SplitViewView splitView={this.props.node.splitview}/>
  }

}

export class LeafNodeView extends React.Component<{node: ILeafNode}> {

  render(): any {
    return null;
  }

}