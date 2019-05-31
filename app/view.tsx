import * as React from 'react'
import { IView, Orientation, LayoutPriority } from 'base/browser/ui/grid/gridview';
import { Event, Emitter, any, filter } from 'base/common/event';
import { observable, action } from 'mobx';

export class View implements IView {

  element: React.RefObject<HTMLDivElement> = React.createRef();

	@observable visible = false;
	private width: number | undefined;
	private height: number | undefined;
	private orientation: Orientation = Orientation.HORIZONTAL;

	get minimumWidth(): number { return this.visible ? this.view.minimumWidth : 0; }
	get maximumWidth(): number { return this.visible ? this.view.maximumWidth : (this.orientation === Orientation.HORIZONTAL ? 0 : Number.POSITIVE_INFINITY); }
	get minimumHeight(): number { return this.visible ? this.view.minimumHeight : 0; }
	get maximumHeight(): number { return this.visible ? this.view.maximumHeight : (this.orientation === Orientation.VERTICAL ? 0 : Number.POSITIVE_INFINITY); }

	private onDidChangeVisibility = new Emitter<{ width: number; height: number; } | undefined>();
	readonly onDidChange: Event<{ width: number; height: number; } | undefined>;

	get priority(): LayoutPriority | undefined { return this.view.priority; }
	get snapSize(): number | undefined { return this.visible ? this.view.snapSize : undefined; }

	constructor(readonly view: IView) {
		this.show();
		this.onDidChange = any(this.onDidChangeVisibility.event, filter(view.onDidChange, () => this.visible));
	}

  @action
	show(): void {
		if (this.visible) {
			return;
		}

		this.visible = true;

		// this.element.appendChild(this.view.element);
		this.onDidChangeVisibility.fire(typeof this.width === 'number' ? { width: this.width, height: this.height! } : undefined);
	}

  @action
	hide(): void {
		if (!this.visible) {
			return;
		}

		this.visible = false;

		// this.element.removeChild(this.view.element);
		this.onDidChangeVisibility.fire(undefined);
	}

  render(): React.ReactNode {
    return <MyGridView {...this}/>
  }

	layout(width: number, height: number, orientation: Orientation): void {
		this.orientation = orientation;

		if (!this.visible) {
			return;
		}

		this.view.layout(width, height, orientation);
		this.width = width;
		this.height = height;
	}
}

export class MyGridView extends React.Component<View> {

  render() {
    const view = this.props;
    return (
      <div ref={view.element}>
      { view.visible ? view.view.render() : null }
      </div>
    )
  }

}