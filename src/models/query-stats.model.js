function reduceAggregate(arr) {
  return arr.reduce((acc, { _id, count }) => {
    const rec = {};
    rec[_id] = { total: count };
    return Object.assign({}, acc, rec);
  }, {});
}

function reduceAggregateSubfield(fieldName, obj, arr) {
  return arr.reduce((acc, { _id: { grade, description }, count }) => {
    acc[description][fieldName] = acc[description][fieldName] || {};
    acc[description][fieldName][grade] = count;
    return acc;
  }, obj);
}

class RestaurantStats {
  constructor(json) {
    this.skip = json.skip;
    this.limit = json.limit;
    this.total = json.total;
    this.grades = reduceAggregate(json.grades);
    this.descriptions = reduceAggregate(json.descriptions);
    this.descriptions = reduceAggregateSubfield('grades', this.descriptions, json.descriptionsGrades);
  }

}

export default RestaurantStats;
