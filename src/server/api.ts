import express, { Application, NextFunction } from 'express';
import { User } from './entities/user';
import { Response } from 'express';
import { Request } from 'express';
import { prisma } from './entities/_entity';

const entities = [
    new User()
]

export const apiRouter = async function (req: Request, res: Response, next: NextFunction) {
    let isParsed = false;
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    const url = new URL(fullUrl);

    entities.forEach((entity) => {
        if (entity.path == url.pathname) {
            switch (req.method) {
                case "GET":
                    entity.get(req, res)
                    isParsed = true;
                    break;
                case "POST":
                    entity.post(req, res)
                    isParsed = true;
                    break;
                case "UPDATE":
                    entity.update(req, res)
                    isParsed = true;
                    break;
                case "DELETE":
                    entity.delete(req, res)
                    isParsed = true;
                    break;
                default:
                    break;
            }
        } else if (entity.path + "/ui" == url.pathname) {
            entity.ui(req, res);
            isParsed = true;
        }
    });

    if (url.pathname == "/api/user/login") {
        const login = req.body.login || "";
        const password = req.body.password || "";

        const user = (await prisma.user.findMany({
            where: {
                login: login,
                password: password,
            }
        }))[0]
        if (user) {
            user.bearerToken;
            res.status(200).cookie("bearerToken", user.bearerToken, { httpOnly: true, sameSite: true, expires: user.bearerExpiration }).send(user);
        } else {
            res.status(401).send();
        }
    }

    if (!isParsed) next();
}