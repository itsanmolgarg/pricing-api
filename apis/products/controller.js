const db = require('../../db');

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create multiple products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "5f5d423a-eeb6-4e59-a8b3-9b557d8126b3"
 *                     title:
 *                       type: string
 *                       example: Product A
 *                     sku:
 *                       type: string
 *                       example: ABC123
 *                     category:
 *                       type: string
 *                       example: Electronics
 *                 description: Array of products to create
 *     responses:
 *       201:
 *         description: Successfully created products
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
 *                       title:
 *                         type: string
 *                         example: Product A
 *                       sku:
 *                         type: string
 *                         example: ABC123
 *                       category:
 *                         type: string
 *                         example: Electronics
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
        const { products = [] } = req.body;
        db.products = [...db.products, ...products]
        res.status(201).json({ message: 'Success', data: db.products });
      } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
      }
}

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Search products based on query parameters
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Title of the product
 *       - in: query
 *         name: sku
 *         schema:
 *           type: string
 *         description: SKU of the product
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category of the product
 *       - in: query
 *         name: subCategory
 *         schema:
 *           type: string
 *         description: Sub-category of the product
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Brand of the product
 *       - in: query
 *         name: segment
 *         schema:
 *           type: string
 *         description: Segment of the product
 *     responses:
 *       201:
 *         description: Successfully retrieved filtered products
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
 *                       title:
 *                         type: string
 *                         example: Product A
 *                       sku:
 *                         type: string
 *                         example: ABC123
 *                       category:
 *                         type: string
 *                         example: Electronics
 *                       subCategory:
 *                         type: string
 *                         example: Mobile Phones
 *                       brand:
 *                         type: string
 *                         example: XYZ Brand
 *                       segment:
 *                         type: string
 *                         example: High-end
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

const search = async (req, res) => {
  try {
    const { title, sku, category, subCategory, brand, segment } = req.query;
  let filteredProducts = db.products;

  if (title) {
    filteredProducts = filteredProducts.filter(product => product.title.toLowerCase().includes(title.toLowerCase()));
  }
  if (sku) {
    filteredProducts = filteredProducts.filter(product => product.sku.toLowerCase().includes(sku.toLowerCase()));
  }
  if (category) {
    filteredProducts = filteredProducts.filter(product => product.category.toLowerCase() === category.toLowerCase());
  }
  if (subCategory) {
    filteredProducts = filteredProducts.filter(product => product.subCategory.toLowerCase() === subCategory.toLowerCase());
  }
  if (brand) {
    filteredProducts = filteredProducts.filter(product => product.brand.toLowerCase() === brand.toLowerCase());
  }
  if (segment) {
    filteredProducts = filteredProducts.filter(product => product.segment.toLowerCase() === segment.toLowerCase());
  }
  res.status(201).json({ message: 'Success', data: filteredProducts });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  create,
  search
}


