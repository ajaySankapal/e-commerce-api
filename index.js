const express = require('express')
const dotenv = require('dotenv')
const asyncHandler = require('express-async-handler')

const connectDB = require('./config/db')
const Product = require('./models/productModel')
const app = express()
dotenv.config()

connectDB()

app.use(express.json())
app.get('/', (req, res) => {
  res.send('API is running!!')
})

//create product
//@desc POST /products
app.post(
  '/products',
  asyncHandler(async (req, res) => {
    const product = new Product({
      ...req.body,
      message: 'product created successfully',
    })
    try {
      await product.save()
      res.status(201).send(product)
    } catch (error) {
      res.status(400).send(error)
    }
  })
)

app.get(
  '/products',
  asyncHandler(async (req, res) => {
    const product = await Product.find({})
    try {
      res.send(product)
    } catch (e) {
      res.status(500).send(e)
    }
  })
)

//update the product
app.patch('/products/:id', async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = [
    'name',
    'image',
    'brand',
    'category',
    'description',
    'rating',
    'numReviews',
    'price',
    'countInStock',
  ]
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  )
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid update!' })
  }
  try {
    // const task = await Task.findById(req.params.id);
    const product = await Product.findOne({
      _id: req.params.id,
    })
    if (!product) {
      res.status(404).send()
    }
    updates.forEach((update) => {
      product[update] = req.body[update]
    })
    await product.save()
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    if (!product) {
      return res.status(404).send()
    }
    res.send(product)
  } catch (e) {
    res.status(400).send(e)
  }
})

//deleting the product
app.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
    })
    if (!product) {
      return res.status(404).send()
    }
    res.send(product)
  } catch (e) {
    res.status(500).send(e)
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`)
})
