export interface CurrentModel {
  id: string;
  name: string;
  url: string;
}

export interface ProjectList {
  id: number;
  name: string;
  url: string;
  sid: string;
  create_time: string;
}

export interface ListCriteria {
  keywords: string;
  page: string;
  pagesize: string;
}

export interface PeopleList {
  id: number;
  name: string;
  url: string;
  sid: string;
  create_time: string;
}

export interface ListQuest {
  keywords: string;
  page: string;
  pagesize: string;
}