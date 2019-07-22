import { message } from "antd";
import { observable, action, computed } from "mobx";
import axios from "@utils/axios";

class Strategy {
  rootStore;
  constructor(rootStore) {
    this.rootStore = rootStore;
  }
  @computed get siteId() {
    return localStorage.getItem("projectId");
  }
  @observable list: any = [];
  @observable modalStatus = false;
  @observable defaultVal: any = {
    name: "",
    display_name: "",
    count: 1,
    expression: "=",
    limit: ""
  };

  @action hideModal = () => {
    this.modalStatus = false;
    this.setDefaultVal({});
  };
  @action showModal = () => (this.modalStatus = true);
  @action setDefaultVal = obj => (this.defaultVal = obj);
  @action setList = (list: any) => (this.list = list);
  @action getList = async (criteria?: any) => {
    let params: any;
    params = criteria ? criteria : { page: "1", pagesize: 50 };
    const { data } = await axios.get(`/api/site/${this.siteId}/alarm`, {
      params
    });
    console.log(15, data.data.data);
    if (data.errno === 0) {
      this.setList(data.data.data);
    } else {
      message.error("后台出错请稍后再试");
    }
  };

  @action addItem = async (params?: any) => {
    let data = {
      name: params.name,
      metric_id: params.metric_id,
      conditions: JSON.stringify({
        count: params.count,
        expression: params.expression,
        limit: params.limit
      })
    };
    let res: any = await axios.post(`/api/site/${this.siteId}/alarm`, {
      ...data
    });
    if (res.data.errno === 0) {
      this.getList();
      this.hideModal();
    } else {
      message.error("后台出错请稍后再试");
      this.hideModal();
    }
  };
  @action changeItem = async (params?: any) => {
    let data = {
      name: params.name,
      metric_id: params.metric_id,
      conditions: JSON.stringify({
        count: params.count,
        expression: params.expression,
        limit: params.limit
      })
    };
    let res: any = await axios.put(
      `/api/site/${this.siteId}/alarm/${this.defaultVal.id}`,
      { ...data }
    );
    if (res.data.errno === 0) {
      this.getList();
      this.hideModal();
    } else {
      message.error("后台出错请稍后再试");
      this.hideModal();
    }
  };
  @action deleteItem = async (id?: any) => {
    let res: any = await axios.delete(`/api/site/${this.siteId}/alarm/${id}`);
    if (res.data.errno === 0) {
      this.getList();
    } else {
      message.error("后台出错请稍后再试");
    }
  };
}

export default Strategy;
