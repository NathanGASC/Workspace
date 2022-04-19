import { Request, Response } from 'express';
import { Entity, IEntity } from './_entity';

export class User extends Entity implements IEntity {
    path: String = "/api/user";
    name = "User";

    hidden: string[] = [
        "email",
        "password",
        "csrfToken",
        "bearerToken",
    ];

    include = {

    };

    depth = 1;

    constructor() {
        super();
        super.init();
    }

    async get(req: Request, res: Response): Promise<void> {
        super.get(req, res);
    }
    async post(req: Request, res: Response): Promise<void> {
    }
    async delete(req: Request, res: Response): Promise<void> {
    }
    async update(req: Request, res: Response): Promise<void> {
    }
}