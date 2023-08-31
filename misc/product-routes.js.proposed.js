const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  console.log('get prod all');
  try {
    const productData = await Product.findAll({
      include: [
        { 
          model: Category,
          required: false 
        },
        {
          model: Tag,
          required: false
        }
      ],
    });
    console.log('get prod productData = ', productData);
    // TODO - *Tag* data is still to-do
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [
        {
         model: Category, 
         required: false  // enables LEFT JOIN, thereby showing products without categories
        },
        {
          model: Tag,
          required: false  // TODO - LEFT JOIN, ...
        }
      ]
    });
    if (!productData) {
      res.status(404).json({ message: 'No product with this id found!' });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  try {
    const product = await Product.create(req.body);
    if (!product) {
      res.status(404).json({ message: 'Unable to create product' });
      return;
    }
    // if there's product tags, we need to create pairings to bulk create in the ProductTag model
    if (req.body.tagIds && req.body.tagIds.length) {  // TODO 
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
      const prodTags = await ProductTag.bulkCreate(productTagIdArr);
      res.status(200).json(prodTags);
    }
    res.status(200).json(product);
    // TODO - do we need a return here
  } catch(err) {
      console.log(err);
      res.status(400).json(err);
    }
});

// update product
// TEMPORARILY commenting out the original router.put('/:id') code to be
// replaced with the code slacked by Brian.  TODO - ultimate to be deleted
//--------
// router.put('/:id', (req, res) => {
//   // update product data
//   Product.update(req.body, {
//     where: {
//       id: req.params.id,
//     },
//   })
//     .then((product) => {
//       if (req.body.tagIds && req.body.tagIds.length) {
        
//         ProductTag.findAll({
//           where: { product_id: req.params.id }
//         }).then((productTags) => {
//           // create filtered list of new tag_ids
//           const productTagIds = productTags.map(({ tag_id }) => tag_id);
//           const newProductTags = req.body.tagIds
//           .filter((tag_id) => !productTagIds.includes(tag_id))
//           .map((tag_id) => {
//             return {
//               product_id: req.params.id,
//               tag_id,
//             };
//           });

//             // figure out which ones to remove
//           const productTagsToRemove = productTags
//           .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
//           .map(({ id }) => id);
//                   // run both actions
//           return Promise.all([
//             ProductTag.destroy({ where: { id: productTagsToRemove } }),
//             ProductTag.bulkCreate(newProductTags),
//           ]);
//         });
//       }

//       return res.json(product);
//     })
//     .catch((err) => {
//       // console.log(err);
//       res.status(400).json(err);
//     });
// });
//--------
// Brian's code follows (pending change changes) ( TODO )
//--------
router.put('/:id', async (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });

            // figure out which ones to remove
          const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ product_id }) => product_id);
                  // run both actions
          return Promise.all([
            
            ProductTag.destroy({ where: { product_id: productTagsToRemove, tag_id: { [Op.ne]: req.body.tagIds} } }),
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


router.delete('/:id', (req, res) => {
  // delete one product by its `id` value
});

module.exports = router;