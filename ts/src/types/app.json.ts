interface InterFaceMessage {
  messages: {[key: string]: string[]};
  warnings: {[key: string]: string[]};
  errors: {[key: string]: string[]};
}

interface InterFaceAppJson {
  result: boolean;
  message: InterFaceMessage;
  data: any;
}

export class AppJson implements InterFaceAppJson {
  result: boolean;
  message: InterFaceMessage;
  data: any;

  constructor() {
    this.result = false;
    this.message = {
      messages: {},
      warnings: {},
      errors: {},
    };
    this.data = null;
  }
}
