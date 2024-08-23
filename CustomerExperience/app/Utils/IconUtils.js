import React from 'react';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import IonIcons from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '../styles/color.constants';

export const FaIcon = ({name, size, color, style}) => {
  return (
    <FontAwesomeIcon
      name={name}
      size={size ?? 24}
      color={color ?? Colors.borderColor}
      style={style}
    />
  );
};

export const IonIcon = ({name, size, color, style}) => {
  return (
    <IonIcons
      name={name}
      size={size ?? 24}
      color={color ?? Colors.borderColor}
      style={style}
    />
  );
};

export const MaterialIcons = ({name, size, color, style}) => {
  return (
    <MaterialIcon
      name={name}
      size={size ?? 24}
      color={color ?? Colors.borderColor}
      style={style}
    />
  );
};

export const MaterialCommunityIcons = ({name, size, color, style}) => {
  return (
    <MaterialCommunityIcon
      name={name}
      size={size ?? 24}
      color={color ?? Colors.borderColor}
      style={style}
    />
  );
};

function getMimeIconName(key) {
  const map = new Map();
  // Image types
  map.image = 'file-photo-o';
  map['image/avif'] = 'file-photo-o';
  map['image/bmp'] = 'file-photo-o';
  map['image/gif'] = 'file-photo-o';
  map['image/vnd.microsoft.icon'] = 'file-photo-o';
  map['image/jpeg'] = 'file-photo-o';
  map['image/png'] = 'file-photo-o';
  map['image/svg+xml'] = 'file-photo-o';
  map['image/tiff'] = 'file-photo-o';
  map['image/webp'] = 'file-photo-o';
  map['image/tiff'] = 'file-photo-o';

  // Video type
  map.video = 'file-video-o';
  map['video/x-msvideo'] = 'file-video-o';
  map['video/mp4'] = 'file-video-o';
  map['video/mpeg'] = 'file-video-o';
  map['video/ogg'] = 'file-video-o';
  map['video/mp2t'] = 'file-video-o';
  map['video/webm'] = 'file-video-o';
  map['video/3gpp'] = 'file-video-o';
  map['video/3gpp2'] = 'file-video-o';

  // Audio type
  map.audio = 'file-audio-o';
  map['audio/aac'] = 'file-audio-o';
  map['audio/midi'] = 'file-audio-o';
  map['audio/x-midi'] = 'file-audio-o';
  map['audio/mpeg'] = 'file-audio-o';
  map['audio/ogg'] = 'file-audio-o';
  map['audio/opus'] = 'file-audio-o';
  map['audio/wav'] = 'file-audio-o';
  map['audio/webm'] = 'file-audio-o';
  map['audio/3gpp'] = 'file-audio-o';
  map['audio/3gpp2'] = 'file-audio-o';

  // Text type
  map.text = 'file-text-o';
  map['text/plain'] = 'file-text-o';
  map['application/rtf'] = 'file-text-o';

  // Zip/Archive type
  map['application/zip'] = 'file-archive-o';
  map['application/x-7z-compressed'] = 'file-archive-o';
  map['application/vnd.rar'] = 'file-archive-o';
  map.archive = 'file-archive-o';

  // excel type
  map.excel = 'file-excel-o';
  map['application/vnd.ms-excel'] = 'file-excel-o';
  map['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'] =
    'file-excel-o';
  map['text/csv'] = 'file-excel-o';

  // poerpoint/presentation type
  map.powerpoint = 'file-powerpoint-o';
  map['application/vnd.ms-powerpoint'] = 'file-powerpoint-o';
  map[
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ] = 'file-powerpoint-o';

  // word type
  map.word = 'file-word-o';
  map['application/x-abiword'] = 'file-word-o';
  map['application/vnd.amazon.ebook'] = 'file-word-o';

  // pdf type
  map.pdf = 'file-pdf-o';
  map['application/pdf'] = 'file-pdf-o';

  // calendar type
  map.calendar = 'calendar-o';
  map['text/calendar'] = 'calendar-o';

  // Any other type
  map.file = 'file-o';

  return map[key] ?? map.file;
}

export const AttachmentIcon = ({mimeType}) => {
  const size = 12;
  const color = Colors.accentLight;
  return (
    <FontAwesomeIcon
      name={getMimeIconName(mimeType)}
      size={size}
      color={color}
    />
  );
};
