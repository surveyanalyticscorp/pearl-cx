import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
  BackHandler,
  FlatList,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import {dashboardStyles} from '../dashboard/dashboard.style';
import {translate} from '../../Utils/MultilinguaUtils';
