'use strict';

import * as stringify from '@bem/sdk.naming.entity.stringify';
import * as presets from '@bem/sdk.naming.presets';

export type convention = 'origin' | 'react' | 'two-dashes';

interface entity {
  block: string,
  elem?: string,
  mod?: {
    name: string,
    val: boolean | string
  }
};

class BemNamingEntity {
  naming: {
    stringify: Function
  };
  entity: entity;
  entityMods: {
    [propName: string] : boolean | string
  };
  entityMixes: Array<string|BemNamingEntity>;

  /**
   * @param block — block name.
   * @param stringify — stringify function
   * @param preset — convention
   */
  constructor(block: string, stringify: Function, preset: convention = 'origin') {
    this.naming = { stringify: stringify(presets[preset]) };
    this.entity = { block };
    this.entityMods = {};
    this.entityMixes = [];
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
   */
  e(elem: string): BemNamingEntity {
    this.entity.elem = elem;
    return this;
  }
  /**
   * Set entity mods.
   *
   * @param mods — entity mixes.
   *
   * @example
   * const b = require('easy-bem-naming')();
   *
   * const entity = b('block').m({ m1: 'v1', m2: 'v2' });
   *
   * entity.toString(); // ➜ block block_m1_v1 block_m2_v2
   */
  m(mods: object): BemNamingEntity {
    this.entityMods = {...this.entityMods, ...mods };
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
   */
  mix(mixes: Array<string|BemNamingEntity>): BemNamingEntity {
    this.entityMixes = this.entityMixes.concat(
      mixes && mixes.length ? mixes : Array.prototype.slice.call(arguments, 0)
    );
    return this;
  }
  /**
   * Returns entities list.
   */
  entities(): Array<entity|string> {
    let all = Object.keys(this.entityMods).reduce((accum: Array<entity|string>, modName: string) => {
      // dont push { block: 'b', elem: 'e', mod: { name: 'm', val: false } }
      this.entityMods[modName] && accum.push({
          block: this.entity.block,
          elem: this.entity.elem,
          mod: {
            name: modName,
            val: this.entityMods[modName]
          }
      });
      return accum;
    }, [this.entity]);

    return this.entityMixes.reduce((accum: Array<entity|string>, mix:string|BemNamingEntity) => {
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
  stringify() : string {
    const entities = this.entities();
    return entities.map(entity =>
      typeof entity === 'string' ? entity : this.naming.stringify(entity)
    ).join(' ');
  }
  /**
   * Returns string representing the entity.
   */
  toString(): string {
    return this.stringify();
  }
  /**
   * Returns string representing the entity. Is needed for debug in Node.js.
   *
   * In some browsers `console.log()` calls `valueOf()` on each argument.
   * This method will be called to get custom string representation of the object.
   */
  valueOf(): string {
    return this.stringify();
  }

}

export default function(preset: convention): Function {
  return (block: string) => new BemNamingEntity(block, stringify, preset);
};
