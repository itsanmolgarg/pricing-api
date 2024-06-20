const uuid = require('uuid');
const db = require('../../db');
const { validateCreatePriceProfile } = require('./services');

/**
 * @swagger
 * components:
 *   schemas:
 *     PricingProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "2f95f50e-4de0-4f4f-882b-c7d20f5a1e21"
 *         name:
 *           type: string
 *           example: First
 *         description:
 *           type: string
 *           example: First Pricing Profile
 *         type:
 *           type: string
 *           example: multiple
 *         basedOnId:
 *           type: string
 *           nullable: true
 *           example: null
 *         adjustmentMode:
 *           type: string
 *           example: fixed
 *         adjustmentIncrement:
 *           type: string
 *           example: increase
 *         status:
 *           type: string
 *           example: draft
 */

/**
 * @swagger
 * /api/pricing-profile:
 *   post:
 *     summary: Create a new pricing profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the pricing profile
 *                 example: First
 *               description:
 *                 type: string
 *                 description: Description of the pricing profile
 *                 example: First Pricing Profile
 *               type:
 *                 type: string
 *                 description: Type of the pricing profile (e.g., single, multiple)
 *                 example: multiple
 *               basedOnId:
 *                 type: string
 *                 nullable: true
 *                 description: ID of another pricing profile this is based on (optional)
 *               adjustmentMode:
 *                 type: string
 *                 description: Mode of adjustment (fixed, dynamic, etc.)
 *                 example: fixed
 *               adjustmentIncrement:
 *                 type: string
 *                 description: Type of adjustment increment (increase, decrease)
 *                 example: increase
 *     responses:
 *       201:
 *         description: Successfully created a pricing profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   $ref: '#/components/schemas/PricingProfile'
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
const create = async (req, res) => {
    try {
      const data = req.body;

      const isValid = validateCreatePriceProfile(data);

      if (!isValid) {
        return res.status(401).json({ message: 'Input is not valid' });
      }

      const { description, type, basedOnId, adjustmentMode, adjustmentIncrement, status = 'draft', name } = data

      const pricingProfile = {
        id: uuid.v4(),
        name,
        description,
        type,
        basedOnId,
        adjustmentMode,
        adjustmentIncrement,
        status
      };

      db.pricingProfile = [...db.pricingProfile, pricingProfile];

      return res.status(201).json({ message: 'Success', data: pricingProfile });
      } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
      }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     PricingProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "2f95f50e-4de0-4f4f-882b-c7d20f5a1e21"
 *         name:
 *           type: string
 *           example: First
 *         description:
 *           type: string
 *           example: First Pricing Profile
 *         type:
 *           type: string
 *           example: multiple
 *         basedOnId:
 *           type: string
 *           nullable: true
 *           example: null
 *         adjustmentMode:
 *           type: string
 *           example: fixed
 *         adjustmentIncrement:
 *           type: string
 *           example: increase
 */

/**
 * @swagger
 * /api/pricing-profile/{id}:
 *   put:
 *     summary: Update an existing pricing profile
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the pricing profile to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PricingProfile'
 *     responses:
 *       201:
 *         description: Successfully updated the pricing profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   $ref: '#/components/schemas/PricingProfile'
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
const update = async (req, res) => {
  try {
    const data = req.body;
    const { id } = req.params;
    const isValid = validateCreatePriceProfile(data);

    if (!isValid) {
      return res.status(401).json({ message: 'Input is not valid' });
    }

    const priceProfileIndex = db.pricingProfile.findIndex(profile => profile.id === id);

    if (priceProfileIndex === -1) {
      return res.status(400).json({ message: 'Invalid data provided' });
    }

    const { description, type, basedOnId, adjustmentMode, adjustmentIncrement, name } = data


    const dataToUpdate = {
      name,
      description,
      type,
      basedOnId,
      adjustmentMode,
      adjustmentIncrement,
    };

    const updatedPricingProfile = {
      ...db.pricingProfile[priceProfileIndex],
      ...dataToUpdate
    };

    db.pricingProfile[priceProfileIndex] = updatedPricingProfile;
  
    return res.status(201).json({ message: 'Success', data: updatedPricingProfile });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
}

/**
 * @swagger
 * /api/pricing-profile/all:
 *   get:
 *     summary: Retrieve all pricing profiles with adjustments
 *     responses:
 *       200:
 *         description: Successfully retrieved all pricing profiles with adjustments
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
 *                       name:
 *                         type: string
 *                         example: First
 *                       description:
 *                         type: string
 *                         example: First Pricing Profile
 *                       type:
 *                         type: string
 *                         example: multiple
 *                       basedOnId:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       adjustmentMode:
 *                         type: string
 *                         example: fixed
 *                       adjustmentIncrement:
 *                         type: string
 *                         example: increase
 *                       pricingAdjustments:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             productId:
 *                               type: string
 *                               example: "5f5d423a-eeb6-4e59-a8b3-9b557d8126b3"
 *                             pricingProfileId:
 *                               type: string
 *                               example: "2f95f50e-4de0-4f4f-882b-c7d20f5a1e21"
 *                             basedPrice:
 *                               type: number
 *                               example: 100.00
 *                             adjustmentValue:
 *                               type: number
 *                               example: 10.00
 *                             price:
 *                               type: number
 *                               example: 110.00
 *                             product:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: string
 *                                   example: "5f5d423a-eeb6-4e59-a8b3-9b557d8126b3"
 *                                 name:
 *                                   type: string
 *                                   example: Product Name
 */

