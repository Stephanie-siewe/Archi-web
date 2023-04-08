
export default class Validator{
    constructor(item, schema){
        this.item = item
        this.schema = schema
    }

    validate(){
        let res = {}
        let error = {}

        for (const key in this.schema) {
            if (Object.hasOwnProperty.call(this.item, key)) {
                res[key] = this.item[key]
            }else{
                error[key] = `la proprieté ${key} est obligatoire`
            }
        }
        return Object.keys(error).length > 0 ? {error, oldVal: this.item} : res;
    }



}