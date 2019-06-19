import * as React from 'react'

export default class extends React.Component<any, any> {
	render() {
		return (
			<div className="fieldset__row clearfix">
				{!this.props.hideLabel ? <label className="fieldset__row__label">{this.props.label || "更多筛选："}</label> : null}
				<div className="fieldset__row__content">
					{this.props.children}
				</div>
			</div>
		);
	}
}
