const db = require('../../db');
const uuid = require('uuid');

/**
 * @swagger
 * /api/pricing-adjustment/based-on-price:
 *   get:
 *     summary: Get based prices for products
 *     parameters:
 *       - in: query
 *         name: basedOnId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the pricing profile to base prices on
 *       - in: query
 *         name: productIds
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         required: true
 *         description: Array of product IDs to get based prices for
 *     responses:
 *       200:
 *         description: Successfully retrieved based prices
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "5f5d423a-eeb6-4e59-a8b3-9b557d8126b3"
 *                       basedPrice:
 *                         type: number
 *                         example: 100.00
 *       422:
 *         description: Invalid data provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid data provided
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

const getBasedOnPrice = async (req, res) => {
  try {
    const data = req.body;

    const isGlobalPrice = (data.basedOnId === 'Global' || !data.basedOnId) // We can use null as well

    const { productIds = [] } = data;
    if (!productIds) {
      res.status(422).json({ message: 'Invalid data provided' });
    }

    const basedPrices = productIds.map(id => {
      const product = db.products.find((product) => product.id === id);

      if (!product) {
        return false;
      }

      if (isGlobalPrice) {
        return {
          id,
          basedPrice: product.wholesalePrice
        }
      }

      const existingPricingAdjustment = db.pricingAdjustment.find(adjustment => adjustment.pricingProfileId === data.basedOnId && adjustment.productId === id);

      if (!existingPricingAdjustment) {
        return {
          id,
          basedPrice: product.wholesalePrice
        }
      }
      return {
        id,
        basedPrice: existingPricingAdjustment.price
      }
      
    }).filter(Boolean);

    res.status(200).json({ message: 'Success', data: basedPrices });

  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * @swagger
 * /api/pricing-adjustment:
 *   post:
 *     summary: Create a pricing adjustment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pricingProfileId:
 *                 type: string
 *                 description: ID of the pricing profile
 *                 example: "2f95f50e-4de0-4f4f-882b-c7d20f5a1e21"
 *               productId:
 *                 type: string
 *                 description: ID of the product
 *                 example: "5f5d423a-eeb6-4e59-a8b3-9b557d8126b3"
 *               adjustmentValue:
 *                 type: number
 *                 description: Adjustment value
 *                 example: 10.00
 *     responses:
 *       200:
 *         description: Successfully created a pricing adjustment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "5f5d423a-eeb6-4e59-a8b3-9b557d8126b3"
 *                     price:
 *                       type: number
 *                       example: 110.00
 *       400:
 *         description: Invalid data provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid data provided
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

const create = async (req, res) => {
  try {
    const data = req.body;
    const { pricingProfileId, productId, adjustmentValue } = data;
    const pricingProfile = db.pricingProfile.find(profile => profile.id === pricingProfileId);

    if (!pricingProfile) {
      return res.status(400).json({ message: 'Invalid data provided' });
    }

    const existingProduct = db.products.find(product => product.id === productId);
    if (!existingProduct) {
      return res.status(400).json({ message: 'Invalid data provided' });
    }

    const { adjustmentIncrement, adjustmentMode, basedOnId } = pricingProfile;

    const existingProductPriceAdjustment = db.pricingAdjustment.find(adjustment => adjustment.productId === productId && adjustment.pricingProfileId === basedOnId);
    
    const pricingAdjustmentData = {
      productId,
      pricingProfileId,
      basedPrice: !existingProductPriceAdjustment ? existingProduct.wholesalePrice : existingProductPriceAdjustment.price,
      adjustmentValue
    };

    let change = adjustmentValue;
    if (adjustmentMode === 'dynamic') {
     change = ((adjustmentValue / 100) * pricingAdjustmentData.basedPrice).toFixed(2);
    }
    pricingAdjustmentData.price = adjustmentIncrement === 'increase' ?
     (Number(pricingAdjustmentData.basedPrice) + Number(change)).toFixed(2) :
     (pricingAdjustmentData.basedPrice - change).toFixed(2)

    const existingAdjustmentIndex = db.pricingAdjustment.findIndex(
      adjustment => adjustment.productId === productId && pricingProfileId === adjustment.pricingProfileId
    );

    // If price adjustment for the product is not present then will create a new one.
    if (existingAdjustmentIndex === -1) {
      pricingAdjustmentData.id = uuid.v4();
      db.pricingAdjustment.push(pricingAdjustmentData);
    }

    if (existingAdjustmentIndex !== -1) {
      db.pricingAdjustment[existingAdjustmentIndex] = {
        ...db.pricingAdjustment[existingAdjustmentIndex],
        ...pricingAdjustmentData
      }
    };
    return res.status(200).json({ message: 'Success', data: {
      productId,
      price: pricingAdjustmentData.price
      },
      db
    });

  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// const getPriceTable = async (req, res) => {
//   try {
//     const { products, adjustmentMode, adjustmentIncrement } = req.body;

//     const priceTable = products.map(p => {
//       const product = db.products.find(product => product.id === p.id);

//       if (!product) {
//         return false;
//       }
//       let change = p.adjustmentValue;
//        if (adjustmentMode === 'dynamic') {
//         change = ((p.adjustmentValue / 100) * p.basedPrice).toFixed(2);
//        }

//        return {
//         id: p.id,
//         price: adjustmentIncrement === 'increase' ? (Number(p.basedPrice) + Number(change)).toFixed(2) : (p.basedPrice - change).toFixed(2)
//        };
//     }).filter(Boolean)
//     res.status(200).json({ message: 'Success', data: priceTable });
//   } catch (error) {
//     res.status(500).json({ message: 'Internal server error' });
//   }
// }

/**
 * @swagger
 * /api/pricing-adjustment/{id}:
 *   delete:
 *     summary: Delete a pricing adjustment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the pricing adjustment to delete
 *     responses:
 *       201:
 *         description: Successfully deleted the pricing adjustment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "2f95f50e-4de0-4f4f-882b-c7d20f5a1e21"
 *                       pricingProfileId:
 *                         type: string
 *                         example: "5f5d423a-eeb6-4e59-a8b3-9b557d8126b3"
 *                       productId:
 *                         type: string
 *                         example: "5f5d423a-eeb6-4e59-a8b3-9b557d8126b3"
 *                       basedPrice:
 *                         type: number
 *                         example: 100.00
 *                       adjustmentValue:
 *                         type: number
 *                         example: 10.00
 *                       price:
 *                         type: number
 *                         example: 110.00
 *       401:
 *         description: Input is not valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Input is not valid
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

const deleteAdjustment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(401).json({ message: 'Input is not valid' });
    }


    db.pricingAdjustment = db.pricingAdjustment.filter(adjustment => adjustment.id !== id);
    res.status(201).json({ message: 'Success', data: db.pricingAdjustment });

  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * @swagger
 * /api/pricing-adjustment:
 *   get:
 *     summary: Get all price adjustments for a pricing profile
 *     parameters:
 *       - in: query
 *         name: pricingProfileId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the pricing profile to get adjustments for
 *     responses:
 *       201:
 *         description: Successfully retrieved price adjustments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "2f95f50e-4de0-4f4f-882b-c7d20f5a1e21"
 *                       pricingProfileId:
 *                         type: string
 *                         example: "5f5d423a-eeb6-4e59-a8b3-9b557d8126b3"
 *                       productId:
 *                         type: string
 *                         example: "5f5d423a-eeb6-4e59-a8b3-9b557d8126b3"
 *                       basedPrice:
 *                         type: number
 *                         example: 100.00
 *                       adjustmentValue:
 *                         type: number
 *                         example: 10.00
 *                       price:
 *                         type: number
 *                         example: 110.00
 *                       title:
 *                         type: string
 *                         example: Product Title
 *                       sku:
 *                         type: string
 *                         example: ABC123
 *                       category:
 *                         type: string
 *                         example: Electronics
 *       401:
 *         description: Input is not valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Input is not valid
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

const getAllPriceAdjustment = async (req, res) => {
  try {
    const data = req.body;

    if (!data.pricingProfileId) {
      return res.status(401).json({ message: 'Input is not valid' });
    }

    const priceAdjustments = db.pricingAdjustment.filter(adjustment => adjustment.pricingProfileId === data.pricingProfileId);

    const updatedPriceAdjustments = priceAdjustments.map(adjustment => {
      const product = db.products.find(product => product.id === adjustment.productId);
      return {
        ...adjustment,
        title: product.title,
        sku: product.sku,
        category: product.category
      }
    });
    return res.status(201).json({ message: 'Success', data: updatedPriceAdjustments });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
    getBasedOnPrice,
    deleteAdjustment,
    getAllPriceAdjustment,
    create
}

