// Bismillah

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import axios from 'axios';

const App = () => {
  const [list, setList] = useState([]);
  const [visible, setVisible] = useState(false);

  const [eventName, setEventName] = useState('');
  const [eventPrice, setEventPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(1);
  const [hideId, setHideId] = useState(null);

  useEffect(() => {
    getList();
  }, []);

  const getList = () => {
    axios
      .get('http://10.0.2.2:3000/events')
      .then(res => {
        setList(res.data);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  };

  const handleDelete = item => {
    axios
      .delete(`http://10.0.2.2:3000/events/${item.id}`)
      .then(() => {
        getList();
      })
      .catch(error => {
        console.error('Error deleting event:', error);
      });
  };

  const handleSave = () => {
    const data = {
      eventName: eventName,
      eventPrice: Number(eventPrice) || 0,
      description: description,
      status: Number(status) || 1,
    };

    if (hideId == null) {
      axios
        .post('http://10.0.2.2:3000/events', data)
        .then(() => {
          getList();
          resetForm();
        })
        .catch(error => {
          console.error('Error creating event:', error);
        });
    } else {
      axios
        .put(`http://10.0.2.2:3000/events/${hideId}`, data)
        .then(() => {
          getList();
          resetForm();
        })
        .catch(error => {
          console.error('Error updating event:', error);
        });
    }
  };

  const handleEdit = item => {
    setVisible(true);
    setHideId(item.id);
    setEventName(item.eventName);
    setEventPrice(item.eventPrice.toString());
    setDescription(item.description);
    setStatus(item.status.toString());
  };

  const handleVisibleModal = () => {
    setVisible(!visible);
    setHideId(null);
    resetForm();
  };

  const resetForm = () => {
    setEventName('');
    setEventPrice(0);
    setDescription('');
    setStatus(1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header_container}>
        <Text style={styles.txt_main}>Event List ({list.length})</Text>
        <TouchableOpacity
          onPress={handleVisibleModal}
          style={styles.btnNewContainer}>
          <Text style={styles.textButton}>+ New Event</Text>
        </TouchableOpacity>
      </View>
      <Modal animationType="slide" visible={visible}>
        <SafeAreaView>
          <View style={styles.form}>
            <TouchableOpacity onPress={handleVisibleModal}>
              <Text style={styles.txtClose}>Close</Text>
            </TouchableOpacity>
            <TextInput
              value={eventName}
              style={styles.text_input}
              placeholder="Event Name"
              onChangeText={setEventName}
            />
            <TextInput
              value={eventPrice.toString()}
              style={styles.text_input}
              placeholder="Event Price"
              keyboardType="numeric"
              onChangeText={setEventPrice}
            />
            <TextInput
              value={description}
              style={styles.text_input}
              placeholder="Description"
              onChangeText={setDescription}
            />
            <TextInput
              value={status.toString()}
              style={styles.text_input}
              placeholder="Status (1 for Enabled, 0 for Disabled)"
              keyboardType="numeric"
              onChangeText={setStatus}
            />
            <TouchableOpacity onPress={handleSave} style={styles.btnSave}>
              <Text style={styles.textButton}>
                {hideId == null ? 'Save' : 'Update'}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
      <ScrollView>
        {list.map((item, index) => (
          <View style={styles.item_course} key={index}>
            <View>
              <Text style={styles.txt_name}>
                {index + 1}. {item.eventName}
              </Text>
              <Text style={styles.txt_item}>Price: ${item.eventPrice}</Text>
              <Text style={styles.txt_item}>{item.description}</Text>
              <Text
                style={
                  item.status === 1 ? styles.txt_enabled : styles.txt_disabled
                }>
                {item.status === 1 ? 'Akan datang' : 'Sudah terlaksana'}
              </Text>
            </View>
            <View style={styles.action_buttons}>
              <TouchableOpacity onPress={() => handleDelete(item)}>
                <Text style={styles.txt_del}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <Text style={styles.txt_edit}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5F5F5'},
  form: {padding: 20, marginTop: 10},
  txtClose: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E74C3C',
    textAlign: 'right',
  },
  text_input: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: '#FAFAFA',
  },
  header_container: {
    padding: 20,
    backgroundColor: '#3498DB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txt_main: {fontSize: 24, fontWeight: 'bold', color: '#FFF'},
  item_course: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#FFF',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  txt_name: {fontSize: 18, fontWeight: 'bold', color: '#333'},
  txt_item: {fontSize: 14, color: '#666', marginTop: 2},
  txt_enabled: {fontSize: 14, color: 'green', fontWeight: 'bold'},
  txt_disabled: {fontSize: 14, color: 'red', fontWeight: 'bold'},
  txt_del: {fontSize: 14, color: '#E74C3C', fontWeight: 'bold', marginTop: 10},
  txt_edit: {fontSize: 14, color: '#3498DB', fontWeight: 'bold', marginTop: 10},
  btnNewContainer: {padding: 12, backgroundColor: '#2ECC71', borderRadius: 5},
  action_buttons: {alignItems: 'flex-end'},
  textButton: {textAlign: 'center', color: '#FFF', fontWeight: '600'},
  btnSave: {
    padding: 15,
    backgroundColor: '#3498DB',
    borderRadius: 5,
    marginTop: 20,
  },
});
