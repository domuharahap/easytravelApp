import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, TextInput, Alert} from 'react-native';
import Environment from '../config/Environment';
import moment from 'moment';
import Select2 from 'react-native-select-two';
import AsyncStorage from '@react-native-community/async-storage';
import Constant from '../config/Constant';


export default class JourneyDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: false,
      ccnumber: '6224 2266 8023 5740',
      expiry:'',
      cvc: '300',
      month: '',
      year: '',
      username: ''
    };
  }

  async componentDidMount() {
    //this.onloadSpecialOffer();
      this.login();
  }

  login = async () => {
    //console.log("login method call");
      this.setState({username: await AsyncStorage.getItem("username")});

  }

  onChangeNumber = async (number) => {
    this.setState({
      ccnumber: number.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim()
    });
  }

  onChangeCvc = async (number) => {
    this.setState({cvc: number.replace(/\s?/g, '')})
  }

  bookingConfirm = async (item, totalTraveler) => {
    this.setState({isLoading: true});
    console.log('confirm booking');
    if(this.state.ccnumber && this.state.years && this.state.months && this.state.cvc) {
      //TODO: validate creditCard 6224226680235740
      const creditCard =  this.state.ccnumber.replace(/\s/g,'');
      const ccvalidation = await this.validateCreditCard(creditCard);
      var travelers = parseInt(totalTraveler, 10);
      if(ccvalidation.valid) {
          //TODO: Book Journey
          console.log(item.amount+", "+ creditCard+", "+ item.id+", " +totalTraveler+", "+ this.state.username);
          const bookings = await this.bookings(item.amount, creditCard, item.id, travelers, "barnabassas");
          if(bookings && bookings.bookingId) {
            //TODO show booking ID
            this.showAlertSuccesBooking(bookings.bookingId);
          }else {
            console.log('rejected');
          }
      }else {
        console.log('Invalid CreditCard');
        //TODO: invalid creditCard
      }
    }else {
      console.log('form empty');
    }
  }

  showAlertSuccesBooking(bookingId) {
      Alert.alert(
          'Confirmation!',
          'You Successfully created your booking! your booking referece: '+bookingId,
          [
              {text: 'OK', onPress: () => this.props.navigation.navigate('Home')},
          ]
      );
  }

  async validateCreditCard(number) {
    try {
      let response = await fetch(Environment.backend_enpoint+'validate-creditcard', {
        method: 'POST', // or 'PUT'
        headers: Environment.headers,
        credentials: 'same-origin',
        body: JSON.stringify({
          creditCardNumber: number
        }),
      });
      let json = await response.json();
      return json;
    } catch (error) {
      console.error(error);
    }
  }

  async bookings(amount, number, journeyId, travelers, username) {
    try {
      console.log(amount+", "+number+", "+journeyId+", "+travelers+", "+username);
      let response = await fetch(Environment.backend_enpoint+'bookings/', {
        method: 'POST',
        headers: {
          Accept: 'application/json', 'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          journeyId: journeyId,
          username: username,
          creditcard: number,
          amount: amount,
          travellers: travelers
        })
      });
      let json = await response.json();
      return json;
    } catch (error) {
      console.log("errors"+error);
      console.error(error);
    }
  }

  renderLoading() {
    if (this.state.isLoading) {
      return (
        <View style={styles.spinner} pointerEvents={'box-none'}>
          <ActivityIndicator/>
        </View>
      )
    } else {
      return null
    }
  }

  render() {
    const { route, navigation } = this.props
    const { item, totalTraveler } = route.params
    return (
        <View style={styles.container}>
          <View style={styles.paymentContainer}>
            <View style={styles.title}>
              <Text>Payment Details</Text>
            </View>
            <View style={styles.content}>
              <Text>CARD NUMBER</Text>
              <TextInput placeholder="0000 0000 0000 0000" keyboardType="numeric" maxLength={19}
                style={{ height: 40, borderColor: '#DCDCDC', borderWidth: 1, borderRadius: 5 }}
                onChangeText={text => this.onChangeNumber(text)}
                value={this.state.ccnumber}
              />
            </View>

            <Text>EXPIRY</Text>
            <View style={styles.expiry}>
              <View style={styles.expiryInput}>
                <Select2 selectedValue={this.state.months}
                      isSelectSingle selectButtonText="Select" cancelButtonText="Cancel"
                      style={{ borderRadius: 5, borderColor: '#DCDCDC' }}
                      colorTheme={'green'}
                      popupTitle='Select item' title='Month'
                      data={Constant.months}
                      onSelect={data => {
                          this.setState({ months: data });
                      }}
                      onRemoveItem={data => {
                          this.setState({months: data });
                      }}
                  />

              </View>
              <View style={styles.expiryInput}>
                <Select2
                      isSelectSingle selectButtonText="Select" cancelButtonText="Cancel"
                      style={{ borderRadius: 5, borderColor: '#DCDCDC' }}
                      colorTheme={'green'}
                      popupTitle='Select item' title='Year'
                      data={Constant.years}
                      onSelect={data => {
                          this.setState({ years: data });
                      }}
                      onRemoveItem={data => {
                          this.setState({years: data });
                      }}
                  />

              </View>
              <View style={styles.expiryInputcsv}>
              </View>
              <View style={styles.expiryInputcsv}>
                <TextInput placeholder="CVC" keyboardType="numeric" maxLength={3} autoCompleteType="cc-csc"
                  style={{ height: 40, borderColor: '#DCDCDC', borderWidth: 1, borderRadius: 5 }}
                  onChangeText={text => this.onChangeCvc(text)}
                  value={this.state.cvc}
                />
              </View>
            </View>
            <TouchableOpacity style={styles.bookingConfirm} onPress={() => this.bookingConfirm(item, totalTraveler)}>
              <Text style={styles.bookingText}>BOOK JOURNEY FOR ${item.amount.toFixed(2)}</Text>
            </TouchableOpacity>
          </View>

          {this.renderLoading()}
        </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    margin: 1,
    padding: 2
  },
  title: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    fontWeight: 'bold'
  },
  paymentContainer:{
    backgroundColor: '#C0C0C0',
    padding: 3,
    borderRadius: 10,
    width: '100%'
  },
  creditCard: {
    justifyContent: 'center',
  },
  bookingConfirm: {
    backgroundColor: '#f4aa5c',
    borderRadius: 10,
    width: '99%',
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
  },
  bookingText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  expiry: {
    flexDirection: 'row',
    width: '100%',
  },
  expiryInput: {
    width: '30%',
    padding: 2
  },
  expiryInputcsv: {
    width: '20%',
  },

  picker: {
    height: 35,
    borderColor: '#fff',
    borderWidth: 1,
  },
  spinner: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
        //backgroundColor: '#f3f3f3'
  }
})
