/* 返回状态值 */
enum Code {
  SUCCESS,
  ERROR,
}

/* 请求返回实体 */
export interface ResResultEntity {
  code: Code,
  error?: string,
  data?: any,
}

export function resSuccess(data: any): ResResultEntity {
  return {
    code: Code.SUCCESS,
    data
  }
}

export function resError(error: any): ResResultEntity {
  return {
    code: Code.ERROR,
    error
  }
}

export interface ErrorEntity {
  name: string,
  stack: string,
  message: string,
}