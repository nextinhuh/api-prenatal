import handlebars from 'handlebars';
import fs from 'fs';

interface ITemplateVariables {
  [key: string]: string | number;
}

interface IParseMailTemplateDTO {
  file: string;
  variables: ITemplateVariables;
}

export default class ConvertHtlm {
  private data: IParseMailTemplateDTO;

  constructor(data: IParseMailTemplateDTO) {
    this.data = data;
  }

  async html(): Promise<any> {
    const templateFileContent = await fs.promises.readFile(this.data.file, {
      encoding: 'utf-8',
    });

    const parseTemplate = handlebars.compile(templateFileContent);

    return parseTemplate(this.data.variables);
  }
}
