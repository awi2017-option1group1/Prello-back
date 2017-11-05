/* tslint:disable */
export const isInteger = (value: any) => {
    return !isNaN(value) && Number.isInteger(Number(value))
}
