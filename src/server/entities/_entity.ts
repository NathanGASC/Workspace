import { PrismaClient } from "@prisma/client";
import { Response } from 'express';
import { Request } from 'express';
import path from "path";

export const prisma = new PrismaClient();

export interface IEntity{
    path:String;
    name:string;

    hidden:string[];
    include:{[key:string]:string}
    depth?:number;
    itemsPerPage?:number;

    get(req:Request,res:Response):Promise<void>;
    post(req:Request,res:Response):Promise<void>;
    delete(req:Request,res:Response):Promise<void>;
    update(req:Request,res:Response):Promise<void>;
    ui(req:Request,res:Response):Promise<void>;
}

export class Entity{
    static entities:{[key:string]:IEntity & Entity} = {};
    _this = (this as unknown as IEntity & Entity)

    init(){
        const _this = this._this;
        Entity.entities[_this.name] = _this;
    }
    
    async get(req:Request,res:Response):Promise<void>{
        const _this = this._this;
        try{
            const include = _this.generateInclude(_this.depth||0);

            const option:any = {
                include:include
            }

            if(req.query.page != undefined){
                const pagination = _this.generatePagination(parseInt(req.query.page as string));
                Object.assign(option, pagination);
            }

            if(!_this.include || option.include == true) delete option.include;
            let data = await (prisma as any)[_this.name].findMany(option);
            this.deleteHiddenKeys(data);

            res.send(data);
        }catch(e){
            console.error(e)
            res.sendStatus(500);
        }
    }

    async post(req:Request,res:Response):Promise<void>{
        
    }
    async delete(req:Request,res:Response):Promise<void>{
        
    }
    async update(req:Request,res:Response):Promise<void>{
        
    }
    async ui(req:Request,res:Response):Promise<void>{
        res.sendFile(path.join(__dirname, '../../client/ui/index.html'));
    }

    private generateInclude(depth:number):boolean|{include:any}{
        if(depth == 0) return true;
        const _this = this._this;
        let include = {} as any;
        for (const [key, entityName] of Object.entries(_this.include)) {
            const childInclude = Entity.entities[entityName]?.generateInclude(depth-1);
            if(typeof childInclude == "boolean"){
                include[key] = childInclude
            }else{
                include[key] = {
                    "include": childInclude
                }
                if(include[key]["include"] === undefined) delete include[key]
            }
        }
        return Object.values(include).length > 0 ? include : true
    }

    private generatePagination(askedPage:number){
        const _this = this._this;
        const itemToSkip = (_this.itemsPerPage || 10) * askedPage;
        return {
            skip: itemToSkip,
            take: _this.itemsPerPage || 10
        }
    }

    private deleteHiddenKeys(data:any){
        if(!data) return;
        const _this = this._this;

        if(!Array.isArray(data)) data = [data];
        data.forEach((row:any) => {
            _this.hidden.forEach((hiddenKey)=>{
                delete row[hiddenKey];
            })
        });

        for (const [key, entityName] of Object.entries(_this.include)) {
            data.forEach((_data:any) => {
                Entity.entities[entityName]?.deleteHiddenKeys(_data[key])
            });
        }
    }
}