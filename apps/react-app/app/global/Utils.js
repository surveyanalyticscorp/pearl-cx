/*jshint esversion:6*/
import Toast from 'react-native-root-toast';
import {Alert} from 'react-native';

class Utils {
    getShortMonthNameFromDate(date) {
        var month = [];
        month[0] = "Jan";
        month[1] = "Feb";
        month[2] = "Mar";
        month[3] = "Apr";
        month[4] = "May";
        month[5] = "Jun";
        month[6] = "Jul";
        month[7] = "Aug";
        month[8] = "Sep";
        month[9] = "Oct";
        month[10] = "Nov";
        month[11] = "Dec";
        return month[date.getMonth()];
    }

    getDateWithSuffix(date) {
        var i = date.getDate();
        var j = i % 10,
            k = i % 100;
        if (j == 1 && k != 11) {
            return i + "st";
        }
        if (j == 2 && k != 12) {
            return i + "nd";
        }
        if (j == 3 && k != 13) {
            return i + "rd";
        }
        return i + "th";
   }

   showToastMessage(aMessage) {
        if (aMessage.length > 0) {
            // Add a Toast on screen.
            let toast = Toast.show(aMessage, {
                duration: Toast.durations.SHORT,
                position: Toast.positions.TOP,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
                onShow: () => {
                    // calls on toast\`s appear animation start
                },
                onShown: () => {
                    // calls on toast\`s appear animation end.
                },
                onHide: () => {
                    // calls on toast\`s hide animation start.
                },
                onHidden: () => {
                    // calls on toast\`s hide animation end.
                }
            });
        }
    }

    isURLAbsolute(url){
        var pat = /^https?:\/\//i;
        return (pat.test(url));


    }

    removeElementByAttribute(arr, attr, value){
        var i = arr.length;
        while(i--){
            if( arr[i]
                && arr[i].hasOwnProperty(attr)
                && (arguments.length > 2 && arr[i][attr] === value ) ){

                arr.splice(i,1);

            }
        }
        return arr;
    }

    replaceElementByAttribute(arr, attr, value, newObject) {
        var i = arr.length;
        while (i--){
            if(arr[i][attr] === value){
                arr[i] = newObject;
                return arr;
            }
        }
    }

    showAlert(title, message, noCallback, yesCallback){
        Alert.alert(
            title,
            message,
            [

                {text: 'NO', onPress: noCallback, style: 'cancel'},
                {text: 'YES', onPress: yesCallback},
            ],
            { cancelable: false }
        );
    }

    getDomainFromUrl(url) {
        let urlParts = url.replace('http://', '').replace('https://', '').split(/[/?#]/);
        let domain= urlParts[0]
        return domain
    }


}


export let utils = new Utils();
