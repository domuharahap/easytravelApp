import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Picker} from 'react-native';
import Environment from '../config/Environment';
import { SliderBox } from "react-native-image-slider-box";
import moment from 'moment';
import Select2 from 'react-native-select-two';
import AsyncStorage from '@react-native-community/async-storage';
import Constant from '../config/Constant'

export default class JourneyDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: false,
      selectedTravelers: 1,
      //TODO: changed the authentication to default false
      isAuthenticated: false,
      travelersEmpty: false
    };
  }

  async componentDidMount() {
    //TODO: check username
    this.login();
    //this.onloadSpecialOffer();
    //TODO: Set default value of Travelers
  }

  login = async () => {
      const username = await AsyncStorage.getItem("username");
      //console.log(username);
      if(username){
        this.setState({isAuthenticated: true});
      }
  }


  onBookNow = async (totalTraveler, item) => {
    console.log("total traveler: "+totalTraveler);
    if(this.travelersEmpty) {
      console.log('no of travellers is empty');
    }else {
      console.log(totalTraveler);
      if(this.state.isAuthenticated) {
        this.props.navigation.navigate('Review', { item: item, totalTraveler: totalTraveler});
      }else {
        this.props.navigation.navigate('Signin');
      }
    }
  }

  render() {
    const { route, navigation } = this.props
    const { item } = route.params
    return (
      <View style={styles.container}>
        <ScrollView>
          <SliderBox
            images={item.slides}
            sliderBoxHeight={300}
            dotColor="#FFEE58"
            inactiveDotColor="#90A4AE"
            dotStyle={styles.dotStyle}
            ImageComponentStyle={styles.imageComponent}
            imageLoadingColor="#2196F3"
          />
          <View style={styles.title}>
              <Text style={styles.items}>{item.name}</Text>
          </View>
          <View style={styles.details}>
            <View style={styles.item}>
                <Text style={styles.items}>Journey:</Text>
                <Text style={styles.price}>{item.name}</Text>
            </View>
            <View style={styles.item}>
                <Text style={styles.items}>Period:</Text>
                <Text style={styles.price}>{moment(item.fromDate).format('ll')} - {moment(item.toDate).format('ll')}</Text>
            </View>
            <View style={styles.item}>
                <Text style={styles.items}>Orginize By:</Text>
                <Text style={styles.price}>{item.tenant}</Text>
            </View>
            <View style={styles.item}>
                <Text style={styles.items}>Amount:</Text>
                <Text style={styles.price}>$ {item.amount.toFixed(2)}</Text>
            </View>
            <View style={styles.item}>
                <Text style={styles.items}>Travelers:</Text>
                <Select2
                    isSelectSingle={true} showSearchBox={true} selectButtonText="Select" cancelButtonText="Cancel"
                    style={styles.travelers}
                    colorTheme={'green'}
                    popupTitle='Select item' title='No of Travelers' searchPlaceHolderText="Type to search..."
                    data={Constant.travelers}
                    onSelect={data => {
                        this.setState({ selectedTravelers: data});
                    }}
                    onRemoveItem={data => {
                        this.setState({selectedTravelers: data });
                    }}
                />

            </View>
          </View>

        </ScrollView>
        <View>
          <TouchableOpacity style={styles.booking} onPress={() => {this.onBookNow(this.state.selectedTravelers, item)}}>
            <Text style={styles.bookingText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    margin: 2
  },
  dotStyle: {
    width: 60,
    height: 4,
    borderRadius: 0,
    marginHorizontal: 0,
    padding: 0,
    margin: 0,
    backgroundColor: "rgba(128, 128, 128, 0.92)"
  },
  imageComponent: {
    borderRadius: 0,
    width: '97%',
    marginTop: 5
  },
  title: {
    margin: 5,
    alignItems: 'center',
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    margin: 5
  },
  item: {
    width: '50%'
  },
  items: {
    marginTop: 5,
    color: '#555',
    fontSize: 20,
    fontWeight: 'bold'
  },
  price: {
    marginTop: 5,
    color: '#555',
    fontSize: 15,
  },
  booking: {
    borderRadius: 15,
    justifyContent: 'flex-end',
    backgroundColor: '#64c07a',
    padding: 12,
    alignItems: 'center',
  },
  bookingText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  picker: {
    height: 50,
    width: 150,
    borderColor: '#A8A8A8'
  },
  travelersEmpty: {
    borderRadius: 7,
    width: '80%',
    borderColor:'red'
  },
  travelers: {
    borderRadius: 7,
    width: '80%',
  }
})
