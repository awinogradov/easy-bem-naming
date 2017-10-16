'use strict';

const stringify = require('@bem/sdk.naming.entity.stringify');
const presets = require('@bem/sdk.naming.presets');

class BemNamingEntity {
  /**
   * @param {Object} block — block name.
   * @param {Function} stringify — stringify function
   * @param {Object} preset — convention
   */
  constructor(block, stringify, preset) {
    this._bemNaming = { stringify: stringify(presets[preset || 'origin']) };
    this._entity = { block };
    this._entityMods = {};
    this._entityMixes = [];
  }
  /**
   * Set element name.
   *
   * @example
   * const b = require('easy-bem-naming')();
   *
   * const entity = b('block').e('elem');
   *
   * entity.toString(); // ➜ block__elem
   *
   * @returns {BemNamingEntity} entity instance.
   */
  e(elem) {
    this._entity.elem = elem;
    return this;
  }
  /**
   * Set entity mods.
   *
   * @param {Object} mods — entity mixes.
   *
   * @example
   * const b = require('easy-bem-naming')();
   *
   * const entity = b('block').m({ m1: 'v1', m2: 'v2' });
   *
   * entity.toString(); // ➜ block block_m1_v1 block_m2_v2
   *
   * @returns {BemNamingEntity} entity instance.
   */
  m(mods) {
    this._entityMods = Object.assign({}, this._entityMods, mods);
    return this;
  }
  /**
   * Set entity mixes.
   *
   * @example
   * const b = require('easy-bem-naming')();
   *
   * const entity = b('block').mix('mixedBlock1', b('mixedBlock2').elem('elem'));
   *
   * entity.toString(); // ➜ block mixedBlock1 mixedBlock2__elem
   *
   * @returns {BemNamingEntity} entity instance.
   */
  mix(mixes) {
    this._entityMixes = this._entityMixes.concat(
      mixes && mixes.length ? mixes : Array.prototype.slice.call(arguments, 0)
    );
    return this;
  }
  /**
   * Returns entities list.
   *
   * @returns {Array<Object>} array of entities in BemEntityName format.
   */
  entities() {
    let all = Object.keys(this._entityMods).reduce((accum, modName) => {
      // dont push { block: 'b', elem: 'e', mod: { name: 'm', val: false } }
      this._entityMods[modName] && accum.push(Object.assign({}, this._entity, {
          mod: { name: modName, val: this._entityMods[modName] }
      }));
      return accum;
    }, [this._entity]);

    return this._entityMixes.reduce((accum, mix) => {
      if(typeof mix === 'string') {
        return accum.concat(mix);
      }

      if(mix instanceof BemNamingEntity) {
        return accum.concat(mix.entities());
      }

      return accum;
    }, all);
  }
  /**
   * Returns className string.
   *
   * @returns {String} entity className string.
   */
  stringify() {
    const entities = this.entities();
    return entities.map(entity =>
      typeof entity === 'string' ? entity : this._bemNaming.stringify(entity)
    ).join(' ');
  }
  /**
   * Returns string representing the entity.
   *
   * @returns {String}
   */
  toString() {
    return this.stringify();
  }
  /**
   * Returns string representing the entity. Is needed for debug in Node.js.
   *
   * In some browsers `console.log()` calls `valueOf()` on each argument.
   * This method will be called to get custom string representation of the object.
   *
   * @returns {String} entity className string.
   */
  valueOf() {
    return this.stringify();
  }

}
/**
 * @param {String} preset – convention.
 * @param {options} block — entity block name.
 *
 * @returns {BemNamingEntity} entity instance.
 */
module.exports = preset => block => new BemNamingEntity(block, stringify, preset);
