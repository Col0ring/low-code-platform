import { Rule } from 'antd/es/form'

export function normalValidator(message: string, options: Rule = {}): Rule {
  return {
    required: true,
    message,
    whitespace: true,
    ...options,
  }
}

export function emptyValidator(message: string, options: Rule = {}): Rule {
  return {
    required: true,
    message: '请输入' + message,
    whitespace: true,
    ...options,
  }
}

export const phoneReg =
  /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/

export function phoneValidator(options: Rule = {}): Rule {
  return {
    required: true,
    message: '请输入正确的手机号',
    pattern: phoneReg,
    whitespace: true,
    ...options,
  }
}

export const urlReg =
  /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/

export const emailReg =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export function emailValidator(options: Rule = {}): Rule {
  return {
    required: true,
    message: '请输入正确的邮箱',
    pattern: emailReg,
    whitespace: true,
    ...options,
  }
}
