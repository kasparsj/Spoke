import React, { Component } from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import InputGroup from "../inputs/InputGroup";
import StringInput from "../inputs/StringInput";
import { Running } from "styled-icons/fa-solid/Running";

export default class TriggerEventNodeEditor extends Component {
  static propTypes = {
    editor: PropTypes.object,
    node: PropTypes.object,
    multiEdit: PropTypes.bool
  };

  static iconComponent = Running;

  static description = "Triggers an event on enter.";

  constructor(props) {
    super(props);

    this.state = {
      options: []
    };
  }

  onChangeEventType = type => {
    this.props.editor.setPropertiesSelected({
      eventType: type
    });
  };

  onChangeEventDetail = value => {
    this.props.editor.setPropertiesSelected({
      eventDetail: value
    });
  };

  componentDidMount() {
    const options = [];

    const sceneNode = this.props.editor.scene;

    sceneNode.traverse(o => {
      if (o.isNode && o !== sceneNode) {
        options.push({ label: o.name, value: o.uuid, nodeName: o.nodeName });
      }
    });

    this.setState({ options });
  }

  render() {
    const { node } = this.props;

    return (
      <NodeEditor description={TriggerEventNodeEditor.description} {...this.props}>
        <InputGroup name="Event Type">
          <StringInput value={node.eventType} onChange={this.onChangeEventType} />
        </InputGroup>
        <InputGroup name="Event Detail">
          <StringInput value={node.eventDetail} onChange={this.onChangeEventDetail} />
        </InputGroup>
      </NodeEditor>
    );
  }
}
