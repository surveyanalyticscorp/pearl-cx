import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {useState} from 'react';
import {ASYNC_RESPONSES_WITH_CX_MANAGER} from '../../api/Constant';

export default function useAsyncResponselist() {
  const [responseReadList, setResponseReadList] = useState([]);
  const {getItem, setItem} = useAsyncStorage(ASYNC_RESPONSES_WITH_CX_MANAGER);

  // async function setValue (responseId)  {

  //     try {

  //         await setItem(JSON.stringify([...responseReadList, ]))
  //     } catch (error) {

  //     }
  // }

  // function toggleValue(value_) {
  //   setValue(currentValue =>
  //     typeof value_ === 'boolean' ? value_ : !currentValue,
  //   );
  // }
  // return [value, toggleValue];
}
