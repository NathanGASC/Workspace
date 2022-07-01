export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function objToStrListOfKeys(obj:any){
    let str = "";
    for (const key in obj) {
        str += `- ${key}\n`;
    }
    str = str.trimEnd()
    return str;
}