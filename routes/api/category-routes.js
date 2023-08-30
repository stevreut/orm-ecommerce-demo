const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findAll({
      include: [{ 
        model: Product,
        required: false  // enables LEFT JOIN, thereby showing categories without products
       }],
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{
         model: Product, 
         required: false  // enables LEFT JOIN, thereby showing categories without associated products
        }]
    });
    if (!categoryData) {
      res.status(404).json({ message: 'No category with this id found!' });
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const categoryData = await Category.create({
      category_name: req.body.category_name
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(400).json(err);  // TODO - should this be a 400?
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    console.log ('put body = ', req.body);
    console.log ('put id req.params.id = ', req.params.id);
    const categoryUpdateResult = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    console.log('put categoryUpdateResult = ', categoryUpdateResult);
    if (!categoryUpdateResult[0]) {
      res.status(404).json({ message: 'No category was found with requested id!' });  // TODO - is this a good return response (404)?
      return;
    }
    res.status(200).json(categoryUpdateResult);  // TODO - This is just '1' (numeric).  It follows the examples, but is it OK?
  } catch (err) {
    res.status(500).json(err.message);  // TODO - 500?  Get rid of ".message"
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  console.log('del this.id = ', this.id);
  console.log('del req.params = ', req.params);
  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id
      }
    });
    console.log('del categoryData = ', categoryData);
    if (!categoryData) {
      console.log('del cat when falsy', categoryData);
      res.status(404).json({ message: 'No category with specified ID was found to be deleted!' });
    } else {
      res.status(200).json(categoryData);
      console.log('del cat when truthy ', categoryData);
    }
  } catch (err) {
    res.status(500).json(err);  // TODO - 500?
  }
});

module.exports = router;
