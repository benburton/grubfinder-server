import titleize from './titleize';

describe('#titleize', () => {

  describe('BROOKLYN', () => {
    it(`should return 'Brooklyn'`, () => {
      expect(titleize('BROOKLYN')).toEqual('Brooklyn');
    });
  });

  describe('STATEN ISLAND', () => {
    it(`should return 'Staten Island`, () => {
      expect(titleize('STATEN ISLAND')).toEqual('Staten Island');
    });
  });

});
