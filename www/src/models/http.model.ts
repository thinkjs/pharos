export interface IResult<T, U = string> {
  errno: Number,
  errmsg: U,
  data: T
}