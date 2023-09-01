const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // finds all categories
  // including associated products
  try {
    const categoryData = await Category.findAll({
      include: [{ 
        model: Product,
        required: false  // enables LEFT JOIN, thereby including categories without products
       }],
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // finds one category by its `id` value
  // and includes any associated products
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{
         model: Product, 
         required: false  // enables LEFT JOIN, thereby including categories without associated products
        }]
    });
    if (!categoryData) {
      res.status(404).json({ message: 'No such category id' });
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // creates a new category
  try {
    const categoryData = await Category.create({
      category_name: req.body.category_name
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // updates a category by its `id` value
  try {
    const categoryUpdateResult = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!categoryUpdateResult[0]) {
      res.status(404).json({ message: 'No such category id' });
      return;
    }
    res.status(200).json(categoryUpdateResult);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!categoryData) {
      res.status(404).json({ message: 'No such category id' });
    } else {
      res.status(200).json(categoryData);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
