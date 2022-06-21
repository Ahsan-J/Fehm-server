import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { Equal, FindOperator, ILike, IsNull, LessThan, LessThanOrEqual, Like, MoreThan, MoreThanOrEqual, Not } from 'typeorm';

@Injectable()
export class Sieve implements PipeTransform {
    filterOp = {
        "==": Equal,
        "!=": Not,
        ">": MoreThan,
        "<": LessThan,
        ">=": MoreThanOrEqual,
        "<=": LessThanOrEqual,
        "@=": <T>(value: T | FindOperator<T>) => Like(`%${value}%`),
        "_=": <T>(value: T | FindOperator<T>) => Like(`${value}%`),
        "!@=": <T>(value: T | FindOperator<T>) => Not(Like(`%${value}%`)),
        "!_=": <T>(value: T | FindOperator<T>) => Not(Like(`${value}%`)),
        "@=*": <T>(value: T | FindOperator<T>) => ILike(`%${value}%`),
        "_=*": <T>(value: T | FindOperator<T>) => ILike(`${value}%`),
        "==*": e => e,
        "!=*": e => e, // Not Supported
        "!@=*": <T>(value: T | FindOperator<T>) => Not(ILike(`%${value}%`)),
        "!_=*": <T>(value: T | FindOperator<T>) => Not(ILike(`${value}%`)),
    }

    nullFilterOp = {
        "==": IsNull,
        "!=": () => Not(IsNull())
    }

    reg = new RegExp(`([\\w\\d]+)(${Object.keys(this.filterOp).join("|")})([\\w\\d]*)`);

    transformFilters(filters) {
        
        const processFilterValue = (op, value) => {
            if(value && value.toLowerCase() != "null") { // perform sieve operation
                const f = this.filterOp[op];
                return f?.(value)
            } else { // Generate where clause for null
                const f = this.nullFilterOp[op] || this.nullFilterOp['==']
                return f();
            }
        }

        return filters.split(',')
        .filter(v => this.reg.test(v))
        .reduce((result, expression) => {
            const [, key, op, value] = this.reg.exec(expression)
            const keys = key.split('|');
            const values = value.split('|');
            if(keys.length <= 1 && values.length <= 1) {
                result[0][key] = processFilterValue(op, value);
            } else {
                keys.forEach((k) => {
                    values.forEach((v) => {
                        result.push({[k]: v})
                    })
                })
            }
            
            return result;
        }, [{}]).filter(obj => Object.values(obj).length)
    }

    transformSorts(sorts: string) {
        return sorts.split(',').filter(v => v).reduce((result, sortKey) => {
            switch(sortKey.charAt(0)) {
                case "-": 
                    result[sortKey.substring(1)] = "DESC";
                    break;
                case "+":
                    result[sortKey.substring(1)] = "ASC"
                    break;
                default:
                    result[sortKey] = "ASC"
            }
            return result;
        }, {})
    }

    transform(value: string, metadata: ArgumentMetadata) {
        if(!value) return {}

        switch(metadata.data) {
            case "filters": 
                return this.transformFilters(value);
            case "sorts": 
                return this.transformSorts(value)
            default:
                return {}
        }
    }
}