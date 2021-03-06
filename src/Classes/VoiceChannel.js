const GuildChannel = require('./GuildChannel');
const request = require('../Connection');
const Collection = require('./Collection');

/**
 * This class represents a Voice Channel
 * @extends {GuildChannel} 
 */

class VoiceChannel extends GuildChannel {
  constructor(raw, guild, client) {
    super(raw, guild, client);

    /**
     * The type of channel
     * @type {String}
     */

    this.type = 'voice';
    
    /**
     * The bitrate of the call
     * @type {Number}
     */

    this.bitrate = raw.bitrate;

    /**
     * The limit of the users in the call
     * @type {Number}
     */

    this.userLimit = raw.user_limit;

  }

  /**
   * @description Sets the bitrate of the channel
   * @param {Number} bitrate The bitrate of the channel
   * @returns {Promise<GuildChannel>} Returns a promise and a Guild Channel
   */

  setBitrate(bitrate) {
    return new Promise((res) => {
      request.req('PATCH', `/channels/${this.id}`, {
        bitrate: bitrate
      }, this.client.token).then(m => {
        const channel = new this.constructor(m, this.guild, this.client);
        this.guild.channels.set(channel.id, channel);
        this.client.channels.set(channel.id, channel);
        setTimeout(res, 100, res(channel));
      });
    });
  }

  /**
   * @description Sets the user limit of the channel
   * @param {Number} limit The user limit of the channel
   * @returns {Promise<GuildChannel>} Returns a promise and a Guild Channel
   */

  setUserLimit(limit) {
    return new Promise((res) => {
      request.req('PATCH', `/channels/${this.id}`, {
        user_limit: Number(limit)
      }, this.client.token).then(m => {
        const channel = new this.constructor(m, this.guild, this.client);
        this.guild.channels.set(channel.id, channel);
        this.client.channels.set(channel.id, channel);
      });
    });
  }

}

module.exports = VoiceChannel;

// THIS CLASS IS WORK IN PROGRESS