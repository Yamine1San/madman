import {AppMessage, InterfaceAppJson, InterfaceAppMessage, InterfaceAppMessageObject} from '../types/app.json';

/**
 *
 * @param source1
 * @param json
 * @param reverse
 */
export function mergeAppJsonMessage(source1: InterfaceAppMessage, json: InterfaceAppJson, reverse = false): InterfaceAppMessage {
  if ('object' !== typeof source1) {
    return source1;
  }

  const source2 = json && json.message;
  if ('object' !== typeof source2) {
    return source1;
  }

  const newMessage = new AppMessage();
  Object.keys(newMessage).forEach((message_type: string) => {
    if (! source1.hasOwnProperty(message_type) && ! source2.hasOwnProperty(message_type)) {
      return;
    }
    if (reverse) {
      // @ts-ignore
      newMessage[message_type] = _mergeAppMessageObject(source2[message_type], source1[message_type]);
    }
    else {
      // @ts-ignore
      newMessage[message_type] = _mergeAppMessageObject(source1[message_type], source2[message_type]);
    }
  });
  return newMessage;
}

/**
 *
 * @param source1
 * @param source2
 */
function _mergeAppMessageObject(source1: InterfaceAppMessageObject|undefined, source2: InterfaceAppMessageObject|undefined): InterfaceAppMessageObject {

  /**
   *
   * @param source
   */
  function isInterfaceAppMessageObject(source: any): source is InterfaceAppMessageObject {
    return (undefined !== source);
  }

  if (! isInterfaceAppMessageObject(source1) && ! isInterfaceAppMessageObject(source2)) {
    return {};
  }
  else if (isInterfaceAppMessageObject(source1) && ! isInterfaceAppMessageObject(source2)) {
    return source1;
  }
  else if (! isInterfaceAppMessageObject(source1) && isInterfaceAppMessageObject(source2)) {
    return source2;
  }

  const appMessageObject: InterfaceAppMessageObject = {};
  if (isInterfaceAppMessageObject(source1) && isInterfaceAppMessageObject(source2)) {
    const setKeys = new Set([...Object.keys(source1), ...Object.keys(source2)]);
    Array.from(setKeys).forEach((key: string) => {
      if (source1.hasOwnProperty(key) && source2.hasOwnProperty(key)) {
        if (Array.isArray(source2[key]) && Array.isArray(source1[key])) {
          const setTmp = new Set(source1[key].concat(source2[key]));
          appMessageObject[key] = Array.from(setTmp);
        }
        else {
          appMessageObject[key] = Object.assign({}, source1[key], source2[key]);
        }
      }
      else if (source1.hasOwnProperty(key)) {
        appMessageObject[key] = source1[key];
      }
      else {
        appMessageObject[key] = source2[key];
      }
    });
  }
  return appMessageObject;
}

/**
 *
 * @param appMessageObject
 * @param key
 * @param msg
 */
export function addMessage(appMessageObject: InterfaceAppMessageObject, key: any, msg?: any) {
  if ('object' === typeof key) {
    for (const k of Object.keys(key)) {
      if ('object' === typeof key[k]) {
        let key_only = 1;
        for (const l of Object.keys(key[k])) {
          key_only = 0;
          _addMessage(appMessageObject, k, key[k][l]);
        }
        if (key_only) {
          _addMessage(appMessageObject, 'general', k);
        }
        continue;
      }
      _addMessage(appMessageObject, k, key[k]);
    }
    return;
  }

  if (undefined === msg || null === msg) {
    _addMessage(appMessageObject, 'general', key);
    return;
  }

  if ('object' === typeof msg) {
    for (const k of Object.keys(msg)) {
      _addMessage(appMessageObject, key, msg[k]);
    }
    return;
  }

  _addMessage(appMessageObject, key, msg);
}

/**
 *
 * @param appMessageObject
 * @param key
 * @param msg
 */
function _addMessage(appMessageObject: InterfaceAppMessageObject, key: any, msg?: any) {

  if (! appMessageObject.hasOwnProperty(key)) {
    appMessageObject[key] = [];
  }

  if (undefined !== msg && null !== msg) {
    appMessageObject[key][appMessageObject[key].length] = msg;
  }
}

/**
 *
 * @param list
 * @param separator
 */
export function getMessageString(list: InterfaceAppMessageObject, separator = '<br>') {
  const messages: any = {};
  for (const key of Object.keys(list)) {
    list[key].forEach((msg) => {
      if (null !== msg && undefined !== msg) {
        messages[msg] = null;
      }
    });
  }
  return Object.keys(messages).join(separator).replace('\n', separator);
}
