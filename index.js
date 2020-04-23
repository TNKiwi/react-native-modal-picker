import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  Modal,
  Image,
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
  TextInput,
} from 'react-native';
import {CheckBox} from 'react-native-elements';

console.disableYellowBox = true;
export default class RNModalPicker extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      isMultiChoice: this.props.multiChoice,
      dataSource: [],
      choices: [],
    };
  }

  _setSelectedValue(
    defaultText,
    pickerStyle,
    textStyle,
    dropDownImageStyle,
    dropDownImage,
  ) {
    return (
      <View style={pickerStyle}>
        {this.state.isMultiChoice ? (
          <Text style={textStyle}>
            {this.state.choices.length > 0
              ? this.state.dataSource
                ? this.state.dataSource.length > 0
                  ? this.state.choices.map((selection, index) => {
                      var toReturn = this.state.dataSource[selection - 1].name;
                      if (
                        index != this.state.choices.length - 1 &&
                        this.state.choices.length > 1
                      ) {
                        toReturn = toReturn + ', ';
                      }
                      return toReturn;
                    })
                  : // this.getLabelForId(2,this.state.dataSource)
                    defaultText
                : defaultText
              : defaultText}
            {/* {this.state.choices.map((selection)=>{
            })} */}
          </Text>
        ) : (
          <Text style={textStyle}>{defaultText}</Text>
        )}
        <Image
          style={dropDownImageStyle}
          resizeMode="contain"
          source={dropDownImage}
        />
      </View>
    );
  }

  getLabelForId(id, source) {
    console.log(id);
    console.log(source);
    if (source) {
      source.forEach((element) => {
        console.log(element.id);
        console.log(id);
        console.log(element.id == id);
        if (element.id == id) {
          console.log('true');
          return element.name;
        }
      });
    } else {
      return '';
    }
  }

  componentDidMount() {
    console.log(this.props.defaultChecked);
    this.setState({
      dataSource: this.props.dataSource,
      choices:
        this.props.defaultChecked != null ? this.props.defaultChecked : [],
    });
  }

  _searchFilterFunction(searchText, data) {
    let newData = [];
    if (searchText) {
      newData = data.filter(function (item) {
        const itemData = item.name.toUpperCase();
        const textData = searchText.toUpperCase();
        return itemData.includes(textData);
      });
      this.setState({
        dataSource: [...newData],
      });
    } else {
      this.setState({dataSource: this.props.dataSource});
    }
  }
  _flatListItemSeparator(itemSeparatorStyle) {
    return <View style={itemSeparatorStyle} />;
  }
  _renderItemListValues(item, index) {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.listRowClickTouchStyle}
        onPress={
          this.state.isMultiChoice
            ? () => {
                this.isChecked(item.id)
                  ? this._setNotCheckedIndex(index, item)
                  : this._setCheckedIndex(index, item);
              }
            : () => this._setSelectedIndex(index, item)
        }>
        <View
          style={{...styles.listRowContainerStyle, flex: 1, height: '100%'}}>
          <Text style={this.props.pickerItemTextStyle}>{item.name}</Text>
        </View>
        {this.state.isMultiChoice ? (
          <CheckBox
            title=""
            wrapperStyle={{
              justifyContent: 'center',
            }}
            containerStyle={{
              // flex: 1,
              backgroundColor: 'transparent',
              borderWidth: 0,
              justifyContent: 'center',
              marginTop: -5,
              // height: "80%"
            }}
            checked={this.isChecked(item.id)}
            onPress={() => {
              this.isChecked(item.id)
                ? this._setNotCheckedIndex(index, item)
                : this._setCheckedIndex(index, item);
            }}
            // style={{alignSelf: "center"}}
          />
        ) : null}
      </TouchableOpacity>
    );
  }

  isChecked(itemid) {
    var exist = false;
    this.state.choices.forEach((item) => {
      if (item == itemid) {
        exist = true;
      }
    });
    return exist;
  }

  _setNotCheckedIndex(index, item) {
    var tmp_choices = this.state.choices.filter((e) => e !== item.id);
    this.setState({choices: tmp_choices});

    this.props.selectedValue(index, item, tmp_choices);

    // this.setState({modalVisible: false});
  }

  _setCheckedIndex(index, item) {
    var tmp_choices = [...this.state.choices, item.id];
    this.setState({
      choices: tmp_choices,
    });

    this.props.selectedValue(index, item, tmp_choices);

    // this.setState({modalVisible: false});
  }

  _setSelectedIndex(index, item) {
    this.props.selectedValue(index, item);

    this.setState({modalVisible: false});
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <View>
          <TouchableOpacity
            disabled={this.props.disablePicker}
            onPress={() => this.setState({modalVisible: true})}
            activeOpacity={0.7}>
            <View>
              {this._setSelectedValue(
                this.props.selectedLabel != undefined &&
                  this.props.selectedLabel != []
                  ? this.props.selectedLabel
                  : this.props.placeHolderLabel,
                this.props.pickerStyle,
                this.props.selectedLabel != undefined &&
                  this.props.selectedLabel != []
                  ? this.props.selectLabelTextStyle
                  : this.props.placeHolderTextStyle,
                this.props.dropDownImageStyle,
                this.props.dropDownImage,
              )}
            </View>
          </TouchableOpacity>
        </View>

        <Modal
          visible={this.state.modalVisible}
          transparent={true}
          onShow={() => this.setState({dataSource: this.props.dataSource})}
          animationType={this.props.changeAnimation}
          onRequestClose={() => this.setState({modalVisible: false})}>
          <View style={styles.container}>
            <View style={styles.listDataContainerStyle}>
              <View style={styles.pickerTitleContainerStyle}>
                {this.props.showPickerTitle ? (
                  <Text style={styles.pickerTitleTextStyle}>
                    {' '}
                    {this.props.pickerTitle}
                  </Text>
                ) : null}

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => this.setState({modalVisible: false})}>
                  <Image
                    resizeMode="contain"
                    style={styles.crossImageStyle}
                    source={require('./res/ic_cancel_grey.png')}
                  />
                </TouchableOpacity>
              </View>
              {this.props.showSearchBar ? (
                <View style={this.props.searchBarContainerStyle}>
                  {/* <Image
                          resizeMode="contain"
                          style={styles.iconGPSStyle}
                          source={Images.ic_search}
                        /> */}

                  <TextInput
                    onChangeText={(text) =>
                      this._searchFilterFunction(
                        text,
                        this.props.dummyDataSource,
                      )
                    }
                    placeholder={this.props.searchBarPlaceHolder}
                    style={styles.textInputStyle}
                    underlineColorAndroid="transparent"
                    keyboardType="default"
                    returnKeyType={'done'}
                    blurOnSubmit={true}
                  />
                </View>
              ) : null}

              <FlatList
                style={styles.flatListStyle}
                keyExtractor={(item) => item.name}
                showsVerticalScrollIndicator={false}
                extraData={this.state}
                overScrollMode="never"
                ItemSeparatorComponent={() =>
                  this._flatListItemSeparator(this.props.itemSeparatorStyle)
                }
                keyboardShouldPersistTaps="always"
                numColumns={1}
                data={this.state.dataSource}
                renderItem={({item, index}) =>
                  this._renderItemListValues(item, index)
                }
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
RNModalPicker.defaultProps = {
  showSearchBar: false,
  showPickerTitle: false,
  disablePicker: false,
  defaultChecked: [],
  changeAnimation: 'slide',
  dropDownImage: require('./res/ic_drop_down.png'),
  placeHolderLabel: 'Please select value from picker',
  searchBarPlaceHolder: 'Search',

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectLabelTextStyle: {
    color: '#000',
    textAlign: 'left',
    width: '99%',
    padding: 10,
    flexDirection: 'row',
  },
  searchBarContainerStyle: {
    marginBottom: 10,
    flexDirection: 'row',
    height: 40,
    shadowOpacity: 1.0,
    shadowRadius: 5,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    backgroundColor: 'rgba(255,255,255,1)',
    shadowColor: '#d3d3d3',
    borderRadius: 10,
    elevation: 3,
    marginLeft: 10,
    marginRight: 10,
  },
  placeHolderTextStyle: {
    color: '#D3D3D3',
    padding: 10,
    textAlign: 'left',
    width: '99%',
    flexDirection: 'row',
  },
  dropDownImageStyle: {
    marginLeft: 10,
    width: 10,
    height: 10,
    alignSelf: 'center',
  },
  pickerItemTextStyle: {
    color: '#000',
    marginVertical: 10,
    flex: 0.9,
    marginLeft: 20,
    marginHorizontal: 10,
    textAlign: 'left',
  },
  pickerStyle: {
    marginLeft: 18,
    elevation: 3,
    paddingRight: 25,
    marginRight: 10,
    marginBottom: 2,
    shadowOpacity: 1.0,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    borderWidth: 1,
    shadowRadius: 10,
    backgroundColor: 'rgba(255,255,255,1)',
    shadowColor: '#d3d3d3',
    borderRadius: 5,
    flexDirection: 'row',
  },
};
RNModalPicker.propTypes = {
  placeHolderLabel: PropTypes.any,
  selectedLabel: PropTypes.any,
  pickerTitle: PropTypes.any,
  dataSource: PropTypes.any,
  dummyDataSource: PropTypes.any,
  dropDownImage: PropTypes.number,
  defaultSelected: PropTypes.any,
  showSearchBar: PropTypes.bool,
  showPickerTitle: PropTypes.bool,
  multiChoice: PropTypes.bool,
  disablePicker: PropTypes.bool,
  changeAnimation: PropTypes.string,
  searchBarPlaceHolder: PropTypes.string,
  defaultChecked: PropTypes.array,
  itemSeparatorStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),
  pickerItemTextStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),
  dropDownImageStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),

  selectLabelTextStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),

  searchBarContainerStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),
  placeHolderTextStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),
  textStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),
  pickerStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),
};
const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  pickerTitleContainerStyle: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  searchBarContainerStyle: {
    marginBottom: 10,
    flexDirection: 'row',
    height: 40,
    shadowOpacity: 1.0,
    shadowRadius: 5,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    backgroundColor: 'rgba(255,255,255,1)',
    shadowColor: '#d3d3d3',
    borderRadius: 10,
    elevation: 3,
    marginLeft: 10,
    marginRight: 10,
  },

  flatListStyle: {
    maxHeight: '85%',
    minHeight: '35%',
  },
  iconGPSStyle: {
    alignItems: 'center',
    alignSelf: 'center',
    height: 20,
    width: 20,
    margin: 5,
    transform: [
      {
        scaleX: I18nManager.isRTL ? -1 : 1,
      },
    ],
  },

  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
  },
  listRowContainerStyle: {
    width: '100%',
    justifyContent: 'center',
  },
  textInputStyle: {
    color: 'black',
    paddingLeft: 15,
    marginTop: Platform.OS == 'ios' ? 10 : 0,
    marginBottom: Platform.OS == 'ios' ? 10 : 0,
    alignSelf: 'center',
    flex: 1,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  crossImageStyle: {
    width: 40,
    height: 40,
    marginTop: -4,

    marginRight: -7,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    alignSelf: 'flex-end',
  },

  listDataContainerStyle: {
    alignSelf: 'center',
    width: '90%',
    borderRadius: 10,
    maxHeight: '80%',
    backgroundColor: 'white',
  },

  listRowClickTouchStyle: {
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
  },

  pickerTitleTextStyle: {
    fontSize: 18,
    flex: 1,
    paddingBottom: 10,
    marginLeft: 40,
    color: '#000',
    textAlign: 'center',
  },
});

//AppRegistry.registerComponent ('RNModalPicker', () => App);
