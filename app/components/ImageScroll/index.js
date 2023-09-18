import React, {useState, useEffect} from 'react';
import {Dimensions, FlatList, View, StyleSheet, Image} from 'react-native';

// Data Pre-fetching refers to the concept where the data is being downloaded in the background. This is done on the assumption that the data will likely be requested, hence enabling the data to load instantly if and when the user requests it.
// Lazy load images

const SingleScreen = ({item}) => {
  return (
    <View style={styles.itemWrapper}>
      <Image
        source={{
          uri: item,
        }}
        style={styles.image}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  itemWrapper: {
    width,
    height,
  },
  image: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
  },
});

const {width, height} = Dimensions.get('window');

const ScrollScreen = () => {
  const [images, setImages] = useState([]);
  const [limit, setLimit] = useState(2);

  const api = `https://api.pexels.com/v1/curated?per_page=${limit}`;

  useEffect(() => {
    fetchImages();
  }, [limit]);

  const fetchImages = () => {
    fetch(api, {
      headers: new Headers({
        Authorization:
          'Your Auth key',
      }),
    })
      .then(res => res.json())
      .then(data => {
        const fetchedImages = data.photos;
        const filterData = fetchedImages.map((x) => x.src.large);
        setImages(filterData);
      })
      .catch(err => console.log(err));
  };

  return (
    <View>
      <FlatList
        data={images}
        pagingEnabled
        scrollEnabled
        style={{height, width}}
        snapToAlignment="center"
        scrollEventThrottle={16}
        decelerationRate={'fast'}
        renderItem={({item}) => {
          return <SingleScreen item={item} />;
        }}
        onEndReachedThreshold={1}
        onEndReached={() => {
          setLimit(prev => prev + 1);
        }}
      />
    </View>
  );
};

export default ScrollScreen;