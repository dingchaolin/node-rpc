let config = function( subscribe_channel_number = 3){
    let subscribe_channels = [],
        return_channels = [];
    for( let i = 1; i < subscribe_channel_number; i ++ ){
        subscribe_channels.push("" + i);
        return_channels.push("" + (0-i));
    }
    return {
        subscribe_channels,
        return_channels
    }

}

let getConfig = function ( subscribe_channel_number, index  ) {
    let configs = config(subscribe_channel_number);
    let ret = [].concat(configs.subscribe_channels, configs.return_channels[index])
    return ret;
}

exports.getConfig =  getConfig;

