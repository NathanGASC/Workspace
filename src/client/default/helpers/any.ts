export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function objToStrListOfKeys(obj: any) {
    let str = "";
    for (const key in obj) {
        str += `- ${key}\n`;
    }
    str = str.trimEnd()
    return str;
}

export function loremIpsum(nbWord: number) {
    let lorem = ""
    const words = `Lorem ipsum dolor sit amet. Ut dolore veritatis ea nulla eaque et nostrum sint sed libero harum aut officia autem. Qui officiis modi sed galisum dignissimos aut consectetur magnam in unde sint et galisum veniam aut corporis iure et nisi sequi. Aut consectetur incidunt in velit temporibus et perferendis possimus eos voluptatem numquam et consequatur voluptates cum molestias magni est amet saepe. Provident internos aut repellendus autem est galisum accusantium et voluptatibus quod. Qui voluptatem optio ut quaerat maiores eos odio cupiditate ut saepe dolorem qui galisum iure nam maxime reiciendis ut doloribus necessitatibus. A aspernatur natus qui rerum deleniti non velit dolores ea rerum animi est facere suscipit et accusamus consequatur non provident porro. Ut possimus dolorem et placeat necessitatibus nam quis cupiditate ut mollitia facere aut voluptas maiores.`
    const aWords = words.split(" ")
    for (let index = 0; index < nbWord; index++) {
        const word = aWords[Math.floor(Math.random() * aWords.length)]
        lorem += " "+word;
    }
    return lorem;
}