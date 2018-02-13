import { it } from 'jasmine-promise-wrapper';

import Restaurant from '../models/restaurant.model';

describe('list', () => {
  const restaurants = {'look': 'at', 'these': 'foods!'};

  beforeEach(() => {
    spyOn(Restaurant, 'list').and.returnValue({
      then: () => { return restaurants; }
    });

    it('is good', () => {

    });
  });
});
