const request = require('../Connection');
const Guild = require('../Classes/Guild');


/**
 * This class represents a message object
 */

class Message {
  constructor(raw, client) {

    /**
     * The ID of the message sent
     * @type {String}
     */

    this.id = raw.id;

    /**
     * The channel the message was sent in
     * @type {TextChannel}
     */

    this.channel = raw.channel;

    /**
     * The guild the message was sent it
     * @type {Guild}
     */

    this.guild = raw.guild;

    /** 
     * The user object of the person who sent the message
     * @type {UserObject}
     */

    this.author = raw.author;

    /**
     * The guild member object of the person who sent the message
     * @type {MemberObject}
     */

    this.member = raw.member;

    /**
     * The clean content of the message which replaces <@id> to @Youssef#0001 for example
     * @type {String}
     */

    this.clean = raw.clean;

    /**
     * The client object which is logged in
     * @type {Client}
     */

    this.client = client;

    /**
     * A formated date in which the message was created at
     * @type {Date}
     */

    this.createdAt = raw.createdAt;

    /**
     * A collection of all of the users mentioned in the message
     * @type {Collection<ID, User>}
     */

    this.mentionedUsers = raw.mentionedUsers;
    

    /**
     * The content of the message
     * @type {String}
     */

    this.content = raw.content;

  }

  /**
   * @description This method will reply by mentioning the user first
   * @param {String} content The string to send the message with
   * @returns {Promise<Message>} Returns a promise and discord message
   */

  reply(content) {
    return new Promise((res) => {
      request.req('POST', `/channels/${this.channel.id}/messages`, {
        content: `<@${this.author.id}>, ${content}`
      }, this.client.token).then(m => {
        setTimeout(res, 100, res(this.client.message_methods().fromRaw(m)));
      }).catch(error => {
        if (error.status === 403) throw new Error('Missing Permissions');
      });        
    });
  }

  /**
   * @description This method will delete a message
   * @param {String} [reason = ''] The reason why the message is deleted
   * @returns {Promise<Message>} Returns a promise and the message deleted
   */

  delete(reason = '') {
    return new Promise((res) => {
      request.req('DELETE', `/channels/${this.channel.id}/messages/${this.id}`, {reason: reason} , this.client.token).then(m => {
        setTimeout(res, 100, res(this.client.message_methods().fromRaw(m)));
      }).catch(error => {
        if (error.status === 403) throw new Error('Missing Permissions');
      });
    });
  }

  /**
    * @description This method will edit a message sent by the client
    * @param {String} newmessage The string to edit the current message with
    * @returns {Promise<Message>} Returns a promise and discord message
    */

  edit(newmessage) {
    return new Promise((res) => {
      request.req('PATCH', `/channels/${this.channel.id}/messages/${this.id}`, {content: newmessage} , this.client.token).then(m => {
        setTimeout(res, 100, res(this.client.message_methods().fromRaw(m)));
      }).catch(error => {
        if (error.status === 403) throw new Error('Missing Permissions');
      });
    });
  }

  /**
    * @description This method will pin a discord message in a channel
    * @returns {Promise<Message>} Returns a promise and discord message (pin)
    */

  pin() {
    return new Promise((res) => {
      request.req('POST', `/channels/${this.channel.id}/pins/${this.id}`, {} , this.client.token).then(m => {
        setTimeout(res, 100, res(this.client.message_methods().fromRaw(m)));
      }).catch(error => {
        if (error.status === 403) throw new Error('Missing Permissions');
      });
    });
  }

  /**
    * @description This method will unpin a discord message in a channel
    * @returns {Promise<Message>} Returns a promise and discord message (unpinned message)
    */

  unpin() {
    return new Promise((res) => {
      request.req('DELETE', `/channels/${this.channel.id}/pins/${this.id}`, {} , this.client.token).then(m => {
        setTimeout(res, 100, res(this.client.message_methods().fromRaw(m)));
      }).catch(error => {
        if (error.status === 403) throw new Error('Missing Permissions');
      });
    });
  }

  /**
    * @description This method will make the client react to a message
    * @param {Emoji} emoji The unicode emoji or the emoji id if it's custom
    */

  react(emoji) {
    let reaction;
    if (encodeURI(emoji) !== emoji) reaction = encodeURI(emoji);
    return new Promise((res) => {
      request.req('PUT', `/channels/${this.channel.id}/messages/${this.id}/reactions/${reaction}/@me`, {}, this.client.token).then(m => {
        setTimeout(res, 100, res(this.client.message_methods().fromRaw(m)));
      }).catch(error => {
        if (error.status === 403) throw new Error('Missing Permissions');
      });
    });
  }

  /**
    * @description This method checks if a user is mentioned
    * @param {String} id The id of the user to be checked
    * @returns {Boolean} If the id given belonged to a mentioned user, it will return true, vice versa
    */

  isMentioned(id) {
    if (this.mentionedUsers.exists('id', id)) return true;
    else return false;
  }
}

module.exports = Message;