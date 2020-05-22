import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Picker} from 'react-native';
import Environment from '../config/Environment';
import { SliderBox } from "react-native-image-slider-box";
import moment from 'moment';
import Constant from '../config/Constant';

export default class JourneyDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: false
    };
  }

  async componentDidMount() {
    //this.onloadSpecialOffer();
  }

  render() {
    const { route, navigation } = this.props
    const { item, totalTraveler } = route.params
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
                <Text style={styles.items}>Travelers:</Text>
                <Text style={styles.price}>{Constant.travelers[totalTraveler-1].name}</Text>
            </View>
          </View>

        </ScrollView>
        <View style={styles.booking}>
          <TouchableOpacity onPress={() => { navigation.navigate('Payment', { item: item, totalTraveler: totalTraveler })}}>
            <Text style={styles.bookingText}>Pay ${item.amount.toFixed(2)}</Text>
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
    padding: 10,
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
  }
})
