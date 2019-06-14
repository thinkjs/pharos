
// import axios from './axios'
declare namespace webapi {
  export interface IResponse<T, U = string> {
    errno: number;
    errmsg: U;
    data: T;
  }

  export interface IPageableRequest {
    pagesize: number;
    page: number;
  }

  export interface IPageableResult<T> {
    items: T[];
    page: {
      pagesize: number;
      page: number;
      total: number;
    }
  }

  namespace moduleA {
    export interface IItemType {
      id: number;
      name: string;
      groupId: number;
    }
    namespace request {
      export interface getItemById {
        id;
      }
      export interface getItems extends IPageableRequest {
        ids?: number[];
        groupId?: number;
      }
    }
    namespace response {
      export type getItemById = IResponse<IItemType>;
      export type getItems = IResponse<IPageableResult<IItemType>>
    }
  }
}

