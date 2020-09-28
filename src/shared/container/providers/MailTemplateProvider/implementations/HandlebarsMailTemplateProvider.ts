import handlebars from 'handlebars'
import fs from 'fs';

import IParseMailTemplateDTO from "../dtos/IParseMailTemplateDTO";
import IMailTemplateProvider from "../models/IMailTemplateProvider";

class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
  public async parse({templateFile,variables}:IParseMailTemplateDTO): Promise<string>{
    const templateFileContent = await fs.promises.readFile(templateFile,{
      encoding: "utf-8",
    })

    const parseTemplate = handlebars.compile(templateFileContent);

    return parseTemplate(variables);
  }
}

export default HandlebarsMailTemplateProvider;
