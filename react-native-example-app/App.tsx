import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';

import InterceptSdk, {DataCenter} from '@npm-questionpro/react-native-survey-intercept';
import { DataMapping } from '@npm-questionpro/react-native-survey-intercept/lib/typescript/types';


const App = () => {
  const [sdkStatus, setSdkStatus] = useState('Not Configured');
  const [lastEvent, setLastEvent] = useState<any>(null);
  const [platform, setPlatform] = useState('unknown');
  const [implementationType, setImplementationType] = useState<string>('unknown');

  useEffect(() => {
    // Set platform info
    setPlatform(require('react-native').Platform.OS);

    // Check implementation type
    const implType = InterceptSdk.getImplementationType();
    setImplementationType(implType);
    
    // Test basic SDK availability
    console.log('🚀 InterceptSdk available:', !!InterceptSdk);
    console.log('🚀 InterceptSdk methods:', Object.keys(InterceptSdk));
    console.log('🚀 Implementation type:', implType);
    console.log('🚀 Native module available:', InterceptSdk.isNativeModuleAvailable());

    // Listen for SDK events
    const subscription = InterceptSdk.onEvent((event) => {
      console.log('📱 SDK Event received:', event);
      setLastEvent(event);
      configureSDK();
    });

    return () => {
      if (subscription && typeof subscription === 'function') {
        subscription();
      }
    };
  }, []);

  
  const configureSDK = async () => {
    try {
      setSdkStatus('Configuring...');
      console.log('🔧 Configuring SDK...');
      
      const result = await InterceptSdk.configure({
        apiKey: '058d9ebc-c80e-4969-8196-f4feb7aae5e6',
        dataCenter: DataCenter.US,
        enableDebug: true,
      });
      
      console.log('✅ SDK Configuration result:', result);
      if(result.success){
        setSdkStatus('Configured Successfully');
        Alert.alert('Success', 'SDK configured successfully!');
      }else{
        setSdkStatus('Configuration Failed');
        Alert.alert('Failure', result.message);
      }
      
    } catch (error) {
      console.error('❌ SDK Configuration error:', error);
      setSdkStatus('Configuration Failed');
      Alert.alert('Error', `Failed to configure SDK: ${error}`);
    }
  };

  const sendTestEvent = async () => {
    try {
      console.log('📤 Sending test event...');
      
      const result = await InterceptSdk.notifyEvent('test_event');
      
      console.log('✅ Event sent result:', result);
      Alert.alert('Success', 'Test event sent successfully!');
    } catch (error) {
      console.error('❌ Send event error:', error);
      Alert.alert('Error', `Failed to send event: ${error}`);
    }
  };

  const launchSurvey = async () => {
    try {
      const result = await InterceptSdk.setScreenVisited('survey');
      console.log('✅ Survey launch result:', result);
    } catch (error) {
      console.error('❌ Launch survey error:', error);
    }
  };

  const setDataMappings = async () => {
  try {
    const dataMappings: DataMapping = {
      'firstName': 'ReactNative',
      'surname': 'DemoApp',
      'emailAddress': 'sample@questionpro.com'
    };
    
    const result = await InterceptSdk.setDataMappings(dataMappings);
    console.log('✅ setDataMappings result:', result);
  } catch (error) {
    console.error('❌ setDataMappings error:', error);
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#007AFF"
        barStyle="light-content"
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>InterceptSDK Example</Text>
          <Text style={styles.subtitle}>Platform: {platform}</Text>
          <Text style={styles.subtitle}>Implementation: {implementationType}</Text>
          <Text style={styles.subtitle}>Status: {sdkStatus}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SDK Actions</Text>
          
          <TouchableOpacity style={styles.button} onPress={configureSDK}>
            <Text style={styles.buttonText}>Configure SDK</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={sendTestEvent}
          >
            <Text style={styles.buttonText}>Send Test Event</Text>
          </TouchableOpacity>

           <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={setDataMappings}
          >
            <Text style={styles.buttonText}>Map Data</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={launchSurvey}
          >
            <Text style={styles.buttonText}>Launch Survey</Text>
          </TouchableOpacity>
        </View>

        {lastEvent && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Last Event</Text>
            <View style={styles.eventContainer}>
              <Text style={styles.eventText}>
                {JSON.stringify(lastEvent, null, 2)}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <Text style={styles.instructionText}>
            1. Tap "Configure SDK" to initialize the SDK with test parameters{'\n'}
            2. Tap "Send Test Event" to send a test event to the SDK{'\n'}
            3. Check the console logs for detailed output{'\n'}
            4. Any received events will appear in the "Last Event" section
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  section: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  eventContainer: {
    backgroundColor: '#f1f3f4',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  eventText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#333',
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default App;
