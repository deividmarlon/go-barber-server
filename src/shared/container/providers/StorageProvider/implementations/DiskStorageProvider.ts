import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';
import IStorageProvider from "../models/IStorageProvider";

export default class DiskStorageProvider implements IStorageProvider{
    public async saveFile(file:string): Promise<string>{
      await fs.promises.rename(
        path.resolve(uploadConfig.tmpFolder, file),
        path.resolve(uploadConfig.uploadsFolder, file),
      )

      return file;
    }

    public async deleteFile(file:string): Promise<void>{

      const filePath = path.resolve(uploadConfig.uploadsFolder, file);

      //verificando se o arquivo existe -> fs.promises.stat(filePath);
      try{
        await fs.promises.stat(filePath);
      }
      catch{
        //se não encontrou um arquivo, retorna um erro
        return;
      }
      //se encontrou o arquivo, vem direto pra cá!
      await fs.promises.unlink(filePath);
    }

}
