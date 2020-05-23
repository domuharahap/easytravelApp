import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, SafeAreaView, ScrollView} from 'react-native';
import { SliderBox } from "react-native-image-slider-box";
import Select2 from 'react-native-select-two';
import moment from 'moment';
import DatePicker from 'react-native-datepicker';

import Constant from '../config/Constant';
import Environment from '../config/Environment';

export default class FindJourney extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      isLoading: false,
      search: '',
      images: [Environment.backend_ip+'/assets/imgs/hero-bg.jpg'],
      locations: '',
      dateFrom: '',
      dateTo: '',
      minDate: '',
      cities: []
    };
  }

  async componentDidMount() {
    this.setState({minDate: moment().format('YYYY-MM-DD')});
    this.setState({cities: Constant.cities});
  }

  onChange = async (locations) => {
    if(locations.length > 1) {
      console.log("searching..."+locations);
      const data = await this.findLocations(locations);
      console.log(data);
      if(data) {
        this.setState({data: data});
      }else{
        console.log("No Journey available");
      }
    }
  }

  async findLocations(locations) {
    try {
      let response = await fetch(Environment.backend_enpoint+'locations?match='+locations, {
        method: 'GET', // or 'PUT'
        headers: Environment.headers,
        credentials: 'same-origin'
      });
      let json = await response.json();
      return json;
    } catch (error) {
      console.log("error search");
      console.error(error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  onSearch = async (locations, dateFrom, dateTo) => {
    console.log('on search');
    //console.log(locations+", "+dateFrom+", "+dateTo);
    if(!locations) {
      //console.log("here");
      //console.log(this.getSelected());
      locations = this.state.locations;
    }
    console.log(locations);
    if(locations || dateFrom || dateTo) {
      this.onSearchDestination(locations, dateFrom, dateTo);

    }else{
      console.log('Form is empty!');
    }
  }

  async onSearchDestination(locations, dateFrom, dateTo) {
    try {
      let response = await fetch(Environment.backend_enpoint+'journeys/?match='+locations+"&from="+dateFrom+"&to="+dateTo, {
        method: 'GET',
        headers: Environment.headers,
        credentials: 'same-origin'
      });
      let json = await response.json();
      json.forEach((element, index) => {
          element.slides = [Environment.backend_ip+element.images.previousPath, Environment.backend_ip+element.images.currentPath, Environment.backend_ip+element.images.nextPath];
      });
      //console.log(json);
      this.setState({data: json});
      return json;
    } catch (error) {
      console.log("error search");
      console.error(error);
    } finally {
      this.setState({ isLoading: false });
    }
  }
  onSelectItem = async (id) => {
    if(id) {
      let destination = Constant.cities.filter(function(item){
        return item.id == id;
      });
      console.log(destination[0].name);
      this.setState({locations: destination[0].name})
    }else{
      this.getSelected();
    }
  }
  getSelected = async () => {
    let destination = Constant.cities.filter(function(item){
      return item.checked == true;
    });
    console.log(destination[0].name);
    if(destination) {
      this.setState({locations: destination[0].name});
      return destination[0].name;
    }
  }

  setCitiesCheck = async(id, isChecked) => {
    let years = Constant.cities.filter(function(item){
      item.id == id;
      item.checked = isChecked;
      return item;
    });
    //this.setState({locations: years[0].id});
  }

  onClear = async () => {
      this.setState({dateFrom: ''});
      this.setState({dateTo: ''});
      this.setState({locations: ''});
      if(this.state.locations) {
        this.setCitiesCheck(this.state.locations, false);
      }
  }

  render() {
    const { navigation } = this.props;
    const { isLoading, images, data, locations, dateFrom, dateTo} = this.state;
    return (
        <View style={styles.container}>
          <SafeAreaView>
            <ScrollView>
              <View style={styles.slider}>
                <SliderBox
                  images={images}
                  sliderBoxHeight={200}
                  dotColor="#FFEE58"
                  inactiveDotColor="#90A4AE"
                  dotStyle={styles.dotStyle}
                  ImageComponentStyle={styles.imageComponent}
                  imageLoadingColor="#2196F3"
                />
                <View style={styles.details}>
                  <View style={styles.easytravel}>
                    <Text style={{color: '#ffffff', fontSize: 13, fontWeight: 'bold'}}>easyTravel!</Text>
                    <Text style={{color: '#ffffff', fontSize: 20, fontWeight: 'bold'}}>Collect Moments</Text>
                    <Text style={{color: '#ffffff', fontSize: 17, fontWeight: 'bold'}}>not things.</Text>
                  </View>

                  <View style={styles.searchForm}>
                    <View style={styles.formInputSelect}>
                      <Select2
                        isSelectSingle={true} showSearchBox={true} selectButtonText="Select" cancelButtonText="Cancel" style={styles.selectItem} colorTheme={'green'}
                        popupTitle='Select item' title='Destination...' searchPlaceHolderText="Type to search..." data={this.state.cities}
                        onSelect={data => {this.onSelectItem(data)}}
                        onRemoveItem={data => {this.setState({locations: data })}}
                      />
                    </View>
                    <View style={{flexDirection: 'row', width: '50%'}}>
                      <View style={styles.formInput}>
                        <DatePicker style={styles.date} date={this.state.dateFrom} mode="date" placeholder="Date From" showIcon={false}
                          format="YYYY-MM-DD" minDate={this.state.minDate} confirmBtnText="Confirm" cancelBtnText="Cancel" onDateChange={(date) => {this.setState({dateFrom: date})}}
                        />
                      </View>
                      <View style={styles.formInput}>
                        <DatePicker style={styles.date} date={this.state.dateTo} mode="date" placeholder="Date To" showIcon={false}
                          format="YYYY-MM-DD" minDate={this.state.dateFrom} confirmBtnText="Confirm" cancelBtnText="Cancel" onDateChange={(date) => {this.setState({dateTo: date})}}
                        />
                      </View>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', padding: 0, width:'99%'}}>
                    <View style={{ width: '50%', padding:1}}>
                      <TouchableOpacity style={styles.search} onPress={this.onClear}>
                        <Text style={styles.bookingText}>Clear</Text>
                      </TouchableOpacity>
                      </View>
                    <View style={{ width: '50%', padding:1}}>
                      <TouchableOpacity style={styles.search} onPress={() => {this.onSearch(locations, dateFrom, dateTo)}}>
                        <Text style={styles.bookingText}>Search</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
            </View>
              { data.length ?  data.map((item, i) =>(
                  <View style={styles.slider} key={i}>
                    <SliderBox images={item.slides} sliderBoxHeight={200} dotColor="#FFEE58" inactiveDotColor="#90A4AE"
                      dotStyle={styles.dotStyle} ImageComponentStyle={styles.imageComponent} imageLoadingColor="#2196F3"
                    />
                    <View style={styles.detailSearch}>
                      <TouchableOpacity onPress={() => { navigation.navigate('JourneyDetails', { item: item })}}>
                        <Text style={styles.items}>{item.name}</Text>
                      </TouchableOpacity>
                      <Text style={styles.price}>$ {item.amount.toFixed(2)}</Text>
                    </View>
                  </View>
                )) : <></>
              }
            </ScrollView>

          </SafeAreaView>
        </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 1
  },
  slider: {
    alignSelf: 'stretch',
    position: 'relative'
  },
  imageComponent: {
    borderRadius: 0,
    width: '99%',
    marginTop: 5
  },
  easytravel:{
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30
  },
  details: {
    position: 'absolute',
    bottom: 5,
    left: 7,
    fontSize: 18,
    position: 'absolute',
    right: 5,
    zIndex: 1
  },
  searchForm:{
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    color: 'black',
    //opacity: 0.7
  },
  selectItem: {
    backgroundColor: '#F5F5F5',
    color: 'white',
    padding: 2,
    borderColor: '#C0C0C0',
    borderRadius: 5
  },
  date:{
    width: '95%',
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: '#F5F5F5',
    borderRadius: 5
  },
  search: {
    borderRadius: 10,
    justifyContent: 'flex-end',
    backgroundColor: '#64c07a',
    padding: 10,
    alignItems: 'center',
  },
  formInputSelect:{
    width: '50%',
    flexDirection: 'row',
    padding: 3
  },
  formInput: {
    width: '50%',
    flexDirection: 'row',
    padding: 1
  },
  emailItem: {
    borderBottomWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.3)',
    padding: 10
  },
  searchInput: {
    padding: 10,
    borderColor: '#CCC',
    borderWidth: 1
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
  detailSearch: {
    position: 'absolute',
    bottom: 15,
    left: 16,
    fontSize: 18
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
})
