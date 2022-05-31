import {addMessage, getMessageString} from '../libs/message.functions';

export interface InterfaceAppMessageObject {
  [key: string|number]: string[];
}

export interface InterfaceAppMessage {
  messages: InterfaceAppMessageObject;
  warnings: InterfaceAppMessageObject;
  errors: InterfaceAppMessageObject;
}

export class AppMessage implements InterfaceAppMessage {
  messages: InterfaceAppMessageObject;
  warnings: InterfaceAppMessageObject;
  errors: InterfaceAppMessageObject;

  constructor() {
    this.messages = {};
    this.warnings = {};
    this.errors = {};
  }
}

export interface InterfaceAppJson {
  result: boolean;
  statusCode: number|null;
  timestamp: string|null;
  path: string|null;
  message: InterfaceAppMessage;
  data: any;
}

export class AppJson implements InterfaceAppJson {
  result: boolean;
  statusCode: number|null;
  timestamp: string|null;
  path: string|null;
  message: InterfaceAppMessage;
  data: any;

  constructor() {
    this.result = false;
    this.statusCode = null;
    this.timestamp = null;
    this.path = null;
    this.message = new AppMessage();
    this.data = {};
  }

  /**
   *
   * @param key
   * @param msg
   */
  addMessage = (key: any, msg?: any) => {
    addMessage(this.message.messages, key, msg);
  };

  /**
   *
   * @param key
   * @param msg
   */
  addWarningMessage = (key: any, msg?: any) => {
    addMessage(this.message.warnings, key, msg);
  };

  /**
   *
   * @param key
   * @param msg
   */
  addErrorMessage = (key: any, msg?: any) => {
    addMessage(this.message.errors, key, msg);
  };

  /**
   *
   * @param separator
   */
  getMessageString = (separator = '<br>') => {
    return getMessageString(this.message.messages, separator);
  };

  /**
   *
   * @param separator
   */
  getWarningMessageString = (separator = '<br>') => {
    return getMessageString(this.message.warnings, separator);
  };

  /**
   *
   * @param separator
   */
  getErrorMessageString = (separator = '<br>') => {
    return getMessageString(this.message.errors, separator);
  };
}
