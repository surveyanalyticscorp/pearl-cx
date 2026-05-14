import React from 'react';
import {render} from '@testing-library/react-native';
import {
  FaIcon,
  IonIcon,
  MaterialIcons,
  MaterialCommunityIcons,
  AttachmentIcon,
  getMimeIconName,
} from './IconUtils';
import {Colors} from '../styles/color.constants';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import IonIcons from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

// Mock the vector icons
jest.mock('react-native-vector-icons/FontAwesome', () => 'FontAwesomeIcon');
jest.mock('react-native-vector-icons/Ionicons', () => 'IonIcons');
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcon');
jest.mock(
  'react-native-vector-icons/MaterialCommunityIcons',
  () => 'MaterialCommunityIcon',
);

describe('IconComponents', () => {
  test('FaIcon should render FontAwesomeIcon with given props', () => {
    const {getByTestId} = render(
      <FaIcon name="rocket" size={30} color="red" testID="fa-icon" />,
    );
    const icon = getByTestId('fa-icon');
    expect(icon.props.name).toBe('rocket');
    expect(icon.props.size).toBe(30);
    expect(icon.props.color).toBe('red');
    expect(icon.props.style).toBeUndefined();
  });

  test('IonIcon should render IonIcons with given props', () => {
    const {getByTestId} = render(
      <IonIcon name="home" size={20} color="blue" testID="ion-icon" />,
    );
    const icon = getByTestId('ion-icon');
    expect(icon.props.name).toBe('home');
    expect(icon.props.size).toBe(20);
    expect(icon.props.color).toBe('blue');
    expect(icon.props.style).toBeUndefined();
  });

  test('MaterialIcons should render MaterialIcon with given props', () => {
    const {getByTestId} = render(
      <MaterialIcons
        name="settings"
        size={25}
        color="green"
        testID="material-icon"
      />,
    );
    const icon = getByTestId('material-icon');
    expect(icon.props.name).toBe('settings');
    expect(icon.props.size).toBe(25);
    expect(icon.props.color).toBe('green');
    expect(icon.props.style).toBeUndefined();
  });

  test('MaterialCommunityIcons should render MaterialCommunityIcon with given props', () => {
    const {getByTestId} = render(
      <MaterialCommunityIcons
        name="camera"
        size={28}
        color="purple"
        testID="material-community-icon"
      />,
    );
    const icon = getByTestId('material-community-icon');
    expect(icon.props.name).toBe('camera');
    expect(icon.props.size).toBe(28);
    expect(icon.props.color).toBe('purple');
    expect(icon.props.style).toBeUndefined();
  });

  test('AttachmentIcon should render FontAwesomeIcon with correct icon name for mimeType', () => {
    const {getByTestId} = render(
      <AttachmentIcon mimeType="image/jpeg" testID="attachment-icon" />,
    );
    const icon = getByTestId('attachment-icon');
    expect(icon.props.name).toBe('file-photo-o');
    expect(icon.props.size).toBe(12);
    expect(icon.props.color).toBe(Colors.accentLight);
  });

  test('FaIcon should use default size and color when not provided', () => {
    const {getByTestId} = render(<FaIcon name="star" testID="fa-default" />);
    const icon = getByTestId('fa-default');
    expect(icon.props.size).toBe(24);
    expect(icon.props.color).toBe(Colors.borderColor);
  });

  test('IonIcon should use default size and color when not provided', () => {
    const {getByTestId} = render(<IonIcon name="star" testID="ion-default" />);
    const icon = getByTestId('ion-default');
    expect(icon.props.size).toBe(24);
    expect(icon.props.color).toBe(Colors.borderColor);
  });

  test('MaterialIcons should use default size and color when not provided', () => {
    const {getByTestId} = render(
      <MaterialIcons name="star" testID="material-default" />,
    );
    const icon = getByTestId('material-default');
    expect(icon.props.size).toBe(24);
    expect(icon.props.color).toBe(Colors.borderColor);
  });

  test('MaterialCommunityIcons should use default size and color when not provided', () => {
    const {getByTestId} = render(
      <MaterialCommunityIcons name="star" testID="mc-default" />,
    );
    const icon = getByTestId('mc-default');
    expect(icon.props.size).toBe(24);
    expect(icon.props.color).toBe(Colors.borderColor);
  });

  test('getMimeIconName should return correct icon name for different mime types', () => {
    expect(getMimeIconName('image/jpeg')).toBe('file-photo-o');
    expect(getMimeIconName('video/mp4')).toBe('file-video-o');
    expect(getMimeIconName('audio/mpeg')).toBe('file-audio-o');
    expect(getMimeIconName('text/plain')).toBe('file-text-o');
    expect(getMimeIconName('application/zip')).toBe('file-archive-o');
    expect(getMimeIconName('application/vnd.ms-excel')).toBe('file-excel-o');
    expect(getMimeIconName('application/vnd.ms-powerpoint')).toBe(
      'file-powerpoint-o',
    );
    expect(getMimeIconName('application/x-abiword')).toBe('file-word-o');
    expect(getMimeIconName('application/pdf')).toBe('file-pdf-o');
    expect(getMimeIconName('text/calendar')).toBe('calendar-o');
    expect(getMimeIconName('unknown/mime')).toBe('file-o');
  });
});
