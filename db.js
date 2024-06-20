
const seedProducts = 
    [
        {
            "title": "High Garden Pinot Noir 2021",
            "sku": "HGVPIN216",
            "brand": "High Garden",
            "category": "Alcoholic Beverage",
            "subCategory": "Wine",
            "segment": "Red",
            "wholesalePrice": 279.06,
            "id": 1
        },
        {
            "title": "Koyama Methode Brut Nature NV",
            "sku": "KOYBRUNV6",
            "brand": "Koyama Wines",
            "category": "Alcoholic Beverage",
            "subCategory": "Wine",
            "segment": "Sparkling",
            "wholesalePrice": 120.00,
            "id": 2
        },
        {
            "title": "Koyama Riesling 2018",
            "sku": "KOYNR1837",
            "brand": "Koyama Wines",
            "category": "Alcoholic Beverage",
            "subCategory": "Wine",
            "segment": "Port/Dessert",
            "wholesalePrice": 215.04
        },
        {
            "title": "Koyama Tussock Riesling 2019",
            "sku": "KOYRIE19",
            "brand": "Koyama Wines",
            "category": "Alcoholic Beverage",
            "subCategory": "Wine",
            "segment": "White",
            "wholesalePrice": 215.04,
            "id": 3
        },
        {
            "title": "Lacourte-Godbillon Brut Cru NV",
            "sku": "LACBNATNV6",
            "brand": "Lacourte-Godbillon",
            "category": "Alcoholic Beverage",
            "subCategory": "Wine",
            "segment": "Sparkling",
            "wholesalePrice": 409.32,
            "id": 4
        }
    ]

    const db = {
        products: [...seedProducts],
        pricingProfile: [],
        pricingAdjustment: []
    }
    
module.exports = db;