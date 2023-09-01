const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findAll({
      include: [{ 
        model: Product,
        required: false  // enables LEFT JOIN, thereby showing tags without products
       }],
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  console.log('tag get entry point');
  try {
    console.log('tag get try');
    console.log('tag get - req.params = ', req.params);
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{
         model: Product, 
         required: false  // enables LEFT JOIN, thereby showing tags without associated products
        }]
    });
    console.log('tag get complete');
    console.log('tag data = ', tagData);
    if (!tagData) {
      res.status(404).json({ message: 'No tag with this id found!' });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', (req, res) => {
  // create a new tag
  /* req.body should look like this...
    {
      tag_name: "aquamarine",
      productIds: [1, 2, 3, 4]
    }
  */
    Tag.create(req.body)
    .then((tag) => {
      // if there's tag tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.productIds.length) {
        const productTagIdArr = req.body.productIds.map((prod_id) => {
          return {
            product_id: prod_id,
            tag_id: tag.id
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(tag);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });

});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    console.log ('put tag body = ', req.body);
    console.log ('put tag id req.params.id = ', req.params.id);
    const tagUpdateResult = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    console.log('put tagUpdateResult = ', tagUpdateResult);
    if (!tagUpdateResult[0]) {
      res.status(404).json({ message: 'No tag was found with requested id!' });  // TODO - is this a good return response (404)?
      return;
    }
    res.status(200).json(tagUpdateResult);  // TODO - This is just '1' (numeric).  It follows the examples, but is it OK?
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  console.log('del this.id = ', this.id);
  console.log('del req.params = ', req.params);
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });
    console.log('del tagData = ', tagData);
    if (!tagData) {
      console.log('del tag when falsy', tagData);
      res.status(404).json({ message: 'No tag with specified ID was found to be deleted!' });
    } else {
      res.status(200).json(tagData);
      console.log('del tag when truthy ', tagData);
    }
  } catch (err) {
    res.status(500).json(err);  // TODO - 500?
  }
});

module.exports = router;
