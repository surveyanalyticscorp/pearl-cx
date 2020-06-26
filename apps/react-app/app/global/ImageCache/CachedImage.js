'use strict';

const PropTypes = require('prop-types');
const _ = require('lodash');
const React = require('react');
const ReactNative = require('react-native');
import{ ImageBackground } from 'react-native';
const flattenStyle = ReactNative.StyleSheet.flatten;
const ImageCacheProvider = require('./ImageCacheProvider');

const {
    Image,
    ActivityIndicator,
    NetInfo,
    Platform
} = ReactNative;


const {
    StyleSheet
} = ReactNative;

const styles = StyleSheet.create({
    image: {
        backgroundColor: 'transparent'
    },
    loader: {
        backgroundColor: 'transparent',
    },
    loaderPlaceholder: {
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

function getImageProps(props) {
    return _.omit(props, ['source', 'defaultSource', 'activityIndicatorProps', 'style', 'useQueryParamsInCacheKey', 'renderImage']);
}

const CACHED_IMAGE_REF = 'cachedImage';

class CachedImage extends React.Component{
    constructor(props){
        super(props);
        this._isMounted = false;
        this.state =  {
            isCacheable: false,
            cachedImagePath: null,
            networkAvailable: true
        };
    }
    static propTypes = {
        renderImage: PropTypes.func.isRequired,
        activityIndicatorProps: PropTypes.object.isRequired,
        useQueryParamsInCacheKey: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.array
        ]).isRequired,
        isProfilePic: PropTypes.bool
    }

    static defaultProps = {
        renderImage: props => (<ImageBackground imageStyle={props.style} ref={CACHED_IMAGE_REF} {...props} />),
        activityIndicatorProps: {},
        useQueryParamsInCacheKey: false
    };

    setNativeProps(nativeProps) {
        try {
            this.refs[CACHED_IMAGE_REF].setNativeProps(nativeProps);
        } catch (e) {
            console.error(e);
        }
    }

    safeSetState(newState) {
        if (!this._isMounted) {
            return;
        }
        return this.setState(newState);
    }

    componentWillMount() {
        this._isMounted = true;
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
        // initial
        NetInfo.isConnected.fetch()
            .then(isConnected => {
                this.safeSetState({
                    networkAvailable: isConnected
                });
            });

        this.processSource(this.props.source);
    }

    componentWillUnmount() {
        this._isMounted = false;
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.source, nextProps.source)) {
            this.processSource(nextProps.source);
        }
    }

    handleConnectivityChange(isConnected) {
        this.safeSetState({
            networkAvailable: isConnected
        });
    }

    processSource(source) {

        let url = _.get(source, ['uri'], null);

        if (ImageCacheProvider.isCacheable(url)) {
            console.log("URL Is Cacheable");
            let options = _.pick(this.props, ['useQueryParamsInCacheKey', 'cacheGroup','isProfilePic']);
            //If profile pic, first delete the profile pic folder, then cache profile pic.
            if(options.isProfilePic) {
                ImageCacheProvider.deleteProfilePicDirectory(global.BASE_URL).then((response) => {
                    console.log(response);
                    this.processImageCaching(url, options);
                });
            } else {
                this.processImageCaching(url, options);
            }
            this.safeSetState({
                isCacheable: true
            });
        } else {
            this.safeSetState({
                isCacheable: false
            });
        }
    }

    //Added separate function to cache images to local storage.
    processImageCaching(url, options) {
        ImageCacheProvider.getCachedImagePath(url, options)
            .catch(() => ImageCacheProvider.cacheImage(url, options))
            .then(cachedImagePath => {
                this.safeSetState({
                    cachedImagePath: cachedImagePath
                });
            })
            .catch(err => {
                this.safeSetState({
                    cachedImagePath: null
                });
            });
    }

    render() {
        if (this.state.isCacheable && !this.state.cachedImagePath) {
            return this.renderLoader();
        }
        let props = getImageProps(this.props);
        let style = this.props.style || styles.image;

        let source = (this.state.isCacheable && this.state.cachedImagePath) ? {
                uri: 'file://' + this.state.cachedImagePath
            } : this.props.source;
        let key = source.uri;
        return this.props.renderImage({
            ...props,
            style,
            source,
            key
        });
    }

    renderLoader() {
        let imageProps = getImageProps(this.props);
        let imageStyle = [this.props.style, styles.loaderPlaceholder];

        let activityIndicatorProps = _.omit(this.props.activityIndicatorProps, ['style']);
        let activityIndicatorStyle = this.props.activityIndicatorProps.style || styles.loader;

        let source = this.props.defaultSource;

        // if the imageStyle has borderRadius it will break the loading image view on android
        // so we only show the ActivityIndicator
        if (Platform.OS === 'android' && flattenStyle(imageStyle).borderRadius) {
            return (
                <ActivityIndicator
                    {...activityIndicatorProps}
                    style={[imageStyle, activityIndicatorStyle]}/>
            );
        }
        // otherwise render an image with the defaultSource with the ActivityIndicator on top of it
        return (
            <ImageBackground
                {...imageProps}
                source={source}
                style={imageStyle}>
                <ActivityIndicator
                    {...activityIndicatorProps}
                    style={activityIndicatorStyle}/>
            </ImageBackground>
        );
    }
};

/**
 * Same as ReactNaive.Image.getSize only it will not download the image if it has a cached version
 * @param uri
 * @param success
 * @param failure
 * @param options
 */
CachedImage.getSize = function getSize(uri, success, failure, options) {
    if (ImageCacheProvider.isCacheable(uri)) {
        ImageCacheProvider.getCachedImagePath(uri, options)
            .then(imagePath => {
                if (Platform.OS === 'android') {
                    imagePath = 'file://' + imagePath;
                }
                Image.getSize(imagePath, success, failure);
            })
            .catch(err => {
                Image.getSize(uri, success, failure);
            });
    } else {
        Image.getSize(uri, success, failure);
    }
};

module.exports = CachedImage;
module.exports.ImageCacheProvider = ImageCacheProvider;
