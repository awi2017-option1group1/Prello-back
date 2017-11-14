import { NotFoundException } from './errors/NotFoundException'
import { Password } from './password'

export class ParamsExtractor<T> {

    private final: {} = {}

    constructor(public params: {}) {}

    public get(): Partial<T> {
        return this.final
    }

    public hasParam(name: string) {
        return this.final.hasOwnProperty(name)
    }

    public getParam(name: string) {
        return this.final[name]
    }

    public fill(entity: T): T {
        Object.keys(this.final).forEach(key => {
            if ( key === 'password') {
                entity[key] = Password.encrypt(this.final[key])
            } else {
                entity[key] = this.final[key]
            }
        })
        return entity
    }

    public require(names: string[]) {
        names.forEach(name => {
            if (this.params[name]) {
                this.final[name] = this.params[name]
            } else {
                throw new NotFoundException(`Required param '${name}' not found`)
            }
        })
        return this
    }

    public permit(names: string[]) {
        names.forEach(name => {
            if (this.params.hasOwnProperty(name)) {
                console.log(name)
                this.final[name] = this.params[name]
            }
        })
        return this
    }

}
