import {Request,Response,NextFunction} from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';
import AppError from "@shared/errors/AppError";

interface TokenPayload{
    iat: number,
    exp: number,
    sub: string,
}

export default function ensureAuthenticated(
        request:Request, 
        response:Response, 
        next:NextFunction
): void {
    //Validação token JWT

    const authHeader = request.headers.authorization;

    if(!authHeader){
        throw new AppError('JWT token is missing!', 401);
    }

    //Splitanto o token no formato -> Bearer sauhdfuasuhsdfuhfsuh

    const[,token] = authHeader.split(' ');

    const {secret} = authConfig.jwt

    try{
        // A função verify() dispara faz um Throw de um erro caso não dê certo!
        // Colocamos esse try para controlar a mensagem desse Throw!
        const decoded = verify(token,secret);

        const {sub} = decoded as TokenPayload;

        request.user = {
            id: sub
        };

        return next();
    }catch(err){
        throw new AppError('Invalid JWT token!', 401);
    }

}