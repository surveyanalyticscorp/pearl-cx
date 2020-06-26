export default class ArrayUtils {
    static getMatchingObject(array, property, expectedValue) {
        if (array) {
            for (let i = 0; i < array.length; i++) {
                if (array[i][property] === expectedValue) {
                    return array[i];
                }
            }
        }
        return null;
    }
    static isNotEmpty(array){
        return (array && array.length > 0);
    }
    static isEmpty(array){
        return !this.isNotEmpty(array);
    }

    static containsElement(array, element){
        return array.includes(element);
    }

    static getArrayOfFieldsFromArray(array, field){
        let fieldsArray=[];
        if(array){
            for(let i=0; i<array.length; i++){
                fieldsArray.push(array[i][field])
            }
        }
        return fieldsArray;
    }

    static getMatchingObjectIndex(array, property, expectedValue) {
        if (array) {
            for (let i = 0; i < array.length; i++) {
                if (array[i][property] === expectedValue) {
                    return i;
                }
            }
        }
        return -1;
    }

    static removeAndGetMatchingObject(array, property, expectedValue) {
        if (array) {
            for (let i = 0; i < array.length; i++) {
                if (array[i][property] === expectedValue) {
                    let element = array.splice(i,1);
                    return element;
                }
            }
        }
        return null;
    }
    static removeMatchingObjectAndReturnNewArray(array, property, expectedValue) {
        if (array) {
            for (let i = 0; i < array.length; i++) {
                if (array[i][property] === expectedValue) {
                    array.splice(i,1);
                    return array ? array: [];
                }
            }
        }
        return array;
    }

    static mereArraysFromObjectValues(object){

        let array = [];
        Object.keys(object).forEach((key)=>{array = [...array,...object[key]]});
        return array;

    }
}