const getAll = async (req, res) => {
  try {
    const pricingProfiles = db.pricingProfile;
    const response = pricingProfiles.map(profile => {
      const filteredAdjustments = db.pricingAdjustment.filter(adjustment => adjustment.pricingProfileId === profile.id);

      const pricingAdjustments = filteredAdjustments.map(adjustment => {
        const product = db.products.find(p => p.id === adjustment.productId);
        return {
          ...adjustment,
          product
        }
      })
      return {
        ...profile,
        pricingAdjustments
      }
    })
    res.status(200).json({ message: 'Success', data: response });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * @swagger
 * /api/pricing-profile/{id}:
 *   get:
 *     summary: Get a pricing profile by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the pricing profile to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the pricing profile
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
 *                     id:
 *                       type: string
 *                       example: "2f95f50e-4de0-4f4f-882b-c7d20f5a1e21"
 *                     name:
 *                       type: string
 *                       example: First
 *                     description:
 *                       type: string
 *                       example: First Pricing Profile
 *                     type:
 *                       type: string
 *                       example: multiple
 *                     basedOnId:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     adjustmentMode:
 *                       type: string
 *                       example: fixed
 *                     adjustmentIncrement:
 *                       type: string
 *                       example: increase
 *                     pricingAdjustments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                             example: "5f5d423a-eeb6-4e59-a8b3-9b557d8126b3"
 *                           pricingProfileId:
 *                             type: string
 *                             example: "2f95f50e-4de0-4f4f-882b-c7d20f5a1e21"
 *                           basedPrice:
 *                             type: number
 *                             example: 100.00
 *                           adjustmentValue:
 *                             type: number
 *                             example: 10.00
 *                           price:
 *                             type: number
 *                             example: 110.00
 *                           product:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 example: "5f5d423a-eeb6-4e59-a8b3-9b557d8126b3"
 *                               name:
 *                                 type: string
 *                                 example: Product Name
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

const getById = async (req, res) => {
  try {
    const { id } = req.params
    const profile = db.pricingProfile.find(pricingProfile => pricingProfile.id === id);
    
    if (!profile) {
      return res.status(500).json({ message: 'Invalid data provided' });
    }

    const filteredAdjustments = db.pricingAdjustment.filter(adjustment => adjustment.pricingProfileId === profile.id);
    const pricingAdjustments = filteredAdjustments.map(adjustment => {
      const product = db.products.find(p => p.id === adjustment.productId);
      return {
        ...adjustment,
        product
      }
    })
    res.status(200).json({ message: 'Success', data: {
      ...profile,
      pricingAdjustments
    } });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * @swagger
 * /api/pricing-profile/{id}:
 *   delete:
 *     summary: Delete a pricing profile by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the pricing profile to delete
 *     responses:
 *       200:
 *         description: Successfully deleted the pricing profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
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

const deleteById = async (req, res) => {
  try {
    const { id } = req.params

    // Deleting all the adjustments for this pricing profile
    const filteredPriceAdjustments = db.pricingAdjustment.filter(adjustment => adjustment.pricingProfileId !== id);
    db.pricingAdjustment = filteredPriceAdjustments;

    const pricingProfiles = db.pricingProfile.filter(pricingProfile => pricingProfile.id !== id);
    db.pricingProfile = pricingProfiles;
    res.status(200).json({ message: 'Success' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
    create, 
    getAll,
    getById,
    deleteById,
    update
}


