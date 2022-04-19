import faker from "@faker-js/faker";
import Chance from "chance";
const chance = new Chance();

export class GeneratorV1{
    generateUser(){
        return {
            "bearerExpiration": faker.date.future(),
            "bearerToken": chance.guid(),
            "birthday": faker.date.past(),
            "csrfToken": chance.guid(),
            "email": faker.internet.email(),
            "emailVerify": chance.bool(),
            "login": faker.internet.userName(),
            "password": faker.internet.password(),
            "picture": faker.internet.avatar(),
        }
    }
}