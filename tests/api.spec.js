const ebn = require('easy-bem-naming');
const b = ebn();

const s = entity => entity.toString();

it('Should stringify block', () => {
  expect(s(b('block'))).toBe('block');
});

it('Should stringify elem', () => {
  expect(s(b('block').e('elem'))).toBe('block__elem');
});

it('Should stringify block with mod', () => {
  expect(s(b('block').m({ m: 'v' }))).toBe('block block_m_v');
});

it('Should stringify block with mods', () => {
  expect(s(b('block').m({ m1: 'v1', m2: 'v2' })))
    .toBe('block block_m1_v1 block_m2_v2');
});

it('Should add elem to block with mods', () => {
  expect(s(b('block').m({ m1: 'v1', m2: 'v2' }).e('elem')))
    .toBe('block__elem block__elem_m1_v1 block__elem_m2_v2');
});

it('Should stringify elem with mods', () => {
  expect(s(b('block').e('elem').m({ m: 'v', a: undefined }))).toBe('block__elem block__elem_m_v');
});

it('Should override existing mods', () => {
  expect(s(b('block').m({ m1: 'v1', m2: 'v2' }).e('elem').m({ m2: 'v3'})))
    .toBe('block__elem block__elem_m1_v1 block__elem_m2_v3');
});

it('Should stringify string mix', () => {
  expect(s(b('block').mix('mixedBlock'))).toBe('block mixedBlock');
});

it('Should stringify array mix', () => {
  expect(s(b('block').mix(['mixedBlock1', b('mixedBlock2'), null]))).toBe('block mixedBlock1 mixedBlock2');
});

it('Should stringify BemEntity mix', () => {
  const mixedBlock = b('mixedBlock');
  expect(s(b('block').mix(mixedBlock))).toBe('block mixedBlock');
});

it('Should stringify many mixes with mods', () => {
  const mixedBlock1 = b('mixedBlock1');
  const mixedBlock3 = b('mixedBlock3').m({ m: 'v'});
  expect(s(b('block').mix(mixedBlock1, 'mixedBlock2').mix(mixedBlock3)))
    .toBe('block mixedBlock1 mixedBlock2 mixedBlock3 mixedBlock3_m_v');
});

it('Should stringify block with nested mixes', () => {
  const mixedBlock1 = b('mixedBlock1');
  const mixedBlock2 = b('mixedBlock2').e('elem').mix('nestedStringMix');
  const mixedBlock3 = b('mixedBlock3').mix(mixedBlock2);
  expect(s(b('block').mix(mixedBlock1, mixedBlock3)))
    .toBe('block mixedBlock1 mixedBlock3 mixedBlock2__elem nestedStringMix');
});

it('Should work with custom @bem/naming', () => {
  const cb = ebn('react');
  expect(s(cb('Block').m({ m1: 'v1', m2: 'v2' }).e('Elem')))
    .toBe('Block-Elem Block-Elem_m1_v1 Block-Elem_m2_v2');
});

it('Should return value', () => {
  expect(b('block').valueOf()).toBe('block');
});
