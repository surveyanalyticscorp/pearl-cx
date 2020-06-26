class MergeSort {

    initialize(inputArray) {

        this.inputArray = inputArray;
        let sortData = {};
        sortData.currentState =this.getInitialCurrentState();
        sortData.nextState = this.getNextState();
        sortData.selectedID = -1;
        sortData.totalSteps = this.getTotalLoops(1, inputArray.length / 2 ) * inputArray.length;
        sortData.steps = 0;
        sortData.percentageCompleted =this.getCompletedPercentage(sortData);
        return sortData;

    }


    getInitialCurrentState() {
        let arrayOfArray = [];
        for (let i = 0; i < this.inputArray.length; i = i + 2) {
            let firstStateElement = {};
            let array1 = [];
            array1.push(this.inputArray[i]);
            firstStateElement.firstArray = array1;
            if (i < this.inputArray.length - 1) {
                let array2 = [];
                array2.push(this.inputArray[i + 1]);
                firstStateElement.secondArray = array2;
            }
            arrayOfArray.push(firstStateElement);
        }
        let currentState = {};
        currentState.loop = 0;
        currentState.i = 0;
        currentState.j = 0;
        currentState.arrayOfArray = arrayOfArray;
        return currentState;
    }

    getNextState() {
        let nextState = {};
        let arrayOfArray = [];
        nextState.arrayOfArray = arrayOfArray;
        nextState.loop = 0;
        nextState.i = 0;
        nextState.arrayPointer = 0;
        return nextState;
    }

    getCompletedPercentage(sortData) {
        let percentageCompleted = sortData.steps * 100 / sortData.totalSteps;
        if (percentageCompleted > 98) {
            return 98;
        }
        return percentageCompleted;
    }

    getTotalLoops(loop, length) {
        if (length <= 1) {
            return 1;
        }
        loop = loop + this.getTotalLoops(loop, Math.round(length / 2));
        console.log("length: " + length + " loop: " + loop);
        return loop;
    }

    getNextPair(sortData) {
        sortData.steps = sortData.steps + 1;
        let selectedId = sortData.selectedID;

        let currentState = sortData.currentState;
        let nextState = sortData.nextState;
        let loop = currentState.loop;
        let i = currentState.i;
        let j = currentState.j;
        let currentStateArray = currentState.arrayOfArray;

        let currentArrayObj = currentStateArray[loop];

        let firstArray = currentArrayObj.firstArray;
        let secondArray = currentArrayObj.secondArray;

        if (!secondArray && loop === 0) {
            sortData.success = true;
            sortData.sortedArray = firstArray;
            sortData.percentageCompleted = 100;
            return sortData;
        } else if (!secondArray) {
            this.putArrayInNextState(firstArray, nextState);
            this.changeToNextState(nextState, sortData);
            return this.getNextPair(sortData);
        }
        if (selectedId === -1) {
            let selectionPair = [];
            selectionPair.push(firstArray[i]);
            selectionPair.push(secondArray[j]);
            sortData.selectionPair = selectionPair;
        } else if (selectedId === 1) {
            this.addSingleElementToNextState(firstArray[i], nextState);
            i++;
            if (i < firstArray.length) {
                currentState.i = i;
                let selectionPair = [];
                selectionPair.push(firstArray[i]);
                selectionPair.push(secondArray[j]);
                sortData.selectionPair = selectionPair;
            } else if (i >= firstArray.length) {
                this.addRemainingDataToNextState(secondArray, j, nextState);
                sortData.selectedID = -1;
                loop++;
                currentState.i = 0;
                currentState.j = 0;
                currentState.loop = loop;
                if (loop >= currentStateArray.length) {
                    this.changeToNextState(nextState, sortData);
                }
                return this.getNextPair(sortData);
            }
        } else if (selectedId === 2) {
            this.addSingleElementToNextState(secondArray[j], nextState);
            j++;
            if (j < secondArray.length) {
                currentState.j = j;
                let selectionPair = [];
                selectionPair.push(firstArray[i]);
                selectionPair.push(secondArray[j]);
                sortData.selectionPair = selectionPair;
            } else if (j >= secondArray.length) {
                this.addRemainingDataToNextState(firstArray, i, nextState);
                sortData.selectedID = -1;
                loop++;
                currentState.i = 0;
                currentState.j = 0;
                currentState.loop = loop;
                if (loop >= currentStateArray.length) {
                    this.changeToNextState(nextState, sortData);
                }
                return this.getNextPair(sortData);
            }

        }
        sortData.percentageCompleted =this. getCompletedPercentage(sortData);
        return sortData;
    }

    changeToNextState(nextState, sortData) {
        nextState.loop = 0;
        nextState.j = 0;
        nextState.i = 0;
        sortData.currentState = nextState;
        sortData.nextState = this.getNextState();
        sortData.selectedID = -1;
    }

    putArrayInNextState(array, nextState) {
        let arrayOfArray = nextState.arrayOfArray;
        let loop = nextState.loop;
        let arrayPointer = nextState.arrayPointer;
        if (arrayPointer === 0) {
            let arrayObject = {};
            arrayObject.firstArray = array;
            arrayOfArray.push(arrayObject);
        } else {
            let arrayObject = arrayOfArray[loop];
            arrayObject.secondArray = array;
            nextState.loop = loop + 1;
            nextState.i = 0;
        }
    }

    addRemainingDataToNextState(array, pointer, nextState) {
        let arrayOfArray = nextState.arrayOfArray;
        let loop = nextState.loop;
        let arrayPointer = nextState.arrayPointer;
        let arrayObject = this.getArrayOfArrayElement(arrayOfArray, loop);
        let arrayToAdd;
        if (arrayPointer == 0) {
            arrayToAdd = this.getJsonArrayFromNextState(arrayObject, "firstArray");
            arrayPointer = 1;
        } else {
            arrayToAdd = this.getJsonArrayFromNextState(arrayObject, "secondArray");
            loop++;
            arrayPointer = 0;
        }
        for (let k = pointer; k < array.length; k++) {
            arrayToAdd.push(array[k]);
        }
        nextState.i = 0;
        nextState.arrayPointer = arrayPointer;
        nextState.loop = loop;
    }

    addSingleElementToNextState(element, nextState) {
        let arrayOfArray = nextState.arrayOfArray;
        let loop = nextState.loop;
        let i = nextState.i;
        let arrayPointer = nextState.arrayPointer;
        let arrayObject = this.getArrayOfArrayElement(arrayOfArray, loop);
        let arrayToAdd;
        if (arrayPointer == 0) {
            arrayToAdd = this.getJsonArrayFromNextState(arrayObject, "firstArray");
        } else {
            arrayToAdd = this.getJsonArrayFromNextState(arrayObject, "secondArray");
        }
        arrayToAdd.push(element);
        i++;
        nextState.i = i;
        nextState.loop = loop;
    }

    getArrayOfArrayElement(arrayOfArray, loop) {
        let jsonObject = arrayOfArray[loop];
        if (!jsonObject) {
            jsonObject = {};
            arrayOfArray.push(jsonObject);
        }
        return jsonObject;
    }

    getJsonArrayFromNextState(arrayObject, key) {
        let arrayToAdd = arrayObject[key];
        if (!arrayToAdd) {
            arrayToAdd = [];
            arrayObject[key]= arrayToAdd;
        }
        return arrayToAdd;
    }
}

export let mergeSort = new MergeSort();
