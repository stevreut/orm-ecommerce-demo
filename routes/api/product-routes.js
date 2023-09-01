const { Op } = require("sequelize");

const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// gets all products
router.get('/', async (req, res) => {
  // finds all products including their associated 
  // category and tag data
  try {
    const productData = await Product.findAll({
      include: [
        { 
          model: Category,
          required: false   // enables LEFT JOIN - thus products with or without categories
        },
        {
          model: Tag,
          required: false   // enables LEFT JOIN - thus products with or without tags
        }
      ],
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // finds a single product by its `id` and includes associated
  // category and tag data
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [
        {
         model: Category, 
         required: false  // enables LEFT JOIN, thereby showing products without categories
        },
        {
          model: Tag,
          required: false // enables LEFT JOIN, thereby showing products without tags
        }
      ]
    });
    if (!productData) {
      res.status(404).json({ message: 'No such product id' });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', (req, res) => {
  // Expects a request in the form of the following
  //
  //  {
  //    "product_name": "Basketball",
  //    "price": 200.00,
  //    "stock": 3,
  //    "tagIds": [1, 2, 3, 4]
  //  }
  //
  Product.create(req.body)
    .then((product) => {
      // if there are product tags then we need to create pairings to
      // bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        // Use 'map' to transform the array tagIds to an array of 
        // objects tieing product_id and tag_id, enabling the
        // creation of appropriate ProductTag bridge entries.
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        // Create the ProductTag bridge entries from the constructed
        // array of linking objects.
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put('/:id', async (req, res) => {
  // update product data from request
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // When product record creation is successful, create ProductTag entries
      // based on the tagIds array in the request, unless it is missing or empty.
      if (req.body.tagIds && req.body.tagIds.length) {
        // Retrieve all current ProductTag entries matching the product_id.
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids consisting of only the
          // tag_ids which of only the tag_ids in the request which do
          // not occur in productTags.
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // Figure out which ones to remove by creating a list of current
          // ProductTag entries which do not match any of the tag_ids in the
          // request.
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ product_id }) => product_id);
          // run both actions
          return Promise.all([

            // Delete the ProductTag entries which do not correspond to the
            // request's tag_ids.
            ProductTag.destroy(
              {
                where: {
                  product_id: productTagsToRemove,
                  tag_id: {
                    [Op.notIn]: req.body.tagIds  // effective an SQL "NOT IN" operator
                  }
                }
              }),

            // Create ProductTag entires for tag_ids in the request which had
            // not previously had corresponding ProductTag entries.
            ProductTag.bulkCreate(newProductTags),

          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!productData) {
      res.status(404).json({ message: 'No such product id' });
    } else {
      res.status(200).json(productData);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
