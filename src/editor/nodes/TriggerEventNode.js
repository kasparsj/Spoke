import { Material, BoxBufferGeometry, Object3D, Mesh, BoxHelper, Vector3 } from "three";
import EditorNodeMixin from "./EditorNodeMixin";

const requiredProperties = ["eventType"];

export default class TriggerEventNode extends EditorNodeMixin(Object3D) {
  static legacyComponentName = "trigger-event";

  static experimental = true;

  static nodeName = "Trigger Event";

  static _geometry = new BoxBufferGeometry();

  static _material = new Material();

  static async deserialize(editor, json) {
    const node = await super.deserialize(editor, json);

    const props = json.components.find(c => c.name === "trigger-event").props;

    node.eventType = props.eventType;
    node.eventDetail = props.eventDetail;

    return node;
  }

  constructor(editor) {
    super(editor);

    const boxMesh = new Mesh(TriggerEventNode._geometry, TriggerEventNode._material);
    const box = new BoxHelper(boxMesh, 0xffff00);
    box.layers.set(1);
    this.helper = box;
    this.add(box);
    this.eventType = "";
    this.eventDetail = "";
  }

  copy(source, recursive = true) {
    if (recursive) {
      this.remove(this.helper);
    }

    super.copy(source, recursive);

    if (recursive) {
      const helperIndex = source.children.indexOf(source.helper);

      if (helperIndex !== -1) {
        this.helper = this.children[helperIndex];
      }
    }

    this.eventType = source.eventType;
    this.eventDetail = source.eventDetail;

    return this;
  }

  serialize() {
    return super.serialize({
      "trigger-event": {
        eventType: this.eventType,
        eventDetail: this.eventDetail
      }
    });
  }

  prepareForExport() {
    super.prepareForExport();
    this.remove(this.helper);

    for (const prop of requiredProperties) {
      if (!this[prop]) {
        console.warn(`TriggerEventNode: property "${prop}" is required. Skipping...`);
        return;
      }
    }

    const scale = new Vector3();
    this.getWorldScale(scale);

    this.addGLTFComponent("trigger-event", {
      size: { x: scale.x, y: scale.y, z: scale.z },
      eventType: this.eventType,
      eventDetail: this.eventDetail
    });
  }
}
