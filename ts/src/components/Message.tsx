import React from "react";
import {getMessageString} from '../libs/message.functions';

export default function Message(Props: any) {
  return (
    <div>
      <div className="message-message" dangerouslySetInnerHTML={{__html: getMessageString(Props.appMessage.messages)}}></div>
      <div className="message-warning" dangerouslySetInnerHTML={{__html: getMessageString(Props.appMessage.warnings)}}></div>
      <div className="message-error" dangerouslySetInnerHTML={{__html: getMessageString(Props.appMessage.errors)}}></div>
    </div>
  );
}
