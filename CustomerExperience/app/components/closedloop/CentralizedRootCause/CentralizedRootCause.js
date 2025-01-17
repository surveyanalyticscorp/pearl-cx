import React, {useEffect} from 'react';
import {View, Text, FlatList, Pressable} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getCentralizedRootCause} from '../../../redux/actions/closedloop.actions';
import ColapsableView from './components/CollapsableView';
import {baseTextStyles} from '../../../styles/text.styles';
import {useState} from 'react';

const CentralizedRootCause = props => {
  const dispatch = useDispatch();
  const centralizedRootCauseList = useSelector(
    state => state.dashboard.centralizedRootCauseList,
  );

  useEffect(() => {
    dispatch(getCentralizedRootCause());
  }, []);

  console.log(
    'CentralizedRootCause:',
    JSON.stringify(centralizedRootCauseList),
  );

  const RenderItem = ({item, index}) => {
    const [isOpen, setIsOpen] = useState(false);
    const {rcTags} = item;
    return (
      <Pressable
        style={{
          margin: 10,
          padding: 10,
          backgroundColor: 'white',
          marginBottom: 10,
        }}
        onPress={() => setIsOpen(!isOpen)}>
        <Text>{item.name}</Text>
        <ColapsableView isOpen={isOpen}>
          {rcTags.map((tag, index) => (
            <Text key={index}>{tag.name}</Text>
          ))}
        </ColapsableView>
      </Pressable>
    );
  };

  return (
    <View>
      <FlatList
        key={temp => temp.name}
        data={centralizedRootCauseList}
        renderItem={RenderItem}
      />
    </View>
  );
};

export default CentralizedRootCause;
