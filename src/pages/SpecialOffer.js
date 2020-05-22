import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, FlatList, ScrollView} from 'react-native';
import Environment from '../config/Environment';
import { SliderBox } from "react-native-image-slider-box";

export default class SepecialOffer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      isLoading: false,
      search: ''
    };
  }

  async componentDidMount() {
    this.onloadSpecialOffer();
  }

  //TODO: sepecial offer data
  onloadSpecialOffer = async () => {
      this.setState({isLoading: true});
      await fetch(Environment.backend_enpoint+'journeys/special-offers', {
        method: 'GET', // or 'PUT'
        headers: Environment.headers,
        credentials: 'same-origin'
      })
      .then((response) => response.json())
      .then(async (json) => {
        //console.log(json);
        json.forEach((element, index) => {
            element.slides = [Environment.backend_ip+element.images.previousPath, Environment.backend_ip+element.images.currentPath, Environment.backend_ip+element.images.nextPath];
        });
        this.setState({data: json});
      })
      .catch((error) => console.error(error))
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  renderLoading() {
    if (this.state.isLoading) {
      return (
        <View style={styles.spinner} pointerEvents={'none'}>
          <ActivityIndicator/>
        </View>
      )
    } else {
      return null
    }
  }

  render() {
    const { navigation } = this.props;
    const { data, isLoading } = this.state;
    return (
        <View style={styles.container}>
          <ScrollView>
            {
              data.length ?  data.map((item, i) =>(
                <View style={styles.slider} key={i}>
                  <SliderBox
                    images={item.slides}
                    sliderBoxHeight={300}
                    dotColor="#FFEE58"
                    inactiveDotColor="#90A4AE"
                    dotStyle={styles.dotStyle}
                    ImageComponentStyle={styles.imageComponent}
                    imageLoadingColor="#2196F3"
                  />
                  <View style={styles.details}>
                    <TouchableOpacity onPress={() => { navigation.navigate('JourneyDetails', { item: item })}}>
                      <Text style={styles.items}>{item.name}</Text>
                    </TouchableOpacity>
                    <Text style={styles.price}>$ {item.amount.toFixed(2)}</Text>
                  </View>
                </View>
              )) : <Text> No Special Offer available.</Text>
            }
          </ScrollView>
          {this.renderLoading()}
        </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  slider: {
    alignSelf: 'stretch',
    position: 'relative'
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
  items: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold'
  },
  price: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold'
  },
  details: {
    position: 'absolute',
    bottom: 15,
    left: 16,
    fontSize: 18
  },
  spinner: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  }
})
