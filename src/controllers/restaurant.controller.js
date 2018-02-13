import Restaurant from '../models/restaurant.model';

async function list(request, response) {
  const descriptions = request.query.descriptions ? request.query.descriptions.split(',') : [];
  const grades = request.query.grades ? request.query.grades.split(',') : [];
  try {
    const skip = request.query.skip ? parseInt(request.query.skip, 10) : 0;
    const limit = request.query.limit ? parseInt(request.query.limit, 10) : 50;
    const stats = await Restaurant.stats({ descriptions, grades, skip, limit });
    const restaurants = await Restaurant.list({ descriptions, grades, skip, limit });

    response.json({ stats, restaurants });
  } catch (e) {
    response.status(500).send({ error: e });
  }
}

async function descriptions(request, response) {
  try {
    response.json(await Restaurant.descriptions());
  } catch (e) {
    response.status(500).send({ error: e });
  }
}

export default { list, descriptions };
